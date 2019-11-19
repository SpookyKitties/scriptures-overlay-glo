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
        return <p id={verse.id}>{verse.text}</p>;
      }
      default:
        break;
    }
  }
  return;
}

function renderFormatGroup(grp: FormatGroup | VersePlaceholder | FormatText) {
  const docType = (grp as FormatGroup).docType;

  switch (docType) {
    case 4: {
      return (
        <div>
          {(grp as FormatGroup).name}
          {renderFormatGroups((grp as FormatGroup).grps)}
        </div>
      );

      break;
    }
    case 5: {
      return <div>5{(grp as FormatText).docType}</div>;
      break;
    }
    default: {
      return <div>{renderVerse((grp as VersePlaceholder).verse)}</div>;
      break;
    }
  }
}

export class ChapterComponent extends Component<ChapterProps> {
  /**
   * render
   */

  public render() {
    console.log(this.props.chapter);

    const verses = this.props.chapter.verses;
    return (
      <div id={this.props.chapter.id} style={chapterStyles}>
        {/* <header>
          <span className="title">{this.props.chapter.title}</span>
          <span className="shortTitle">{this.props.chapter.shortTitle}</span>
        </header> */}
        {renderFormatGroup(this.props.chapter.body)}
      </div>
    );
  }
}
