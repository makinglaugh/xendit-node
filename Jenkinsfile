#!/usr/bin/env groovy
  
pipeline {
  agent { label 'master' }
  environment {
    tag_ver = sh (
      script: "date +%s",
      returnStdout: true
      ).trim()
    }
    stages {
      stage('build') {
        steps {
          sh "sed -i \'s:latest:${tag_ver}:\' docker-compose.yaml"
          sh "export DOCKER_HOST=127.0.0.1"
          sh "docker-compose -f docker-compose.yaml build"
          sh "docker images"
        }
      }
      stage('kompose') {
        steps {
          // create deployment and service file
          sh "kompose convert -f docker-compose.yaml"  

          // add line for check if new pods UP before replacing old ones
          sh 'sed -i \'s/strategy: {}/strategy:/\' xendit-node-deployment.yaml'
          sh "sed -i \'/template/i \\    type: RollingUpdate\' xendit-node-deployment.yaml"
          sh "sed -i \'/template/i \\    rollingUpdate:\' xendit-node-deployment.yaml"
          sh "sed -i \'/template/i \\      maxSurge: 2\' xendit-node-deployment.yaml"
          sh "sed -i \'/template/i \\      maxUnavailable: 50%\' xendit-node-deployment.yaml"

          // add line for health check 
          sh "sed -i \'/resource/i \\        readinessProbe:\' xendit-node-deployment.yaml"
          sh "sed -i \'/resource/i \\          httpGet:\' xendit-node-deployment.yaml"
          sh "sed -i \'/resource/i \\            path: /health\' xendit-node-deployment.yaml"
          sh "sed -i \'/resource/i \\            port: 3000\' xendit-node-deployment.yaml"
          sh "sed -i \'/resource/i \\          initialDelaySeconds: 5\' xendit-node-deployment.yaml"
          sh "sed -i \'/resource/i \\          periodSeconds: 5\' xendit-node-deployment.yaml"
          sh "sed -i \'/resource/i \\          successThreshold: 1\' xendit-node-deployment.yaml"

          // kubernetes get credential
          sh "gcloud container clusters get-credentials xendit --zone asia-southeast1-a --project xendit-trial"
        }
      }
      stage('push') {
        steps {
          retry(10) {
            // pushing the build image
            sh "gcloud docker -- push gcr.io/xendit-trial/xendit-node:${tag_ver}"
          }
          timeout(time: 20, unit: 'MINUTES') {
            sh 'echo checking health...'
          }
        }
      }
      stage('deploy') {
        steps {
          // apply changes
          sh "kubectl apply -f xendit-node-deployment.yaml --record"
          sh "kubectl apply -f xendit-node-service.yaml"
        }
      }
    }
  }
