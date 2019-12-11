import { Component } from 'react';
import { BehaviorSubject } from 'rxjs';
import { filter, map } from 'rxjs/operators';

export let openExportModal: BehaviorSubject<boolean>;

export class ExportModal extends Component {
  public state: { active: boolean };

  public componentDidMount() {
    openExportModal = new BehaviorSubject(false);

    openExportModal.pipe(map(o => this.setState({ active: o }))).subscribe();
  }
  public render() {
    if (this.state) {
      return (
        <div
          className={`modal ${this.state.active ? 'is-active' : 'asdfasdfadf'}`}
        >
          <div className={`modal-background`}></div>
          <div className={`modal-content`}></div>
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
