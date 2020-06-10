module.exports = {
  git: {
    commitMessage: 'chore: release v${version}',
  },
  github: {
    release: true,
  },
  hooks: {
    'after:release': './docker.sh ${version}',
  },
  plugins: {
    'release-it-yarn-workspaces': true,
    '@release-it/conventional-changelog': {
      preset: 'angular',
      infile: 'CHANGELOG.md',
    },
  },
  npm: false,
};
