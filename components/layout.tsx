import { NextPage } from "next";
import { NavbarComponents, NavbarProps } from "./navbar.component";
import { CSSProperties } from "react";
import Head from "next/head";
import "../styles/styles.scss";
const oithContentStyles: CSSProperties = {
  position: "absolute"
};

const Layout: React.FunctionComponent<NavbarProps> = ({
  children,
  title,
  shortTitle
}) => {
  return (
    <div id="oith-main">
      <Head>
        <title>{title}</title>
      </Head>
      <div id="oith-content" style={oithContentStyles}>
        {children}
      </div>
      ;
    </div>
  );
};

export default Layout;
