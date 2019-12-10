import { IncomingMessage } from 'http';
import { ParsedUrlQuery } from 'querystring';
import { appSettings } from '../components/header.component';

export const validLangs = ['eng', 'spa', 'por', 'fra', 'zhs', 'zho', 'jpn'];

function parseCookieLang(req: IncomingMessage) {
  const reg = /lang\=(.+?)(\;|$)/g.exec(req.headers.cookie);
  return reg[1];
}
export function langReq(req: IncomingMessage, query: ParsedUrlQuery) {
  try {
    const lang = query['lang'] as string;
    console.log(`1 ${lang}`);

    if (lang && validLangs.includes(lang.toLowerCase())) {
      return lang;
    }
  } catch (error) {}

  try {
    const lang = parseCookieLang(req); // req.headers.cookie.toLowerCase() as string;
    console.log(`2 ${lang}`);
    if (lang && validLangs.includes(lang)) {
      return lang;
    }
  } catch (error) {}
  try {
    const lang = appSettings.settings.lang; //req.headers.cookie.toLowerCase() as string;
    console.log(`3 ${lang}`);
    if (lang && validLangs.includes(lang)) {
      return lang;
    }
  } catch (error) {}

  return 'eng';
}
