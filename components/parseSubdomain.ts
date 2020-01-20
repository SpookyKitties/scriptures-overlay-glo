export function parseSubdomain(host?: string) {
  try {
    const subDomain = location.hostname.split('.').shift();
    if (subDomain) {
      if (['localhost'].includes(subDomain.toLowerCase())) {
        return 'future';
      }
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

export function parseStorage(host?: string) {
  const subDomain = parseSubdomain(host);
  console.log(subDomain === '');

  if (subDomain === 'future') {
    return 'blobtest';
  }

  if (subDomain === '') {
    return 'blobtest';
  }
  if (['june', 'b'].includes(subDomain)) {
    return 'junetest';
  }
  if (['a'].includes(subDomain)) {
    return 'blobtest';
  }

  return 'blobtest';
}
