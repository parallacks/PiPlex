import React, { Component } from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { Button, Box, List, ListItem } from '@material-ui/core';
import { UploadItem } from '../components/UploadItem';

const scp = require( 'node-scp')

// const useStyles = makeStyles((theme: Theme) =>
//   createStyles({
//     root: {
//       flexGrow: 1,
//     },
//     paper: {
//       height: 140,
//       width: 100,
//     },
//     control: {
//       padding: theme.spacing(2),
//     },
//     formControl: {
//       margin: theme.spacing(1),
//       minWidth: 120,
//     },
//     formLabel:{
//       fontColor: '#fff'
//     }
//   }),
// );
const rootPath = '/mnt/storage/Media'
async function getRemoteDirectories() {
  try {
    const client = await scp({
      host: '192.168.50.190',
      port: 22,
      username: 'pi',
      password: 'lancealot596'
    })
    const res = await client.list(rootPath)
    // console.log(res)
    client.close() // remember to close connection after you finish
    let list = []
    for (let i of res){
      console.log(i)
      if(i.type === 'd' && i.name[0] !== '.')
        list.push(i.name)
    }
    return list
  } catch (e) {
    console.log(e)
    return []
  }
}
async function createDirectory(dirToAdd:string) {
  try {
    const client = await scp({
      host: '192.168.50.190',
      port: 22,
      username: 'pi',
      password: 'lancealot596'
    })
    await client.mkdir(dirToAdd)
    client.close() // remember to close connection after you finish
  } catch (e) {
    console.log(e)
  }
}

async function uploadFile(localFile:string, remoteFile:string) {
  try {
    const client = await scp({
      host: '192.168.50.190',
      port: 22,
      username: 'pi',
      password: 'lancealot596'
    })
    await client.uploadFile(localFile, remoteFile)
    client.close() // remember to close connection after you finish
  } catch (e) {
    console.log(e)
  }
}

interface UploadObject {
  libraryFolder:string
  containingFolder:string
  files:[string]
}
class Testing extends Component<any, any>  {

  constructor(props: object){
    super(props)
    this.state = {libList:[],
                  uploadList:[]
                  }
  }
  componentDidMount(){
    getRemoteDirectories().then(res => { this.setState({libList: res});console.log(this.state.libList); })
  }

  addFilesToQueue(files: object){
    console.log(files)
  }

  updateUploadItemLibrary(index: number, selectedFolder:string){
    let stateCopy = this.state
    stateCopy.uploadList[index].libraryFolder = selectedFolder
    this.setState(stateCopy)
  }

  updateFileList(index:number, files:string[]){
    let stateCopy = this.state
    stateCopy.uploadList[index].files = files
    this.setState(stateCopy)
  }

  updateContainingFolder(index:number, folderName: string){
    let stateCopy = this.state
    stateCopy.uploadList[index].containingFolder = folderName
    this.setState(stateCopy)
    console.log(this.state)
  }



  render (){
    const addListItem = ()=>{
      this.setState({uploadList: this.state.uploadList.concat({libraryFolder:'',
                                                               files: [],
                                                               containingFolder: ''})})
    }
    const startUpload = () => {
      for (let fold of this.state.uploadList){
        let dir = rootPath+"/"+fold.libraryFolder+"/"+fold.containingFolder;
        createDirectory(dir);
        for (let file of fold.files){
          let slashSwap = file.replace(/\\/g, '/')
          console.log(slashSwap)
          let temp:[string] = slashSwap.split('/')
          let fileName = temp[temp.length - 1]
          uploadFile(slashSwap, dir+"/"+fileName)
        }
      }
    }
    return (
      <Box width ={{ xs: '100%', md: '80%'}} >
        <Button onClick = {addListItem}>Click me!</Button>
        <List>
          {this.state.uploadList.map((el: UploadObject, i: number)=>(
            <ListItem key={i}>
              <UploadItem index={i}
                          libraryFolders = {this.state.libList}
                          selectedFolder = {el.libraryFolder}
                          containingFolder = {el.containingFolder}
                          updateLibrary = {this.updateUploadItemLibrary.bind(this)}
                          updateFileList = {this.updateFileList.bind(this)}
                          updateContainingFolder = {this.updateContainingFolder.bind(this)}
                          filePaths = {el.files}/>
            </ListItem>
          ))}
        </List>
        <Button onClick = {startUpload}>Start Uploading</Button>
        {this.state.libraryFolder}
        <p>
          {this.state.fileList}
        </p>
      </Box>
    );
  }
}

export default Testing;
