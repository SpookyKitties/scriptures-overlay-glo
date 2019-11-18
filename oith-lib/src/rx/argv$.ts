import { Observable, of } from 'rxjs';
import { filter } from 'rxjs/operators';

export const filterUndefinedNull$ = filter(
  <T>(o: T) => o !== undefined && o !== null,
);

export function argv$<T>(argv: {}, attr: string): Observable<T> {
  return of(argv[attr] as T).pipe(filterUndefinedNull$);
}
