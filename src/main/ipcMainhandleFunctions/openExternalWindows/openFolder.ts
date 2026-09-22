import { shell } from "electron";
import fs from 'fs/promises'

export async function openFolderInNative(filePath: string) {
    /*
    A function to open a specific filePath within the user's native
    File Explorer.

    For example, in Mac, this is Finder.
    */
  try {
    await fs.access(filePath);
    await shell.openPath(filePath);
    return true;

  } catch (error) {
    console.error("An error occured:", error);
    return false;
  }   
}