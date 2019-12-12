import { Component } from 'react';
import { BehaviorSubject } from 'rxjs';

export let openImportModal: BehaviorSubject<boolean>;

export class ImportNotesModal extends Component {
  render() {
    return (
      <div className="modal">
        <div className="modal-background"></div>
        <div className="modal-content"></div>
        <button className="modal-close is-large" aria-label="close"></button>
      </div>
    );
  }
}
