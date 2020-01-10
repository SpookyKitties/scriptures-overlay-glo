export declare module GloAnnotations {
  export interface Content {
    startOffset: string;
    color: string;
    endOffset: string;
    uri: string;
    pid: string;
  }

  export interface Highlight {
    content: Content[];
  }

  export interface Note {
    content: string;
    title: string;
  }

  export interface RootObject {
    id: string;
    contentVersion: string;
    docId: string;
    locale: string;
    uri: string;
    personId: string;
    type: string;
    highlight: Highlight;
    source: string;
    device: string;
    tags: any[];
    note: Note;
    folders: any[];
    lastUpdated: Date;
    created: Date;
  }
}
