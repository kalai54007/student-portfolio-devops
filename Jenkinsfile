pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/<your-username>/<repo-name>.git'
            }
        }
        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }
        stage('Build App') {
            steps {
                sh 'npm run build'
            }
        }
        stage('Archive Artifacts') {
            steps {
                archiveArtifacts artifacts: 'build/**', fingerprint: true
            }
        }
    }
}
