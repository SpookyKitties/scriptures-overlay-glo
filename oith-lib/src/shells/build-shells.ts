import { EMPTY, forkJoin, Observable, of } from 'rxjs';
import {
  filter,
  find,
  flatMap,
  groupBy,
  map,
  mergeMap,
  toArray,
} from 'rxjs/operators';
import {
  Chapter,
  FormatGroup,
  FormatMerged,
  FormatText,
  Verse,
  VersePlaceholder,
} from '../models/Chapter';
import { flatMap$ } from '../rx/flatMap$';
import { VerseNote, VerseNoteGroup, Note } from '../verse-notes/verse-note';
import { buildFMerged } from './buildFMerged';

function findFormatGroupsWithVerseIDs(
  formatGroup: FormatGroup,
  // isBody: boolean,
): Observable<VersePlaceholder> {
  return of(formatGroup.grps as (
    | FormatGroup
    | FormatText
    | VersePlaceholder)[]).pipe(
    filter(o => o !== undefined),
    flatMap$,
    map(o => {
      if ((o as VersePlaceholder).v !== undefined) {
        return of(o as VersePlaceholder);
      }
      return findFormatGroupsWithVerseIDs(o as FormatGroup);
    }),
    flatMap$,
  );
}

function findVerse(verses: Verse[], verseID: string) {
  return of(verses.find(v => v.id === verseID));
  // return of(verses).pipe(
  //   flatMap$,
  //   find(o => o.id === verseID),
  // );
}

export function generateVerseNoteShell(chapter: Chapter) {
  const verseNotes = chapter.verses
    .map(v => {
      return (chapter.verseNotes
        ? chapter.verseNotes.find(
            vN =>
              vN.id ===
              `${chapter.id.replace('-chapter', '')}-${v.id}-verse-notes`,
          )
        : undefined) as VerseNote;
    })
    .filter(o => o !== undefined);
  return of((chapter.verseNotes = verseNotes));

  // return of(chapter.verses).pipe(
  //   flatMap$,
  //   map(v => {
  //     return (chapter.verseNotes
  //       ? chapter.verseNotes.find(
  //           vN =>
  //             vN.id ===
  //             `${chapter.id.replace('-chapter', '')}-${v.id}-verse-notes`,
  //         )
  //       : undefined) as VerseNote;
  //   }),
  //   filter(o => o !== undefined),
  //   toArray(),
  // );
}

// export function prepareVerseNotes(verseNotes: VerseNote[]) {}

export function addVersesToBody(chapter: Chapter) {
  return findFormatGroupsWithVerseIDs(chapter.body).pipe(
    map(o => {
      o.verse = chapter.verses.find(v => v.id === o.v);
      // return of(o).pipe(
      //   map(o => findVerse(chapter.verses, o.v)),
      //   flatMap$,
      //   filter(o => o !== undefined),
      //   // toArray(),
      //   map(verses => {
      //     o.verse = verses; //as Verse[];
      //   }),
      // );
      // (o.verseIDs as string[]).map(vID => {
      //   const verse = chapter.verses.find(v => v.id === vID);
      // });
    }),
    // flatMap$,
    toArray(),
  );
}

function extractFormatText(
  verse: FormatGroup | Verse | FormatText,
): Observable<FormatText> {
  if (Array.isArray((verse as FormatGroup | Verse).grps)) {
    return of((verse as FormatGroup | Verse).grps as (
      | FormatGroup
      | FormatText)[]).pipe(
      flatMap$,
      map(o => extractFormatText(o)),
      flatMap$,
    );
  } else if ((verse as FormatText).docType === 5) {
    return of(verse as FormatText);
  }

  return EMPTY;
}

// function addTextToFormatText(verse: Verse, formatText: FormatText) {
//   if (formatText.offsets) {
//     const split = formatText.offsets.split('-');

//     return of(
//       (formatText.formatMerged = [
//         new FormatMerged(
//           verse.text.slice(parseInt(split[0], 10), parseInt(split[1], 10) + 1),
//         ),
//       ]),
//     );
//   }

//   return EMPTY;
// }

// function resetVerse(verse: Verse) {
//   return extractFormatText(verse).pipe(
//     map(o => {
//       return addTextToFormatText(verse, o);
//     }),
//     flatMap$,
//     toArray(),
//     map(o => o),
//   );
// }

// function resetVerses(verses: Verse[]) {
//   return of(verses).pipe(
//     flatMap$,
//     map(v => resetVerse(v)),
//     flatMap$,
//     toArray(),
//   );
// }

function highlightContext(
  verses: Verse[],
  chapterParams: ChapterParams,
  hC: 'highlight' | 'context',
) {
  (chapterParams[hC] as string).split(',').map(h => {
    if (h.includes('-')) {
      const hSplit = h.split('-');

      const firstIndex = verses.findIndex(v => v.id === hSplit[0]);
      const lastIndex = verses.findIndex(v => v.id === hSplit[1]);

      verses.slice(firstIndex, lastIndex + 1).map(v => (v[hC] = true));
    } else {
      const verse = verses.find(v => v.id === h);
      if (verse) {
        verse[hC] = true;
      }
    }
  });
}

export function highlightVerses(verses: Verse[], chapterParams: ChapterParams) {
  if (chapterParams.highlight) {
    highlightContext(verses, chapterParams, 'highlight');
  }
  if (chapterParams.context) {
    highlightContext(verses, chapterParams, 'context');
  }
  // return;
  // return of(() => {}).pipe(toArray());
}
import { groupBy as _groupBy } from 'lodash';

function generateVerseNoteGroups(verseNotea?: VerseNote[]) {
  if (verseNotea) {
    return of(verseNotea).pipe(
      flatMap$,
      map(vN => {
        if (vN.notes) {
          const sortedNotes = _groupBy(vN.notes, note => {
            if (
              note.formatTag.offsets === '' ||
              note.formatTag.offsets === undefined
            ) {
              // console.log(note.formatTag.offsets === '');

              return note.id;
            }
            // console.log(note);
            return note.formatTag.offsets;
          });
          // const n = sortedNotes.sort((a, b) => a.noteType - b.noteType);
          vN.noteGroups = Array.from(Object.keys(sortedNotes)).map(key => {
            // console.log(sortedNotes[key][0].phrase);
            // console.log(sortedNotes[key][0].formatTag.offsets);

            const notes = sortedNotes[key].sort(
              (a, b) => a.noteType - b.noteType,
            );
            return new VerseNoteGroup(notes, '');
          });

          // console.log(verseNoteGroups);

          // return of(vN.notes).pipe(
          //   flatMap$,
          //   groupBy(n => n.formatTag.offsets),
          //   mergeMap(o =>
          //     o.pipe(
          //       toArray(),
          //       map(
          //         (notes): VerseNoteGroup => {
          //           const n = notes.sort((a, b) => a.noteType - b.noteType);
          //           return new VerseNoteGroup(notes, '');
          //         },
          //       ),
          //     ),
          //   ),
          //   toArray(),
          //   map(ng => {
          //     vN.noteGroups = ng;
          //   }),
          // );
        }
        return EMPTY;
      }),
      flatMap(o => o),
      toArray(),
    );
  }

  return EMPTY;
}

function findAllGrpsWithName(
  name: string,
  grp: FormatGroup,
): Observable<FormatGroup> {
  if (grp.name && grp.name.toLowerCase() === name) {
    return of(grp);
  } else if (Array.isArray(grp.grps)) {
    return of(grp.grps).pipe(
      flatMap$,
      map(o => findAllGrpsWithName(name, o as FormatGroup)),
      flatMap$,
    );
  }

  return EMPTY;
}
import axios from 'axios';
import { VideoData } from '../../../components/VideoComponent';
import { NoteCategories } from '../verse-notes/settings/note-gorup-settings';
import { store, appSettings } from '../../../components/SettingsComponent';
function prepVideos(chapter: Chapter) {
  return findAllGrpsWithName('video', chapter.body).pipe(
    // toArray(),
    map(grp => {
      return of(
        axios.get(grp.attrs['src'] as string, { responseType: 'json' }),
      ).pipe(
        flatMap(o => o),
        map(o => {
          //
          return (o.data as VideoData.RootObject).renditions;
        }),
        flatMap(o => o),
        find(o => typeof o.src === 'string' && o.container === 'MP4'),
        map(source => {
          if (source && grp.attrs) {
            grp.attrs['src'] = source.src;
          }
        }),
      );
    }),
    flatMap$,
    toArray(),
  );
}

const port = parseInt(process.env.PORT, 10) || 3000;

function addRefLabel(chapter: Chapter) {
  return of(
    appSettings
      ? of(appSettings.noteCategories)
      : of(
          axios.get(
            'https://files.oneinthinehand.org/so//scripture_files/eng-note-categories.json',
            {
              responseType: 'json',
              // proxy: { port: port, host: '127.0.0.1' },
            },
          ),
        ).pipe(
          flatMap$,
          map(res => res.data as NoteCategories),
        ),
  ).pipe(
    flatMap$,
    map(noteCategories => {
      return of(chapter.verseNotes).pipe(
        filter(o => o !== undefined),
        flatMap(o => o as VerseNote[]),
        filter(o => Array.isArray(o.notes)),
        flatMap(o => o.notes as Note[]),
        filter(o => o !== undefined && Array.isArray(o.ref)),
        map(note => {
          note.ref.map(ref => {
            const cat =
              noteCategories && noteCategories.noteCategories
                ? noteCategories.noteCategories.find(
                    c => c.category === ref.category,
                  )
                : { label: 'err' };
            ref.label = `${
              cat ? cat.label.replace('â˜º', '🔊').replace('GEO', '🗺') : 'ERR'
            }\u00a0`;
          });
        }),
      );
    }),
    flatMap$,
    toArray(),
  );
}

export function buildShell(chapter: Chapter, params: ChapterParams) {
  return forkJoin(
    // resetVerses(chapter.verses),
    generateVerseNoteGroups(chapter.verseNotes).pipe(
      map(() => buildFMerged(chapter)),
      flatMap(o => o),
    ),
    addRefLabel(chapter),
    prepVideos(chapter),
    of(highlightVerses(chapter.verses, params)),
  );
}

export declare type Params = {
  [key: string]: any;
};

export interface ChapterParams {
  book: string;
  chapter: string;
  highlight?: string;
  context?: string;
  lang: string;
}

export function parseChapterParams(
  params: Params,
  lang: string,
): ChapterParams {
  const book = params['book'] as string;
  const chapterSplit = (params['chapter'] as string).split('.');

  return {
    book: book,
    chapter: chapterSplit[0],
    highlight: chapterSplit[1],
    context: chapterSplit[2],
    lang: lang, // params['lang'] ? params['lang'] : 'eng',
  };
}
