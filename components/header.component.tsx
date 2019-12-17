import { Component, CSSProperties } from 'react';
import { NoteGroupSettings } from '../oith-lib/src/verse-notes/settings/note-gorup-settings';
import { tap, catchError, map } from 'rxjs/operators';
import { Chapter } from '../oith-lib/src/models/Chapter';
import { Subject, BehaviorSubject } from 'rxjs';
import { settings } from 'cluster';
import { Store } from '../pages/_app';
import { flatMap$ } from '../oith-lib/src/rx/flatMap$';
import { resetNotes$ } from './resetNotes';
import { resetNoteVisibilitySettings } from './resetNoteVisibility';
import { AppSettings } from './AppSettings';
import { NoteSettingsMenu } from './NoteSettingsMenu';
import { menuOverlay$ } from './MenuOverlay';
import { FormatTagService } from './FormatTagService';
import { setCurrentNav } from './nextPage';
import { parseCookieLang, parseLangFromUrl } from '../app/parseCookieLang';
import { openExportModal } from './note-offsets/export-modal';

export let appSettings: AppSettings;
export let store: Store;
export let formatTagService: FormatTagService;
export let closeMenu$: Subject<boolean>;

type HProps = {
  chapter: Chapter | undefined;
};

const headerStyles: CSSProperties = {
  gridTemplateColumns: `48px calc(100vw - 48px * 3) 48px 48px`,
};

const noteSettingsMenuBtn: CSSProperties = {
  position: 'relative',
};

export class HeaderComponent extends Component {
  public state: { displayNoteSettings: boolean };
  public componentDidMount() {
    const lang = parseLangFromUrl();
    appSettings = new AppSettings(lang);
    if (appSettings.settings.lang === 'pes') {
      document.body.classList.add('right-to-left');
    }
    store = new Store();
    formatTagService = new FormatTagService();

    setCurrentNav();
    closeMenu$ = new BehaviorSubject(false);
    closeMenu$.subscribe(() => {
      this.setState({ displayNoteSettings: false });
    });
  }
  public showNotes() {
    appSettings.displayNotes();
  }

  public displayNavClick() {
    appSettings.displayNav();
  }
  public render() {
    return (
      <div className="oith-header" style={headerStyles}>
        <div className="oith-header-item" onClick={this.displayNavClick}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              d="M20.5 4H16c-1.9 0-3.2.4-4 1-.8-.6-2.1-1-4-1H3.5C2.7 4 2 4.7 2 5.5v12c0 .8.7 1.5 1.5 1.5H7c2.3 0 3 .4 3.5.6.4.2.8.4 1.5.4s1.2-.2 1.5-.4c.5-.2 1.2-.6 3.5-.6h3.5c.8 0 1.5-.7 1.5-1.5v-12c0-.8-.7-1.5-1.5-1.5zM7 17.5H3.5v-12H8c1.7 0 2.7.4 3.2.8v12c-.5-.3-1.4-.8-4.2-.8zm13.5 0H17c-2.8 0-3.7.5-4.3.8v-12c.6-.4 1.6-.8 3.3-.8h4.5v12z"
            ></path>
          </svg>
        </div>
        <div></div>
        <div className={`"oith-header-item" `} onClick={() => this.showNotes()}>
          <svg
            width="24"
            height="24"
            xmlns="http://www.w3.org/2000/svg"
            role="presentation"
          >
            <path
              fill="currentColor"
              d="M2 15c0-.828.666-1.5 1.5-1.5.828 0 1.5.666 1.5 1.5 0 .828-.666 1.5-1.5 1.5-.828 0-1.5-.666-1.5-1.5zm0-9c0-.828.666-1.5 1.5-1.5.828 0 1.5.666 1.5 1.5 0 .828-.666 1.5-1.5 1.5C2.672 7.5 2 6.834 2 6zm5 0c0-.414.341-.75.744-.75h13.512c.411 0 .744.333.744.75 0 .414-.341.75-.744.75H7.744A.745.745 0 0 1 7 6zm0 3.5c0-.414.341-.75.744-.75h13.512c.411 0 .744.333.744.75 0 .414-.341.75-.744.75H7.744A.745.745 0 0 1 7 9.5zm0 9c0-.414.341-.75.744-.75h13.512c.411 0 .744.333.744.75 0 .414-.341.75-.744.75H7.744A.745.745 0 0 1 7 18.5zM7 15c0-.414.341-.75.744-.75h13.512c.411 0 .744.333.744.75 0 .414-.341.75-.744.75H7.744A.745.745 0 0 1 7 15z"
            ></path>
          </svg>
        </div>
        <div
          className={`oith-header-item dropdown ${
            this.state && this.state.displayNoteSettings ? 'is-active' : ''
          }`}
          role="menu"
          style={noteSettingsMenuBtn}
          onClick={evt => {
            if (!this.state || this.state.displayNoteSettings !== true) {
              // const noteSettingsMenu = document.querySelector(
              //   '.note-settings-menu',
              // );
              // if (
              //   noteSettingsMenu &&
              //   noteSettingsMenu.contains(evt.target as HTMLElement)
              // ) {
              //   return;
              // }

              this.setState({
                displayNoteSettings: true,
              });

              menuOverlay$.next(closeMenu$);
            }
          }}
        >
          <svg
            width="24"
            height="24"
            xmlns="http://www.w3.org/2000/svg"
            role="presentation"
            className={`dropdown-trigger `}
          >
            <path
              fill="currentColor"
              d="M13.792 16.428a4.79 4.79 0 0 1-6.23-2.638 4.772 4.772 0 0 1 2.646-6.218 4.79 4.79 0 0 1 6.23 2.638 4.772 4.772 0 0 1-2.646 6.218zm-.56-1.39a3.272 3.272 0 0 0 1.815-4.265 3.29 3.29 0 0 0-4.279-1.81 3.272 3.272 0 0 0-1.815 4.264 3.29 3.29 0 0 0 4.279 1.81zm-7.853-5.84c-.51 1.199-1.706 2.01-2.986 2.12a9.51 9.51 0 0 0-.011 1.195c1.279.129 2.458.96 2.95 2.173.488 1.207.218 2.626-.61 3.607.263.302.544.586.842.853.996-.812 2.418-1.056 3.625-.545 1.2.509 2.015 1.702 2.125 2.98.4.028.801.032 1.202.01.13-1.276.963-2.452 2.179-2.942 1.21-.487 2.631-.217 3.614.609a9.55 9.55 0 0 0 .856-.839c-.813-.994-1.057-2.413-.544-3.617.51-1.199 1.706-2.01 2.986-2.12a9.51 9.51 0 0 0 .011-1.195c-1.279-.129-2.458-.96-2.95-2.173-.488-1.207-.218-2.626.61-3.607a9.55 9.55 0 0 0-.842-.853c-.996.812-2.418 1.056-3.625.545-1.2-.509-2.015-1.702-2.125-2.98a9.59 9.59 0 0 0-1.202-.01c-.13 1.276-.963 2.452-2.179 2.942-1.21.487-2.631.217-3.614-.609a9.55 9.55 0 0 0-.856.839c.813.994 1.057 2.413.544 3.617zm-2.153-4.03c.599-.768 1.297-1.454 2.08-2.04a.75.75 0 0 1 1.05.15c.533.711 1.57 1.01 2.388.681.824-.331 1.356-1.258 1.242-2.14a.75.75 0 0 1 .652-.84c.972-.12 1.952-.111 2.917.026a.75.75 0 0 1 .637.85c-.128.877.393 1.819 1.204 2.162.818.347 1.853.067 2.398-.638a.75.75 0 0 1 1.054-.133c.769.597 1.457 1.294 2.045 2.075a.75.75 0 0 1-.15 1.053c-.714.53-1.013 1.563-.684 2.377.333.82 1.262 1.353 2.15 1.239a.75.75 0 0 1 .84.65c.12.97.11 1.949-.027 2.912a.75.75 0 0 1-.85.636c-.882-.127-1.827.393-2.17 1.201-.347.814-.068 1.844.639 2.388a.75.75 0 0 1 .133 1.056c-.599.767-1.297 1.453-2.08 2.04a.75.75 0 0 1-1.05-.15c-.533-.712-1.57-1.012-2.388-.682-.824.331-1.356 1.258-1.242 2.14a.75.75 0 0 1-.652.84c-.972.12-1.952.111-2.917-.026a.75.75 0 0 1-.637-.85c.128-.877-.393-1.819-1.204-2.162-.818-.347-1.853-.067-2.398.638a.75.75 0 0 1-1.054.133 11.052 11.052 0 0 1-2.045-2.075.75.75 0 0 1 .15-1.053c.714-.53 1.013-1.563.684-2.377-.333-.82-1.262-1.353-2.15-1.239a.75.75 0 0 1-.84-.65c-.12-.97-.11-1.949.027-2.912a.75.75 0 0 1 .85-.636c.882.127 1.827-.393 2.17-1.201.347-.814.068-1.844-.639-2.388a.75.75 0 0 1-.133-1.056z"
            ></path>
          </svg>
          <NoteSettingsMenu
            displayNoteSettings={
              this.state ? this.state.displayNoteSettings === true : false
            }
          />
        </div>
      </div>
    );
  }
}
