import axios from 'axios';
import { NextPage } from 'next';
import { flatMap, map, take, filter } from 'rxjs/operators';
import { ChapterComponent } from '../../components/chapter.component';
import Layout from '../../components/layout';
import { VerseNotesShellComponent } from '../../components/verse-notes-shell';
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

class OithParent extends Component<{ chapter: Chapter }> {
  componentDidMount() {
    appSettings.displayNav$.subscribe(o => {
      this.setState({ displayNav: o });
    });

    appSettings.notesMode$.subscribe(o => {
      this.setState({ notesMode: o ? o : 'off' });
    });
    // console.log(this.props);

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
          this.state && this.state['displayNav'] ? 'nav' : ''
        } ${this.state ? `${this.state['notesMode']}-notes` : ''}`}
      >
        <nav></nav>
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

const ChapterParent: NextPage<{ chapter: Chapter }> = ({ chapter }) => {
  return <OithParent chapter={chapter}></OithParent>;
};
ChapterParent.getInitialProps = async ({ query }) => {
  const params = parseChapterParams(query);
  const data = await axios.get(
    `/scripture_files/${params.lang}-${params.book}-${params.chapter}-chapter.json`,
    { proxy: { port: 3000, host: '127.0.0.1' } },
  );

  const chapter = data.data as Chapter;
  chapter.params = params;

  // const b = await addVersesToBody(chapter)
  //   .pipe(
  //     map(() => buildShell(chapter, params)),
  //     flatMap(o => o),
  //   )
  //   .toPromise();

  console.log(`${chapter}`);

  if (store) {
    store.addToHistory(await store.chapter.pipe(take(1)).toPromise());

    const checkHistory = store.checkHistory(
      `${params.lang}-${params.book}-${params.chapter}-chapter`,
    );
    // console.log(checkHistory);
    // store.chapter.next(checkHistory ? checkHistory : chapter);

    store.history = true;
    if (checkHistory) {
      console.log(checkHistory);
      store.chapter.next(checkHistory);
    } else {
      store.initChapter$.next(chapter);
    }
    return { chapter };

    return;
  } else return { chapter };
};

export default ChapterParent;
