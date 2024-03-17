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

        stage('Parse and Send Test Results') {
            steps {
                script {
                    // Specify the path to the jest_results.xml file
                    def jestResultsPath = 'test_results/jest_results.xml'
                    
                    // Extract the totalTests, totalFailures and total errors
                    def totalTests = sh(script: "xmllint --xpath 'string(//testsuites/@tests)' ${jestResultsPath}", returnStdout: true).trim()
                    def totalFailures = sh(script: "xmllint --xpath 'string(//testsuites/@failures)' ${jestResultsPath}", returnStdout: true).trim()
                    def totalErrors = sh(script: "xmllint --xpath 'string(//testsuites/@errors)' ${jestResultsPath}", returnStdout: true).trim()
                    
                    // Construct the message to include tests, failures, and errors
                    def message = "Test Results: Total Tests: ${totalTests}, Failures: ${totalFailures}, Errors: ${totalErrors}"
                    
                    // Send the message to Slack
                    slackSend(channel: '#jenkinscicd', message: message)

                }
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
            echo 'Archiving test results'
            archiveArtifacts artifacts: 'test_results/jest_results.xml', onlyIfSuccessful: true
            echo 'Sending Test results.'
            script {
                env.ARTIFACT_URL = "${env.JENKINS_URL}job/${env.JOB_NAME}/${env.BUILD_NUMBER}/artifact/test_results/jest_results.xml"
                slackSend(channel: '#your-channel', message: "Here is the link to the test results: ${env.ARTIFACT_URL}")
            }
            echo 'Pipeline execution completed.'
        }
    }
}