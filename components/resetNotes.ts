import { map, filter } from "rxjs/operators";
import { store, appSettings } from "./header.component";
import { Chapter } from "../oith-lib/src/models/Chapter";
function resetNotes(
  chapter: Chapter //import("c:/users/jared/source/repos/scriptures-overlay/oith-lib/src/models/Chapter").Chapter
) {
  chapter.verseNotes.map(verseNote => {
    const v = verseNote.noteGroups.map(noteGroup => {
      const v = noteGroup.notes.map(note => {
        note.formatTag.visible =
          appSettings.settings.vis[`${note.noteType}`] === true;
        if (note.formatTag.visible) {
          const refVis = note.ref.map(
            ref =>
              (ref.vis = appSettings.settings.vis[`${ref.category}`] === true)
          );
          note.formatTag.visible = refVis.includes(true);
        }
        return note.formatTag.visible;
      });
      return (noteGroup.formatTag.visible = v.includes(true));
    });
    verseNote.vis = v.includes(true);
  });
  console.log(chapter);
}
export function resetNotes$() {
  store.chapter
    .pipe(
      filter(o => o !== undefined),
      map(chapter => {
        resetNotes(chapter);
      })
    )
    .subscribe();
}