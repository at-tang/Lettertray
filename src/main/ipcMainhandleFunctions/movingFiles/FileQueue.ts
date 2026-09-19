import { Rule } from "../../api/types";
import { handleNewFileAdded } from "./handleNewFileAdded";

export interface MoveFilePayload {
    /*
    A singular object within a FileQueue, containing a file that has
    been added to a folder being watched, and the relevant instructions
    that the user has given on what to do. 
    */
   
    filepath: String,
    rules: Rule[]

}

export class FileQueue {
  /*
  FileQueue: Maintains a queue of files that have been added to a folder
  watched by Chokidar. Manages the moving files process, particularly in
  making sure that the number of concurrent operations is limited, as to not
  crash the program.
  */
  queue: MoveFilePayload[]
  processing: boolean

  constructor() {
    this.queue = [];
    this.processing = false;
  }

  push(mfp: MoveFilePayload) {
    this.queue.push(mfp)
    this.processNext();
  }

  async processNext() {
    if (this.processing || this.queue.length === 0) return;

    this.processing = true;
    const nextMove = this.queue.shift();

    try {
      await handleNewFileAdded(nextMove?.filepath, nextMove?.rules)
    }
    catch (err) {
      console.error(err)
    }
    finally {
      this.processing = false;
      setImmediate(() => this.processNext())
    }
  }
}