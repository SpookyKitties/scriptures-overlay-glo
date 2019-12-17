import { FormatTagNoteOffsets } from '../../oith-lib/src/verse-notes/verse-note';
import { of } from 'rxjs';
import { map, delay, find, flatMap, filter } from 'rxjs/operators';
import { store, formatTagService } from '../SettingsComponent';
import { addOffsets } from '../note-offsets/addOffsets';

export function notePhraseClick(
  evt: HTMLElement,
  formatTag: FormatTagNoteOffsets,
) {
  addOffsets(evt, formatTag)
    .pipe(
      filter(o => o === true),
      map(() => {
        return formatTagService.notePhaseClick(formatTag).pipe(
          map(() => {
            store.updateFTags$.next(true);
            store.updateNoteVisibility$.next(true);
          }),
          delay(100),
        );
      }),
      flatMap(o => o),
    )
    .subscribe(() => {
      of(document.querySelectorAll('.verse'))
        .pipe(
          flatMap(o => o),
          find(o => o.querySelector('.highlight') !== null),
          map(o => {
            if (o) {
              o.scrollIntoView();
            }
          }),
        )
        .subscribe();
    });
}
