import {
  VerseNote,
  FormatTag,
} from '../../../oith-lib/src/verse-notes/verse-note';

import { forkJoin, of, EMPTY, Observable } from 'rxjs';

import { expandOffsets } from '../../../oith-lib/src/offsets/expandOffsets';

import { map, flatMap, toArray, take, filter } from 'rxjs/operators';

import { flatMap$ } from '../../../oith-lib/src/rx/flatMap$';

import {
  FormatGroup,
  Verse,
  FormatText,
  FormatMerged,
  Chapter,
} from '../../../oith-lib/src/models/Chapter';
import { chapter$ } from '../store/store';

function expandNoteOffsets(verseNote?: VerseNote) {
  if (verseNote && verseNote.notes) {
    const vasdf = verseNote.notes.map(note => {
      return forkJoin(expandOffsets(note.formatTag), of(note.formatTag)).pipe(
        map(o => o[1]),
      );
    });
    if (verseNote.noteGroups) {
      return of(
        verseNote.noteGroups.map(ng =>
          forkJoin(expandOffsets(ng.formatTag), of(ng.formatTag)).pipe(
            map(o => o[1]),
          ),
        ),
      ).pipe(flatMap$, flatMap$); //, toArray());
    }
  }

  return EMPTY;
}

function extractFormatText(
  verse: FormatGroup | Verse | FormatText,
): Observable<FormatText> {
  if (Array.isArray((verse as FormatGroup | Verse).grps)) {
    return of(
      (verse as FormatGroup | Verse).grps as (FormatGroup | FormatText)[],
    ).pipe(
      flatMap$,
      map(o => extractFormatText(o)),
      flatMap$,
    );
  } else if ((verse as FormatText).docType === 5) {
    return of(verse as FormatText);
  }

  return EMPTY;
}
function objectsAreSame(x: any[], y: any[]) {
  var objectsAreSame = true;
  for (var propertyName in x) {
    if (x[propertyName] !== y[propertyName]) {
      objectsAreSame = false;
      break;
    }
  }
  return objectsAreSame;
}

function addTextToFormatText(
  verse: Verse,
  formatText: FormatText,
  formatTags?: FormatTag[],
) {
  if (formatText.offsets && !formatTags) {
    const split = formatText.offsets.split('-');

    return of(
      (formatText.formatMerged = [
        new FormatMerged(
          verse.text.slice(parseInt(split[0], 10), parseInt(split[1], 10) + 1),
          [],
        ),
      ]),
    );
  } else if (formatText.uncompressedOffsets && formatTags) {
    const fMerged: { i: number[]; formatTags: FormatTag[] }[] = [];
    let last: { i: number[]; formatTags: FormatTag[] } | undefined = undefined;

    formatText.uncompressedOffsets.map(u => {
      const ft = formatTags.filter(
        o =>
          (o.uncompressedOffsets && o.uncompressedOffsets.includes(u)) ||
          o.offsets === 'all',
      );

      if (!last) {
        last = { i: [u], formatTags: ft };
        fMerged.push(last);
      } else {
        if (objectsAreSame(ft, last.formatTags)) {
          last.i.push(u);
        } else {
          last = { i: [u], formatTags: ft };
          fMerged.push(last);
        }
      }
    });

    return of(
      (formatText.formatMerged = fMerged.map(f => {
        return new FormatMerged(
          verse.text.slice(f.i[0], f.i[f.i.length - 1] + 1),
          f.formatTags,
        );
      })),
    );
  }

  return EMPTY;
}

function resetVerse(verse: Verse, formatTags?: FormatTag[]) {
  return extractFormatText(verse).pipe(
    map((o: FormatText) => {
      return expandOffsets(o).pipe(
        map(() => addTextToFormatText(verse, o, formatTags)),
        flatMap$,
      );
    }),
    flatMap(o => o),
    toArray(),
  );
}
export function buildFMergedOld(chapter: Chapter) {
  return of(chapter.verses).pipe(
    flatMap$,
    map(async verse => {
      if (chapter.verseNotes) {
        const verseNote = chapter.verseNotes.find(vN =>
          vN.id.includes(`-${verse.id}-verse-note`),
        );
        return expandNoteOffsets(verseNote).pipe(
          toArray(),
          map(formatTags => resetVerse(verse, formatTags)),
          flatMap$,
        );
      }
      return EMPTY;
    }),
    flatMap(o => o),
    flatMap(o => o),
    toArray(),
  );
}
export function buildFMerged() {
  return chapter$.pipe(
    take(1),
    filter(o => o !== undefined),
  );
}
