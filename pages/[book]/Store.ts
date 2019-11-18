import { map, filter } from "rxjs/operators";
import { Chapter } from "../../oith-lib/src/models/Chapter";
import { Subject } from "rxjs/internal/Subject";
// fromEvent('window:click').subscribe()
export class Store {
  public chapter$ = new Subject<Chapter>();
  public isManual: boolean;

  constructor() {
    this.manualOrChapter();
  }
  public manualOrChapter() {
    this.chapter$
      .pipe(
        filter(o => o !== undefined),
        map(() => {
          this.isManual = window.location.href.includes("manual");
          console.log(this.isManual);
        })
      )
      .subscribe();
  }
}

export const store = new Store();
