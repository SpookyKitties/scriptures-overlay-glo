import axios from 'axios';
import { NextPage } from 'next';
import { flatMap, map, take, filter, debounceTime } from 'rxjs/operators';
import { ChapterComponent } from '../../components/chapter.component';
import Layout from '../../components/layout';
import { VerseNotesShellComponent } from '../../components/verse-notes/verse-notes-shell';
import { Chapter } from '../../oith-lib/src/models/Chapter';
import ReactGA from 'react-ga';
import {
  addVersesToBody,
  buildShell,
  parseChapterParams,
  ChapterParams,
} from '../../oith-lib/src/shells/build-shells';
import { Component } from 'react';
import { appSettings, store } from '../../components/SettingsComponent';
import { forkJoin, fromEvent, of, Observable } from 'rxjs';
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

    appSettings.displayUnderline$.subscribe(o => {
      this.setState({ displayUnderline: o });
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
        map(chapter => {
          return addVersesToBody(chapter).pipe(
            map(() => buildShell(chapter, chapter.params)),
            flatMap(o => o),
            map(() => chapter),
          );
        }),
        flatMap(o => o),
      )
      .subscribe(chapter => {
        store.chapter.next(chapter);
      });

    store.chapter.pipe(filter(o => o !== undefined)).subscribe(chapter => {
      if (titleService && chapter) {
        titleService.next([chapter.title, chapter.shortTitle]);
      }
      this.setState({ chapter: chapter });
      setTimeout(() => {
        ReactGA.pageview(window.location.pathname + window.location.search);
      }, 200);

      store.disableNav$.next(false);
    });
  }

  private getClasses() {
    if (this.state) {
      return `${this.state['displayNav'] ? 'nav' : 'nav-off'} ${
        this.state['displayUnderline'] === false ? 'hide-underline' : ''
      } ${this.state['notesMode']}-notes`;
    }

    return `nav-off`;
  }

  render() {
    // const chapter = this.props.chapter;

    // if (store) {
    //   // store.chapter.next(this.props.chapter);
    // } else {
    //   this.setState({ chapter: chapter });
    // }
    return (
      <div className={`oith-content-parent ${this.getClasses()}`}>
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

const ChapterParent: NextPage<{ chapter: Chapter; lang: string }> = ({
  chapter,
  lang,
}) => {
  return <OithParent chapter={chapter} lang={lang}></OithParent>;
};
import PouchDB from 'pouchdb';
import { PouchyRx } from '../../components/import-notes/import-notes/PouchyRx';
import { ParsedUrlQuery } from 'querystring';
import { IncomingMessage } from 'http';
import { titleService } from '../../components/TitleComponent';

ChapterParent.getInitialProps = async ({ query, req, res }) => {
  return await loadChapter(req, query);
};

export default ChapterParent;

const port = parseInt(process.env.PORT, 10) || 3000;

async function getChapterRemote(id: string, params: ChapterParams) {
  try {
    const data = await axios.get(
      `https://oithstorage.blob.core.windows.net/blobtest/${id}.json`,
    );
    // `/files/scripture_files/${id}.json`, {
    // proxy: { port: port, host: '127.0.0.1' },

    const chapter = data.data as Chapter;
    chapter.params = params;

    return chapter;
  } catch (error) {
    console.log(error);

    return undefined;
  }
  const g = async () => {};
}

async function loadChapter(req: IncomingMessage, query: ParsedUrlQuery) {
  const lang = langReq(req, query);
  const params = parseChapterParams(query, lang);

  const id = `${params.lang}-${params.book}-${params.chapter}-chapter`;

  if (store) {
    store.addToHistory(await store.chapter.pipe(take(1)).toPromise());

    // const checkHistory = store.checkHistory(
    //   `${params.lang}-${params.book}-${params.chapter}-chapter`,
    // );
    store.disableNav$.next(true);
    let chapter = await store
      .checkHistory$(id)
      .pipe(
        map(c => {
          if (c) {
            return of(c);
          }
          store.history = false;

          let database = new PouchyRx(
            `v6-${window.location.hostname}-overlay-org`,
          );
          return database
            .get<Chapter>(
              `${params.lang}-${params.book}-${params.chapter}-chapter`,
            )
            .pipe(
              map(dbItem => {
                if (dbItem) {
                  return dbItem.doc;
                }
                return;
              }),
            );
        }),
        flatMap(o => o),
        map(c => {
          if (c) {
            return of(c);
          }

          return getChapterRemote(id, params);
        }),
        flatMap(o => o),
      )
      .toPromise();

    // store.chapter.next(checkHistory ? checkHistory : chapter);

    if (chapter && !store.history) {
      chapter.params = params;
      store.initChapter$.next(chapter);
    } else {
      store.chapter.next(chapter);
    }
    store.history = true;
    return { chapter, lang };
  } else {
    let chapter = await getChapterRemote(id, params);

    return { chapter, lang };
  }
}
