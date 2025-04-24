import _ from 'lodash';
import xss from 'xss';

const sanitizeNoSQL = (obj) => {
  if (!_.isPlainObject(obj)) return obj;
  const clean = {};
  for (const key in obj) {
    if (key.startsWith('$') || key.includes('.')) {
      console.log('Skipping dangerous key:', key); // Debug line
      continue;
    }
    clean[key] = sanitizeNoSQL(obj[key]);
  }
  return clean;
};

const sanitizeXSS = (obj) => {
  if (!_.isPlainObject(obj)) return obj;
  const clean = {};
  for (const key in obj) {
    const value = obj[key];
    if (typeof value === 'string') {
      clean[key] = xss(value);
    } else if (Array.isArray(value)) {
      clean[key] = value.map((item) =>
        typeof item === 'string' ? xss(item) : item
      );
    } else if (_.isPlainObject(value)) {
      clean[key] = sanitizeXSS(value);
    } else {
      clean[key] = value;
    }
  }
  return clean;
};

const sanitizeMiddleware = (req, res, next) => {
  req.sanitizedQuery = sanitizeXSS(sanitizeNoSQL(req.query || {}));
  req.sanitizedBody = sanitizeXSS(sanitizeNoSQL(req.body || {}));
  next();
};

export default sanitizeMiddleware;
