import { of } from 'rxjs';
export function parseLanguage(docuemnt: CheerioStatic) {
  const htmlE = docuemnt('html');
  if (htmlE && htmlE.attr('lang') !== '') {
    return of(htmlE.attr('lang') as string);
  }
  throw new Error('No valid lang found');
}
