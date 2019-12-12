import PouchDB from 'pouchdb';
import { of, EMPTY, Observable } from 'rxjs';
import { flatMap, map } from 'rxjs/operators';

export type DBItem<T> = {
  _id: string;
  _rev: string;
  doc: T;
};

export class PouchyRx {
  public db?: PouchDB.Database<{}>;

  public constructor(
    dbName: string,
    options?: PouchDB.Configuration.DatabaseConfiguration,
  ) {
    this.db = new PouchDB(dbName, options);
  }

  public getRev(docID: string) {
    return this.get(docID).pipe(map(doc => (doc ? doc._rev : undefined)));
  }
  public put$<T, T2 extends keyof T>(
    doc: T,
    id: T2,
    options: PouchDB.Core.PutOptions = { fetch: undefined, force: undefined },
  ) {
    const docId = (doc[id] as unknown) as string;

    return this.getRev(docId).pipe(
      map(_rev => {
        const d: DBItem<T> = { _id: docId, _rev: _rev, doc: doc };

        return of(this.db.put(d, options));
      }),
      flatMap(o => o),
      flatMap(o => o),
    );
    //   this.db.put()
  }
  public get<T>(
    docID: string,
    options: PouchDB.Core.GetOptions = {},
  ): Observable<DBItem<T>> {
    const getDBItem = async () => {
      try {
        const dbItem = await this.db.get(docID, options ? options : undefined);

        return dbItem as DBItem<T>;
      } catch (error) {
        return undefined;
      }
    };
    return of(getDBItem()).pipe(flatMap(o => o));
  }

  public allDocs$(
    options:
      | PouchDB.Core.AllDocsWithKeyOptions
      | PouchDB.Core.AllDocsOptions
      | PouchDB.Core.AllDocsWithKeysOptions
      | PouchDB.Core.AllDocsWithinRangeOptions = {},
  ) {
    return of(this.db.allDocs(options)).pipe(flatMap(o => o));
  }

  public bulkDocs$<T, T2 extends keyof T>(docs: T[], idAttr: T2) {}
}
