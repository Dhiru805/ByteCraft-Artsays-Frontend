pipeline {
    agent any

    stages {
        stage('Clean Workspace') {
            steps {
                echo 'Cleaning workspace for frontend...'
                cleanWs()
            }
        }

        stage('Checkout Code') {
            steps {
                echo 'Checking out frontend code...'
                checkout([$class: 'GitSCM',
                      branches: [[name: '*/frontend-server']],
                      userRemoteConfigs: [[url: 'https://github.com/Dhiru805/ByteCraft-Artsays-Frontend.git']]])
            }
        }

        stage('Build Docker Image') {
            steps {
                echo 'Building Docker image for frontend (React build runs inside Docker)...'
                // --no-cache ensures npm run build always runs fresh → new JS hash always matches index.html
                sh 'docker build --no-cache -t artsays-frontend .'
            }
        }

        stage('Setup Network') {
            steps {
                echo 'Setting up Docker network...'
                sh '''
                docker network create artsays-network 2>/dev/null || true
                docker network connect artsays-network artsays-backend-container 2>/dev/null || echo "Backend container not found, will connect later"
                '''
            }
        }

        stage('Run Docker Container') {
            steps {
                echo 'Running Docker container for frontend...'
                sh '''
                docker stop artsays-frontend-container || true
                docker rm artsays-frontend-container || true

                docker run -d \
                  --name artsays-frontend-container \
                  --network artsays-network \
                  -p 3000:80 \
                  artsays-frontend

                echo "Waiting for frontend to start..."
                sleep 5
                '''
            }
        }

        stage('Sync index.html to host volume') {
            steps {
                echo 'Copying fresh index.html from frontend container to HOST path /var/www/artsays/frontend/index.html...'
                sh '''
                # Extract the freshly built index.html from the new nginx container
                docker cp artsays-frontend-container:/usr/share/nginx/html/index.html /tmp/artsays-index.html

                # Verify SEO placeholders are present — fail loudly if missing
                grep -q "__META_TITLE__" /tmp/artsays-index.html && echo "OK - placeholders present" || {
                    echo "ERROR - __META_TITLE__ placeholder missing from index.html! Aborting."
                    head -c 500 /tmp/artsays-index.html
                    exit 1
                }

                # Write to the HOST directory that the backend container volume-mounts.
                # The backend Jenkinsfile mounts  -v /var/www/artsays/frontend:/var/www/artsays/frontend:ro
                # so writing here is the ONLY way the backend sees the new index.html.
                mkdir -p /var/www/artsays/frontend
                cp /tmp/artsays-index.html /var/www/artsays/frontend/index.html
                echo "Wrote new index.html to host path /var/www/artsays/frontend/index.html"
                  grep -o 'main[.][a-f0-9]*[.]js' /var/www/artsays/frontend/index.html | head -1 || true
                '''
            }
        }

        stage('Clear Backend Prerender Cache') {
            steps {
                echo 'Clearing in-memory prerender cache so backend picks up the new index.html immediately...'
                sh '''
                # Use curl from the Jenkins host — backend is bound to 127.0.0.1:3001 on the host
                curl -s -X POST http://127.0.0.1:3001/__prerender-cache-clear \
                  && echo "Cache cleared successfully" \
                  || echo "Cache-clear failed (backend may be restarting) — will auto-reload on next request"
                '''
            }
        }
    }

    post {
        success { echo 'Frontend deployed successfully!' }
        failure { echo 'Frontend deployment failed!' }
    }
}
