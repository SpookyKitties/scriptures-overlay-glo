import { NextPage } from "next";
import { NavbarComponents, NavbarProps } from "./navbar.component";
import { CSSProperties } from "react";
import Head from "next/head";
import "../styles/styles.scss";
import { HeaderComponent } from "./header.component";
const oithContentStyles: CSSProperties = {
  height: "calc(100vh - 48px)",
  display: "block",
  width: "100vw",
  position: "fixed",
  top: "48px"
};

const Layout: React.FunctionComponent<NavbarProps> = ({
  children,
  title,
  shortTitle
}) => {

  return (
    <div id="oith-main">
      {/* <Head>
        <title>{title}</title>
      </Head> */}
      <HeaderComponent></HeaderComponent>
      <div id="oith-content" style={oithContentStyles}>
        {children}
      </div>
    </div>
  );
};

export default Layout;
