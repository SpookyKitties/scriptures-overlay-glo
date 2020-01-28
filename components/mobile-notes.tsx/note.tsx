import { Component } from 'react';
import {
  Note,
  VerseNoteGroup,
} from '../../oith-lib/src/verse-notes/verse-note';

export class NoteComponent extends Component<{ note: Note }> {
  public render() {
    return <></>;
  }
}

export class NoteGroupComponent extends Component<{
  noteGroup?: VerseNoteGroup;
}> {
  public render() {
    return <></>;
  }
}
