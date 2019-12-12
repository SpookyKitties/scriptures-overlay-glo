import { Component } from 'react';
import { BehaviorSubject } from 'rxjs';

export let openImportModal: BehaviorSubject<boolean>;

export class ImportChapterModal extends Component {
  public state: { active: boolean };

  public componentDidMount() {
    openImportModal.subscribe(o => {
      this.setState({ active: o });
    });
  }
  render() {
    return (
      <div
        className={`modal ${
          this.state && this.state.active ? 'is-active' : ''
        }`}
      >
        <div className="modal-background"></div>
        <div className="modal-content">
          <div className={`box`}>
            <input type="file" name="" id="fileUpload" multiple />
            <label>Upload Chapters</label>
          </div>
        </div>
        <button className="modal-close is-large" aria-label="close"></button>
      </div>
    );
  }
}
