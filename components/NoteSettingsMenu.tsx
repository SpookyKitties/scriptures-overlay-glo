import { Component, CSSProperties } from 'react';

const noteSettingsMenuStyles: CSSProperties = {
  position: 'absolute',
  left: '0',
  minWidth: '12rem',
  right: '48px',
  paddingTop: '4px',
  top: '100%',
  zIndex: 20,
};

export class NoteSettingsMenu extends Component<{
  displayNoteSettings?: boolean;
}> {
  public render() {
    return (
      <div
        style={noteSettingsMenuStyles}
        className={`note-settings-menu ${
          this.props.displayNoteSettings === true ? '' : 'none'
        }`}
      >
        asdfasdf
      </div>
    );
  }
}
