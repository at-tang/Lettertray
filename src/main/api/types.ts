export class AutomationRequest {
    title: string;
    type: string;
    originDirectory: string;
    newDirectory: string;
    keyword: string;
    automationActive: boolean;

    public constructor(title: string, type: string, originDir: string, newDir: string, keyword: string) {
        this.title = title;
        this.type = type;
        this.originDirectory = originDir;
        this.newDirectory = newDir;
        this.keyword = keyword;
        this.automationActive = true;
    }

    public getJSON() {
        return {
            title: this.title,
            type: this.type,
            originDirectory: this.originDirectory,
            newDirectory: this.newDirectory,
            keyword: this.keyword,
            automationActive: this.automationActive

        }
    }
}

export interface Rule {
    title: string,
    type: string,
    originDirectory: string,
    newDirectory: string,
    keyword: string
    automationActive: boolean

}