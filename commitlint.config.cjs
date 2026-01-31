module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      ['feat', 'fix', 'refactor', 'perf', 'style', 'test', 'docs', 'chore', 'build'],
    ],
    'scope-enum': [
      2,
      'always',
      [
        'ui',
        'layout',
        'page',
        'component',
        'hook',
        'api',
        'state',
        'router',
        'auth',
        'permission',
        'i18n',
        'theme',
        'devops',
      ],
    ],
  },
};
