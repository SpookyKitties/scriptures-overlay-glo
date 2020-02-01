import axios from 'axios';
import { addYears } from 'date-fns';
import { IncomingMessage } from 'http';
import { NextPage } from 'next';
import { ParsedUrlQuery } from 'querystring';
import { Component } from 'react';
import ReactGA from 'react-ga';
import { forkJoin, of } from 'rxjs';
import { filter, flatMap, map, take } from 'rxjs/operators';
import { langReq } from '../../app/langReq';
import { ChapterComponent } from '../../components/chapter.component';
import { PouchyRx } from '../../components/import-notes/import-notes/PouchyRx';
import { NavigationComponenet } from '../../components/navigation/navigation.component';
import { parseSubdomain } from '../../components/parseSubdomain';
import { appSettings, store } from '../../components/SettingsComponent';
import { titleService } from '../../components/TitleComponent';
import { addNotesToVerses$ } from '../../components/verse-notes/addNotesToVerses$';
import { VerseNotesShellComponent } from '../../components/verse-notes/verse-notes-shell';
import { Chapter } from '../../oith-lib/src/models/Chapter';
import {
  addVersesToBody,
  buildShell,
  ChapterParams,
  parseChapterParams,
} from '../../oith-lib/src/shells/build-shells';
import { scroll } from '../../components/scroll';
import { MobileNotesComponent } from '../../components/mobile-notes.tsx/MobileNotesComponent';

export type ImgAttr = {
  src: string;
  alt: string;
};

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

    store.initChapter$
      .pipe(
        filter(o => o !== undefined),
        map(chapter => {
          const addVToB = addVersesToBody(chapter).pipe(
            map(() => buildShell(chapter, chapter.params)),
            flatMap(o => o),
            map(() => chapter),
          );
          return forkJoin(addVToB, addNotesToVerses$(chapter));
        }),
        flatMap(o => o),
      )
      .subscribe(chapter => {
        store.chapter.next(chapter[0]);
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

  renderFuture() {
    try {
      if (parseSubdomain().beta) {
        return <MobileNotesComponent />;
      }
    } catch (error) {}
    return <></>;
  }

  render() {
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
        {/* {this.renderFuture()} */}

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

ChapterParent.getInitialProps = async ({ query, req, res }) => {
  console.log(query);

  return await loadChapter(req, query);
};

export default ChapterParent;

const port = parseInt(process.env.PORT, 10) || 3000;

async function getChapterRemote(id: string, params: ChapterParams) {
  try {
    const data = await axios.get(
      `${parseSubdomain(params.host).storageURL}${id}.json`,
    );

    const chapter = data.data as Chapter;
    chapter.params = params;

    return chapter;
  } catch (error) {
    console.log('a190');

    return undefined;
  }
  const g = async () => {};
}

async function loadChapter(req: IncomingMessage, query: ParsedUrlQuery) {
  const lang = langReq(req, query);
  const host = req && req.headers ? req.headers.host : location.host;

  const params = parseChapterParams(query, lang, host);

  const id = `${params.lang}-${params.book}-${params.chapter}-chapter`;
  if (store) {
    store.addToHistory(await store.chapter.pipe(take(1)).toPromise());

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
