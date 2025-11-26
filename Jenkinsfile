pipeline {
    agent any

    stages {
        stage('Clone Repository') {
            steps {
                echo '📥 Cloning code from GitHub For Frontend...'
                checkout scm
            }
        }

        stage('Build Docker Image') {
            steps {
                echo '🐳 Building Docker image for frontend...'
                sh 'docker build -t artsays-frontend .'
            }
        }

        stage('Run Docker Container') {
            steps {
                echo '🚀 Running Docker container for frontend...'

                // Stop and remove old container if exists
                sh '''
                if [ $(docker ps -aq -f name=artsays-frontend-container) ]; then
                  docker stop artsays-frontend-container || true
                  docker rm artsays-frontend-container || true
                fi

                docker run -d \
                  --name artsays-frontend-container \
                  -p 3000:3000 \
                  artsays-frontend
                '''
            }
        }
    }

    post {
        success {
            echo '✅ Deployment completed successfully For Frontend!'
        }
        failure {
            echo '❌ Build or deployment failed For Frontend!'
        }
    }
}