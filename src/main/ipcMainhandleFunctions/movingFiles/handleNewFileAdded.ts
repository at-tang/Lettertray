import path from "node:path";
import { Rule } from "../../api/types";
import fs from 'fs/promises';
import { createConflict, createHistoryEntries } from "../../main";
import { HistoryEntry } from "../../classes/History";

export async function moveFile(filePath: string, rule: Rule, retries: number = 5, delay: number = 300) {
  /*
  The function that actually moves the file.
  */
    
    for (let attempts = 1; attempts <= retries; attempts++) {
      const fileName = path.basename(filePath);
      
      const newFilePath = path.join(rule.newDirectory, fileName)

    // Attempt to move the file
        try {
            await fs.rename(filePath, path.join(rule.newDirectory, fileName))
            console.log("Successful move of \'" + fileName + "\' to " + rule.newDirectory + " at " + new Date().toLocaleTimeString());
            // Write this to the history
            createHistoryEntries([new HistoryEntry(rule.originDirectory, rule.newDirectory, fileName, true)])
            return
          } 
              
          catch (err) {

            // try an alternative method
            if (err.code === 'EXDEV' || err.code === 'EBUSY' || err.code === 'EPERM') {
              try {
                console.log("Could not use rename. Resorting to copyFile and unlink");
                await fs.copyFile(filePath, path.join(rule.newDirectory, fileName))
                await fs.unlink(filePath)
                createHistoryEntries([new HistoryEntry(rule.originDirectory, rule.newDirectory, fileName, true)])
                }
                catch (copyFileErr) {
                    console.error(copyFileErr)
                }
              }

          }

          // If this is the last allocated attempt to move, then the algorithm just moves on
          if (attempts === retries) {
            throw new Error("Attempts at moving file " + filePath + " exhausted.\nCould not move to ");
          }  

          await new Promise(resolve => setTimeout(resolve, delay)) // Timer
      }
}


export async function handleNewFileAdded(filePath: string, rules: Rule[] = [], retries: number = 5, delay: number = 300)  {

  // Main function handling the moving of files based on the user's sorting parameters
  // filePath is the current file being addressed

  const dirPath = path.dirname(filePath);
  const fileName = path.basename(filePath);

  const possiblePaths: Rule[] = []; // All rules that apply

  for (const rule of rules) { 
    // If statements are layered so that if one if doesnt pass, we don't need to process the rest of the ifs
    // If the rule isn't active or directories don't match, then we don't need to compute Regex
    if (rule.automationActive) {
        if (rule.originDirectory === dirPath) {
          const regexMatch: boolean = RegExp(rule.keyword).test(fileName)
          if (regexMatch) {
            possiblePaths.push(rule)
            console.log(`${filePath} matches regex: ${rule.keyword}`)

            //await moveFile(filePath, rule);

          }
        }
    }

  }

  console.log(possiblePaths);
  

  if (possiblePaths.length === 1) { // There isn't any conflicting rules
    console.log("Only one possible path")
    await moveFile(filePath, possiblePaths.at(0));
  }
  else if (possiblePaths.length > 1) { 
  // Conflict logic goes here
    createConflict(filePath, possiblePaths);
   return
  }
   
  
  return

}