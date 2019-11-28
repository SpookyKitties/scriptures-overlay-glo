import { Component, MouseEvent } from 'react';
import {
  VerseNote,
  VerseNoteGroup,
  Note,
  NoteRef,
} from '../oith-lib/src/verse-notes/verse-note';
import { Chapter } from '../oith-lib/src/models/Chapter';
import { fromEvent } from 'rxjs';
import { map, filter } from 'rxjs/operators';
import { useRouter } from 'next/router';
import { gotoLink } from './gotoLink';

type VNProps = {
  chapter?: Chapter;
  // verseNotes?: VerseNote[];
};
function createMarkup(txt: string) {
  return { __html: txt };
}

function noteClick(event: MouseEvent) {}

function sortNotes(noteA: Note, noteB: Note) {
  return noteA.noteType - noteB.noteType;
}

function sortNoteRefs(noteRefA: NoteRef, noteRefB: NoteRef) {
  return noteRefA.category - noteRefB.category;
}

function renderNoteGroup(noteGroup: VerseNoteGroup) {
  return (
    <div
      className={`verse-note-group ${
        noteGroup.formatTag.visible ? '' : 'none'
      }`}
    >
      <span className="note-phrase">{noteGroup.notes[0].phrase}</span>
      {noteGroup.notes
        .sort((a, b) => sortNotes(a, b))
        .map(note => {
          return (
            <div
              className={`note ${note.formatTag.visible ? '' : 'none'}`}
              onClick={event => {
                gotoLink(event);
              }}
            >
              {note.ref
                .sort((a, b) => sortNoteRefs(a, b))
                .map(ref => {
                  return (
                    <p className={`note-reference ${ref.vis ? '' : 'none'}`}>
                      <span className="ref-label">{ref.label}</span>
                      <span
                        dangerouslySetInnerHTML={{
                          __html: ref.text.replace(/\#/g, ''),
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

function sortVerseNoteGroups(
  verseNoteGroupA: VerseNoteGroup,
  verseNoteGroupB: VerseNoteGroup,
) {
  const getFirstOffset = (vng: VerseNoteGroup) => {
    return vng.formatTag && vng.formatTag.uncompressedOffsets
      ? vng.formatTag.uncompressedOffsets[0]
      : 0;
  };

  return getFirstOffset(verseNoteGroupA) - getFirstOffset(verseNoteGroupB);
}

function renderVerseNote(verseNote: VerseNote) {
  if (verseNote.noteGroups) {
    return (
      <div
        className={`verse-note ${verseNote.vis ? '' : 'none'}`}
        id={verseNote.id}
      >
        <p className="short-title">{generateShortTitle(verseNote)}</p>
        {verseNote.noteGroups
          .sort((a, b) => sortVerseNoteGroups(a, b))
          .map(noteGroup => renderNoteGroup(noteGroup))}
      </div>
    );
  }
  return <></>;
}

export class VerseNotesShellComponent extends Component<VNProps> {
  render() {
    if (this.props.chapter) {
      return (
        <div className="verse-notes">
          {this.props.chapter.verses.map(verse => {
            const verseNote = this.props.chapter.verseNotes.find(vN =>
              vN.id.includes(`-${verse.id}-verse-notes`),
            );
            if (verseNote) {
              return renderVerseNote(verseNote);
            }
          })}
          <div className="white-space"></div>
        </div>
      );
    }

    return <div className="verse-notes"></div>;
  }
}

function generateShortTitle(verseNote: VerseNote) {
  if (verseNote) {
    if (doesntInclude(['title1', 'closing1'], verseNote.id)) {
      const idSplit = verseNote.id.split('-');

      return `Verse ${idSplit[idSplit.length - 3]} Notes`;
    } else if (verseNote.id.includes('title1')) {
      return 'Chapter Notes';
    } else if (verseNote.id.includes('closing')) {
      return 'Footer Notes';
    }
  }
  return '';
}

export function capitalizeFirstLetter(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function doesntInclude(strings: string[], val: string) {
  return strings.filter(s => val.includes(s)).length === 0;
}
