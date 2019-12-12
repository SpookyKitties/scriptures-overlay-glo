import axios from 'axios';
import { NextPage } from 'next';
import { flatMap, map, take, filter } from 'rxjs/operators';
import { ChapterComponent } from '../../components/chapter.component';
import Layout from '../../components/layout';
import { VerseNotesShellComponent } from '../../components/verse-notes/verse-notes-shell';
import { Chapter } from '../../oith-lib/src/models/Chapter';
import {
  addVersesToBody,
  buildShell,
  parseChapterParams,
} from '../../oith-lib/src/shells/build-shells';
import { Component } from 'react';
import { appSettings, store } from '../../components/header.component';
import { forkJoin, fromEvent, of } from 'rxjs';
// import { store } from "../_app";
import Router from 'next/router';
import { NavigationComponenet } from '../../components/navigation/navigation.component';
import { addYears } from 'date-fns';
import { langReq } from '../../app/langReq';

export type ImgAttr = {
  src: string;
  alt: string;
};

function scroll() {
  const verses = Array.from(document.querySelectorAll('.verse'));
  const chapterElement = document.querySelector('.chapter-loader');
  if (chapterElement) {
    const y = chapterElement.getBoundingClientRect().top;
    const verse = verses.find(
      e => e.getBoundingClientRect().top + 10 >= y === true,
    );
    if (verse) {
      const tempID = /^(p)(.+)$/g.exec(verse.id);
      const id = tempID ? tempID[2] : verse.id;
      const verseNote = document.querySelector(`[id*='-${id}-verse-note']`);

      if (verseNote) {
        verseNote.scrollIntoView();
      }
    }
  }
}

export function reInitChapter() {
  store.chapter
    .pipe(
      take(1),
      filter(o => o !== undefined),
      map(chapter =>
        addVersesToBody(chapter).pipe(
          map(() => buildShell(chapter, chapter.params)),
          flatMap(o => o),
          map(() => chapter),
        ),
      ),
      flatMap(o => o),
    )
    .subscribe(chapter => {
      store.chapter.next(chapter);
    });
}

class OithParent extends Component<{ chapter: Chapter; lang: string }> {
  componentDidMount() {
    appSettings.displayNav$.subscribe(o => {
      this.setState({ displayNav: o });
    });
    document.cookie = `lang=${this.props.lang}; expires=${addYears(
      new Date(),
      1,
    )}; path=/`;
    appSettings.settings.lang = this.props.lang;
    appSettings.save('settings');

    appSettings.notesMode$.subscribe(o => {
      this.setState({ notesMode: o ? o : 'off' });
    });

    store.initChapter$.next(this.props.chapter);
    // store.chapter.next(this.props.chapter);
    store.initChapter$
      .pipe(
        filter(o => o !== undefined),
        map(chapter =>
          addVersesToBody(chapter).pipe(
            map(() => buildShell(chapter, chapter.params)),
            flatMap(o => o),
            map(() => chapter),
          ),
        ),
        flatMap(o => o),
      )
      .subscribe(chapter => {
        store.chapter.next(chapter);
      });

    store.chapter.pipe(filter(o => o !== undefined)).subscribe(chapter => {
      this.setState({ chapter: chapter });
    });
  }

  render() {
    // const chapter = this.props.chapter;

    // if (store) {
    //   // store.chapter.next(this.props.chapter);
    // } else {
    //   this.setState({ chapter: chapter });
    // }
    return (
      <div
        className={`oith-content-parent ${
          this.state && this.state['displayNav'] ? 'nav' : 'nav-off'
        } ${this.state ? `${this.state['notesMode']}-notes` : ''}`}
      >
        <nav className={`oith-navigation`}>
          <NavigationComponenet />
          <div
            className={`mobile-nav-close`}
            onClick={() => {
              appSettings.displayNav();
            }}
          ></div>
        </nav>
        <div className={`chapter-loader `} onScroll={scroll}>
          <ChapterComponent></ChapterComponent>
          <div className="white-space"></div>
        </div>
        <VerseNotesShellComponent
          chapter={
            this.state && this.state['chapter']
              ? this.state['chapter']
              : undefined
          }
        ></VerseNotesShellComponent>
      </div>
    );
  }
}

const port = parseInt(process.env.PORT, 10) || 3000;
const ChapterParent: NextPage<{ chapter: Chapter; lang: string }> = ({
  chapter,
  lang,
}) => {
  return <OithParent chapter={chapter} lang={lang}></OithParent>;
};
import PouchDB from 'pouchdb';
import { PouchyRx } from '../../components/import-notes/import-notes/PouchyRx';

ChapterParent.getInitialProps = async ({ query, req, res }) => {
  const lang = langReq(req, query);
  const params = parseChapterParams(query, lang);
  // console.log(port);
  console.log(lang);

  const data = await axios.get(
    `https://files.oneinthinehand.org/so//scripture_files/${params.lang}-${params.book}-${params.chapter}-chapter.json`,
    // { proxy: { port: port, host: '127.0.0.1' } },
  );

  const chapter = data.data as Chapter;
  chapter.params = params;

  // const b = await addVersesToBody(chapter)
  //   .pipe(
  //     map(() => buildShell(chapter, params)),
  //     flatMap(o => o),
  //   )
  //   .toPromise();

  if (store) {
    store.addToHistory(await store.chapter.pipe(take(1)).toPromise());

    const checkHistory = store.checkHistory(
      `${params.lang}-${params.book}-${params.chapter}-chapter`,
    );

    // store.chapter.next(checkHistory ? checkHistory : chapter);

    if (checkHistory && store.history) {
      store.chapter.next(checkHistory);
    } else {
      // try {
      let database = new PouchyRx(`v6-${window.location.hostname}-overlay-org`);
      const i = await database
        .get<Chapter>(`${params.lang}-${params.book}-${params.chapter}-chapter`)
        .toPromise();
      if (i) {
        console.log(i);
        const c = i.doc; // as Chapter;
        store.initChapter$.next(c);
      } else {
        // return { c, lang };
        // } catch (error) {
        store.initChapter$.next(chapter);
        // }}
      }
    }
    store.history = true;
    return { chapter, lang };

    return;
  } else return { chapter, lang };
};

export default ChapterParent;
