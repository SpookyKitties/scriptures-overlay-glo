import Router from 'next/router';
import { appSettings } from './header.component';
import { filter, map } from 'rxjs/operators';

export function getNav() {
  return appSettings.flatNavigation$.pipe(
    filter(o => o !== undefined),
    map(ni => {
      return ni.filter(n => n.href !== undefined);
    }),
  );
}

export function previousPage() {
  const url = parseUrl();
  if (url) {
    console.log(url);
    getNav().subscribe(o => {
      const n = o.find(n => n.href === url);
      if (n) {
        const i = o[o.indexOf(n) - 1];
        Router.push('/[book]/[chapter]', `/${i.href}`);
      }
    });
  }
}
export function nextPage() {
  const url = parseUrl();
  if (url) {
    console.log(url);
    getNav().subscribe(o => {
      const n = o.find(n => n.href === url);
      if (n) {
        const i = o[o.indexOf(n) + 1];
        Router.push('/[book]/[chapter]', `/${i.href}`);
      }
    });
  }
}
function parseUrl() {
  const urlRegex = /(^http.*\/)(.+?)(\/)(.+?)($|\.)/g.exec(
    window.location.href,
  );

  return urlRegex ? `${urlRegex[2]}/${urlRegex[4]}` : undefined;
}
