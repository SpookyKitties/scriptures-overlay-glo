import { of, forkJoin } from 'rxjs';
import { flatMap$ } from '../rx/flatMap$';
import { map, toArray } from 'rxjs/operators';
import { parseDocID } from './parseDocID';
import { NoteSettings, NoteSetting, GlobalNoteSettings } from './NoteSettings';

function parseTruthSettings($: CheerioStatic) {
  return of($('truth-settings truth-setting').toArray()).pipe(
    flatMap$,
    map(e => {
      return forkJoin(
        of(e.attribs['label']),
        of(e.attribs['overlays']).pipe(
          map(o => (o !== undefined ? o.split(',') : [])),
        ),
        of(e.attribs['categories-on']).pipe(
          map(o => (o !== undefined ? o.split(',') : [])),
        ),
        of(e.attribs['categories-on-plus']).pipe(
          map(o => (o !== undefined ? o.split(',') : [])),
        ),
        of(e.attribs['display'] === 'true'),
        of(e.attribs['enabled'] === 'true'),
      ).pipe(
        map(
          ([
            label,
            overlays,
            catOn,
            catOnPlus,
            dispaly,
            eanbled,
          ]): NoteSetting => {
            return {
              label: label,
              overlays: overlays,
              catOn: catOn,
              catOnPlus: catOnPlus,
              display: dispaly,
              enabled: eanbled,
            };
          },
        ),
      );
    }),
    flatMap$,
    toArray(),
  );
}

function parseAdditionalettings($: CheerioStatic) {
  return of($('additional truth-setting').toArray()).pipe(
    flatMap$,
    map(e => {
      return forkJoin(
        of(e.attribs['label']),
        of(e.attribs['additional-content']),

        of(e.attribs['display'] === 'true'),
        of(e.attribs['enabled'] === 'true'),
      ).pipe(
        map(
          ([label, overlays, display, enabled]): GlobalNoteSettings => {
            return {
              label: label,
              additionalcontent: overlays,
              display: display,
              enabled: enabled,
            };
          },
        ),
      );
    }),
    flatMap$,
    toArray(),
  );
}

export function parseLang($: CheerioStatic) {
  return of($('html').attr('lang'));
}

export function noteGroupProcessor($: CheerioStatic) {
  console.log('Parsing Note Settings.');

  return forkJoin(
    parseTruthSettings($),
    parseAdditionalettings($),
    parseLang($),
  ).pipe(
    map(
      (o): NoteSettings => {
        return {
          addSettings: o[1],
          noteSettings: o[0],
          id: `${o[2]}-note-settings`,
        };
      },
    ),
  );
}
