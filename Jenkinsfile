pipeline {
    agent any
    environment {
        DOCKERHUB_USER = 'danyal722'
    }
    stages {
        stage('Build Frontend') {
            steps {
                sh 'docker build -t $DOCKERHUB_USER/taskmanager-frontend:latest ./frontend'
            }
        }
        stage('Build Backend') {
            steps {
                sh 'docker build -t $DOCKERHUB_USER/taskmanager-backend:latest ./backend'
            }
        }
        stage('Push to Docker Hub') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub-creds', usernameVariable: 'U', passwordVariable: 'P')]) {
                    sh '''
                    echo "$P" | docker login -u "$U" --password-stdin
                    docker push $DOCKERHUB_USER/taskmanager-frontend:latest
                    docker push $DOCKERHUB_USER/taskmanager-backend:latest
                    '''
                }
            }
        }
        stage('Deploy') {
            steps {
                sh '''
                docker compose down || true
                docker compose up -d
                docker ps
                '''
            }
        }
    }
}
