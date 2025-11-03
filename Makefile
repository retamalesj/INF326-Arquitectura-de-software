.PHONY: help deploy info build-presence clean logs status

deploy:
	kubectl --kubeconfig k8s/k8s-inf326-nyc1-kubeconfig-2.yaml apply -f k8s/mongodb.yaml
	kubectl --kubeconfig k8s/k8s-inf326-nyc1-kubeconfig-2.yaml apply -f k8s/rabbitmq.yaml
	kubectl --kubeconfig k8s/k8s-inf326-nyc1-kubeconfig-2.yaml apply -f k8s/service.yaml
	kubectl --kubeconfig k8s/k8s-inf326-nyc1-kubeconfig-2.yaml apply -f k8s/deployment.yaml
	kubectl --kubeconfig k8s/k8s-inf326-nyc1-kubeconfig-2.yaml apply -f k8s/autoscaling.yaml
	kubectl --kubeconfig k8s/k8s-inf326-nyc1-kubeconfig-2.yaml apply -f k8s/ingress.yaml

	@echo "Desplegado correctamente!"

info:
	kubectl --kubeconfig k8s/k8s-inf326-nyc1-kubeconfig-2.yaml cluster-info

build-presence:
	docker build -t doorkaz/presence-service:latest Presencia/
	docker push doorkaz/presence-service:latest

clean:
	kubectl --kubeconfig k8s/k8s-inf326-nyc1-kubeconfig-2.yaml delete -f k8s/mongodb.yaml
	kubectl --kubeconfig k8s/k8s-inf326-nyc1-kubeconfig-2.yaml delete -f k8s/deployment.yaml
	kubectl --kubeconfig k8s/k8s-inf326-nyc1-kubeconfig-2.yaml delete -f k8s/service.yaml
	kubectl --kubeconfig k8s/k8s-inf326-nyc1-kubeconfig-2.yaml delete -f k8s/autoscaling.yaml
	kubectl --kubeconfig k8s/k8s-inf326-nyc1-kubeconfig-2.yaml delete -f k8s/ingress.yaml

logs:
	kubectl --kubeconfig k8s/k8s-inf326-nyc1-kubeconfig-2.yaml logs -l app=presence-service -f --all-containers

status:
	kubectl --kubeconfig k8s/k8s-inf326-nyc1-kubeconfig-2.yaml get pods
	kubectl --kubeconfig k8s/k8s-inf326-nyc1-kubeconfig-2.yaml get svc
	kubectl --kubeconfig k8s/k8s-inf326-nyc1-kubeconfig-2.yaml get hpa
	kubectl --kubeconfig k8s/k8s-inf326-nyc1-kubeconfig-2.yaml get ingress
