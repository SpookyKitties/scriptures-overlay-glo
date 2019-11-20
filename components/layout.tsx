import { NextPage } from "next";
import { NavbarComponents, NavbarProps } from "./navbar.component";
import { CSSProperties } from "react";
import Head from "next/head";
import "../styles/styles.scss";
import { HeaderComponent } from "./header.component";
import Helmet from "react-helmet";
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
      <Helmet>
        <title>{title}</title>
        <script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=${"UA-153000658-1"}`}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${"UA-153000658-1"}');
          `
          }}
        />
      </Helmet>
      <HeaderComponent></HeaderComponent>
      <div id="oith-content" style={oithContentStyles}>
        {children}
      </div>
    </div>
  );
};

export default Layout;
