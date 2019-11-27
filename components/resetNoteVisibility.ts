import { appSettings } from "./header.component";
export function resetNoteVisibility() {
  appSettings.noteSettings.noteGroupSettings
    .filter(g => g.enabled)
    .map(grp => {
      grp.categoriesOn
        .concat(grp.overlays)
        .map(o => (appSettings.settings.vis[o] = true));
    });
  appSettings.noteCategories.noteCategories
    .filter(nc => {
      return !nc.on
        .map(on => appSettings.settings.vis[on] !== true)
        .includes(false) && nc.off
        ? !nc.off
            .map(on => appSettings.settings.vis[on] === true)
            .includes(true)
        : true;
    })
    .map(c => (appSettings.settings.vis[`nc-${c.category}`] = true));
}
