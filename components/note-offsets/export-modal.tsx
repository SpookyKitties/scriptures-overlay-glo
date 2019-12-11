import { Component } from 'react';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { appSettings } from '../header.component';
import { NoteType } from '../../oith-lib/src/verse-notes/settings/note-gorup-settings';
import { exportNotes } from './exportNotes';

export let openExportModal: BehaviorSubject<boolean>;

class ExportModalCheckBox extends Component<{ noteType: NoteType }> {
  public state: { enabled: boolean };
  componentDidMount() {
    this.setState({ enabled: false });
  }
  public render() {
    if (this.state) {
      return (
        <label
          className={`checkbox ${
            this.state.enabled
              ? `checked-overlay ${this.props.noteType.className}`
              : ''
          }`}
          onClick={() => {
            this.setState({ enabled: !this.state.enabled });
          }}
        >
          <input type="checkbox" checked={this.state.enabled} />
          {this.props.noteType.name}
        </label>
      );
    }

    return <></>;
  }
}

export class ExportModal extends Component {
  public state: { active: boolean; noteTypes: NoteType[] };

  public componentDidMount() {
    openExportModal = new BehaviorSubject(false);

    openExportModal.pipe(map(o => this.setState({ active: o }))).subscribe();

    this.setState({ noteTypes: appSettings.noteTypes.noteTypes });
  }
  public render() {
    if (this.state) {
      return (
        <div className={`modal ${this.state.active ? 'is-active' : ''}`}>
          <div
            className={`modal-background  `}
            onClick={() => {
              openExportModal.next(false);
            }}
          ></div>
          <div className={`modal-content`}>
            <div className={`box`}>
              {this.state.noteTypes.map(noteType => {
                return <ExportModalCheckBox noteType={noteType} />;
              })}
              <button
                onClick={() => {
                  exportNotes().subscribe(o => {
                    console.log(o);
                  });
                }}
              >
                Export
              </button>
            </div>
          </div>
          <button
            className="modal-close is-large"
            aria-label="close"
            onClick={() => {
              openExportModal.next(false);
            }}
          ></button>
        </div>
      );
    }
    return <></>;
  }
}
