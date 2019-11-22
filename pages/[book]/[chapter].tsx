import axios from "axios";
import { NextPage } from "next";
import { flatMap, map } from "rxjs/operators";
import { ChapterComponent } from "../../components/chapter.component";
import Layout from "../../components/layout";
import { VerseNotesShellComponent } from "../../components/verse-notes-shell";
import { Chapter } from "../../oith-lib/src/models/Chapter";
import {
  addVersesToBody,
  buildShell,
  parseChapterParams
} from "../../oith-lib/src/shells/build-shells";

export type ImgAttr = {
  src: string;
  alt: string;
};

function scroll() {
  const verses = Array.from(document.querySelectorAll(".verse"));
  const chapterElement = document.querySelector(".chapter-loader");
  if (chapterElement) {
    const y = chapterElement.getBoundingClientRect().top;
    const verse = verses.find(
      e => e.getBoundingClientRect().top + 10 >= y === true
    );
    if (verse) {
      const tempID = /^(p)(.+)$/g.exec(verse.id);
      const id = tempID ? tempID[2] : verse.id;
      const verseNote = document.querySelector(`[id*='-${id}-verse-note']`);
      console.log(verse);

      if (verseNote) {
        verseNote.scrollIntoView();
      }
    }
  }
}

const ChapterParent: NextPage<{ chapter: Chapter }> = ({ chapter }) => {
  return (
    <Layout
      title={chapter ? chapter.title : ""}
      shortTitle={chapter ? chapter.shortTitle : ""}
    >
      <nav></nav>
      <div className="parent">
        <div className="chapter-loader" onScroll={scroll}>
          <ChapterComponent chapter={chapter}></ChapterComponent>
          <div className="white-space"></div>
        </div>
        <VerseNotesShellComponent chapter={chapter}></VerseNotesShellComponent>
        {/* <div className="verse-notes"></div> */}
      </div>
    </Layout>
  );
};

ChapterParent.getInitialProps = async ({ query }) => {
  const params = parseChapterParams(query);
  const data = await axios.get(
    `/scripture_files/${params.lang}-${params.book}-${params.chapter}-chapter.json`,
    { proxy: { port: 3000, host: "127.0.0.1" } }
  );
  const chapter = data.data as Chapter;

  const b = await addVersesToBody(chapter)
    .pipe(
      map(() => buildShell(chapter, params)),
      flatMap(o => o)
    )
    .toPromise();

  return { chapter };
};

export default ChapterParent;
