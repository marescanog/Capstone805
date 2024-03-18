pipeline {
    agent any

    tools {
        nodejs 'NodeJS 18.16.0'
    }

    stages {
        stage('Echo 1') {
            echo " stage 1"
        }

        stage('Echo 2') {
            echo " stage 2"
        }

        stage('Echo 3') {
            echo " stage 3"
        }
      
    }

    post {
        // What to do after the pipeline has finished
        always {
            echo 'Pipeline execution completed.'
        }
    }
}