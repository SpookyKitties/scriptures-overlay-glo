import { Component, CSSProperties } from 'react';
import { Verse } from '../../oith-lib/src/models/Chapter';
import { BehaviorSubject } from 'rxjs';
import { filter } from 'rxjs/operators';
import { VerseNote } from '../../oith-lib/src/verse-notes/verse-note';
import { renderImageIcon } from './renderImageIcon';
import { renderCloseIcon } from './renderCloseIcon';
import { renderDocIcon } from './renderDocIcon';
import { VerseNoteGroupComponent } from '../verse-notes/verse-notes-shell';

export let syncedVerse: BehaviorSubject<VerseNote>;

export let updateVisibility: BehaviorSubject<boolean>;

const notesComponentHeaderCSS: CSSProperties = {
  display: 'grid',
  width: '10vw',
  gridTemplateColumns: '32px 32px 32px',
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
      console.log(verse);

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

  public render() {
    if (this.state && this.state.verseNote) {
    }
    return (
      <div
        style={{ position: 'fixed', top: 0, left: 500 }}
        className={`note-component`}
      >
        <div
          style={notesComponentHeaderCSS}
          className={`notes-component-header`}
        >
          <span>{renderDocIcon()}</span>
          <span>{renderImageIcon()}</span>
          <span
            className={`btn-close`}
            style={{ position: 'absolute', right: 0 }}
          >
            {renderCloseIcon()}
          </span>
        </div>
        {this.renderNotes()}
      </div>
    );
    return <>asdf</>;
  }
}
