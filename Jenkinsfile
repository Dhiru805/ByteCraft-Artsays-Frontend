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

        stage('Sync index.html to backend') {
            steps {
                echo 'Copying fresh index.html (with new JS hash) from frontend container into backend container...'
                sh '''
                # Extract the freshly built index.html from the new container
                docker cp artsays-frontend-container:/usr/share/nginx/html/index.html /tmp/artsays-index.html

                # Verify SEO placeholders are present
                grep -c "__META_TITLE__" /tmp/artsays-index.html && echo "OK - placeholders present" || {
                    echo "ERROR - __META_TITLE__ placeholder missing from index.html!"
                    echo "First 300 chars:"
                    head -c 300 /tmp/artsays-index.html
                    exit 1
                }

                # Inject into the running backend container
                if docker inspect artsays-backend-container >/dev/null 2>&1; then
                    docker exec artsays-backend-container mkdir -p /var/www/artsays/frontend 2>/dev/null || true
                    docker cp /tmp/artsays-index.html artsays-backend-container:/var/www/artsays/frontend/index.html
                    echo "Injected fresh index.html into backend container"
                else
                    echo "Backend container not running — skipping inject"
                fi
                '''
            }
        }

        stage('Clear Backend Prerender Cache') {
            steps {
                echo 'Clearing backend prerender cache so new index.html (with new JS hash) is picked up immediately...'
                sh '''
                # Run curl from inside the frontend container (which is on artsays-network)
                # so it can reach the backend container by its Docker hostname.
                docker exec artsays-frontend-container \
                  wget -qO- --post-data="" http://artsays-backend-container:3001/__prerender-cache-clear \
                  && echo "Cache cleared successfully" \
                  || echo "Cache-clear request failed — backend may still be starting up. Next request will reload index.html from disk."
                '''
            }
        }
    }

    post {
        success { echo 'Frontend deployed successfully!' }
        failure { echo 'Frontend deployment failed!' }
    }
}
