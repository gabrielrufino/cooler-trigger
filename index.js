'use strict'

const pWaitFor = require('p-wait-for')
const shell = require('shelljs')
const si = require('systeminformation')

const deactivationThreshold = 65
const activationThreshold = 50

async function setup() {
  shell.exec('sudo uhubctl -l 1-1 -p 2 -a 0')
}

async function main() {
  await pWaitFor(async () => {
    const { main } = await si.cpuTemperature()

    return main > deactivationThreshold
  })

  shell.exec('sudo uhubctl -l 1-1 -p 2 -a 1')

  await pWaitFor(async () => {
    const { main } = await si.cpuTemperature()

    return main < activationThreshold
  })

  shell.exec('sudo uhubctl -l 1-1 -p 2 -a 0')

  main()
}

setup()
main()
