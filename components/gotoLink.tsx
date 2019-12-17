import { MouseEvent } from "react";
import Router from "next/router";
import { store } from "./SettingsComponent";

function gotoExternalLink(href: string) {}

export function gotoLink(event: MouseEvent, href?: string) {
  event.preventDefault();
  const h = href ? href : (event.target as HTMLAnchorElement).href;
  if (href) {
    Router.push("/[book]/[chapter]", href);
    store.history = false;
    return;
  }
  if (h) {
    if (h.includes("churchofjesuschrist")) {
      return gotoExternalLink(h);
    }
    if (href) {
      Router.push("/[book]/[chapter]", href);
      store.history = false;
      return;
    }
    const url = /(^.+)(\/.+\/.+)/g.exec(h);
    Router.push("/[book]/[chapter]", url[2]);
    store.history = false;
  }
}
