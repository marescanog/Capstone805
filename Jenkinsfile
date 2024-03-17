pipeline {
    agent any



    stages {
        stage('Clean Workspace') {
            steps {
                cleanWs()
            }
        }

        stage('Clone Repository') {
            steps {
                git(branch: 'jenkins-jest', url: 'https://github.com/marescanog/Capstone805.git')
            }
        }

        stage('Use Node.js') {
            tools {
                nodejs = '18.16.0'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Create .env') {
            steps {
                sh '''
                echo DATABASE=${DATABASE} > .env
                echo DATABASE_USERNAME=${DATABASE_USERNAME} >> .env
                echo DATABASE_PASSWORD=${DATABASE_PASSWORD} >> .env
                '''
            }
        }

        stage('Run Server & Test') {
            steps {
                // Starts the Express server & runs tests using Jest
                sh 'npm test'
            }
        }
    }

    post {
        // What to do after the pipeline has finished
        always {
            junit 'test_results/jest_results.xml'
            echo 'Pipeline execution completed.'
        }
    }
}