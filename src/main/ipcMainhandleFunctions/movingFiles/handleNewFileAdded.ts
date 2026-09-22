import path from "node:path";
import { Rule } from "../../api/types";
import fs from 'fs/promises';
import { createHistoryEntries } from "../../main";
import { HistoryEntry } from "../../classes/History";

export async function handleNewFileAdded(filePath: string, rules: Rule[] = [], retries: number = 5, delay: number = 300)  {

  // Main function handling the moving of files based on the user's sorting parameters
  // filePath is the current file being addressed

  const dirPath = path.dirname(filePath);
  const fileName = path.basename(filePath);

  for (const rule of rules) { 
    // If statements are layered so that if one if doesnt pass, we don't need to process the rest of the ifs
    // If the rule isn't active or directories don't match, then we don't need to compute Regex
    if (rule.automationActive) {
        if (rule.originDirectory === dirPath) {
          const regexMatch: boolean = RegExp(rule.keyword).test(fileName)
          if (regexMatch) {

            for (let attempts = 1; attempts <= retries; attempts++) {

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
                throw new Error("Attempts at moving file " + filePath + " exhausted.");
              }
              
              await new Promise(resolve => setTimeout(resolve, delay)) // Timer


            }

          }
        }
    }

    }
    return

}