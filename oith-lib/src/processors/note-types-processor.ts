import { of, forkJoin } from 'rxjs';
import { flatMap, map, toArray } from 'rxjs/operators';
import {
  NoteCategory,
  NoteCategories,
  NoteType,
  NoteTypes,
} from '../verse-notes/settings/note-gorup-settings';
import { flatMap$ } from '../rx/flatMap$';
import { parseLanguage } from './parseLanguage';

export function getAttribute(element: Element, attr: string) {
  return of(element.getAttribute(attr)).pipe(map(o => (o ? o : '')));
}

const parseNoteCategoryMap = map((noteCategoryElement: Element) => {
  return of(['name', 'short-name', 'class', 'sort'])
    .pipe(
      flatMap$,
      map(attr => getAttribute(noteCategoryElement, attr)),
      flatMap$,
      toArray(),
    )
    .pipe(
      map(
        ([name, sN, cls, nt]): NoteType => {
          return new NoteType(name, sN, cls, false, parseInt(nt, 10));
        },
      ),
    );
});

export function noteTypeProcessor(docuemnt: Document) {
  return forkJoin(
    of('eng'),
    of(docuemnt.querySelectorAll('note-types note-type')).pipe(
      flatMap(o => o),
      parseNoteCategoryMap,
      flatMap$,
      toArray(),
    ),
  ).pipe(
    map(
      ([lang, noteCategories]): NoteTypes => {
        return new NoteTypes(`${lang}-note-types`, noteCategories);
      },
    ),
  );
}
