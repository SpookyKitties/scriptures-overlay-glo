import {
  subdomains,
  backup as backupSettings,
} from './subdomain_settings.json';

export function parseSubdomain(hostName?: string) {
  const subDomain = subdomains.find(s =>
    s.matches.includes(hostName ? hostName : location.hostname),
  );
  console.log(subDomain);

  return subDomain ? subDomain : backupSettings;
}
