import { Component, CSSProperties, MouseEvent } from 'react';
import { appSettings, store, formatTagService } from './header.component';
import {
  NoteSetting,
  NoteSettings,
} from '../oith-lib/src/processors/NoteSettings';

const noteSettingsMenuStyles: CSSProperties = {
  position: 'absolute',
  right: '0px',
  minWidth: '12rem',
  paddingTop: '4px',
  top: '100%',
  zIndex: 20,
  backgroundColor: 'white',
  left: 'unset',
};

class NoteSettingComponent extends Component<{ noteSetting: NoteSetting }> {
  public state: { noteSetting: NoteSetting; enabled: boolean };

  private noteSettingClick(event: MouseEvent, noteSetting: NoteSetting) {
    event.preventDefault();

    const nodeName = (event.target as HTMLElement).nodeName;

    noteSetting.enabled =
      (event.target as HTMLInputElement).checked !== undefined
        ? (event.target as HTMLInputElement).checked
        : !noteSetting.enabled;
    this.setState({ enabled: noteSetting.enabled });

    appSettings.save('noteSettings');
    formatTagService.reset();
    store.resetNotes$.next(true);
  }
  componentDidMount() {
    this.setState({
      noteSetting: this.props.noteSetting,
      enabled: this.props.noteSetting.enabled,
    });
  }

  public render() {
    if (this.state) {
      return (
        <div
          className={`dropdown-item`}
          onClick={event =>
            this.noteSettingClick(event, this.state.noteSetting)
          }
        >
          <label className={`checkbox`}>
            <input type="checkbox" checked={this.state.enabled} />
            {this.state.noteSetting.label}
          </label>
        </div>
      );
    }

    return <></>;
  }
}

export class NoteSettingsMenu extends Component<{
  displayNoteSettings?: boolean;
}> {
  private noteSettingClick(event: MouseEvent, noteSetting: NoteSetting) {
    event.preventDefault();

    noteSetting.enabled = !noteSetting.enabled;
    appSettings.save('noteSettings');
    store.resetNotes$.next(true);
  }

  private renderNoteSettings() {
    return (
      <div className={`dropdown-content`}>
        {appSettings.noteSettings.noteSettings
          .filter(ns => ns.display)
          .map(noteSetting => {
            return (
              <NoteSettingComponent
                noteSetting={noteSetting}
              ></NoteSettingComponent>
            );
          })}
      </div>
    );
  }

  public render() {
    if (appSettings) {
      return (
        <div
          style={noteSettingsMenuStyles}
          className={`note-settings-menu  dropdown-menu`}
        >
          <div>Note Sets</div>
          <hr />
          {this.renderNoteSettings()}
          <hr />
        </div>
      );
    }
    return <></>;
  }
}
