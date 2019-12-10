export function parseCookieLang(cookie: string) {
  const reg = /lang\=(.+?)(\;|$)/g.exec(cookie);
  return reg ? reg[1] : '';
}

export function parseLangFromUrl() {
  const cookieLang = parseCookieLang(document.cookie);

  const urlLangReg = /lang\=(.+?)(\;|$)/g.exec(window.location.href);
  const urlLang = urlLangReg ? urlLangReg[1] : cookieLang;
  console.log(urlLang);

  if (urlLang.trim().length === 0) {
    return 'eng';
  }
  return urlLang;
}
