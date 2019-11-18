import { of } from 'rxjs';
import { JSDOM } from 'jsdom';
import { map } from 'rxjs/operators';
export function loadJSDOM(input: string | Buffer) {
  return of(new JSDOM(input).window.document);
}
export const loadJSDOM$ = map((input: string | Buffer) => loadJSDOM(input));
