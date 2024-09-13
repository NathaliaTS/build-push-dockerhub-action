import * as core from '@actions/core';

async function run() {
  try {
    core.info('Olá, mundo');
  } catch (error) {
    core.setFailed(`Action failed with error: ${error}`);
  }
}

run();