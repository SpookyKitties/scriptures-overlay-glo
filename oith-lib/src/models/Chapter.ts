import {
  VerseNote,
  Offsets,
  Doc,
  DocType,
  FormatTag,
} from '../verse-notes/verse-note';
export class Verse {
  public id: string;
  public text: string;
  public n: string;
  public highlight?: boolean;
  public context?: boolean;

  public grps: FormatGroup[];
  public attrs: {};
  public constructor(
    id: string,
    text: string,
    formatGroups: FormatGroup[],
    n: string,
    attrs: {},
  ) {
    this.id = id;
    this.text = text;
    this.grps = formatGroups;
    this.n = n;
    this.attrs = attrs;
  }
}

export class VersePlaceholder {
  v: string;
  verse?: Verse;
}
export class FormatMerged {
  public text: string;
  public formatTags: FormatTag[];
  public underline?: boolean;
  public doubleUnderline?: boolean;
  public highlight?: boolean;
  public all?: boolean;
  public constructor(text: string, formatTags: FormatTag[]) {
    this.text = text;
    this.formatTags = formatTags;
  }
}

export class FormatText implements Offsets {
  public id: string;
  public offsets?: string | undefined;
  public uncompressedOffsets?: number[] | undefined;
  public docType: DocType = DocType.FORMATTEXT;
  public formatMerged?: FormatMerged[];
  // public text: string;

  // public off
}
export class FormatGroup {
  public grps?: (FormatGroup | FormatText | VersePlaceholder)[];
  public name?: string;
  // public txt?: FormatText;
  // public verseIDs?: string[];
  // public verses?: Verse[];
  public attrs?: {};
  public docType: DocType = DocType.FORMATGROUP;
}

export class Chapter extends Doc {
  // public id: string;
  public _rev?: string | undefined;
  // public chapterVerseBreaks?: ChapterVerseBreaks;
  // public docType = DocTypes.chapter;
  public lang: string;
  public shortTitle: string;
  public testament: string;
  public title: string;
  public body: FormatGroup;
  public sortVerseNotes?: VerseNote[];

  // public versesFormatGroups:
  public verseNotes?: VerseNote[];
  public verses: Verse[];
  // public verses: Verse[];
  public constructor(
    id: string,
    lang: string,
    title: string,
    shortTitle: string,
    testament: string,
    verses: Verse[],
    body: FormatGroup,
  ) {
    super(id, DocType.CHAPTER);
    // this.id = id;
    this.lang = lang;
    this.title = title;
    this.shortTitle = shortTitle;
    this.testament = testament;
    this.verses = verses;
    this.body = body;
  }
}
