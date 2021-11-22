---
title: "Rancher Multi-Cluster Management UI"
slug: "rancher-multi-cluster-management-ui"
date: 2021-11-17T13:00:00Z
draft: false
featuredImage: /assets/rancher-ui-full.png
featuredImagePreview: /assets/rancher-ui-small.png
---
## What is Rancher Multi-Cluster Management

If you have ventured into container management and Kubernetes for your organization (or even for yourself), you have quickly realized that you need a robust way to manage more than one cluster easily. In fact, you probably want an easier way to manage a single cluster.

The official Kubernetes dashboard is... sub-optimal. There are a few other open-source options out there, but they lack in many areas. So what are we supposed to do?

```
# Rancher has entered the chat.
```

This is where the Rancher UI, or [Rancher Multi-Cluster Manager](https://rancher.com/products/rancher) (Rancher MCM) comes into play.

As engineers responsible for a plethora of technologies, even just drilling down into Kubernetes space we usually have:

- A local Kubernetes cluster (k3d, k3s on a Raspberry Pi, or similar)
- 1-2 Dev clusters
- 1-N Test, QA, etc clusters
- 1-N Production clusters

On each of those clusters we need:

- Monitoring & Alerting
- Logging
- Backups
- Direct access to Pod console and logs
- Simplified deployment capabilities (Helm, etc) into each
- Quick view into the health of the cluster
- Much more

This presents a problem because our time is already fragmented enough. We really need a unified interface that not only lowers the barrier to entry for less experienced Kubernetes users but also simplifies cluster and app administration for our fragmented attention.

---

![Rancher 2.6 - Create Cluster UI](/assets/rancher-mcm-cluster-support.png)

---

## What Can Rancher MCM Do?

Rancher MCM has numerous capabilities that will make the developer, infrastructure, security and cluster-administrators life much easier.

Some of the key features of Rancher MCM are:

- Certified Distritbution Support: Rancher supports any certified Kubernetes distribution. For on-premises workloads, we offer the RKE. For the public cloud, we support all the major distributions, including EKS, AKS, and GKE. For edge, branch and desktop workloads we offer K3s, a certified lightweight distribution of Kubernetes. 

- Simplified Cluster Operations: Rancher provides simple, consistent cluster operations including provisioning, version management, visibility and diagnostics, monitoring and alerting, and centralized audit. 

- Security, Policy and User Management: Rancher lets you automate processes and applies a consistent set of user access and security policies for all your clusters, no matter where they’re running.

- Shared Tools and Services: Rancher provides a rich catalog of services for building, deploying and scaling containerized applications, including app packaging, CI/CD, logging, monitoring and service mesh.

---


![](/assets/rancher-platform.png)

---

## Deploying Rancher MCM

There are 2 primary ([well-documented](https://rancher.com/docs/rancher/v2.6/en/installation/)) ways that we generally deploy Rancher MCM.

### Single Host on Docker (Non HA)

- [Docker Install](https://rancher.com/docs/rancher/v2.6/en/installation/other-installation-methods/single-node-docker/)
- [Docker Advanced Options](https://rancher.com/docs/rancher/v2.6/en/installation/other-installation-methods/single-node-docker/advanced/)

There are many scenarios where we need to stand up a temporary or demo instance of Rancher. While the production, highly available method is to deploy the Helm chart onto a HA Kubernetes cluster, the simplest way to get started is to deploy Rancher as a Docker container.

Before you start, make sure you have a modern Linux distro running with a recent version of Docker running.

The simple command which includes local persistent storage is:

```bash
docker run -d --restart=unless-stopped \
  -p 80:80 -p 443:443 \
  -v /opt/rancher:/var/lib/rancher \
  --privileged \
  rancher/rancher:latest

```

If you are running this on a public server, you can also automatically deploy this and get a valid SSL certificate from Let's Encrypt using the following command.

Make sure that the following is configured:

- Open port 80 from the internet to your server
- Configure the <YOUR.DNS.NAME> that you enter below to point to the public IP of your server

```bash
docker run -d --restart=unless-stopped \
  -p 80:80 -p 443:443 \
  -v /opt/rancher:/var/lib/rancher \
  --privileged \
  rancher/rancher:latest
  --acme-domain <YOUR.DNS.NAME>

```

Check out the documentation for additional advanced deployment options for the Rancher Single Node Docker Install

*Fun Fact: The Docker Install actually deploys a K3d Single Node Cluster under to the hood to run the Rancher MCM UI on top of*

### HA Deployment of Kubernetes

- [Rancher on K8s](https://rancher.com/docs/rancher/v2.6/en/installation/install-rancher-on-k8s/)
- [Docker Advanced Options](https://rancher.com/docs/rancher/v2.6/en/installation/other-installation-methods/single-node-docker/advanced/)

Assuming you have a HA (at least 3 master node) Kubernetes cluster up and running already, you can deploy Rancher on top of that to provide you with a HA deployment of you Rancher MCM. In this instance, we will use the Rancher self generated SSL cert, but you can refer to the docs for apply your own SSL certificates.

Before you get started you will need:

- A HA Kubernetes Cluster. Any one will do.
- Helm installed locally

First, you need to install cert-manager in your cluster:

```bash
# If you have installed the CRDs manually instead of with the `--set installCRDs=true` option added to your Helm install command, you should upgrade your CRD resources before upgrading the Helm chart:
kubectl apply -f https://github.com/jetstack/cert-manager/releases/download/v1.5.1/cert-manager.crds.yaml

# Add the Jetstack Helm repository
helm repo add jetstack https://charts.jetstack.io

# Update your local Helm chart repository cache
helm repo update

# Install the cert-manager Helm chart
helm install cert-manager jetstack/cert-manager \
  --namespace cert-manager \
  --create-namespace \
  --version v1.5.1

```

We can verify cert-manager is installed by running:
```bash
kubectl get pods --namespace cert-manager
```

Next, we can install Rancher:
```bash
# Add the Rancher Helm repository
helm repo add rancher-stable https://releases.rancher.com/server-charts/stable

# Create the Rancher Namespace
kubectl create namespace cattle-system

# Install the Rancher Helm chart
helm install rancher rancher-stable/rancher \
  --namespace cattle-system \
  --set hostname=rancher.my.org \
  --set bootstrapPassword=admin
```

We can verify our rancher deployment using the following command:
```bash
kubectl -n cattle-system rollout status deploy/rancher
```

Now you should be able to visit `https://rancher.my.org` and access the cluster.

You can now begin to import additional clusters, select existing clusters to explore and deploy new resources.

Here are some videos to get you started with the Rancher 2.6 Interface:

- [Rancher Online Meetup - September 2021 - Introducing SUSE Rancher 2.6](https://www.youtube.com/watch?v=e3qbjX8StvU)
- [What's New in Rancher 2.6?](https://www.youtube.com/watch?v=_dn4c9j7LUo)
- [Rancher 2.6 UI Walkthrough and Q&A](https://www.youtube.com/watch?v=bpc-z1GMivA&t=4410s)

### Rancher MCM - Final Words

Hopefully, this post provided you with some insight into how valuable the Rancher MCM UI can be to your organization and helped you get started deploying it into your environment.

Please reach out to us if you have any questions regarding installing Rancher or if you need any help running your DevSecOps systems.

Thanks for reading!

---

*The AB Engineering Team*

**Website:** https://alphabravo.io

**Contact Us:** https://alphabravo.io/contact-us
