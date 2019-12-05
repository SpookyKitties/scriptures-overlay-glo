import Router from 'next/router';
import { appSettings, store } from './header.component';
import { filter, map, flatMap, take, toArray } from 'rxjs/operators';
import { forkJoin, of, Observable, EMPTY } from 'rxjs';
// import { filterUndefined$ } from '../oith-lib/src/process';
import { flatMap$ } from '../oith-lib/src/rx/flatMap$';
import { NavigationItem } from './navigation-item';
import { getURL } from 'next/dist/next-server/lib/utils';

export const filterUndefined$ = filter(
  <T>(o: T) => o !== undefined && o !== null,
);
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
  const urlRegex = /(^http.*\/)(.+?)(\/)(.+?)(\?|$|\.)/g.exec(
    window.location.href,
  );

  return urlRegex ? `${urlRegex[2]}/${urlRegex[4]}` : undefined;
}

function navUPdate(
  navigationItem: NavigationItem,
  url: string,
): Observable<NavigationItem[]> {
  if (
    navigationItem.navigationItems !== undefined &&
    navigationItem.navigationItems.find(ni => `/${ni.href}` === url)
  ) {
    return of([navigationItem]); //.pipe(map(o=>o.concat()));
  } else if (navigationItem.navigationItems !== undefined) {
    return of(navigationItem.navigationItems).pipe(
      flatMap$,
      map(o => navUPdate(o, url).pipe(map(o => o.concat([navigationItem])))),
      flatMap$,
    );
  }
  // console.log(url);

  return EMPTY; // of(navigationItem).pipe();
}
// export const filterUndefined<T> = () => filter((o: T) => o !== undefined); //=>{}
export function setCurrentNav() {
  store.chapter
    .pipe(
      filterUndefined$,
      map(() => {
        console.log('jhhgg');

        return forkJoin(
          appSettings.navigation$.pipe(
            take(1),
            filter(o => o !== undefined),
          ),
          appSettings.flatNavigation$.pipe(
            take(1),
            filterUndefined$,
            map(nav => {
              console.log('jht4343');

              return nav
                .filter(n => n.navigationItems !== undefined)
                .map(n => (n.open = false));
            }),
          ),
        ).pipe(map(o => o[0]));
      }),
      // flatMap$,
      flatMap(o => o),
      map(o =>
        navUPdate(o, getURL()).pipe(
          flatMap$,
          // toArray(),
          toArray(),
          map(o => o),
        ),
      ),
      flatMap(o => o),
    )
    .subscribe(o => {
      console.log(o.map(i => (i.open = true)));
      console.log(o);

      appSettings.updatenavigation$.next(true);
    });
}
