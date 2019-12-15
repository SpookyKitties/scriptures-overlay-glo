import {
  NoteTypes,
  NoteCategories,
} from '../oith-lib/src/verse-notes/settings/note-gorup-settings';
import { flatMap, map, filter, toArray } from 'rxjs/operators';
import { BehaviorSubject, of, forkJoin, Observable } from 'rxjs';
import axios from 'axios';
import { NoteSettings } from '../oith-lib/src/processors/NoteSettings';
import { Settings } from './Settings';
import { NavigationItem } from './navigation-item';
import { flatMap$ } from '../oith-lib/src/rx/flatMap$';
import { resetNotes$ } from './resetNotes';

const flattenPrimaryManifest = (
  navItems: NavigationItem[],
): Observable<NavigationItem[]> => {
  return of(navItems).pipe(
    flatMap$,
    map(navItem => {
      if (navItem.navigationItems && navItem.navigationItems.length > 0) {
        return flattenPrimaryManifest(navItem.navigationItems).pipe(
          map(o => o.concat([navItem])),
          flatMap$,
        );
      }

      return of(navItem);
    }),
    flatMap$,
    toArray(),
  );
};
export class AppSettings {
  public settings: Settings;
  public noteSettings?: NoteSettings;
  public noteTypes?: NoteTypes;
  public displayNav$: BehaviorSubject<boolean>; //(false);
  public notesMode$: BehaviorSubject<string>;
  public navigation$ = new BehaviorSubject<NavigationItem>(undefined);
  public updatenavigation$ = new BehaviorSubject<boolean>(undefined);
  public flatNavigation$ = new BehaviorSubject<NavigationItem[]>(undefined);
  public flatNavigationParents$ = new BehaviorSubject<NavigationItem[]>(
    undefined,
  );
  public noteCategories?: NoteCategories;
  constructor(lang: string) {
    const settingsS = localStorage.getItem(
      `${lang}-scriptures-overlay-settings`,
    );
    this.settings = settingsS ? JSON.parse(settingsS) : new Settings(lang);
    this.displayNav$ = new BehaviorSubject(this.settings.displayNav);
    this.notesMode$ = new BehaviorSubject(this.settings.notesMode);
    this.loadNoteSettings();
    this.initNav();
    this.flattenNavigation();
  }
  private async getNoteTypeSettings<T extends keyof AppSettings>(
    key: T,
    fileName: 'note-settings' | 'note-categories' | 'note-types',
  ) {
    if (!this[key]) {
      const lang = this.settings.lang;

      try {
        const data = await axios.get(
          `https://files.oneinthinehand.org/so/scripture_files/${'eng'}-${fileName}.json`,
          {
            responseType: 'json',
          },
        );
        this[key] = data.data;
        this.save(key);
      } catch (error) {
        console.log(error);
      }
    }
  }

  private flattenNavigation() {
    this.navigation$
      .pipe(
        filter(o => o !== undefined),
        map(navigation =>
          flattenPrimaryManifest(navigation.navigationItems).pipe(
            map(o => this.flatNavigation$.next(o)),
          ),
        ),
        flatMap$,
      )
      .subscribe();
  }
  private initNav() {
    of(
      axios.get(
        `https://files.oneinthinehand.org/so//files/navigation/${this.settings.lang}-navigation.json`,
        {
          responseType: 'json',
        },
      ),
    )
      .pipe(
        flatMap(o => o),
        map(o => o.data as NavigationItem),
      )
      .subscribe(o => {
        this.navigation$.next(o);
      });
  }
  public loadNoteSettings() {
    const noteSettingsS = localStorage.getItem(
      'scriptures-overlay-noteSettings',
    );
    const noteTypesS = localStorage.getItem('scriptures-overlay-noteTypes');
    const noteCategoriesS = localStorage.getItem(
      'scriptures-overlay-noteCategories',
    );
    this.noteSettings = noteSettingsS ? JSON.parse(noteSettingsS) : undefined;
    this.noteTypes = noteTypesS ? JSON.parse(noteTypesS) : undefined;
    this.noteCategories = noteCategoriesS
      ? JSON.parse(noteCategoriesS)
      : undefined;
    return (
      forkJoin(
        of(this.getNoteTypeSettings('noteSettings', 'note-settings')).pipe(
          flatMap$,
        ),
        of(this.getNoteTypeSettings('noteCategories', 'note-categories')).pipe(
          flatMap$,
        ),
        of(this.getNoteTypeSettings('noteTypes', 'note-types')).pipe(flatMap$),
      )
        // .pipe(flatMap(o => o))
        .subscribe(o => {
          resetNotes$();
        })
    );
  }
  public displayNav() {
    this.settings.displayNav = !this.settings.displayNav;
    this.displayNav$.next(this.settings.displayNav);
    this.save('settings');
  }
  public displayNotes() {
    const displayNotes = this.settings.notesMode;

    const width = window.outerWidth;

    if (displayNotes === 'off' || typeof displayNotes === 'undefined') {
      this.settings.notesMode = 'small';
    } else if (displayNotes === 'small') {
      if (window.matchMedia('(min-width: 768px)').matches) {
        this.settings.notesMode = 'off';
      } else {
        this.settings.notesMode = 'large';
      }
    } else {
      this.settings.notesMode = 'off';
    }
    this.save('settings');
    this.notesMode$.next(this.settings.notesMode);
  }
  public save<T extends keyof this>(key: T) {
    localStorage.setItem(
      `scriptures-overlay-${key}`,
      JSON.stringify(this[key]),
    );
  }
}
