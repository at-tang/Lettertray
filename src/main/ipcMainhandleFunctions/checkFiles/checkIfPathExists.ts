import fs from 'node:fs'
export function checkIfPathExists(path: string) {
    /*
    Checks if a path exists. Returns true if it exists. Return false if not.
    */

   return fs.existsSync(path);

}