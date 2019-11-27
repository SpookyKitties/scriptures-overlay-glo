import { Component, CSSProperties } from "react";
import { FormatMerged } from "../oith-lib/src/models/Chapter";
import { store } from "./header.component";
import { map } from "rxjs/operators";

export function displayStateKey<T, T2 extends keyof T>(state: T, key: T2) {
  return state ? state[key] : "";
}

export function calcClassList(formatMerged: FormatMerged) {
  const fts = formatMerged.formatTags.filter(f => {
    return [55, 56].includes(f.fType) && f.visible;
  });
  const all = fts.find(
    ft =>
      ft.offsets === "all" ||
      (ft.uncompressedOffsets && ft.uncompressedOffsets.includes(0))
  )
    ? "all"
    : "";

  const refCount =
    fts.length > 0 ? (fts.length > 1 ? "ref-double" : "ref-single") : "";
  return `${all} ${refCount}`;
}

export class FormatTag extends Component<{ formatMerged: FormatMerged }> {
  public state: { formatMerged: FormatMerged; classList: string; text: string };

  public style: CSSProperties = {
    backgroundColor: "inherit"
  };
  public className = "";
  constructor(props) {
    super(props);
    // this.state = { formatMerged: this.props.formatMerged };
    const fm = this.props.formatMerged;

    fm.all = fm.formatTags.find(f => f.offsets === "all") !== null;
    if (fm.all) {
      this.className = "all";
    }
  }

  componentDidMount() {
    this.setState({ text: this.props.formatMerged.text });
    this.setState({ formatMerged: this.props.formatMerged });

    store.updateFTags$
      .pipe(
        map(() => {
          this.setState({
            classList: `${calcClassList(this.props.formatMerged)} f-t`
          });
        })
      )
      .subscribe();
  }

  public click(fm: FormatMerged) {
    // this.style = { backgroundColor: "black" };
    this.setState({ style: this.style });
    // this.state.formatMerged.text = "lkasdf";
    // this.setState((state, props) => {
    //
    // });
  }
  public render() {
    return (
      <span
        className={`${displayStateKey(this.state, "classList")}`}
        style={this.style}
        onClick={() => this.click(this.state.formatMerged)}
      >
        {displayStateKey(this.state, "text")}
      </span>
    );
  }
}
