pipeline {
  agent any

  environment {
    DOCKER_IMAGE = 'battlesimulator-frontend'
    DOCKER_TAG = "${BUILD_NUMBER}"
    PORT = '3000'
    GITHUB_REPO = 'https://github.com/250421/Nightreign-P2-Frontend.git'
  }

  stages {
    stage('Update Lock File') {
      steps {
        // Remove existing lock file and generate a new one
        sh '''
          # Clean up any previous build artifacts
          rm -rf node_modules package-lock.json || true
          
          # Install dependencies with flags to handle architecture issues
          npm install --no-optional --legacy-peer-deps
        '''
      }
    }

    stage('Build') {
      steps {
        sh'''
          echo "optional=false" > .npmrc
          export ROLLUP_SKIP_NATIVE=true
          // npm run build -- --legacy-peer-deps
          npm run build
        '''
      }
    }

    stage('Docker Build') {
        steps {
          // Build new image
          sh "cd ${WORKSPACE} && docker build -t ${DOCKER_IMAGE}:${DOCKER_TAG} ."
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
                    docker run -d \\
                    --name ${DOCKER_IMAGE} \\
                    -p 8082:80 \\
                    --restart unless-stopped \\
                    ${DOCKER_IMAGE}:${DOCKER_TAG}
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
