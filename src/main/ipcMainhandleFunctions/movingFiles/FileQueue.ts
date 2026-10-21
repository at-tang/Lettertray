import { Rule } from "../../api/types";
import { deleteAllEntriesOverLimit, HISTORY_ENTRY_LIMIT } from "../../main";
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
  totalMoves: number

  constructor() {
    this.queue = [];
    this.processing = false;
    this.totalMoves = 0;
    
  }

  push(mfp: MoveFilePayload) {
    this.queue.push(mfp)
    this.processNext();
  }

  async processNext() {

    // If queue is currently processing a file
    if (this.processing) {
      return;
    }

    // If queue is empty. Mainly split from processing check for future functionality
    if (this.queue.length === 0) {
      if (this.totalMoves !== 0) deleteAllEntriesOverLimit();
      return;
    }

    this.processing = true;
    const nextMove = this.queue.shift();

    try {
      await handleNewFileAdded(nextMove?.filepath, nextMove?.rules)
    }
    catch (err) {
      console.error(err)
      this.queue.push(mfp) // If file move doesn't work. place it on the back of the queue 
    }
    finally {
      this.totalMoves++;
      if (this.totalMoves % HISTORY_ENTRY_LIMIT === 0 && this.totalMoves !== 0) {
        deleteAllEntriesOverLimit();
      }


      this.processing = false;
      setImmediate(() => this.processNext())
    }
  }
}