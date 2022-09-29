'use strict'

const pWaitFor = require('p-wait-for')
const shell = require('shelljs')
const si = require('systeminformation')

const DEACTIVATION_THRESHOLD = 65
const ACTIVATION_THRESHOLD = 50

async function setup () {
  shell.exec('sudo uhubctl -l 1-1 -p 2 -a 0')
}

async function main () {
  await pWaitFor(async () => {
    const { main } = await si.cpuTemperature()

    return main > DEACTIVATION_THRESHOLD
  })

  shell.exec('sudo uhubctl -l 1-1 -p 2 -a 1')

  await pWaitFor(async () => {
    const { main } = await si.cpuTemperature()

    return main < ACTIVATION_THRESHOLD
  })

  shell.exec('sudo uhubctl -l 1-1 -p 2 -a 0')

  main()
}

setup()
  .then(main)
