export function parseSubdomain() {
  const subDomain = location.hostname.split('.').shift();
  if (subDomain) {
    if (['localhosat', 'port', 'dev'].includes(subDomain.toLowerCase())) {
      return '';
    }
    if (subDomain.toLowerCase() === 'localhost') {
      return 'a';
    }
    return subDomain;
  }
  return '';
}
