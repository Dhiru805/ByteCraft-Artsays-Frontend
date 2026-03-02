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
                echo '🐳 Building Docker image for frontend...'
                sh 'docker build --no-cache --memory=6g --memory-swap=6g -t artsays-frontend .'
            }
        }

        stage('Setup Network') {
            steps {
                echo '🔗 Setting up Docker network...'
                sh '''
                # Create network if it doesn't exist
                docker network create artsays-network 2>/dev/null || true
                
                # Ensure backend is on the network (if running)
                docker network connect artsays-network artsays-backend-container 2>/dev/null || echo "Backend container not found, will connect later"
                '''
            }
        }

        stage('Run Docker Container') {
            steps {
                echo '🚀 Running Docker container for frontend...'
                sh '''
                # Stop and remove existing frontend container
                docker stop artsays-frontend-container || true
                docker rm artsays-frontend-container || true

                # Run frontend on the shared network
                docker run -d \
                  --name artsays-frontend-container \
                  --network artsays-network \
                  -p 80:80 \
                  artsays-frontend

                echo "⏳ Waiting for frontend to start..."
                sleep 5
                '''
            }
        }

        stage('Clear Backend Prerender Cache') {
            steps {
                echo '🔄 Clearing backend prerender cache so new index.html is used...'
                sh '''
                # Tell the backend to drop its cached index.html so it re-fetches from the new container
                curl -s -X POST http://artsays-backend-container:3001/__prerender-cache-clear || \
                  curl -s -X POST http://localhost:3001/__prerender-cache-clear || \
                  echo "⚠️  Cache-clear request failed (backend may not be running yet) — it will auto-refresh on next request"
                '''
            }
        }
    }

    post {
        success { echo '✅ Frontend deployed successfully!' }
        failure { echo '❌ Frontend deployment failed!' }
    }
}