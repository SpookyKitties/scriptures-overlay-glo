import { Verse } from '../../../oith-lib/src/models/Chapter';
import { of } from 'rxjs';
import { BuildShellOptions } from '../get_shell';
import { highlightContext } from './build-shells';
export function highlightVerses(
  verses: Verse[],
  chapterParams: BuildShellOptions,
) {
  return of(() => {
    if (chapterParams.highlight) {
      highlightContext(verses, chapterParams, 'highlight');
    }
    if (chapterParams.context) {
      highlightContext(verses, chapterParams, 'context');
    }
  });
}
