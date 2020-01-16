import { Component } from 'react';
import { appSettings, store, formatTagService } from '../SettingsComponent';
import {
  GlobalNoteSettings,
  NoteSetting,
} from '../../oith-lib/src/processors/NoteSettings';

export class NoteSettingComponent extends Component<{
  setting: GlobalNoteSettings | NoteSetting;
}> {
  public state: { checked: boolean };

  click(setting: GlobalNoteSettings | NoteSetting, e: HTMLInputElement) {
    if (e.type === 'checkbox') {
      setting.enabled = !setting.enabled;

      this.setState({ checked: setting.enabled });
      appSettings.save('noteSettings');
      formatTagService.reset();
      store.resetNotes$.next(true);
      // e.checked = setting.enabled;
    }
  }

  componentDidMount() {
    this.setState({ checked: this.props.setting.enabled });
  }

  public render() {
    if (this.state) {
      return (
        <div
          className={`dropdown-item`}
          key={this.props.setting.label}
          onClick={evt => {
            // evt.preventDefault();
            this.click(this.props.setting, evt.target as HTMLInputElement);
          }}
        >
          <label className={`checkbox`}>
            <input
              type="checkbox"
              name=""
              id={`ns${this.props.setting.label}`}
              checked={this.state.checked}
            />
            {this.props.setting.label}
          </label>
        </div>
      );
    }

    return <div>hgxrs</div>;
    return <></>;
  }
}

export class AdditionalSettingaComponent extends Component {
  public render() {
    if (
      appSettings &&
      appSettings.noteSettings &&
      appSettings.noteSettings.addSettings.filter(ns => ns.display).length > 0
    ) {
      return (
        <div>
          {appSettings.noteSettings.addSettings
            .filter(ns => ns.display)
            .map(addSet => {
              return <NoteSettingComponent setting={addSet} />;
            })}
        </div>
      );
    }

    return <></>;
  }
}
