const pWaitFor = require('p-wait-for');
const shell = require('shelljs');
const si = require('systeminformation');

const DEACTIVATION_THRESHOLD = 65;
const DEACTIVATION_COMMAND = 'sudo uhubctl -l 1-1 -p 2 -a 0';
const ACTIVATION_THRESHOLD = 50;
const ACTIVATION_COMMAND = 'sudo uhubctl -l 1-1 -p 2 -a 1';

async function setup() {
  shell.exec(DEACTIVATION_COMMAND);
}

async function main() {
  await pWaitFor(async () => {
    const { main: currentTemperature } = await si.cpuTemperature();

    return currentTemperature > DEACTIVATION_THRESHOLD;
  });

  shell.exec(ACTIVATION_COMMAND);

  await pWaitFor(async () => {
    const { main: currentTemperature } = await si.cpuTemperature();

    return currentTemperature < ACTIVATION_THRESHOLD;
  });

  shell.exec(DEACTIVATION_COMMAND);

  main();
}

setup()
  .then(main);
