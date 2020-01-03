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
import Fuse from 'fuse.js';
import { cloneDeep } from 'lodash';
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

  public fuse$: BehaviorSubject<any>;

  public noteCategories?: NoteCategories;
  constructor(lang: string) {
    const settingsS = localStorage.getItem(
      `${lang}-scriptures-overlay-settings`,
    );
    this.settings = settingsS ? JSON.parse(settingsS) : new Settings(lang);
    this.displayNav$ = new BehaviorSubject(this.settings.displayNav);
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

      try {
        const data = await axios.get(
          `https://oithstorage.blob.core.windows.net/blobtest/${'eng'}-${fileName}.json`,
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
  public displayNotes() {
    const displayNotes = this.settings.notesMode;

    const width = window.outerWidth;

    if (displayNotes === 'off' || typeof displayNotes === 'undefined') {
      this.settings.notesMode = 'small';
    } else if (displayNotes === 'small') {
      if (window.matchMedia('(min-width: 700.01px)').matches) {
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
