export class NoteSetting {
  public label: string;
  public overlays: string[];
  public catOn: string[];
  public catOnPlus: string[];
  public display: boolean;
  public enabled: boolean;
}
export class GlobalNoteSettings {
  public label: string;
  public additionalcontent: string;
  public display: boolean;
  public enabled: boolean;
}
export class NoteSettings {
  public noteSettings: NoteSetting[];
  public addSettings: GlobalNoteSettings[];
  public id: string;
}
