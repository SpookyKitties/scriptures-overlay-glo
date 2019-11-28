import { appSettings, store } from './header.component';
import { of, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { flatMap$ } from '../oith-lib/src/rx/flatMap$';

function resetNoteCategories() {
  appSettings.noteCategories.noteCategories
    .filter(noteCategory => {
      return !noteCategory.on
        .map(on => appSettings.settings.vis[on] !== true)
        .includes(false) && noteCategory.off
        ? !noteCategory.off
            .map(off => appSettings.settings.vis[off] === true)
            .includes(true)
        : true;
    })
    .map(c => (appSettings.settings.vis[`nc-${c.category}`] = true));
}

function resetNoteTypes() {
  appSettings.noteTypes.noteTypes
    .filter(noteType => {
      return appSettings.settings.vis[noteType.className] === true;
    })
    .map(c => (appSettings.settings.vis[`nt-${c.noteType}`] = true));
}

function resetNoteSettings() {
  appSettings.noteSettings.noteSettings
    .filter(g => g.enabled)
    .map(grp => {
      grp.catOn
        .concat(grp.overlays)
        .map(o => (appSettings.settings.vis[o] = true));
    });
}

export function resetNoteVisibilitySettings() {
  appSettings.settings.vis = {};
  return of(resetNoteSettings()).pipe(
    map(() => forkJoin(of(resetNoteCategories()), of(resetNoteTypes())).pipe()),
    flatMap$,
    map(() => {
      console.log('asdiofjaoisdjfoiasjdasdfasdfweweqaafoij');

      store.updateFTags$.next(true);
    }),
  );
}
