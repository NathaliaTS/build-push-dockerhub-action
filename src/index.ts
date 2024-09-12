import * as core from '@actions/core';
import { exec } from 'child_process';
import { promisify } from 'util';
import * as path from 'path';
import * as fs from 'fs';

const execPromise = promisify(exec);

async function run() {
  try {
    const dockerImage = core.getInput('docker_image');
    const dockerfileRepo = core.getInput('dockerfile_repo');
    const dockerfilePath = core.getInput('dockerfile_path');
    
    // Clonar o repositório que contém o Dockerfile
    const repoName = dockerfileRepo.split('/').pop().replace('.git', '');
    await execPromise(`git clone ${dockerfileRepo}`);
    
    // Construir o Dockerfile
    const fullDockerfilePath = path.join(repoName, dockerfilePath);
    if (!fs.existsSync(fullDockerfilePath)) {
      throw new Error(`Dockerfile not found at path: ${fullDockerfilePath}`);
    }
    
    await execPromise(`docker build -f ${fullDockerfilePath} -t ${dockerImage} ${repoName}`);
    core.info(`Docker image ${dockerImage} built successfully.`);

    // Fazer pull da imagem do Docker Hub
    await execPromise(`docker pull ${dockerImage}`);
    core.info(`Docker image ${dockerImage} pulled successfully.`);
  } catch (error) {
    core.setFailed(`Action failed with error: ${error}`);
  }
}

run();