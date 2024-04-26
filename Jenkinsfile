pipeline {
    agent any

    stages {
        stage('Stop Services') {
            steps {
                script {
                    // SSH into the remote server and run docker-compose down
                    sshCommand remote: [credentialsId: 'ssh-credentials', 
                                        user: 'ssh-user	', 
                                        host: 'host-server'], 
                               command: 'cd /home/dl-video-api && docker-compose down'
                }
            }
        }

        stage('Start Services') {
            steps {
                script {
                    // SSH into the remote server and run docker-compose up
                    sshCommand remote: [credentialsId: 'ssh-credentials', 
                                        user: 'ssh-user	', 
                                        host: 'host-server'], 
                               command: 'cd /home/dl-video-api && docker-compose up -d'
                }
            }
        }
    }
}
