const dangerousKeys = new Set(['__proto__', 'prototype', 'constructor']);

const cleanValue = (value) => {
  if (Array.isArray(value)) return value.map(cleanValue);
  if (value && typeof value === 'object') {
    for (const key of Object.keys(value)) {
      if (key.startsWith('$') || key.includes('.') || dangerousKeys.has(key)) {
        delete value[key];
      } else {
        value[key] = cleanValue(value[key]);
      }
    }
  }
  if (typeof value === 'string') {
    return value.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '').trim();
  }
  return value;
};

export const sanitizeInputs = (req, _res, next) => {
  req.body = cleanValue(req.body);
  req.params = cleanValue(req.params);
  next();
};
