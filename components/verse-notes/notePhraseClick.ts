import { FormatTagNoteOffsets } from '../../oith-lib/src/verse-notes/verse-note';
import { of } from 'rxjs';
import { map, delay, find, flatMap, filter, take } from 'rxjs/operators';
import { store, formatTagService } from '../header.component';
import {
  expandOffsets,
  compressRanges,
} from '../../oith-lib/src/offsets/expandOffsets';
import { flatMap$ } from '../../oith-lib/src/rx/flatMap$';
import PouchDB from 'pouchdb';

export function saveChapter() {
  return store.chapter.pipe(
    take(1),
    map(c => {
      return c;
    }),
    filter(o => o !== undefined),
    map(async c => {
      let database: PouchDB.Database<{}> | undefined;
      let rev: string | undefined = undefined;
      database = new PouchDB(`v6-${window.location.hostname}-overlay-org`);
      try {
        const dbi = await database.get(c.id);
        rev = dbi._rev;
      } catch (error) {}

      return of(database.put({ _id: c.id, _rev: rev, chapter: c })).pipe(
        flatMap$,
      );
    }),
    flatMap$,
  );
}

function checkSelection(e: Element, formatTag: FormatTagNoteOffsets) {
  const selection = document.getSelection();
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
        const noteIDSplit = noteID.split('-');

        if (verseID && verseID[2] === noteIDSplit[noteIDSplit.length - 3]) {
          console.log(verseID);

          formatTag.offsets = `${formatTag.offsets},${start}-${end}`;
          // console.log()

          return expandOffsets(formatTag).pipe(
            map(() => {
              formatTag.offsets = compressRanges(formatTag.uncompressedOffsets)
                .map(i => i.join('-'))
                .join(',');
              return saveChapter();
            }),
            flatMap$,
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
