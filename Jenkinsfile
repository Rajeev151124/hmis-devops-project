pipeline {
    agent any

    environment {
        DOCKER_IMAGE = "rajeevreddy1511/patient-service:latest"
        FRONTEND_IMAGE = "rajeevreddy1511/hmis-frontend:latest"
    }

    stages {

        stage('Clone Code') {
            steps {
                git branch: 'main', url: 'https://github.com/Rajeev151124/hmis-devops-project.git'
            }
        }

        stage('Build Backend Image') {
            steps {
                sh 'docker build -t patient-service ./patient-service'
                sh 'docker tag patient-service $DOCKER_IMAGE'
            }
        }

        stage('Push Backend Image') {
            steps {
                sh 'docker push $DOCKER_IMAGE'
            }
        }

        stage('Build Frontend Image') {
            steps {
                sh 'docker build -t hmis-frontend ./frontend'
                sh 'docker tag hmis-frontend $FRONTEND_IMAGE'
            }
        }

        stage('Push Frontend Image') {
            steps {
                sh 'docker push $FRONTEND_IMAGE'
            }
        }

        stage('Deploy MySQL') {
            steps {
                sh 'kubectl apply -f k8s/mysql-deployment.yaml'
                sh 'kubectl apply -f k8s/mysql-service.yaml'
            }
        }

        stage('Deploy Backend') {
            steps {
                sh 'kubectl apply -f k8s/patient-deployment.yaml'
                sh 'kubectl apply -f k8s/patient-service.yaml'
            }
        }

        stage('Deploy Frontend') {
            steps {
                sh 'kubectl apply -f k8s/frontend-deployment.yaml'
                sh 'kubectl apply -f k8s/frontend-service.yaml'
            }
        }

        stage('Deploy Monitoring') {
            steps {
                sh '''
                helm repo add prometheus-community https://prometheus-community.github.io/helm-charts || true
                helm repo update
                helm install monitoring prometheus-community/kube-prometheus-stack || true
                '''
            }
        }
    }
}
