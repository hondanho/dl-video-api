pipeline  { 
    agent any

    environment {
        BRANCH = "${params.BRANCH}"
        SERVICE_NAME = "${params.SERVICE_NAME}"
        DOCKER_FILE = "${params.DOCKER_FILE}"
    }
    
    stages {        

        stage('Show host list') {
            steps{
                withCredentials([
                        string(credentialsId: 'host-list', variable: 'HOST_LIST')
                    ]) {
                    script{
                        def hosts = env.HOST_LIST.split(',')
                        for (host in hosts) {
                            sh "echo ${host}"
                        }
                    }
                }
            }
        }
        stage('Build image') {
            steps {
                    // docker build -t ${env.SERVICE_NAME}:${env.BUILD_NUMBER} -f Dockerfile . 
                
                sh """
                    docker build -t ${env.SERVICE_NAME}:latest -f ${env.DOCKER_FILE} . 
                """
            }
        }

        stage('Test image') {
            steps {
                
                sh 'echo "Tests passed"'
            }
        }

        stage('Send new image to host') {
            steps{
                script {
                    withCredentials([
                        file(credentialsId: 'rsa-file', variable: 'PEM_FILE_PATH'),
                        string(credentialsId: 'ssh-user-name', variable: 'USER_NAME'),
                        string(credentialsId: 'host-list', variable: 'HOST_LIST')
                    ]) {
                        def hosts = env.HOST_LIST.split(',')
                        sh """
                            docker save -o /docker_temp/${env.SERVICE_NAME}-${env.BUILD_NUMBER}.tar ${env.SERVICE_NAME}:latest 
                        """
                        for (host in hosts) {
                            // sh "scp <path_to_your_file_to_copy> ${host}:<destination_path_on_host>"
                            sh """
                                echo "copying docker file to ${host}"
                                cp ${env.PEM_FILE_PATH} key.pem
                                chmod 600 key.pem
                                scp -o StrictHostKeyChecking=no -i key.pem /docker_temp/${env.SERVICE_NAME}-${env.BUILD_NUMBER}.tar ${env.USER_NAME}@${host}:/home/docker-image-temp
                            """
                        }
                    }

                    sh 'echo "triggering updatemanifestjob..."'
                }
            }
        }

        stage('Trigger ManifestUpdate') {
            steps{
                
                sh 'echo "triggering deploy new version..."'
                build job: 'deploy', parameters: [string(name: 'SERVICE_NAME', value: env.SERVICE_NAME), string(name: 'VERSION', value: env.BUILD_NUMBER)]
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
