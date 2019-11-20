import axios from "axios";
import { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { Fragment } from "react";
import { flatMap, map, filter } from "rxjs/operators";
import { ChapterComponent } from "../../components/chapter.component";
import Layout from "../../components/layout";
import { VerseNotesShellComponent } from "../../components/verse-notes-shell";
import {
  Verse,
  FormatGroup,
  FormatText,
  Chapter,
  VersePlaceholder
} from "../../oith-lib/src/models/Chapter";

import { store } from "../../app/Store";
import { HeaderComponent } from "../../components/header.component";
import {
  addVersesToBody,
  buildNewShell
} from "../../oith-lib/src/shells/build-shells";
import { Subject } from "rxjs";

function Testat() {
  return <h1>Test</h1>;
}

export type ImgAttr = {
  src: string;
  alt: string;
};

function formatVerses(verses?: Verse[]) {
  if (verses) {
    return verses.map(verse => {
      switch (verse.n) {
        case "p": {
          return <p>{formatGroups(verse.grps, verse)}</p>;
        }
        case "h2": {
          return <h2>{formatGroups(verse.grps, verse)}</h2>;
        }
        case "h1": {
          return <h1>{formatGroups(verse.grps, verse)}</h1>;
        }
        case "h3": {
          return <h3>{formatGroups(verse.grps, verse)}</h3>;
        }
        case "h4": {
          return <h4>{formatGroups(verse.grps, verse)}</h4>;
        }
        case "p": {
          return <p>{formatGroups(verse.grps, verse)}</p>;
        }
        case "p": {
          return <p>{formatGroups(verse.grps, verse)}</p>;
        }
        case "p": {
          return <p>{formatGroups(verse.grps, verse)}</p>;
        }
        case "p": {
          return <p>{formatGroups(verse.grps, verse)}</p>;
        }
        default:
          break;
      }
      return (
        <p>
          {verse.text}-jhhgfdd{formatGroups(verse.grps, verse)}
        </p>
      );
    });
  }
  return;
}
function formatGroup(grp: FormatGroup) {
  return <Fragment>{formatGroups(grp.grps)}</Fragment>;
}

function formatGroups(
  grps?: (FormatGroup | FormatText | VersePlaceholder)[],
  verse?: Verse
) {
  if (grps) {
    return grps.map(grpTxt => {
      if ((grpTxt as FormatText).docType === 4) {
        const grp = grpTxt as FormatGroup;

        if (
          grp.attrs &&
          (grp.attrs as { class: string })["class"] !== undefined
        ) {
          (grp.attrs as { className: string }).className = (grp.attrs as {
            class: string;
          }).class;

          (grp.attrs as { class?: string }).class = undefined;
        }
        // return <h1>{grp.name}</h1>;
        const name = grp.name ? grp.name.toLowerCase() : "";
        switch (name) {
          case "header": {
            return <header {...grp.attrs}>{formatGroup(grp)}</header>;
          }
          case "section": {
            return <section {...grp.attrs}>{formatGroup(grp)}</section>;
          }
          case "ul": {
            return <ul {...grp.attrs}>{formatGroup(grp)}</ul>;
          }
          case "li": {
            return <li {...grp.attrs}>{formatGroup(grp)}</li>;
          }
          case "dl": {
            return <dl {...grp.attrs}>{formatGroup(grp)}</dl>;
          }
          case "h1": {
            return <h1 {...grp.attrs}>{formatGroup(grp)}</h1>;
          }
          case "h2": {
            return <h2 {...grp.attrs}>{formatGroup(grp)}</h2>;
          }
          case "h3": {
            return <h3 {...grp.attrs}>{formatGroup(grp)}</h3>;
          }
          case "h4": {
            return <h4 {...grp.attrs}>{formatGroup(grp)}</h4>;
          }
          case "p": {
            return <p {...grp.attrs}>{formatGroup(grp)}</p>;
          }
          case "em": {
            return <em {...grp.attrs}>{formatGroup(grp)}</em>;
          }
          case "dd": {
            return <dd {...grp.attrs}>{formatGroup(grp)}</dd>;
          }
          case "figure": {
            return <figure {...grp.attrs}>{formatGroup(grp)}</figure>;
          }
          case "div": {
            return <div {...grp.attrs}>{formatGroup(grp)}</div>;
          }
          case "ol": {
            return <ol {...grp.attrs}>{formatGroup(grp)}</ol>;
          }
          case "figcaption":
          case "figcaption": {
            return <figcaption {...grp.attrs}>{formatGroup(grp)}</figcaption>;
          }
          case "span":
          case "span": {
            return <span {...grp.attrs}>{formatGroup(grp)}</span>;
          }
          case "a":
          case "a": {
            return renderLinks(grp);
          }
          case "i": {
            return <i {...grp.attrs}>{formatGroup(grp)}</i>;
          }
          case "cite": {
            return <cite {...grp.attrs}>{formatGroup(grp)}</cite>;
          }
          case "br": {
            return (
              <h1 {...grp.attrs}>
                {grp.grps ? grp.grps.length : "br"}
                <br />
              </h1>
            );
            // return <br {...grp.attrs}>{formatGroup(grp)}</br>;
          }

          case "IMG": {
            const attrs = grp.attrs as ImgAttr;
            attrs.src = `/images/${attrs.src}.jpg`;
            return (
              <div className="img-container ">
                <img {...attrs} />
              </div>
            );
          }

          default: {
            return <span {...grp.attrs}>{formatGroup(grp)}</span>;
          }
        }
      } else if ((grpTxt as FormatText).docType === 5 && verse) {
        const txt = grpTxt as FormatText;
        if (txt.formatMerged) {
          return (
            <span off-ets={txt.offsets}>
              {txt.formatMerged.map(fm => {
                return <span className="f-t">{fm.text}</span>;
              })}
            </span>
          );
        }
      }
    });
  }

  return;
}
const ChapterParent: NextPage<{ a: string; chapter: Chapter }> = ({
  a,
  chapter
}) => {
  return (
    <Layout
      title={chapter ? chapter.title : ""}
      shortTitle={chapter ? chapter.shortTitle : ""}
    >
      <nav></nav>
      <div className="parent">
        <div className="chapter-loader">
          <ChapterComponent chapter={chapter}></ChapterComponent>
        </div>
        <VerseNotesShellComponent chapter={chapter}></VerseNotesShellComponent>
        {/* <div className="verse-notes"></div> */}
      </div>
    </Layout>
  );
};

// const h: Chapter[] = [];

ChapterParent.getInitialProps = async ({ query }) => {
  const a = "oiasjdf55555oiajsdf";
  // console.log(a);
  // console.log(query);

  const data = await axios.get(
    `/scripture_files/${query["lang"] ? query["lang"] : "eng"}-${
      query["book"]
    }-${query["chapter"]}-chapter.json`,
    { proxy: { port: 3000, host: "127.0.0.1" } }
  );
  const chapter = data.data as Chapter;
  // h.push(chapter);

  // console.log(chapter);

  // console.log("ijasdfoiasdfjiojeoirjoij");

  const b = await addVersesToBody(chapter)
    .pipe(
      map(() => buildNewShell(chapter)),
      flatMap(o => o)
    )
    .toPromise();
  // console.log(chapter);

  return { a, chapter };
};

export default ChapterParent;

function renderLinks(grp: FormatGroup): JSX.Element {
  const attrs = grp.attrs as { href: string };

  if (attrs.href && attrs.href.includes("#note")) {
    return <span {...grp.attrs}>{formatGroup(grp)}</span>;
  }

  return (
    <Link {...attrs}>
      <a>{formatGroup(grp)}</a>
    </Link>
  );
}
