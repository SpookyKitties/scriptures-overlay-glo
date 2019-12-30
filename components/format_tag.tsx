import { Component, CSSProperties } from 'react';
import { FormatMerged } from '../oith-lib/src/models/Chapter';
import { map, filter, toArray, delay, take } from 'rxjs/operators';
import { of, forkJoin } from 'rxjs';
import { flatMap$ } from '../oith-lib/src/rx/flatMap$';
import { FormatTagNoteOffsets } from '../oith-lib/src/verse-notes/verse-note';
import { store, formatTagService, appSettings } from './SettingsComponent';

export function displayStateKey<T, T2 extends keyof T>(state: T, key: T2) {
  return state ? state[key] : '';
}

export function calcClassList(formatMerged: FormatMerged) {
  const fts = formatMerged.formatTags.filter(f => {
    return [55, 56].includes(f.fType) && f.visible;
  });

  const all = fts.find(
    ft =>
      ft.offsets === 'all' ||
      (ft.uncompressedOffsets && ft.uncompressedOffsets.includes(0)),
  )
    ? 'all'
    : '';

  const highlight =
    fts.find((o: FormatTagNoteOffsets) => o.highlight === true) !== undefined
      ? 'highlight'
      : '';

  const refCount =
    fts.length > 0 ? (fts.length > 1 ? 'ref-double' : 'ref-single') : '';
  return `${all} ${refCount} ${highlight}`;
}

export class FormatTag extends Component<{
  formatMerged: FormatMerged;
  offsets: string;
}> {
  public state: { formatMerged: FormatMerged; classList: string; text: string };

  public style: CSSProperties = {
    backgroundColor: 'inherit',
  };
  public className = '';
  constructor(props) {
    super(props);
    // this.state = { formatMerged: this.props.formatMerged };
    const fm = this.props.formatMerged;

    fm.all = fm.formatTags.find(f => f.offsets === 'all') !== null;
    if (fm.all) {
      this.className = 'all';
    }
  }

  componentDidMount() {
    this.setState({ text: this.props.formatMerged.text });
    this.setState({ formatMerged: this.props.formatMerged });
    this.setState({ offset: this.props.formatMerged.offset });

    store.updateFTags$
      .pipe(
        map(() => {
          this.setState({
            classList: `${calcClassList(this.props.formatMerged)} f-t`,
          });
        }),
      )
      .subscribe();
  }

  public click(fm: FormatMerged) {
    // this.style = { backgroundColor: "black" };
    const setNotesMode = () => {
      return appSettings.notesMode$.pipe(
        take(1),
        map(o => {
          if (o === 'off') {
            appSettings.notesMode$.next('small');
          }
        }),
      );
    };
    const fm$ = of(fm).pipe(
      filter(
        o => o.formatTags && o.formatTags.filter(o => o.visible).length > 0,
      ),
      map(o => formatTagService.fMergedClick(o)),
      flatMap$,
      map(() => {
        store.updateFTags$.next(true);
        store.updateNoteVisibility$.next(true);
      }),
      delay(100),
    );

    forkJoin(setNotesMode(), fm$).subscribe(() => {
      const vng = document.querySelector('.verse-note-group.highlight'); //.scrollIntoView();

      if (vng) {
        vng.scrollIntoView();
      }
    });
    // of(fm)
    //   .pipe(
    //     filter(
    //       o => o.formatTags && o.formatTags.filter(o => o.visible).length > 0,
    //     ),
    //     map(o => formatTagService.fMergedClick(o)),
    //     flatMap$,
    //     map(() => {
    //       store.updateFTags$.next(true);
    //       store.updateNoteVisibility$.next(true);
    //     }),
    //     delay(100),
    //   )
    //   .subscribe(() => {
    //     const vng = document.querySelector('.verse-note-group.highlight'); //.scrollIntoView();

    //     if (vng) {
    //       vng.scrollIntoView();
    //     }
    //   });

    // of(fm.formatTags as FormatTagNoteOffsets[])
    //   .pipe(
    //     flatMap$,
    //     filter(o => o.visible),
    //     map(o => {
    //       console.log(o);
    //       o.highlight = !o.highlight;
    //     }),
    //     toArray(),
    //   )
    //   .subscribe(() => {
    //     store.updateFTags$.next(true);
    //     store.updateNoteVisibility$.next(true);
    //   });

    // this.setState({ style: this.style });
    // this.state.formatMerged.text = "lkasdf";
    // this.setState((state, props) => {
    //
    // });
  }
  public render() {
    return (
      <span
        className={`${displayStateKey(this.state, 'classList')} `}
        style={this.style}
        data-offset={`${this.state ? this.state['offset'] : ''}`}
        onClick={() => this.click(this.state.formatMerged)}
      >
        {displayStateKey(this.state, 'text')}
      </span>
    );
  }
}
