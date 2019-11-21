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
        return (
          <div className="note">
            {note.ref.map(ref => {
              console.log(ref.label);

              return (
                <p className="note-reference">
                  <span className="ref-label">{ref.label}</span>
                  <span
                    dangerouslySetInnerHTML={{
                      __html: ref.text.replace(/\#/g, "")
                    }}
                  ></span>
                </p>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
function renderVerseNote(verseNote: VerseNote) {
  if (verseNote.noteGroups) {
    return (
      <div className="verse-note">
        <p className="short-title">{generateShortTitle(verseNote)}</p>
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
          {this.props.chapter.verses.map(verse => {
            const verseNote = this.props.chapter.verseNotes.find(vN =>
              vN.id.includes(`-${verse.id}-verse-notes`)
            );
            if (verseNote) {
              return renderVerseNote(verseNote);
            }
          })}
        </div>
      );
      return (
        <div className="verse-notes">
          {this.props.chapter.verseNotes.map(vn => renderVerseNote(vn))}
        </div>
      );
    }

    return <div className="verse-notes"></div>;
  }
}

function generateShortTitle(verseNote: VerseNote) {
  if (verseNote) {
    if (doesntInclude(["title1", "closing1"], verseNote.id)) {
      const idSplit = verseNote.id.split("-");

      return `Verse ${idSplit[idSplit.length - 3]} Notes`;
    } else if (verseNote.id.includes("title1")) {
      return "Chapter Notes";
    } else if (verseNote.id.includes("closing")) {
      return "Footer Notes";
    }
  }
  return "";
}

export function capitalizeFirstLetter(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function doesntInclude(strings: string[], val: string) {
  return strings.filter(s => val.includes(s)).length === 0;
}
