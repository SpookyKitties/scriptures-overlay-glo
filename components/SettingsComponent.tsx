import { Component } from 'react';
import { Store } from '../pages/_app';
import { AppSettings } from './AppSettings';
import { FormatTagService } from './FormatTagService';
import { setCurrentNav } from './nextPage';
import { parseLangFromUrl } from '../app/parseCookieLang';
export let formatTagService: FormatTagService;

export let appSettings: AppSettings;
export let store: Store;
export class SettingsComponent extends Component {
  public componentDidMount() {
    const lang = parseLangFromUrl();
    appSettings = new AppSettings(lang);
    if (appSettings.settings.lang === 'pes') {
      document.body.classList.add('right-to-left');
    }
    store = new Store();
    formatTagService = new FormatTagService();
    setCurrentNav();
  }
  public render() {
    return <></>;
  }
}
