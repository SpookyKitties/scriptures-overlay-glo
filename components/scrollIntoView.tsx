import { of } from "rxjs";
import { filter, map, take, flatMap } from "rxjs/operators";
import { store } from "./header.component";
export function scrollIntoView() {
  return store.chapter.pipe(
    take(1),
    map(c => {
      console.log(c);
      if (c && c.params && c.params.highlight && !store.history) {
        return of(document.querySelector(".highlight,.context")).pipe(
          filter(o => o !== null),
          map(o => o.scrollIntoView())
        );
      }
      return of(document.querySelector(".chapter-loader")).pipe(
        filter(o => o !== null),
        map(o => {
          o.scrollTop = store.history ? c.chapterTop : 0;
        })
      );
      // .subscribe();
    }),
    flatMap(o => o)
  );
}
