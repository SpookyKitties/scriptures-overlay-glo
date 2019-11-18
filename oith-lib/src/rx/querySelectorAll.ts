import { of, Observable } from 'rxjs';
import { flatMap } from 'rxjs/operators';

export const flatElements$ = flatMap(
  <T extends Element, T2 extends Node>(e: NodeListOf<T | T2>) => e,
);

export function querySelectorAll(
  selector: string,
  doc: Document = document,
): Observable<Element> {
  return of(doc.querySelectorAll(selector)).pipe(flatElements$);
}
