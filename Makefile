.PHONY: help deploy info build-presence clean logs status

deploy:
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
	kubectl --kubeconfig k8s/k8s-inf326-nyc1-kubeconfig-2.yaml delete -f k8s/deployment.yaml
	kubectl --kubeconfig k8s/k8s-inf326-nyc1-kubeconfig-2.yaml delete -f k8s/service.yaml
	kubectl --kubeconfig k8s/k8s-inf326-nyc1-kubeconfig-2.yaml delete -f k8s/autoscaling.yaml
	kubectl --kubeconfig k8s/k8s-inf326-nyc1-kubeconfig-2.yaml delete -f k8s/ingress.yaml

logs:
	kubectl --kubeconfig k8s/k8s-inf326-nyc1-kubeconfig-2.yaml logs -l app=presence-service -f --all-containers

status:
	@echo "-------------------------------------------------------------------------------------------------------"
	@echo ""
	kubectl --kubeconfig k8s/k8s-inf326-nyc1-kubeconfig-2.yaml get pods
	@echo ""
	@echo "-------------------------------------------------------------------------------------------------------"
	@echo ""
	kubectl --kubeconfig k8s/k8s-inf326-nyc1-kubeconfig-2.yaml get svc
	@echo ""
	@echo "-------------------------------------------------------------------------------------------------------"
	@echo ""
	kubectl --kubeconfig k8s/k8s-inf326-nyc1-kubeconfig-2.yaml get hpa
	@echo ""
	@echo "-------------------------------------------------------------------------------------------------------"
	@echo ""
	kubectl --kubeconfig k8s/k8s-inf326-nyc1-kubeconfig-2.yaml get ingress
	@echo ""
	@echo "-------------------------------------------------------------------------------------------------------"

build-api-gateway:
	docker build -t doorkaz/api-gateway:latest api-gateway/
	docker push doorkaz/api-gateway:latest

deploy-api-gateway:
	kubectl --kubeconfig k8s/k8s-inf326-nyc1-kubeconfig-2.yaml apply -f k8s/api-gateway-service.yaml
	kubectl --kubeconfig k8s/k8s-inf326-nyc1-kubeconfig-2.yaml apply -f k8s/api-gateway-deployment.yaml
	kubectl --kubeconfig k8s/k8s-inf326-nyc1-kubeconfig-2.yaml apply -f k8s/api-gateway-ingress.yaml

	@echo "API Gateway desplegado correctamente!"

clean-api-gateway:
	kubectl --kubeconfig k8s/k8s-inf326-nyc1-kubeconfig-2.yaml delete -f k8s/api-gateway-service.yaml
	kubectl --kubeconfig k8s/k8s-inf326-nyc1-kubeconfig-2.yaml delete -f k8s/api-gateway-deployment.yaml
	kubectl --kubeconfig k8s/k8s-inf326-nyc1-kubeconfig-2.yaml delete -f k8s/api-gateway-ingress.yaml