import { Component } from "react";
import {
  VerseNote,
  VerseNoteGroup
} from "../oith-lib/src/verse-notes/verse-note";

type VNProps = {
  verseNotes?: VerseNote[];
};
function createMarkup(txt: string) {
  return { __html: txt };
}

function renderNoteGroup(noteGroup: VerseNoteGroup) {
  //   console.log(noteGroup.notePhrase);
  return (
    <div>
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
      <div>
        {verseNote.noteGroups.map(noteGroup => renderNoteGroup(noteGroup))}
      </div>
    );
  }
  return;
}

export class VerseNotesShellComponent extends Component<VNProps> {
  render() {
    if (this.props.verseNotes) {
      return (
        <div className="verse-notes">
          {this.props.verseNotes.map(vn => renderVerseNote(vn))}
        </div>
      );
    }

    return <div className="verse-notes"></div>;
  }
}
