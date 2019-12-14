import {
  FormatTagNoteOffsets,
  VerseNote,
} from '../../oith-lib/src/verse-notes/verse-note';
import { of, EMPTY } from 'rxjs';
import { map, toArray, flatMap, filter } from 'rxjs/operators';
import {
  expandOffsets,
  compressRanges,
} from '../../oith-lib/src/offsets/expandOffsets';
import { flatMap$ } from '../../oith-lib/src/rx/flatMap$';
import { reInitChapter } from '../../pages/[book]/[chapter]';
import { saveChapter } from './saveChapter';
import { Verse, FormatText } from '../../oith-lib/src/models/Chapter';
import {
  extractFormatText,
  addTextToFormatText,
  expandNoteOffsets,
  resetVerse,
} from '../../oith-lib/src/shells/buildFMerged';
import { store } from '../header.component';

export function resetLiveVerse(verseid: string, noteID: string) {
  return store.chapter.pipe(
    filter(o => o !== undefined),
    map(chapter => {
      const verse = chapter.verses.find(v => v.id === verseid);
      console.log(verse);

      const verseNote = chapter.verseNotes.find(v => v.id === noteID);
      if (verse) {
        return expandNoteOffsets(verseNote).pipe(
          toArray(),
          map(formatTags => resetVerse(verse, formatTags)),
          flatMap$,
        );
      }
      return EMPTY;
    }),
    flatMap$,
  );
}

export function addOffsets(e: Element, formatTag: FormatTagNoteOffsets) {
  if (formatTag.offsets === 'all') {
    return of(true);
  }
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
          start + ((selection as unknown) as number).toString().length - 1;
        const note = Array.from(document.querySelectorAll('.verse-note')).find(
          vng => vng.contains(e),
        );
        const verseID = /(^p|^)(.+)/.exec(verse.id);
        const noteID = note.id;
        'eng-heb-1-1-verse-notes';
        const noteIDSplit = noteID.split('-');
        if (verseID && verseID[2] === noteIDSplit[noteIDSplit.length - 3]) {
          const newOffsets = start !== end ? `${start}-${end}` : `${start}`;
          console.log(newOffsets);

          formatTag.offsets = `${formatTag.offsets},${newOffsets}`;
          return expandOffsets(formatTag).pipe(
            map(() => {
              if (formatTag.uncompressedOffsets.includes(0)) {
                formatTag.offsets = 'all';
              } else {
                formatTag.offsets = compressRanges(
                  formatTag.uncompressedOffsets,
                )
                  .map(i => (i[0] !== i[1] ? i.join('-') : i[0]))
                  .join(',');
              }
              formatTag.notes.map(n => {
                n.formatTag.offsets = formatTag.offsets;
              });
              return saveChapter();
            }),
            flatMap$,
            map(() => {
              console.log(verseID);
              console.log(noteID);
              return resetLiveVerse(verseID[2], noteID).pipe(
                map(() => {
                  store.updateVerses.next(true);
                  return false;
                }),
              );
            }),
            flatMap$,
          );
        }
      }
    }
  }
  return of(true);
}
