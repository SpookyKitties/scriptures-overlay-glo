export function parseSubdomain() {
  const subDomain = location.hostname.split('.').shift();
  if (subDomain) {
    if (['localhosat', 'port'].includes(subDomain.toLowerCase())) {
      return '';
    }
    if (subDomain.toLowerCase() === 'localhost') {
      console.log(subDomain);
      return 'a';
    }
    return subDomain;
  }
  return '';
}
