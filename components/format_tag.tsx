import { Component, CSSProperties } from "react";
import { FormatMerged } from "../oith-lib/src/models/Chapter";

export class FormatTag extends Component<{ formatMerged: FormatMerged }> {
  public state: { formatMerged: FormatMerged };

  public style: CSSProperties = {
    backgroundColor: "inherit"
  };
  public className = "";
  constructor(props) {
    super(props);
    this.state = { formatMerged: this.props.formatMerged };
    const fm = this.props.formatMerged;

    fm.all = fm.formatTags.find(f => f.offsets === "all") !== null;
    if (fm.all) {
      this.className = "all";
    }
  }

  public click(fm: FormatMerged) {
    this.style = { backgroundColor: "black" };
    this.setState({ style: this.style });
    console.log(this.state);

    // this.state.formatMerged.text = "lkasdf";
    // this.setState((state, props) => {
    //   console.log(state);
    // });
  }
  public render() {
    return (
      <span
        className={this.className}
        style={this.style}
        onClick={() => this.click(this.state.formatMerged)}
      >
        {this.state.formatMerged.text}
      </span>
    );
  }
}
