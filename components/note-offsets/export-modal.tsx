import { Component } from 'react';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { appSettings } from '../SettingsComponent';
import { NoteType } from '../../oith-lib/src/verse-notes/settings/note-gorup-settings';
import { exportNotes } from './exportNotes';

export let openExportModal: BehaviorSubject<boolean>;
export let resetCheckboxes: BehaviorSubject<boolean>;

class ExportModalCheckBox extends Component<{ noteType: NoteType }> {
  public state: { enabled: boolean };
  componentDidMount() {
    this.setState({ enabled: false });

    resetCheckboxes.subscribe(() => {
      this.setState({ enabled: false });
    });
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
    resetCheckboxes = new BehaviorSubject(false);

    openExportModal
      .pipe(
        map(o => {
          resetCheckboxes.next(true);
          this.setState({ active: o });
          if (appSettings && appSettings.noteTypes) {
            this.setState({ noteTypes: appSettings.noteTypes.noteTypes });
          }
        }),
      )
      .subscribe();
  }
  public render() {
    if (this.state && this.state.noteTypes) {
      return (
        <div className={`modal ${this.state.active ? 'is-active' : ''}`}>
          <div
            className={`modal-background  `}
            style={{ backgroundColor: 'unset' }}
            onClick={() => {
              openExportModal.next(false);
            }}
          ></div>
          <div className={`modal-content `}>
            <div className={`box export-modal-content`}>
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
