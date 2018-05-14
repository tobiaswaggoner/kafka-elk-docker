kubectl apply -f k8s/zookeeper.yml
kubectl apply -f k8s/zookeeper-service.yml

kubectl apply -f k8s/zookeeper-ui.yml
kubectl apply -f k8s/zookeeper-ui-service.yml

kubectl apply -f k8s/kafka-cluster.yml
kubectl apply -f k8s/kafka-service.yml

kubectl apply -f k8s/kafka-test-client.yml
kubectl apply -f k8s/kafka-test-client-service.yml

kubectl apply -f k8s/kafka-ui.yml
kubectl apply -f k8s/kafka-ui-service.yml

kubectl apply -f k8s/elastic-search.yml
kubectl apply -f k8s/elastic-search-service.yml

kubectl apply -f k8s/kibana.yml
kubectl apply -f k8s/kibana-service.yml