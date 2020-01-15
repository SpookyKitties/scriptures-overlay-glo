export function parseSubdomain() {
  try {
    const subDomain = location.hostname.split('.').shift();
    if (subDomain) {
      if (['localhosat', 'port', 'dev'].includes(subDomain.toLowerCase())) {
        return '';
      }
      if (subDomain.toLowerCase() === 'localhost') {
        return '';
      }
      return subDomain;
    }
    return '';
  } catch (error) {
    return '';
  }
}

export function parseStorage() {
  const subDomain = parseSubdomain();
  console.log(subDomain === '');

  if (subDomain === '') {
    return 'blobtest';
  }
  if (['a', 'b'].includes(subDomain)) {
    return 'novembertest';
  }
}
