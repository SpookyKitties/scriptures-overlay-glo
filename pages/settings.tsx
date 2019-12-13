// import layout from '../components/layout';
import Layout from '../components/layout';
import { ChapterComponent } from '../components/chapter';
import { NextPage } from 'next';

import { importFiles } from '../components/import-notes/import-notes/importFiles';
import { Component } from 'react';
function showProgress() {
  return (
    <progress className="progress is-small is-primary" max="100">
      15%
    </progress>
  );
}
export default class SettimgsPage extends Component {
  public state: { progress: boolean };
  render() {
    if (this.state && this.state.progress) {
      return showProgress();
    }
    return (
      <div>
        <input type="file" name="" id="fileUpload" multiple />{' '}
        <button
          className={`button`}
          onClick={() => {
            this.setState({ progress: true });
            importFiles('#fileUpload').subscribe(
              () => {},
              () => {},
              () => {
                this.setState({ progress: false });
              },
            );
          }}
        >
          Upload
        </button>
      </div>
    );
  }
}
