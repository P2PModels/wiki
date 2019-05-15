module.exports = {
  input: [
    'src/**/*.{js,jsx}',
    // Use ! to filter out files or directories
    '!app/**/*.spec.{js,jsx}',
    '!app/i18n/**',
    '!**/node_modules/**',
  ],
  output: './',
  options: {
    debug: true,
    sort: true,
    defaultValue: function(lng, ns, key) {
      return key
    },
    func: {
      list: ['i18next.t', 'i18n.t', 't'],
      extensions: ['.js'],
    },
    trans: {
      component: 'Trans',
      i18nKey: 'i18nKey',
      defaultsKey: 'defaults',
      extensions: ['.js'],
      fallbackKey: function(ns, value) {
        return value
      },
    },
    lngs: ['en'],
    defaultLng: 'en',
    resource: {
      loadPath: 'public/locales/{{lng}}.json',
      savePath: 'public/locales/{{lng}}.json',
      jsonIndent: 2,
      lineEnding: '\n',
    },
    nsSeparator: false, // namespace separator
    keySeparator: false, // key separator
    interpolation: {
      prefix: '{{',
      suffix: '}}',
    },
  },
}
