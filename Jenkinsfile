pipeline {
  agent any
  
  tools {
    nodejs 'NodeJS 18'
  }

  environment {
    APP_NAME = 'battlesimulator-frontend'
    PORT = '3000'
    GITHUB_REPO = 'https://github.com/250421/Nightreign-P2-Frontend.git'
    DOCKER_IMAGE = "${APP_NAME}:${BUILD_NUMBER}"
  }

  stages {
    stage('Checkout') {
      steps {
        git branch: 'main',
        url: "${GITHUB_REPO}"
      }
    }

    stage('Install Dependencies') {
      steps {
        sh 'npm ci'
      }
    }

    stage('Lint & Format Check') {
      steps {
        sh 'npm run lint || true'
      }
    }

    stage('Test') {
      steps {
        sh 'npm test || true'  // Add tests if available
      }
    }

    stage('Build') {
      steps {
        sh 'npm run build'
      }
    }

    stage('Build Docker Image') {
      steps {
        sh 'docker build -t ${DOCKER_IMAGE} .'
        sh 'docker tag ${DOCKER_IMAGE} ${APP_NAME}:latest'
      }
    }

    stage('Deploy') {
        steps {
            sh 'docker stop ${APP_NAME} || true'
            sh 'docker rm ${APP_NAME} || true'
            sh 'docker run -d -p ${PORT}:80 --name ${APP_NAME} ${APP_NAME}:latest'
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
        echo 'Pipeline finished'
    }
  }
}
