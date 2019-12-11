import { FormatTagNoteOffsets } from '../../oith-lib/src/verse-notes/verse-note';
import { of } from 'rxjs';
import { map, delay, find, flatMap, filter } from 'rxjs/operators';
import { store, formatTagService } from '../header.component';
import {
  expandOffsets,
  compressRanges,
} from '../../oith-lib/src/offsets/expandOffsets';

function checkSelection(e: Element, formatTag: FormatTagNoteOffsets) {
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
        const noteIDSplit = noteID.split('-');

        if (verseID && verseID[2] === noteIDSplit[noteIDSplit.length - 3]) {
          console.log(verseID);

          formatTag.offsets = `${formatTag.offsets},${start}-${end}`;
          // console.log()

          return expandOffsets(formatTag).pipe(
            map(
              () =>
                (formatTag.offsets = compressRanges(
                  formatTag.uncompressedOffsets,
                )
                  .map(i => i.join('-'))
                  .join(',')),
            ),
            map(() => false),
          );
        }
      }
    }
  }

  console.log('oiajsdfioajsdfiojasdf');

  return of(true);
}

export function notePhraseClick(
  evt: HTMLElement,
  formatTag: FormatTagNoteOffsets,
) {
  checkSelection(evt, formatTag)
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
      console.log('asdiojasofjaoisfj');

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
