pipeline {
    agent any

    stages {

        stage('Clean Workspace') {
            steps {
                echo '🧹 Cleaning workspace for frontend...'
                cleanWs()
            }
        }

        stage('Checkout Code') {
            steps {
                echo '📥 Checking out frontend code...'
                checkout([$class: 'GitSCM',
                          branches: [[name: '*/anshul2.0']],
                          userRemoteConfigs: [[url: 'https://github.com/Shantanu58/ByteCraft-Artsays-Frontend.git']]])
            }
        }

        stage('Build Docker Image') {
            steps {
                echo '🐳 Building Docker image for frontend (using local build folder)...'
                sh 'docker build --no-cache --memory=6g --cpus=2 -t artsays-frontend .'
            }
        }

        stage('Run Docker Container') {
            steps {
                echo '🚀 Running Docker container for frontend...'
                sh '''
                if [ $(docker ps -aq -f name=artsays-frontend-container) ]; then
                  docker stop artsays-frontend-container || true
                  docker rm artsays-frontend-container || true
                fi

                docker run -d \
                  --name artsays-frontend-container \
                  -p 80:80 \
                  artsays-frontend
                '''
            }
        }
    }

    post {
        success { echo '✅ Frontend deployed successfully!' }
        failure { echo '❌ Frontend deployment failed!' }
    }
}
