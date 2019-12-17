import { store } from './SettingsComponent';
import { take, filter } from 'rxjs/operators';

export function exportNotes() {
  if (store) {
    store.chapter.pipe(
      take(1),
      filter(o => o !== undefined),
    );
  }
}
