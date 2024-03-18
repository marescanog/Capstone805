pipeline {
    agent any

    tools {
        nodejs 'NodeJS 18.16.0'
    }

    stages {
        stage('Echo 1') {
            steps {
                echo " stage 1"
            }
        }

        stage('Echo 2') {
              steps {
                echo " stage 1"
            }
        }

        stage('Echo 3') {
              steps {
                echo " stage 1"
            }
        }
      
    }

    post {
        // What to do after the pipeline has finished
        always {
            echo 'Pipeline execution completed.'
        }
    }
}