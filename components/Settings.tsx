import { Params } from '../oith-lib/src/shells/build-shells';
export class Settings {
  public textSize = 18;
  public notePaneWidth = 300;
  public notePaneWidthDisplay = 300;
  public notePaneHeight = 300;
  public notePaneHeightDisplay = 300;
  public noteCatList: Params = {};
  public oithHeaderTop = 0;
  public contentTop = 48;
  public displayUnderline: boolean;
  public lang = 'eng';
  public vis = {};
  public displayNotes: boolean;
  public displayNav: boolean;
  public notesMode: 'large' | 'small' | 'off' = 'small';
  constructor(lang: string) {
    this.lang = lang;

    if (window && window.matchMedia('(min-width: 500.01px)').matches) {
      this.displayNav = true;
    } else {
      this.displayNav = false;
    }
  }
}
