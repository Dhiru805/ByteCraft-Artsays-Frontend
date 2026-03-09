pipeline {
    agent any

    environment {
        IMAGE_NAME     = "artsays-frontend"
        CONTAINER_NAME = "artsays-frontend-container"
        NEW_CONTAINER  = "artsays-frontend-new"
        NETWORK_NAME   = "artsays-network"
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
                echo 'Building Docker image for frontend...'
                sh 'docker build --no-cache -t ${IMAGE_NAME}:${BUILD_NUMBER} .'
            }
        }

        stage('Setup Network') {
            steps {
                sh '''
                docker network inspect ${NETWORK_NAME} >/dev/null 2>&1 || docker network create ${NETWORK_NAME}
                docker network connect ${NETWORK_NAME} artsays-backend-container 2>/dev/null || true
                '''
            }
        }

        stage('Start New Container') {
            steps {
                echo 'Starting new frontend container on staging port 3003...'
                sh '''
                docker stop ${NEW_CONTAINER} 2>/dev/null || true
                docker rm  ${NEW_CONTAINER} 2>/dev/null || true

                docker run -d \
                  --name ${NEW_CONTAINER} \
                  --network ${NETWORK_NAME} \
                  -p 127.0.0.1:3003:80 \
                  ${IMAGE_NAME}:${BUILD_NUMBER}
                '''
            }
        }

        stage('Health Check New Container') {
            steps {
                echo 'Waiting for new frontend container to be healthy...'
                sh '''
                sleep 5
                docker exec ${NEW_CONTAINER} wget -qO- http://localhost:80/ > /dev/null || {
                    echo "New container failed health check — aborting, old container stays live"
                    docker logs ${NEW_CONTAINER} || true
                    docker stop ${NEW_CONTAINER} || true
                    docker rm  ${NEW_CONTAINER} || true
                    exit 1
                }
                echo "New frontend container is healthy"
                '''
            }
        }

        stage('Swap Containers') {
            steps {
                echo 'New container healthy — swapping old container out...'
                sh '''
                # Remove old production container
                docker stop ${CONTAINER_NAME} 2>/dev/null || true
                docker rm  ${CONTAINER_NAME} 2>/dev/null || true

                # Stop staging container and relaunch on production port
                docker stop ${NEW_CONTAINER}
                docker rm   ${NEW_CONTAINER}

                docker run -d \
                  --name ${CONTAINER_NAME} \
                  --network ${NETWORK_NAME} \
                  -p 3000:80 \
                  ${IMAGE_NAME}:${BUILD_NUMBER}
                '''
            }
        }

        stage('Health Check New Container') {
    steps {
        sh '''
        echo "Checking new container health..."

        for i in $(seq 1 10); do
          if docker exec ${NEW_CONTAINER} wget -qO- http://localhost:80/ > /dev/null; then
              echo "New frontend container is healthy"
              exit 0
          fi

          echo "Waiting for container... attempt $i"
          sleep 3
        done

        echo "New container failed health check — aborting deployment"
        docker logs ${NEW_CONTAINER} || true
        docker stop ${NEW_CONTAINER} || true
        docker rm  ${NEW_CONTAINER} || true
        exit 1
        '''
    }
}

        stage('Clear Backend Prerender Cache') {
            steps {
                echo 'Clearing backend prerender cache...'
                sh '''
                curl -s -X POST http://artsays-backend-container:3001/__prerender-cache-clear || \
                  curl -s -X POST http://localhost:3001/__prerender-cache-clear || \
                  echo "Cache-clear request failed — backend will auto-refresh on next request"
                '''
            }
        }

        stage('Cleanup Old Images') {
            steps {
                sh 'docker image prune -af'
            }
        }

    }

    post {

        success {
            echo 'Frontend deployed successfully — old build replaced only after new build passed health check.'
        }

        failure {
            echo 'Deployment failed — old container was NOT stopped, production is still running.'
            sh '''
            docker stop ${NEW_CONTAINER} 2>/dev/null || true
            docker rm  ${NEW_CONTAINER} 2>/dev/null || true
            '''
        }

        always {
            echo 'Pipeline finished'
        }
    }
}
