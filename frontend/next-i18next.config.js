module.exports = {
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },
  localePath: typeof window === 'undefined'
    ? require('path').resolve('./public/locales')
    : '/locales',
  reloadOnPrerender: process.env.NODE_ENV === 'development',
  
  // Explicitly configure backend for App Router
  backend: {
    loadPath: './public/locales/{{lng}}/{{ns}}.json',
  },
};
