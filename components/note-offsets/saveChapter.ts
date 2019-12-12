import { of } from 'rxjs';
import { map, filter, take } from 'rxjs/operators';
import { store } from '../header.component';
import { flatMap$ } from '../../oith-lib/src/rx/flatMap$';
import PouchDB from 'pouchdb';
import { PouchyRx } from '../import-notes/import-notes/PouchyRx';
import { Chapter } from '../../oith-lib/src/models/Chapter';
export function saveChapter() {
  return store.chapter.pipe(
    take(1),
    map(c => {
      return c;
    }),
    filter(o => o !== undefined),
    map((c: Chapter) => {
      let database = new PouchyRx(`v6-${window.location.hostname}-overlay-org`);

      return database.put$(c, 'id');
    }),
    flatMap$,
  );
}
