import { MouseEvent } from 'react';
import Router from 'next/router';
import { store } from './SettingsComponent';
import ReactGa from 'react-ga';

function gotoExternalLink(href: string) {}

export function gotoLink(event: MouseEvent, href?: string) {
  event.preventDefault();
  const h = href ? href : (event.target as HTMLAnchorElement).href;
  if (href) {
    Router.push('/[book]/[chapter]', href);
    store.history = false;
    return;
  }
  if (h) {
    if (h.includes('churchofjesuschrist')) {
      return gotoExternalLink(h);
    }
    if (href) {
      Router.push('/[book]/[chapter]', href);
      store.history = false;
      return;
    }
    const url = /(^.+)(\/.+\/.+)/g.exec(h);

    ReactGa.event({
      category: 'cross-ref',
      action: `${window.location.pathname}`,
      label: url[2],
    });
    Router.push('/[book]/[chapter]', url[2]);
    store.history = false;
  }
}
