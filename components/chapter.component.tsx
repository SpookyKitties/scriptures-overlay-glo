import { Component, CSSProperties, Fragment } from "react";
import {
  Chapter,
  FormatGroup,
  VersePlaceholder,
  FormatText,
  Verse
} from "../oith-lib/src/models/Chapter";

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
        return <h1 {...verse}>{renderFormatGroups(verse.grps)}</h1>;
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
          return <span>{fm.text}</span>;
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
      const attrs = (grp as FormatGroup).attrs;
      const elementName = (grp as FormatGroup).name
        ? (grp as FormatGroup).name.toLowerCase()
        : "";
      switch (elementName) {
        case "body":
        case "div": {
          return (
            <div {...(attrs ? attrs : {})}>
              {renderFormatGroups((grp as FormatGroup).grps)}
            </div>
          );
          break;
        }
        case "header": {
          return (
            <header {...(attrs ? attrs : {})}>
              {renderFormatGroups((grp as FormatGroup).grps)}
            </header>
          );
          break;
        }
        case "span": {
          return (
            <span {...(attrs ? attrs : {})}>
              {renderFormatGroups((grp as FormatGroup).grps)}
            </span>
          );
          break;
        }
        case "br": {
          return <br />;
        }
        case "": {
          return (
            <Fragment>{renderFormatGroups((grp as FormatGroup).grps)}</Fragment>
          );
        }
        default: {
          return (
            <Fragment>
              g|{elementName.toUpperCase()}|g
              {renderFormatGroups((grp as FormatGroup).grps)}
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
      <div className="chapter-content classic-scriptures">
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
