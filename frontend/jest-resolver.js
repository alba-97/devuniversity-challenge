const path = require('path');

module.exports = (request, options) => {
  // Default resolver
  const defaultResolver = options.defaultResolver;

  // Resolve @/ imports from src directory
  if (request.startsWith('@/')) {
    const modulePath = path.join(options.basedir, 'src', request.slice(2));
    return defaultResolver(modulePath, options);
  }

  // Use the default resolver for everything else
  return defaultResolver(request, options);
};
