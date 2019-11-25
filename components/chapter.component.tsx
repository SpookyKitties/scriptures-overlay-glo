import { useRouter } from "next/router";
import { Component, CSSProperties, Fragment } from "react";
import {
  Chapter,
  FormatGroup,
  VersePlaceholder,
  FormatText,
  Verse
} from "../oith-lib/src/models/Chapter";
import { FormatTag } from "./format_tag";
import { VideoComponent } from "./VideoComponent";
import Head from "next/head";
import { VerseComponent } from "./verse.component";
import { forkJoin, of } from "rxjs";
import { filter, map } from "rxjs/operators";
import { appSettings } from "./header.component";
import Link from "next/link";

type ChapterProps = {
  chapter: Chapter;
};

const chapterStyles: CSSProperties = {
  // height: "calc(100vh - 48px)",
  // display: "block",
  // width: "100vw",
  // position: "fixed"
};
const asdf: CSSProperties = {
  // top: '48px',
};

export function renderFormatGroups(
  grps?: (FormatGroup | VersePlaceholder | FormatText)[]
): JSX.Element {
  if (grps) {
    return <Fragment>{grps.map(grp => renderFormatGroup(grp))}</Fragment>;
  }
  return;
}

// export function renderVerse(verse?: Verse): JSX.Element {
//   if (verse) {
//     const elementName = verse.n.toLowerCase();

//     switch (elementName) {
//       case "p": {
//         return <p id={verse.id}>{renderFormatGroups(verse.grps)}</p>;
//       }
//       case "h1": {
//         return (
//           <h1 {...verse.attrs} id={verse.id}>
//             {renderFormatGroups(verse.grps)}
//           </h1>
//         );
//       }
//       case "h2": {
//         return (
//           <h2 {...verse.attrs} id={verse.id}>
//             {renderFormatGroups(verse.grps)}
//           </h2>
//         );
//       }
//       case "h3": {
//         return (
//           <h3 {...verse.attrs} id={verse.id}>
//             {renderFormatGroups(verse.grps)}
//           </h3>
//         );
//       }
//       case "h4": {
//         return (
//           <h4 {...verse.attrs} id={verse.id}>
//             {renderFormatGroups(verse.grps)}
//           </h4>
//         );
//       }
//       default:
//         return <div>Missing verse element {verse.n}</div>;
//         break;
//     }
//   }
//   return;
// }

export function renderFormat(ft: FormatText) {
  if (ft.formatMerged) {
    return (
      <Fragment>
        {ft.formatMerged.map(fm => {
          return <FormatTag formatMerged={fm}></FormatTag>;
          return (
            <span
              onClick={() => {
                fm.text = "aaa";
              }}
            >
              {fm.text}
            </span>
          );
        })}
      </Fragment>
    );
  }
  return <div>bbbhh</div>;
}

function normalizeAttrs(attrs?: {}) {
  if (attrs) {
    attrs["className"] = attrs["class"];
    attrs["class"] = undefined;
  }
}

function renderFormatGroup(grp: FormatGroup | VersePlaceholder | FormatText) {
  const docType = (grp as FormatGroup).docType;

  switch (docType) {
    case 4: {
      const formatGroup = grp as FormatGroup;
      const attrs = formatGroup.attrs;
      // normalizeAttrs(attrs);
      const elementName = formatGroup.name
        ? formatGroup.name.toLowerCase()
        : "";
      switch (elementName) {
        case "body":
        case "div": {
          return (
            <div {...(attrs ? attrs : {})}>
              {renderFormatGroups(formatGroup.grps)}
            </div>
          );
          break;
        }
        case "header": {
          return (
            <header {...(attrs ? attrs : {})}>
              {renderFormatGroups(formatGroup.grps)}
            </header>
          );
          break;
        }
        case "span": {
          return (
            <span {...(attrs ? attrs : {})}>
              {renderFormatGroups(formatGroup.grps)}
            </span>
          );
          break;
        }
        case "small": {
          return (
            <small {...(attrs ? attrs : {})}>
              {renderFormatGroups(formatGroup.grps)}
            </small>
          );
          break;
        }
        case "br": {
          return <br />;
        }
        case "img": {
          attrs["alt"] = attrs["alt"];
          const src = `/images/${`${attrs["src"]}`
            .replace(/\.jpg.*/g, "")
            .replace(/\/images.*images\//g, "")}.jpg`;
          attrs["src"] === undefined;
          return (
            <div className="img-container">
              <img {...attrs} src={src} />
            </div>
          );
        }
        case "video": {
          return (
            <VideoComponent
              grp={grp as FormatGroup}
              attrs={attrs}
            ></VideoComponent>
          );
          // return <video {...attrs} />;
        }
        case "a": {
          const href: string | undefined = formatGroup.attrs["href"];
          if (!href || (href && href.includes("note"))) {
            attrs["href"] = undefined;
            return (
              <span {...(attrs ? attrs : {})}>
                {renderFormatGroups(formatGroup.grps)}
              </span>
            );
          } else if (href && href.includes("churchofjesuschrist")) {
            return <a href={href}>{renderFormatGroups(formatGroup.grps)}</a>;
          }
          return (
            <Link href={href}>
              <a className="valid-href">
                {renderFormatGroups(formatGroup.grps)}
              </a>
            </Link>
          );
        }
        case "": {
          return <Fragment>{renderFormatGroups(formatGroup.grps)}</Fragment>;
        }
        case "cite": {
          return <cite>{renderFormatGroups(formatGroup.grps)}</cite>;
        }
        case "strong": {
          return <strong>{renderFormatGroups(formatGroup.grps)}</strong>;
        }
        case "em": {
          return <em>{renderFormatGroups(formatGroup.grps)}</em>;
        }
        case "nav": {
          return <nav>{renderFormatGroups(formatGroup.grps)}</nav>;
        }
        case "i": {
          return <i>{renderFormatGroups(formatGroup.grps)}</i>;
        }
        case "ruby": {
          return <ruby>{renderFormatGroups(formatGroup.grps)}</ruby>;
        }
        case "rb": {
          return <Fragment>{renderFormatGroups(formatGroup.grps)}</Fragment>;
        }
        case "rt": {
          return <rt>{renderFormatGroups(formatGroup.grps)}</rt>;
        }
        case "figure": {
          return <figure>{renderFormatGroups(formatGroup.grps)}</figure>;
        }
        case "ul": {
          return <ul>{renderFormatGroups(formatGroup.grps)}</ul>;
        }
        case "li": {
          return <li>{renderFormatGroups(formatGroup.grps)}</li>;
        }
        case "section": {
          return <section>{renderFormatGroups(formatGroup.grps)}</section>;
        }
        case "figcaption": {
          return (
            <figcaption>{renderFormatGroups(formatGroup.grps)}</figcaption>
          );
        }
        default: {
          return (
            <Fragment>
              g|{elementName.toUpperCase()}|g
              {renderFormatGroups(formatGroup.grps)}
            </Fragment>
          );
          break;
        }
      }

      break;
    }
    case 5: {
      return renderFormat(grp as FormatText);
      return <div>{(grp as FormatText).docType}</div>;
      break;
    }
    default: {
      return (
        <VerseComponent
          verse={(grp as VersePlaceholder).verse}
        ></VerseComponent>
      );
    }
  }
}

export class ChapterComponent extends Component<ChapterProps> {
  componentDidMount() {
    console.log(appSettings);

    forkJoin(
      of(document.querySelector(".highlight,.context")).pipe(
        filter(o => o !== null),
        map(o => o.scrollIntoView())
      )
    ).subscribe();
  }
  /**
   * render
   */
  public render() {
    // const verses = this.props.chapter.verses;
    return (
      <div
        className={`chapter-content ${
          this.props.chapter && !this.props.chapter.id.includes("-come-foll")
            ? " classic-scriptures"
            : "manual"
        }`}
      >
        <span className={"left-nav"}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <path d="M11.67 3.87L9.9 2.1 0 12l9.9 9.9 1.77-1.77L3.54 12z" />
            <path fill="none" d="M0 0h24v24H0z" />
          </svg>
        </span>
        <div
          id={this.props.chapter.id}
          className="chapter"
          style={chapterStyles}
        >
          {/* <header>
          <span className="title">{this.props.chapter.title}</span>
          <span className="shortTitle">{this.props.chapter.shortTitle}</span>
        </header> */}
          {renderFormatGroups(this.props.chapter.body.grps)}
        </div>
        <span className={"right-nav"}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <path d="M5.88 4.12L13.76 12l-7.88 7.88L8 22l10-10L8 2z" />
            <path fill="none" d="M0 0h24v24H0z" />
          </svg>
        </span>
      </div>
    );
  }
}
