import { Component, CSSProperties } from 'react';
import { Verse } from '../../oith-lib/src/models/Chapter';
import { BehaviorSubject } from 'rxjs';
import { filter } from 'rxjs/operators';
import { VerseNote } from '../../oith-lib/src/verse-notes/verse-note';
import { renderImageIcon } from './renderImageIcon';
import { renderCloseIcon } from './renderCloseIcon';
import { renderDocIcon } from './renderDocIcon';
import { VerseNoteGroupComponent } from '../verse-notes/verse-notes-shell';
import { appSettings } from '../SettingsComponent';

export let syncedVerse: BehaviorSubject<VerseNote>;

export let updateVisibility: BehaviorSubject<boolean>;

export function renderJSTIcon(verseNote?: VerseNote) {
  if (typeof verseNote === 'undefined') {
    return '';
  }
  return <span style={iconStyle}>JST</span>;
}
export function renderWordsIcon(verseNote?: VerseNote) {
  if (typeof verseNote === 'undefined') {
    return '';
  }
  return <span style={iconStyle}>🔠</span>;
}

export function renderScripturesIcon(verseNote?: VerseNote) {
  if (typeof verseNote === 'undefined') {
    return '';
  }
  return <span style={iconStyle}>🧾</span>;

  return '';
}

export function renderContextIcon(verseNote?: VerseNote) {
  if (typeof verseNote === 'undefined') {
    return '';
  }
  return <span style={iconStyle}>💡</span>;
}
export function renderPronunciationIcon(verseNote?: VerseNote) {
  if (typeof verseNote === 'undefined') {
    return '';
  }
  return <span style={iconStyle}>🔊</span>;

  return '🔊';
}

const noteComponentStyles: CSSProperties = {
  position: 'absolute',
  left: 0,
  width: '100vw',
  backgroundColor: 'inherit',
  borderBottom: 'solid',
  borderBottomWidth: '1px',
  borderBottomColor: '#aeb6b6',
  height: '32px',
};

const notesComponentHeaderCSS: CSSProperties = {
  display: 'grid',
  width: '300px',
  height: '32px',
  gridAutoFlow: 'column',
  maxWidth: 'calc(100vw - 48px)',
};

export const iconStyle: CSSProperties = {
  display: 'grid',
  justifyContent: 'center',
  alignContent: 'center',
  width: '32px',
};

export class MobileNotesComponent extends Component {
  public state: {
    verseNote?: VerseNote;
  };
  public componentDidMount() {
    syncedVerse = new BehaviorSubject(undefined);
    updateVisibility = new BehaviorSubject(true);
    updateVisibility
      .pipe(filter(() => this.state && this.state.verseNote !== undefined))
      .subscribe(() => {
        const verse = this.state.verseNote;
        this.setState({ verse: undefined });
        this.setState({ verseNote: verse });
      });
    syncedVerse.subscribe(verse => {
      this.setState({ verseNote: verse });
    });
  }
  public renderNotes() {
    if (this.state && this.state.verseNote) {
      return this.state.verseNote.noteGroups.map(noteGroup => {
        return <VerseNoteGroupComponent noteGroup={noteGroup} />;
      });
    }
    return <></>;
  }

  private displayNotes() {
    appSettings.displayNotes();
  }

  public render() {
    if (this.state && this.state.verseNote) {
    }
    return (
      <div style={noteComponentStyles} className={`note-component`}>
        <div
          style={notesComponentHeaderCSS}
          className={`notes-component-header`}
        >
          {renderWordsIcon(
            this.state && this.state.verseNote
              ? this.state.verseNote
              : undefined,
          )}
          {renderContextIcon(
            this.state && this.state.verseNote
              ? this.state.verseNote
              : undefined,
          )}
          {renderScripturesIcon(
            this.state && this.state.verseNote
              ? this.state.verseNote
              : undefined,
          )}
          {renderPronunciationIcon(
            this.state && this.state.verseNote
              ? this.state.verseNote
              : undefined,
          )}
          {renderJSTIcon(
            this.state && this.state.verseNote
              ? this.state.verseNote
              : undefined,
          )}
          {renderImageIcon(
            this.state && this.state.verseNote
              ? this.state.verseNote
              : undefined,
          )}
          <span
            className={`btn-close`}
            style={{ position: 'absolute', right: 0 }}
            onClick={() => this.displayNotes()}
          >
            {renderCloseIcon()}
          </span>
        </div>
      </div>
    );
  }
}
