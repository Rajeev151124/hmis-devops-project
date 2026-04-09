pipeline {
    agent any

    environment {
        DOCKER_IMAGE = "rajeevreddy1511/patient-service:latest"
        FRONTEND_IMAGE = "rajeevreddy1511/hmis-frontend:latest"
        KUBECONFIG = "/var/lib/jenkins/.kube/config"
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

        
        stage('Create ConfigMap') {
            steps {
                sh 'kubectl apply -f k8s/mysql-configmap.yaml'
            }
        }

        stage('Deploy MySQL (Safe)') {
            steps {
                sh 'kubectl apply -f k8s/mysql-deployment.yaml'
                sh 'kubectl apply -f k8s/mysql-service.yaml'
            }
        }

        stage('Deploy Backend (Rolling Update)') {
            steps {
                sh 'kubectl apply -f k8s/patient-deployment.yaml'
                sh 'kubectl apply -f k8s/patient-service.yaml'
                sh 'kubectl rollout restart deployment patient-service'
            }
        }

        stage('Deploy Frontend (Rolling Update)') {
            steps {
                sh 'kubectl apply -f k8s/frontend-deployment.yaml'
                sh 'kubectl apply -f k8s/frontend-service.yaml'
                sh 'kubectl rollout restart deployment frontend'
            }
        }

        stage('Deploy Appointment Service (Rolling Update)') {
            steps {
                sh 'kubectl apply -f k8s/appointment-deployment.yaml'
                sh 'kubectl apply -f k8s/appointment-service.yaml'
                sh 'kubectl rollout restart deployment appointment-service'
            }
        }

        stage('Deploy Monitoring (Idempotent)') {
            steps {
                sh '''
                helm repo add prometheus-community https://prometheus-community.github.io/helm-charts || true
                helm repo update
                helm upgrade --install monitoring prometheus-community/kube-prometheus-stack
                '''
            }
        }

        stage('Verify Deployment') {
            steps {
                sh 'kubectl get pods'
                sh 'kubectl get svc'
            }
        }
    }

    post {
        always {
            echo 'Pipeline completed successfully.'
        }
    }
}
