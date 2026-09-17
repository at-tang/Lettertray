import { Edge } from "@xyflow/react";

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
    id: number
    title: string,
    type: string,
    originDirectory: string,
    newDirectory: string,
    keyword: string
    automationActive: boolean
    viewKeyword: string

    directoriesAllowed: boolean
    caseSensitive: boolean

}

export interface SavedFlowgraph {
    nodes: Node[],
    edges: Edge[]
}

export class Position {
    x: number;
    y: number;

    public constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}

export class Data {
    label: string;

    public constructor(label: string) {
        this.label = label;

    }

}

export class AutomatorNode {
    id: string;
    data: Data;
    position: Position;

    public constructor(id: string, data: Data, position: Position) {
        this.id = id;
        this.data = data;
        this.position = position;
    }
    
}