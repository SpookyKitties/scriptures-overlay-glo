import axios from 'axios';
import Fuse from 'fuse.js';
import { cloneDeep, flatten } from 'lodash';
import { BehaviorSubject, forkJoin, Observable, of } from 'rxjs';
import { filter, flatMap, map, toArray } from 'rxjs/operators';
import { NoteSettings } from '../oith-lib/src/processors/NoteSettings';
import { flatMap$ } from '../oith-lib/src/rx/flatMap$';
import {
  NoteCategories,
  NoteTypes,
} from '../oith-lib/src/verse-notes/settings/note-gorup-settings';
import { NavigationItem } from './navigation-item';
import { resetNotes$ } from './resetNotes';
import { Settings } from './Settings';
import { parseSubdomain, parseStorage } from './parseSubdomain';

const newFlattenPrimaryManifest = (
  navItems: NavigationItem[],
): NavigationItem[] => {
  const flattenNav = (navItem: NavigationItem) => {
    if (Array.isArray(navItem.navigationItems)) {
      return newFlattenPrimaryManifest(navItem.navigationItems).concat(navItem);
    }
    return [navItem];
  };
  return flatten(
    navItems.map(navItem => {
      return flattenNav(navItem);
    }),
  );
};

const flattenPrimaryManifest = (
  navItems: NavigationItem[],
): Observable<NavigationItem[]> => {
  // return of(newFlattenPrimaryManifest(navItems));
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
  public displayUnderline$: BehaviorSubject<boolean>; //(false);
  public notesMode$: BehaviorSubject<string>;
  public navigation$ = new BehaviorSubject<NavigationItem>(undefined);
  public updatenavigation$ = new BehaviorSubject<boolean>(undefined);
  public flatNavigation$ = new BehaviorSubject<NavigationItem[]>(undefined);
  '';
  public flatNavigationParents$ = new BehaviorSubject<NavigationItem[]>(
    undefined,
  );

  public fuse$: BehaviorSubject<any>;

  public noteCategories?: NoteCategories;
  constructor(lang: string) {
    const settingsS = localStorage.getItem(
      `${lang}-scriptures-overlay-settings`,
    );
    this.settings = settingsS ? JSON.parse(settingsS) : new Settings(lang);
    this.displayNav$ = new BehaviorSubject(this.settings.displayNav);
    this.displayUnderline$ = new BehaviorSubject(
      this.settings.displayUnderline !== false,
    );
    this.notesMode$ = new BehaviorSubject(this.settings.notesMode);
    this.loadNoteSettings().subscribe(() => {
      this.initNav();
      this.flattenNavigation();
    });
  }

  private async getNoteTypeSettings<T extends keyof AppSettings>(
    key: T,
    fileName: 'noteSettings' | 'noteCategories' | 'noteTypes',
  ) {
    if (!this[key]) {
      const lang = this.settings.lang;

      const subDomain = parseSubdomain();
      try {
        const data = await axios.get(
          `https://oithstorage.blob.core.windows.net/${parseStorage()}/${'eng'}-${
            subDomain !== '' ? `${subDomain}-` : ''
          }${fileName}.json`,
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
            map(o => {
              this.flatNavigation$.next(o);
              const hg = cloneDeep(o);

              const fuse = new Fuse(
                hg.map(n => {
                  n.title = n.title.toLowerCase();
                  n.shortTitle = n.shortTitle.toLowerCase();
                  return n;
                }),
                {
                  keys: ['title', 'shortTitle', 'href'],
                  threshold: 0.35,
                  includeScore: true,
                  caseSensitive: false,
                  tokenize: true,
                  location: 0,
                },
              );

              this.fuse$ = new BehaviorSubject(fuse);
            }),
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
    const noteCategoriesS = localStorage.getItem(
      `eng-scriptures-overlay-noteCategories`,
    );

    this.noteCategories = noteCategoriesS
      ? JSON.parse(noteCategoriesS)
      : undefined;
    const noteSettingsS = localStorage.getItem(
      `eng-scriptures-overlay-noteSettings`,
    );
    const noteTypesS = localStorage.getItem(`eng-scriptures-overlay-noteTypes`);

    this.noteSettings = noteSettingsS ? JSON.parse(noteSettingsS) : undefined;
    this.noteTypes = noteTypesS ? JSON.parse(noteTypesS) : undefined;
    return (
      forkJoin(
        of(this.getNoteTypeSettings('noteSettings', 'noteSettings')).pipe(
          flatMap$,
        ),
        of(this.getNoteTypeSettings('noteCategories', 'noteCategories')).pipe(
          flatMap$,
        ),
        of(this.getNoteTypeSettings('noteTypes', 'noteTypes')).pipe(flatMap$),
      )
        // .pipe(flatMap(o => o))
        .pipe(
          map(o => {
            resetNotes$();
          }),
        )
    );
  }
  public displayNav() {
    this.settings.displayNav = !this.settings.displayNav;
    this.displayNav$.next(this.settings.displayNav);
    this.save('settings');
  }
  public displayUnderline() {
    if (this.settings.displayUnderline !== false) {
      this.settings.displayUnderline = false;
    } else {
      this.settings.displayUnderline = true;
    }
    this.displayUnderline$.next(this.settings.displayUnderline);
    this.save('settings');
  }
  public displayNotes() {
    const displayNotes = this.settings.notesMode;

    const width = window.outerWidth;

    if (displayNotes === 'off' || typeof displayNotes === 'undefined') {
      this.settings.notesMode = 'small';
    } else if (displayNotes === 'small') {
      if (window.matchMedia('(min-width: 500.01px)').matches) {
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
      `${this.settings.lang}-scriptures-overlay-${key}`,
      JSON.stringify(this[key]),
    );
  }
}
