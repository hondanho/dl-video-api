pipeline  {
    agent any
    
    stages {        

        stage('Build image') {
            steps {
                sh """
                    docker-compose down
                    docker-composes up -d
                """
            }
        }
    }
    
    post {
        success {
            script {
                sh 'echo "success"'
            }
        }
        failure {
            script {
                sh 'echo "failed"'
            }
        }
    }
}
