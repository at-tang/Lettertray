import { shell } from "electron";

export async function openFolderInNative(filePath: string) {
    /*
    A function to open a specific filePath within the user's native
    File Explorer.

    For example, in Mac, this is Finder.
    */
  try {
    await shell.openPath(filePath);
  } catch (error) {
    console.error("An error occured:", error);
  }   
}