export class HistoryEntry{

    originDir: string; // What directory was this file pulled from
    newDir: string; // Where did this file go?
    fileName: string; // What is the name of this file
    time: number; // What time did this occur
    complete: boolean

    public constructor (originDir: string, newDir: string, fileName: string, complete: boolean) {
        this.originDir = originDir;
        this.newDir = newDir;
        this.fileName = fileName;
        this.time = new Date().getTime();
        this.complete = complete;
    }

}