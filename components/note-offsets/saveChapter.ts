import { of } from 'rxjs';
import { map, filter, take } from 'rxjs/operators';
import { store } from '../header.component';
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
      let database: PouchDB.Database<{}> = new PouchDB(
        `v6-${window.location.hostname}-overlay-org`,
      );
      let rev: string | undefined = undefined;
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
