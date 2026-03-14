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
                          branches: [[name: '*/frontend-server']],
                          userRemoteConfigs: [[url: 'https://github.com/Dhiru805/ByteCraft-Artsays-Frontend.git']]])
            }
        }

        stage('Build Docker Image') {
            steps {
                echo '🐳 Building Docker image for frontend...'
                  sh 'docker build --no-cache -t artsays-frontend .'
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

                  # Ensure the named volume exists
                  docker volume create artsays-frontend-html 2>/dev/null || true

                  # Run frontend on the shared network, populating the named volume
                  # The volume is also mounted read-only by the backend container so it
                  # can read index.html directly without any HTTP fetch.
                  docker run -d \
                    --name artsays-frontend-container \
                    --network artsays-network \
                    -v artsays-frontend-html:/usr/share/nginx/html \
                    artsays-frontend

                echo "⏳ Waiting for frontend to start..."
                sleep 5
                '''
            }
        }

        stage('Run Nginx Proxy Container') {
            steps {
                echo '🔀 Running nginx proxy container...'
                sh '''
                # Stop and remove existing nginx proxy container
                docker stop artsays-nginx-proxy || true
                docker rm artsays-nginx-proxy || true

                  # Copy nginx-proxy.conf to a fixed path so the container mount is stable
                  mkdir -p /var/lib/jenkins/nginx-proxy
                  cp nginx-proxy.conf /var/lib/jenkins/nginx-proxy/nginx-proxy.conf

                  docker run -d \
                    --name artsays-nginx-proxy \
                    --network artsays-network \
                    -p 80:80 \
                    -p 443:443 \
                    -v /etc/letsencrypt:/etc/letsencrypt:ro \
                    -v /var/lib/jenkins/nginx-proxy/nginx-proxy.conf:/etc/nginx/conf.d/default.conf:ro \
                    nginx:alpine

                echo "⏳ Waiting for nginx proxy to start..."
                sleep 3
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