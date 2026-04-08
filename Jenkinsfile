pipeline {
    agent any

    stages {
        stage('Clone') {
            steps {
                git 'https://github.com/Rajeev151124/hmis-devops-project.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t patient-service ./patient-service'
            }
        }

        stage('Push Image') {
            steps {
                sh '''
                docker tag patient-service rajeevreddy1511/patient-service
                docker push rajeevreddy1511/patient-service
                '''
            }
        }

        stage('Deploy to K8s') {
            steps {
                sh 'kubectl apply -f k8s/'
            }
        }
    }
}
