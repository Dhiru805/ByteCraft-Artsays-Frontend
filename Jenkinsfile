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

                # Run frontend on the shared network
                docker run -d \
                  --name artsays-frontend-container \
                  --network artsays-network \
                  -p 3000:80 \
                  artsays-frontend

                echo "⏳ Waiting for frontend to start..."
                sleep 5
                '''
            }
        }

        stage('Sync index.html to host volume') {
            steps {
                echo 'Copying fresh index.html from frontend container to host and into backend container...'
                sh '''
                # Copy index.html from frontend container to a temp path jenkins owns (no sudo needed)
                  docker cp artsays-frontend-container:/usr/share/nginx/html/index.html /tmp/artsays-index.html

                  # Verify placeholders are present
                  grep -c "__META_TITLE__" /tmp/artsays-index.html && echo "OK - placeholders present" || echo "WARN - no placeholders found in index.html"

                  # Inject directly into the running backend container via docker cp
                  # (no sudo, no host-path permissions needed)
                  if docker inspect artsays-backend-container >/dev/null 2>&1; then
                      docker exec artsays-backend-container mkdir -p /var/www/artsays/frontend 2>/dev/null || true
                      docker cp /tmp/artsays-index.html artsays-backend-container:/var/www/artsays/frontend/index.html
                      echo "Injected index.html directly into backend container"
                  else
                      echo "Backend container not running — skipping inject (backend will fetch via HTTP on next request)"
                  fi
                '''
            }
        }

        stage('Clear Backend Prerender Cache') {
            steps {
                echo 'Clearing backend prerender cache so new index.html is picked up...'
                sh '''
                curl -s -X POST http://artsays-backend-container:3001/__prerender-cache-clear || \
                  curl -s -X POST http://localhost:3001/__prerender-cache-clear || \
                  echo "Cache-clear request failed (backend may not be running yet) — it will auto-refresh on next request"
                '''
            }
        }
    }

    post {
        success { echo '✅ Frontend deployed successfully!' }
        failure { echo '❌ Frontend deployment failed!' }
    }
}