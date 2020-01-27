import {
  subdomains,
  backup as backupSettings,
} from './subdomain_settings.json';

export function parseSubdomain2(hostName?: string) {
  const subDomain = subdomains.find(s =>
    s.matches.includes(hostName ? hostName : location.hostname),
  );
  return subDomain ? subDomain : backupSettings;
}
