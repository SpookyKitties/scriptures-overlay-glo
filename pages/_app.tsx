import React from "react";
import App from "next/app";
import Layout from "../components/layout";
import { appSettings } from "../components/header.component";
import { BehaviorSubject } from "rxjs";
import { Chapter } from "../oith-lib/src/models/Chapter";

export class Store {
  public chapterHistory: Chapter[] = [];
  public chapter = new BehaviorSubject<Chapter>(undefined);
  history: boolean;

  public constructor() {}

  private getScrollTop(selector: string) {
    const chapterLoadElement = document.querySelector(selector);
    return chapterLoadElement ? chapterLoadElement.scrollTop : 0;
  }

  public addToHistory(chapter?: Chapter) {
    if (chapter) {
      chapter.history = true;
      chapter.chapterTop = this.getScrollTop(".chapter-loader");
      chapter.verseNotesTop = this.getScrollTop(".verse-notes");
      this.chapterHistory = this.chapterHistory
        .filter(o => o.id !== chapter.id)
        .concat([chapter]);
    }
  }

  public checkHistory(id: string) {
    if (this.history) {
      return this.chapterHistory.find(c => c.id === id);
    }
    return undefined;
  }
}

class MyApp extends App {
  // Only uncomment this method if you have blocking data requirements for
  // every single page in your application. This disables the ability to
  // perform automatic static optimization, causing every page in your app to
  // be server-side rendered.
  //
  // static async getInitialProps(appContext) {
  //   // calls page's `getInitialProps` and fills `appProps.pageProps`
  //   const appProps = await App.getInitialProps(appContext);
  //
  //   return { ...appProps }
  // }
  componentDidMount() {
    // store = new Store();
    // store.chapter.subscribe(c => {
    //   console.log(c);
    // });
  }

  render() {
    const { Component, pageProps } = this.props;
    return (
      <Layout>
        <div className="oiajsdfoiajsdfoijasdfoij">
          <Component {...pageProps} />;
        </div>
      </Layout>
    );
  }
}

export default MyApp;
