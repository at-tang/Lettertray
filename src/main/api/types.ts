export class AutomationRequest {
    title: string;
    type: string;
    originDirectory: string;
    newDirectory: string;
    keyword: string;
    automationActive: boolean;
    viewKeyword: string; // The keyword given by the user, but without the regex. Designed for user view

    public constructor(title: string, type: string, originDir: string, newDir: string, keyword: string, viewKeyword: string) {
        this.title = title;
        this.type = type;
        this.originDirectory = originDir;
        this.newDirectory = newDir;
        this.keyword = keyword;
        this.automationActive = true;
        this.viewKeyword = viewKeyword;
        
    }


}

export interface Rule {
    title: string,
    type: string,
    originDirectory: string,
    newDirectory: string,
    keyword: string
    automationActive: boolean
    viewKeyword: string

}