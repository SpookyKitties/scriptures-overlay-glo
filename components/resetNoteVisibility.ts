import { appSettings, store } from './SettingsComponent';
import { of, forkJoin } from 'rxjs';
import { map, toArray } from 'rxjs/operators';
import { flatMap$ } from '../oith-lib/src/rx/flatMap$';

function resetNoteCategories() {
  appSettings.noteCategories.noteCategories
    .filter(noteCategory => {
      const off = noteCategory.off
        ? !noteCategory.off
          .map(off => appSettings.settings.vis[off] !== true)
          .includes(false)
        : true;
      const on = !noteCategory.on
        .map(on => appSettings.settings.vis[on] === true)
        .includes(false);

      return on === true && off === true;
    })
    .map(c => {
      appSettings.settings.vis[`nc-${c.category}`] = true;
    });
}

function resetNoteTypes() {
  appSettings.noteTypes.noteTypes
    .filter(noteType => {
      return appSettings.settings.vis[noteType.className] === true;
    })
    .map(c => (appSettings.settings.vis[`nt-${c.noteType}`] = true));
}

function resetNoteSettings() {
  appSettings.settings.vis = undefined;
  appSettings.settings.vis = {};
  appSettings.noteSettings.noteSettings

    .filter(g => g.enabled)
    .map(grp => {
      grp.catOn.concat(grp.overlays).map(o => {
        appSettings.settings.vis[o] = true;
      });
    });
}

export function resetNoteVisibilitySettings() {
  return of(resetNoteSettings()).pipe(
    map(() => {
      return forkJoin(of(resetNoteCategories()), of(resetNoteTypes()));
    }),
    flatMap$,
    map(() => {
      appSettings.save('settings');
    }),
  );
}
