import { of, forkJoin } from 'rxjs';
import { flatMap, map, toArray } from 'rxjs/operators';
import {
  NoteCategory,
  NoteCategories,
} from '../verse-notes/settings/note-gorup-settings';
import { flatMap$ } from '../rx/flatMap$';

export function getAttribute(element: Element, attr: string) {
  return of(element.getAttribute(attr)).pipe(map(o => (o ? o : '')));
}

const parseNoteCategoryMap = map((noteCategoryElement: Element) => {
  return of(['name', 'label', 'class', 'on', 'note-category', 'off'])
    .pipe(
      flatMap$,
      map(attr => getAttribute(noteCategoryElement, attr)),
      flatMap$,
      toArray(),
    )
    .pipe(
      map(
        ([name, label, cls, on, noteCategoryNum, off]): NoteCategory => {
          return new NoteCategory(
            parseInt(noteCategoryNum, 10),
            cls,
            name,
            label,
            on.split(','),
            off !== '' ? off.split(',') : undefined,
          );
        },
      ),
    );
});

export function parseLanguage(docuemnt: Document) {
  const htmlE = docuemnt.querySelector('html');

  if (htmlE && htmlE.hasAttribute('lang')) {
    return of(htmlE.getAttribute('lang') as string);
  }

  throw new Error('No valid lang found');
}

export function noteCategoryProcessor(docuemnt: Document) {
  return forkJoin(
    parseLanguage(docuemnt),
    of(docuemnt.querySelectorAll('note-categories note-category')).pipe(
      flatMap(o => o),
      parseNoteCategoryMap,
      flatMap$,
      toArray(),
    ),
  ).pipe(
    map(
      ([lang, noteCategories]): NoteCategories => {
        return new NoteCategories(
          `${lang}-note-categories`,
          noteCategories,
          [],
        );
      },
    ),
  );
}
