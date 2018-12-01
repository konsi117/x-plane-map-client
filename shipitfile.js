/* eslint import/no-extraneous-dependencies: 0 */
const shipitDeploy = require('shipit-deploy');

module.exports = function shipitConfig(shipit) {
  shipitDeploy(shipit);

  shipit.initConfig({
    default: {
      deployTo: '/home/fouc/x-plane-map-client',
      dirToCopy: 'build',
      repositoryUrl: 'https://github.com/foucdeg/x-plane-map-client',
      ignores: ['.git'],
      keepReleases: 3,
      deleteOnRollback: false,
      shallowClone: true,
      yarn: {
        remote: false,
      },
    },
    prod: {
      servers: [
        {
          host: 'vps',
          user: 'fouc',
        },
      ],
    },
  });

  shipit.blTask('build-client', async () => {
    await shipit.local(`cd ${shipit.workspace} && yarn && yarn build`);
    shipit.emit('client_built');
  });

  shipit.on('fetched', () => {
    shipit.start('build-client');
  });
};
