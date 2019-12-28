import {
  VerseNoteGroup,
  NoteRef,
} from '../../oith-lib/src/verse-notes/verse-note';
export function refClick(noteGroup: VerseNoteGroup, ref: NoteRef) {
  if (
    ref.label.includes('🔊') &&
    noteGroup &&
    noteGroup.notes &&
    noteGroup.notes[0]
  ) {
    const phrase = noteGroup.notes[0].phrase
      .toLowerCase()
      .replace('“', '')
      .replace('”', '');
    const fileName = `https://oithstorage.blob.core.windows.net/blobtest/${phrase}.wav`;
    try {
      new Audio(fileName).play();
    } catch (error) {}
  }
}
