import React from 'react'
import { IconButton, FormControl, FormLabel, Select, MenuItem, Button, TextField } from '@material-ui/core'
import { DropzoneDialogBase, FileObject } from 'material-ui-dropzone'
import  CloseIcon  from '@material-ui/icons/Close'


export const UploadItem: React.FC<{ index: number
                                    libraryFolders: [string]
                                    selectedFolder: string
                                    filePaths: [string]
                                    containingFolder: string
                                    updateLibrary: (index: number, selectedFolder: string) => void
                                    updateFileList: (index: number, files: string[])=>void
                                    updateContainingFolder: (index: number, name:string)=>void}> = (props) => {

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) =>{
    props.updateLibrary(props.index, event.target.value as string)
  }
  const handleContainingChange = (event: React.ChangeEvent<{ value: unknown }>) =>{
    props.updateContainingFolder(props.index, event.target.value as string)
  }
  const handleFileList = () => {
    let fileNames = []
    for (let f of fileObjects){
      fileNames.push(f.file.path)
    }
    props.updateFileList(props.index, fileNames)
  }
  const [open, setOpen] = React.useState(false);
  const [fileObjects, setFileObjects] = React.useState<FileObject[]>([]);

  const dialogTitle = () => (
    <>
      <span>Upload file</span>
      <IconButton
        style={{right: '12px', top: '8px', position: 'absolute'}}
        onClick={() => setOpen(false)}>
        <CloseIcon />
      </IconButton>
    </>
  );
  return (
    <div>
      <TextField value={props.containingFolder}
                  onChange = {handleContainingChange}></TextField>
      <FormControl>
        <FormLabel>Library</FormLabel>
        <Select
          value={props.selectedFolder}
          onChange={handleChange}
          >
          {
            props.libraryFolders.map((el: string) => (
              <MenuItem key={el} value={el}>{el}</MenuItem>
            ))
          }
        </Select>
      </FormControl>
      <Button onClick={()=>setOpen(true)}
        >No Click Me!</Button>
      <DropzoneDialogBase
        dialogTitle={dialogTitle()}
        acceptedFiles={['image/*']}
        fileObjects={fileObjects}
        cancelButtonText={"cancel"}
        submitButtonText={"submit"}
        maxFileSize={5000000}
        open={open}
        onAdd={newFileObjs => {
          console.log('onAdd', newFileObjs);
          setFileObjects(fileObjects.concat(newFileObjs));
        }}
        onDelete={deleteFileObj => {
          console.log('onDelete', deleteFileObj);
        }}
        onClose={() => setOpen(false)}
        onSave={() => {
          console.log('onSave', fileObjects);
          handleFileList();
          setOpen(false);
        }}
        showPreviews={true}
        showFileNamesInPreview={true}
      />
    </div>
  )
}
