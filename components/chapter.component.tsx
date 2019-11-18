import { Component, CSSProperties } from "react";
import { Chapter } from "../../oith-lib/src/models/Chapter";

type ChapterProps = {
  chapter: Chapter;
};

const chapterStyles: CSSProperties = {
  height: "100%",
  display: "grid",

  gridTemplateRows: "48px 100%"
};

export class ChapterComponent extends Component<ChapterProps> {
  /**
   * render
   */

  public render() {
    const verses = this.props.chapter.verses;
    return (
      <div id={this.props.chapter.id} style={chapterStyles}>
        <header>
          <span className="title">{this.props.chapter.title}</span>
          <span className="shortTitle">{this.props.chapter.shortTitle}</span>
        </header>
        {verses ? verses.length : 0}
      </div>
    );
  }
}
