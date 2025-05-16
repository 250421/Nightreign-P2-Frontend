pipeline {
  agent any

  tools {
    nodejs 'NodeJS 20'
  }

  environment {
    DOCKER_IMAGE = 'battlesimulator-frontend'
    DOCKER_TAG = "${BUILD_NUMBER}"
  }

  stages {
    stage('Update Lock File') {
      steps {
        // Remove existing lock file and generate a new one
        sh '''
            rm -f package-lock.json
            npm cache clean --force
            npm install --no-audit --legacy-peer-deps
        '''
      }
    }

    stage('Build') {
      steps {
        sh 'npm run build --legacy-peer-deps'
      }
    }

    stage('Docker Build') {
      steps {
        sh "docker build -t ${DOCKER_IMAGE}:${DOCKER_TAG} ."
      }
    }

    stage('Deploy') {
        steps {
            script {
                // Stop existing container
                sh "docker stop ${DOCKER_IMAGE} || true"
                sh "docker rm ${DOCKER_IMAGE} || true"
                // Run new container with environment variables
                sh """ 
                  docker run -d --name ${DOCKER_IMAGE} -p 3000:80 --restart unless-stopped ${DOCKER_IMAGE}:${DOCKER_TAG}
                """
            }
        }
    }
  }

  post {
    success {
        echo 'Build and deployment successful!'
    }
    failure {
        echo 'Pipeline failed. Please check the logs for more information.'
    }
    always {
      // Clean up to prevent disk space issues
      sh 'docker image prune -f || true'
    }
  }
}

