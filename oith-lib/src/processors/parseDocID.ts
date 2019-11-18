import { EMPTY, of, Observable } from 'rxjs';
import { parseLanguage } from './parseLanguage';
import { map } from 'rxjs/operators';
export function parseDocID($: CheerioStatic): Observable<string> {
  const htmlE = $('html');
  if (htmlE && htmlE.attr('data-uri')) {
    const r = /^.+\/(.+?)\/(.+?)(\.html$|$)/g.exec(htmlE.attr(
      'data-uri',
    ) as string);

    if (r) {
      return parseLanguage($).pipe(
        map(l => {
          return `${l}-${r[1]}-${r[2]}`;
        }),
      );
    }
  }
  return EMPTY;
  // throw new Error('No valid data-uri found');
}
