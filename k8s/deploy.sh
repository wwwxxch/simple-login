#!/bin/bash

kubectl apply -f app-secret.yaml

kubectl apply -f db-deploy.yaml
kubectl apply -f db-service.yaml

kubectl apply -f app-deploy.yaml
kubectl apply -f app-service.yaml

echo "done"