import { Component } from "react";
import {
  VerseNote,
  VerseNoteGroup
} from "../oith-lib/src/verse-notes/verse-note";
import { Chapter } from "../oith-lib/src/models/Chapter";

type VNProps = {
  chapter?: Chapter;
  // verseNotes?: VerseNote[];
};
function createMarkup(txt: string) {
  return { __html: txt };
}

function renderNoteGroup(noteGroup: VerseNoteGroup) {
  return (
    <div className="verse-note-group">
      <span className="note-phrase">{noteGroup.notes[0].phrase}</span>
      {noteGroup.notes.map(note => {
        return note.ref.map(ref => {
          return (
            <div
              dangerouslySetInnerHTML={{ __html: ref.text.replace(/\#/g, "") }}
            ></div>
          );
        });
      })}
    </div>
  );
}
function renderVerseNote(verseNote: VerseNote) {
  if (verseNote.noteGroups) {
    return (
      <div className="verse-note">
        {verseNote.noteGroups.map(noteGroup => renderNoteGroup(noteGroup))}
      </div>
    );
  }
  return;
}

export class VerseNotesShellComponent extends Component<VNProps> {
  render() {
    if (this.props.chapter) {
      return (
        <div className="verse-notes">
          {this.props.chapter.verseNotes.map(vn => renderVerseNote(vn))}
        </div>
      );
    }

    return <div className="verse-notes"></div>;
  }
}
