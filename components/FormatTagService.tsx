import { store } from './header.component';
import { FormatTagNoteOffsets } from '../oith-lib/src/verse-notes/verse-note';
import { filter, map, flatMap, toArray, take } from 'rxjs/operators';
import { FormatMerged } from '../oith-lib/src/models/Chapter';
import { EMPTY, of } from 'rxjs';
import { flatMap$ } from '../oith-lib/src/rx/flatMap$';
export class FormatTagService {
  private notePhrase?: FormatTagNoteOffsets;

  public currentFormatMerged?: FormatMerged;

  private formatMergedNoteOffets?: FormatTagNoteOffsets[];
  private resetUnderline() {
    return store.chapter.pipe(
      take(1),
      filter(o => o !== undefined && o.verseNotes && o.verseNotes.length > 0),
      flatMap(chapter => chapter.verseNotes),
      filter(o => o.noteGroups !== undefined),
      flatMap(o => o.noteGroups),
      map(grp => (grp.formatTag.highlight = false)),
      toArray(),
    );
  }
  public fMergedClick(fMerged: FormatMerged) {
    return this.resetUnderline().pipe(
      map(() => {
        if (fMerged === this.currentFormatMerged) {
          if (
            this.formatMergedNoteOffets &&
            this.formatMergedNoteOffets.length > 0
          ) {
            return of(
              this.formatMergedNoteOffets.shift() as FormatTagNoteOffsets,
            );
          }

          this.currentFormatMerged = undefined;
          this.formatMergedNoteOffets = undefined;
          return EMPTY;
        } else {
          this.currentFormatMerged = fMerged;
          this.formatMergedNoteOffets = fMerged.formatTags.filter(
            f => f.visible,
          ) as FormatTagNoteOffsets[];

          return of(
            this.formatMergedNoteOffets.shift() as FormatTagNoteOffsets,
          );
        }

        return EMPTY;
      }),
      flatMap$,
      map(f => {
        f.highlight = true;
      }),
      toArray(),
    );
  }

  public reset() {
    this.currentFormatMerged = undefined;
    this.formatMergedNoteOffets = undefined;
    this.notePhrase = undefined;

    this.resetUnderline().subscribe();
  }
  /**
   * notePhaseClick
   */
  public notePhaseClick(ft: FormatTagNoteOffsets) {
    return this.resetUnderline().pipe(
      map(() => {
        this;
      }),
    );
  }
}
