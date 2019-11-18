import { Chapter } from '../models/Chapter';
import { VerseNote } from '../verse-notes/verse-note';
import { of, forkJoin, Observable } from 'rxjs';
import { flatMap$ } from '../rx/flatMap$';
import { map, filter, toArray, flatMap } from 'rxjs/operators';
import { fastGlob$, sortPath } from '../main';
import { readFile$, readFileMap } from '../fs$';

function loadFiles() {
  console.log(sortPath);

  return fastGlob$(sortPath).pipe(
    flatMap(o => o),
    readFileMap,
    flatMap(o => o),
    map(o => JSON.parse(o.toString()) as (Chapter | VerseNote)[]),
    flatMap(o => o),
    toArray(),
  );
}

export function sort() {
  console.log('Sorting Files');
  return loadFiles().pipe(
    map(docs => {
      console.log(docs.length);

      return of(docs).pipe(
        flatMap$,
        filter(o => o.id.endsWith('chapter')),
        map(
          (doc: Chapter): Observable<Chapter> => {
            if (doc.verseNotes === undefined) {
              doc.verseNotes = [];
            }
            const splitID = doc.id.split('-');
            splitID.pop();
            const id = `${splitID.join('-')}-`;
            const i = doc.id.replace('-chapter', '-');

            const verseNotes = of(docs).pipe(
              flatMap$,
              filter(o => o.id.includes('verse-note') && o.id.includes(i)),
              map((verseNote: VerseNote) => {
                if (doc.verseNotes) {
                  const vNote = doc.verseNotes.find(
                    vn => vn.id === verseNote.id,
                  );
                  if (vNote) {
                    vNote.notes = (vNote.notes ? vNote.notes : []).concat(
                      verseNote.notes ? verseNote.notes : [],
                    );
                  } else {
                    doc.verseNotes.push(verseNote);
                  }
                } else {
                  doc.verseNotes = [verseNote];
                }
              }),
              toArray(),
            );

            return forkJoin(verseNotes, of(doc)).pipe(map(o => o[1]));
          },
        ),
        flatMap(o => o),
      );
    }),
    flatMap(o => o),
  );
  // const verseNotes = docs.filter(doc =>
  //   doc.id.includes('verse-note'),
  // ) as VerseNote[];
  // // console.log(docs.map(o => o.id));

  // // console.log(verseNotes.map(o => o.id));

  // // const chapters = docs.filter()

  // return of(docs).pipe(
  //   flatMap$,
  //   filter(o => o.id.endsWith('chapter')),
  //   map(
  //     (doc: Chapter): Observable<Chapter> => {
  //       if (doc.verseNotes === undefined) {
  //         doc.verseNotes = [];
  //       }
  //       const splitID = doc.id.split('-');
  //       splitID.pop();
  //       const id = `${splitID.join('-')}-`;
  //       const i = doc.id.replace('-chapter', '-');

  //       const verseNotes = of(docs).pipe(
  //         flatMap$,
  //         filter(o => o.id.includes('verse-note') && o.id.includes(i)),
  //         map((verseNote: VerseNote) => {
  //           if (doc.verseNotes) {
  //             const vNote = doc.verseNotes.find(vn => vn.id === verseNote.id);
  //             if (vNote) {
  //               vNote.notes = (vNote.notes ? vNote.notes : []).concat(
  //                 verseNote.notes ? verseNote.notes : [],
  //               );
  //             } else {
  //               doc.verseNotes.push(verseNote);
  //             }
  //           } else {
  //             doc.verseNotes = [verseNote];
  //           }
  //         }),
  //         toArray(),
  //       );

  //       return forkJoin(verseNotes, of(doc)).pipe(map(o => o[1]));
  //     },
  //   ),
  //   flatMap$,
  //   // toArray(),
  // );

  // console.log(verseNotes.length);
}
