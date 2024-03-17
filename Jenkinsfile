def COLOR_MAP = [
    'SUCESS': 'good',
    'FAILURE': 'danger'
]

pipeline {
    agent any

    tools {
        nodejs 'NodeJS 18.16.0'
    }

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

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Create .env') {
           steps {
                withCredentials([
                    string(credentialsId: 'DATABASE', variable: 'DATABASE'),
                    string(credentialsId: 'DATABASE_USERNAME', variable: 'DATABASE_USERNAME'),
                    string(credentialsId: 'DATABASE_PASSWORD', variable: 'DATABASE_PASSWORD')
                ]) {
                    sh '''
                    echo DATABASE=${DATABASE} > .env
                    echo DATABASE_USERNAME=${DATABASE_USERNAME} >> .env
                    echo DATABASE_PASSWORD=${DATABASE_PASSWORD} >> .env
                    '''
                }
            }
        }

        stage('Run Server & Test') {
            steps {
                // Starts the Express server & runs tests using Jest
                sh 'npm test'
            }
        }
    }

    stage('Parse and Send Test Results') {
        steps {
            script {
                // Read the XML file
                def jestResults = readXML file: 'test_results/jest_results.xml'
                
                // Example: Extracting some information
                // This part highly depends on the structure of your jest_results.xml
                // Let's assume we want to count the number of tests
                def totalTests = jestResults.testsuite.'@tests'.text()
                def failedTests = jestResults.testsuite.'@failures'.text()

                // Construct the message
                def message = "Total Tests: ${totalTests}, Failed Tests: ${failedTests}"
                
                // Send the message to Slack
                slackSend(channel: '#jenkinscicd', message: message)
            }
        }
    }

    post {
        // What to do after the pipeline has finished
        always {
            junit 'test_results/jest_results.xml'
            echo 'Slack Notofications.'
            slackSend channel: '#jenkinscicd',
                color: COLOR_MAP[currentBuild.currentResult],
                message: "*${currentBuild.currentResult}:* Job ${env.JOB_NAME} build ${env.BUILD_NUMBER} \n More info at: ${env.BUILD_URL}"
            echo 'Pipeline execution completed.'
        }
    }
}