import { FormatTagNoteOffsets } from '../../oith-lib/src/verse-notes/verse-note';
import { of } from 'rxjs';
import { map, delay, find, flatMap } from 'rxjs/operators';
import { store, formatTagService } from '../header.component';

function checkSelection(e: Element) {
  const selection = document.getSelection();

  console.log(selection);
  if (selection && selection.rangeCount > 0) {
    const range = selection.getRangeAt(0);

    if (range) {
      const verses = Array.from(document.querySelectorAll('.verse')).filter(
        e => e.contains(range.startContainer) || e.contains(range.endContainer),
      );
      if (verses.length === 1) {
        const verse = verses[0];
        const start =
          parseInt(
            range.startContainer.parentElement.getAttribute('data-offset'),
          ) + range.startOffset;
        const end =
          start + ((selection as unknown) as number).toString().length;
        const note = Array.from(document.querySelectorAll('.verse-note')).find(
          vng => vng.contains(e),
        );

        const verseID = /(^p|^)(.+)/.exec(verse.id);
        const noteID = note.id;
        'eng-heb-1-1-verse-notes';
        // console.log(note.id);

        if (verseID) {
          const noteIDSplit = noteID.split('-');

          console.log(verseID[2] === noteIDSplit[noteIDSplit.length - 3]);

          console.log(start);
          console.log(end);
          console.log(verse.textContent.slice(start, end));
          console.log(verse);
          console.log(note);
        }
      }
    }
  }

  return of(true);
}

export function notePhraseClick(
  evt: HTMLElement,
  formatTag: FormatTagNoteOffsets,
) {
  checkSelection(evt);
  formatTagService
    .notePhaseClick(formatTag)
    .pipe(
      map(() => {
        store.updateFTags$.next(true);
        store.updateNoteVisibility$.next(true);
      }),
      delay(100),
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
      // const vng = document.querySelector('.f-t.highlight'); //.scrollIntoView();
      // if (vng) {
      //   vng.scrollIntoView();
      // }
    });
}
