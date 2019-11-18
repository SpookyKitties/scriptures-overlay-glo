import { Component, CSSProperties } from "react";

const navbarStyles: CSSProperties = {
  color: "blue",
  width: "100vw",
  height: "48px",
  backgroundColor: "white"
};

export type NavbarProps = {
  title: string;
  shortTitle: string;
};

export class NavbarComponents extends Component<NavbarProps> {
  public render() {
    return (
      <div style={navbarStyles}>
        <span className="title">{this.props.title}</span>
        <span className="shortTitle">{this.props.shortTitle}</span>
      </div>
    );
  }
}
