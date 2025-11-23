export const apps = [
  {
    name: 'main-server',
    script: 'npm',
    args: ['run', 'start:prod'],
    instances: '3',
    exec_mode: 'cluster'
  },
  {
    name: 'worker-server',
    script: 'npm',
    args: ['run', 'start:prod'],
    instances: '1',
    exec_mode: 'fork'
  }
];

// pm2 start npm --name main-server -- run start:prod
