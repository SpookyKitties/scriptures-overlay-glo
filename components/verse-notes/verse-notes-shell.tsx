import { Component, MouseEvent } from 'react';
import {
  VerseNote,
  VerseNoteGroup,
  Note,
  NoteRef,
} from '../../oith-lib/src/verse-notes/verse-note';
import { Chapter } from '../../oith-lib/src/models/Chapter';
import { fromEvent } from 'rxjs';
import { filter } from 'rxjs/operators';
import { useRouter } from 'next/router';
import { gotoLink } from '../gotoLink';
import { store } from '../SettingsComponent';
import { flatMap$ } from '../../oith-lib/src/rx/flatMap$';
import { notePhraseClick } from './notePhraseClick';
import { flatten, uniqBy } from 'lodash';
import { refClick } from './refClick';

type VNProps = {
  chapter?: Chapter;
  // verseNotes?: VerseNote[];
};
function createMarkup(txt: string) {
  return { __html: txt };
}

function sortNotes(noteA: Note, noteB: Note) {
  return noteA.noteType - noteB.noteType;
}

function sortNoteRefs(noteRefA: NoteRef, noteRefB: NoteRef) {
  return noteRefA.category - noteRefB.category;
}

class NoteGroupComponent extends Component {
  componentDidMount() {
    store.editMode$.subscribe(o => {
      this.setState({ editMode: o });
    });
  }
  render() {
    return '';
  }
}

function renderNoteGroup(noteGroup: VerseNoteGroup) {
  return (
    <div
      className={`verse-note-group ${
        noteGroup.formatTag.visible ? '' : 'none'
      }   ${noteGroup.formatTag.highlight ? 'highlight' : ''}`}
    >
      <span
        onClick={(evt: MouseEvent) => {
          const ee = evt.target as HTMLElement;
          notePhraseClick(ee, noteGroup.formatTag);
        }}
        className="note-phrase"
      >
        {noteGroup.notes[0].phrase}
      </span>

      <div
        className={`note`}
        onClick={event => {
          gotoLink(event);
        }}
      >
        {uniqBy(
          flatten(
            noteGroup.notes
              .filter(nt => nt.formatTag.visible)
              .map(nt => nt.ref.filter(ref => ref.vis)),
          ),
          b => b.label,
        )
          .sort((a, b) => sortNoteRefs(a, b))
          .map(ref => {
            return (
              <p
                onClick={evt => {
                  if (
                    (evt.target as HTMLElement).classList.contains('ref-label')
                  ) {
                    refClick(noteGroup, ref);
                  }
                }}
                className={`note-reference ${ref.label
                  .trim()
                  .replace('🔊', 'speaker')} ${ref.vis ? '' : 'none'}`}
              >
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
      {/* {
      noteGroup.notes
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
                      <span className="ref-label">
                        {ref.category}
                        {ref.label}
                      </span>
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
        })} */}
    </div>
  );
}

function sortVerseNoteGroups(
  verseNoteGroupA: VerseNoteGroup,
  verseNoteGroupB: VerseNoteGroup,
) {
  const getFirstOffset = (vng: VerseNoteGroup) => {
    if (vng.formatTag.offsets === 'all') {
      return -1;
    }
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

type VerseNoteState = { verseNote: VerseNote };

export class VerseNoteComponent extends Component<VerseNoteState> {
  public state: VerseNoteState;

  componentDidMount() {
    store.updateNoteVisibility$.subscribe(() => {
      this.setState({ verseNote: this.props.verseNote });
    });
  }
  public render() {
    if (this.state && this.state.verseNote) {
      const verseNote = this.state.verseNote;
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
    }
    return <></>;
  }
}

export class VerseNotesShellComponent extends Component<VNProps> {
  public state: { chapter: Chapter };

  componentDidMount() {
    // store.chapter
    //   .pipe(
    //     filter(o => o !== undefined),
    //     map(chapter => {
    //       this.setState({ chapter: chapter });
    //     }),
    //   )
    //   .subscribe();
  }

  render() {
    if (this.props.chapter) {
      return (
        <div className="verse-notes">
          {this.props.chapter.verses.map(verse => {
            const verseNote = this.props.chapter.verseNotes.find(vN =>
              vN.id.includes(`-${verse.id}-verse-notes`),
            );
            if (verseNote) {
              return <VerseNoteComponent verseNote={verseNote} />;
              // return renderVerseNote(verseNote);
            }
          })}
          <div className="white-space"></div>
        </div>
      );
    }
    // if (this.state && this.state.chapter) {
    //   return (
    //     <div className="verse-notes">
    //       {this.state.chapter.verses.map(verse => {
    //         const verseNote = this.state.chapter.verseNotes.find(vN =>
    //           vN.id.includes(`-${verse.id}-verse-notes`),
    //         );
    //         if (verseNote) {
    //           return <VerseNoteComponent verseNote={verseNote} />;
    //           // return renderVerseNote(verseNote);
    //         }
    //       })}
    //       <div className="white-space"></div>
    //     </div>
    //   );
    // }

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
