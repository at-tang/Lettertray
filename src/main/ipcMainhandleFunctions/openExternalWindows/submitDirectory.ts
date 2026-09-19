import { dialog } from "electron";

export async function submitDirectory() {
  /*
  Opens the OS menu to select a specific directory.
  Returns the absolute path as a string if a directory is selected.
  Returns null if the user cancels the request
  */
 
  const result = await dialog.showOpenDialog({
    properties: ['openDirectory', 'createDirectory']
  });

  if (result.canceled) {
    return null;
  } else {
    return result.filePaths[0]; // Absolute path string
  }    
}