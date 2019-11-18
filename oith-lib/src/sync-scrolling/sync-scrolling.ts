import { of, Subject, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';

export const syncScrolling$ = new Subject();

function syncScrolling() {
  syncScrolling$
    .pipe(
      map(() => {
        const verses = Array.from(document.querySelectorAll('.verse'));
        const chapterElement = document.querySelector('.chapter-loader');
        if (chapterElement) {
          const y = chapterElement.getBoundingClientRect().top;
          const verse = verses.find(
            e => e.getBoundingClientRect().top + 10 >= y + 10 === true,
          );
          if (verse) {
            const verseNote = document.querySelector(
              `[id*='-${verse.id}-verse-note']`,
            );

            if (verseNote) {
              verseNote.scrollIntoView();
            }
          }
        }
      }),
    )
    .subscribe();
}

syncScrolling();
