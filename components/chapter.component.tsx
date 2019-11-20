import { Component, CSSProperties, Fragment } from "react";
import {
  Chapter,
  FormatGroup,
  VersePlaceholder,
  FormatText,
  Verse
} from "../oith-lib/src/models/Chapter";
import { FormatTag } from "./format_tag";

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

export function renderVerse(verse?: Verse): JSX.Element {
  if (verse) {
    const elementName = verse.n.toLowerCase();

    switch (elementName) {
      case "p": {
        return <p id={verse.id}>{renderFormatGroups(verse.grps)}</p>;
      }
      case "h1": {
        return (
          <h1 {...verse.attrs} id={verse.id}>
            {renderFormatGroups(verse.grps)}
          </h1>
        );
      }
      case "h2": {
        return (
          <h2 {...verse.attrs} id={verse.id}>
            {renderFormatGroups(verse.grps)}
          </h2>
        );
      }
      case "h3": {
        return (
          <h3 {...verse.attrs} id={verse.id}>
            {renderFormatGroups(verse.grps)}
          </h3>
        );
      }
      case "h4": {
        return (
          <h4 {...verse.attrs} id={verse.id}>
            {renderFormatGroups(verse.grps)}
          </h4>
        );
      }
      default:
        return <div>Missing verse element {verse.n}</div>;
        break;
    }
  }
  return;
}

export function renderFormat(ft: FormatText) {
  if (ft.formatMerged) {
    return (
      <Fragment>
        {ft.formatMerged.map(fm => {
          return <FormatTag ft={fm}></FormatTag>;
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

function renderFormatGroup(grp: FormatGroup | VersePlaceholder | FormatText) {
  const docType = (grp as FormatGroup).docType;

  switch (docType) {
    case 4: {
      const formatGroup = grp as FormatGroup;
      const attrs = formatGroup.attrs;
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
        case "br": {
          return <br />;
        }
        case "img": {
          return <img {...attrs} />;
        }
        case "a": {
          const href: string | undefined = formatGroup.attrs["href"];
          if (href && href.includes("note")) {
            return (
              <span {...(attrs ? attrs : {})}>
                {renderFormatGroups(formatGroup.grps)}
              </span>
            );
          }
          return (
            <a {...(attrs ? attrs : {})}>
              {renderFormatGroups(formatGroup.grps)}
            </a>
          );
        }
        case "": {
          return <Fragment>{renderFormatGroups(formatGroup.grps)}</Fragment>;
        }
        case "cite": {
          return <cite>{renderFormatGroups(formatGroup.grps)}</cite>;
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
        <Fragment>{renderVerse((grp as VersePlaceholder).verse)}</Fragment>
      );
      break;
    }
  }
}

export class ChapterComponent extends Component<ChapterProps> {
  /**
   * render
   */
  public render() {
    const verses = this.props.chapter.verses;
    return (
      <div
        className={
          this.props.chapter && !this.props.chapter.id.includes("-come-foll")
            ? "chapter-content classic-scriptures"
            : "chapter-content manual"
        }
      >
        <span></span>
        <div id={this.props.chapter.id} style={chapterStyles}>
          {/* <header>
          <span className="title">{this.props.chapter.title}</span>
          <span className="shortTitle">{this.props.chapter.shortTitle}</span>
        </header> */}
          {renderFormatGroups(this.props.chapter.body.grps)}
        </div>
        <span></span>
      </div>
    );
  }
}
