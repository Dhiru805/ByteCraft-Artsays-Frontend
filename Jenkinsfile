pipeline {
    agent any

    environment {
        IMAGE_NAME  = "artsays-frontend"
        SERVE_PATH  = "/var/www/artsays/frontend"
    }

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
                    userRemoteConfigs: [[url: 'https://github.com/Dhiru805/ByteCraft-Artsays-Frontend.git']]
                ])
            }
        }

        stage('Build Docker Image') {
            steps {
                echo 'Building Docker image to capture build artifacts...'
                sh 'docker build --no-cache -t ${IMAGE_NAME}:${BUILD_NUMBER} .'
            }
        }

        stage('Extract Build Artifacts') {
            steps {
                echo 'Extracting build/ from Docker image to host...'
                sh '''
                # Create a temporary container (don't start it)
                TEMP_CONTAINER=$(docker create ${IMAGE_NAME}:${BUILD_NUMBER})

                # Copy build artifacts out of the image
                docker cp ${TEMP_CONTAINER}:/usr/share/nginx/html/. build-extracted/

                # Remove the temporary container
                docker rm ${TEMP_CONTAINER}
                '''
            }
        }

        stage('Deploy to Serve Path') {
            steps {
                echo "Deploying build artifacts to ${SERVE_PATH}..."
                sh '''
                  # Ensure target directory exists
                  mkdir -p ${SERVE_PATH}

                  # Sync files: recursive, no ownership/permission/time preservation
                  # (jenkins does not own the destination; --omit-dir-times skips utimes errors)
                  rsync -rl --delete --omit-dir-times build-extracted/ ${SERVE_PATH}/

                  # Set permissions so nginx (www-data) can read everything
                  find ${SERVE_PATH} -type d -exec chmod 755 {} +
                  find ${SERVE_PATH} -type f -exec chmod 644 {} +
                  '''
            }
        }

        stage('Verify Deployment') {
            steps {
                sh '''
                # Check index.html exists at the serve path
                if [ ! -f "${SERVE_PATH}/index.html" ]; then
                    echo "ERROR: index.html not found at ${SERVE_PATH} — deployment failed"
                    exit 1
                fi
                echo "Deployment verified: index.html present at ${SERVE_PATH}"
                '''
            }
        }

        stage('Clear Backend Prerender Cache') {
            steps {
                echo 'Clearing backend prerender cache...'
                sh '''
                CACHE_CLEARED=0

                if curl -sf -X POST http://backend.artsays.in/__prerender-cache-clear; then
                    echo "Cache cleared via container hostname"
                    CACHE_CLEARED=1
                elif curl -sf -X POST http://127.0.0.1:3001/__prerender-cache-clear; then
                    echo "Cache cleared via localhost"
                    CACHE_CLEARED=1
                fi

                if [ "$CACHE_CLEARED" = "0" ]; then
                    echo "ERROR: Could not reach backend cache-clear endpoint — deployment may serve stale HTML"
                    exit 1
                fi
                '''
            }
        }

        stage('Cleanup') {
            steps {
                sh '''
                # Remove extracted artifacts from workspace
                rm -rf build-extracted/

                # Remove build image (no longer needed at runtime)
                docker rmi ${IMAGE_NAME}:${BUILD_NUMBER} 2>/dev/null || true

                # Prune any dangling images
                docker image prune -f
                '''
            }
        }

    }

    post {

        success {
            echo 'Frontend deployed successfully — static files live at /var/www/artsays/frontend.'
        }

        failure {
            echo 'Deployment failed — previous files at /var/www/artsays/frontend are unchanged.'
            sh 'rm -rf build-extracted/ 2>/dev/null || true'
        }

        always {
            echo 'Pipeline finished'
        }
    }
}
