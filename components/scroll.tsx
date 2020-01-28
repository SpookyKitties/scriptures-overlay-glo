import { filter, map, take } from 'rxjs/operators';
import { store } from './SettingsComponent';
import { syncedVerse } from './mobile-notes.tsx/MobileNotesComponent';

function resetVerseFocus() {
  Array.from(document.querySelectorAll('.verse.focused')).map(v =>
    v.classList.remove('focused'),
  );
}

function setVerseFocus(verseID: string) {
  const verseElem = document.querySelector(`.verse[id="${verseID}"]`);

  if (verseElem) {
    verseElem.classList.add('focused');
  }
}

export function scroll() {
  const verses = Array.from(document.querySelectorAll('.verse'));
  const chapterElement = document.querySelector('.chapter-loader');
  if (chapterElement) {
    const y = chapterElement.getBoundingClientRect().top;
    const verse = verses.find(
      e => e.getBoundingClientRect().top + 10 >= y === true,
    );
    if (verse) {
      store.chapter
        .pipe(
          take(1),
          filter(o => o !== undefined),
          map(chapter => {
            resetVerseFocus();
            const tempID = /^(p)(.+)$/g.exec(verse.id);
            const id = tempID ? tempID[2] : verse.id;

            const vn = chapter.verseNotes.find(vn =>
              vn.id.includes(`-${id}-verse-note`),
            );
            if (syncedVerse) {
              setVerseFocus(verse.id);
              syncedVerse.next(vn);
            }
            const verseNote = document.querySelector(
              `[id*='-${id}-verse-note']`,
            );
            if (verseNote) {
              verseNote.scrollIntoView();
            }
          }),
        )
        .subscribe();
    }
  }
}
