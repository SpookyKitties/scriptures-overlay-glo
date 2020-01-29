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

export function renderJSTIcon() {
  return 'JST';
}
export function renderWordsIcon() {
  return '🔤';
}

export function renderScripturesIcon() {
  return '🧾';
}

export function renderContextIcon() {
  return '💡';
}
export function renderPronunciationIcon() {
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

const iconStyle: CSSProperties = {
  display: 'grid',
  justifyContent: 'center',
  alignContent: 'center',
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
          <span style={iconStyle}>{renderWordsIcon()}</span>
          <span style={iconStyle}>{renderContextIcon()}</span>
          <span style={iconStyle}>{renderScripturesIcon()}</span>
          <span style={iconStyle}>{renderPronunciationIcon()}</span>
          <span style={iconStyle}>{renderJSTIcon()}</span>
          <span style={iconStyle}>{renderImageIcon()}</span>
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
