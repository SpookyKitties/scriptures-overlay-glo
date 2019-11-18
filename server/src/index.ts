import next from 'next';
import normalizePath from 'normalize-path';

const app = next({ dir: normalizePath(`./app`) });
