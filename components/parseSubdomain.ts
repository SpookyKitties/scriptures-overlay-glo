import {
  subdomains,
  backup as backupSettings,
} from './subdomain_settings.json';

import os from 'os';
function getHostName() {
  if (!location && os) {
    return os.hostname();
  }

  if (location) {
    return location.hostname;
  }
  return '';
}

export function parseSubdomain(
  hostName?: string,
): {
  matches: string[];
  storageURL: string;
  settings: string;
  beta: boolean;
  disclaimer: boolean;
} {
  try {
    const hn = getHostName();

    console.log(hn);

    const subDomain = subdomains.find(s => s.matches.includes(hn));

    return subDomain ? subDomain : backupSettings;
  } catch (error) {
    console.log(backupSettings);

    return backupSettings;
  }
}
