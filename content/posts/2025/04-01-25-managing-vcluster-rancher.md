---
title: "K3s, Rancher, and vCluster: Your Kubernetes Management Dream Team"
description: "A guide to setting up K3s, Rancher MCM, and vCluster for efficient Kubernetes management."
slug: "k3s-rancher-vcluster"
date: 2025-04-01T09:00:00Z
draft: false
featuredImage: /assets/2025/04/04-01-25-rancher-vcluster.jpg
featuredImagePreview: /assets/2025/04/04-01-25-rancher-vcluster.jpg
featuredImageAlt: "K3s, Rancher, and vCluster"
images: ["/assets/2025/04/04-01-25-rancher-vcluster.jpg"]
seo:
  images: ["/assets/2025/04/04-01-25-rancher-vcluster.jpg"]
lightgallery: true
tags: [devsecops, kubernetes, etcd, k3s]
author: AB Engineering
---
<!--more-->

Kubernetes can sometimes feel like trying to keep track of octopus tentacles during an earthquake. Thankfully, we have a trio of technologies that work together to make your life easier. Let's dive into how to deploy K3s, get Rancher MCM running, set up vCluster operator, and create virtual clusters that would make even hardcore Kubernetes enthusiasts smile.

## The Perfect Lightweight Kubernetes: K3s

K3s is essentially Kubernetes after an intensive CrossFit program - all the power with none of the bloat. At under 70MB, it's the lean, mean Kubernetes machine built for edge computing and resource-constrained environments.

Getting K3s up and running is refreshingly simple:

```bash
curl -sfL https://get.k3s.io | INSTALL_K3S_VERSION=v1.30.10+k3s1 K3S_TOKEN=supersecrettoken sh -s - server \
  --cluster-init \
  --tls-san=YOURSERVERIP \
  --disable=traefik
# Check for Ready node (takes ~30 seconds)
sudo k3s kubectl get node
cp /etc/rancher/k3s/k3s.yaml ~/.kube/config
```

That's it! No 27-step installation process or arcane configuration files. If you blinked, you might have missed it.

Note: We pinned the version of K3s to v1.30.10+k3s1 to ensure stability. Don't use the latest version unless you're ready for some unexpected surprises.

## Accessing Rancher the K3s Cluster - Ingress

We need to setup ingress to access the Rancher UI. We prefer to use ingress-nginx for this.

```bash
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.12.1/deploy/static/provider/cloud/deploy.yaml
```

## Rancher MCM: The Kubernetes Control Tower

Rancher Multi-Cluster Management is like having a universal remote for all your Kubernetes clusters. It gives you that "single pane of glass" that management loves to hear about in presentations.

Before diving into Rancher installation, we need Helm - the package manager that makes Kubernetes slightly less hair-pulling:

```bash
# Install Helm
curl -fsSL -o get_helm.sh https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3
chmod 700 get_helm.sh
./get_helm.sh
```

## Installing Cert-Manager

Cert-Manager is a Kubernetes controller that manages TLS certificates in a cluster. Rancher requires it to be installed.

```bash
# If you have installed the CRDs manually, instead of setting `installCRDs` or `crds.enabled` to `true` in your Helm install command, you should upgrade your CRD resources before upgrading the Helm chart:
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.17.1/cert-manager.crds.yaml

# Add the Jetstack Helm repository
helm repo add jetstack https://charts.jetstack.io

# Update your local Helm chart repository cache
helm repo update

# Install the cert-manager Helm chart
helm install cert-manager jetstack/cert-manager \
  --namespace cert-manager \
  --create-namespace \
  --set crds.enabled=true
```

Now for the main event - installing Rancher:

```bash
# Add the Rancher repo
helm repo add rancher-stable https://releases.rancher.com/server-charts/stable
helm repo update

# Create namespace for Rancher
kubectl create namespace cattle-system

# Install Rancher
helm install rancher rancher-stable/rancher \
  --namespace cattle-system \
  --set hostname=YOUR-SERVER-IP-ADDRESS.sslip.io \
  --set bootstrapPassword=SOME_SECRET_PASSWORD
  --set ingress.ingressClassName=nginx
```

Once installed, you can access the Rancher UI by navigating to `https://YOUR-SERVER-IP-ADDRESS.sslip.io` and logging in with `admin` and the password you set during installation.

Congratulations! You now have a beautiful Rancher UI to manage your Kubernetes empire.

## vCluster Operator: Virtual Kubernetes Magic

vCluster is like apartment buildings for your Kubernetes workloads - separate living spaces sharing the same foundation. The vCluster operator makes this magic happen.

To install vCluster Rancher Operator, you can add the loft repository to Rancher and install the vCluster Rancher Operator chart in the local cluster.

1. Select the local cluster in the Rancher clusters overview page.
2. In the sidebar, navigate to "Apps" -> "Repositories".
3. Select "Create".
4. Set the name to any value and the Index URL to https://charts.loft.sh.
5. (Optional) if you want to install pre-release versions you must select the user icon in the top right, then navigate to "Preferences". Scroll down and select "Include Prerelease Versions".
6. In the sidebar, navigate to "Apps" -> "Charts".
7. Find and select the "vCluster Rancher Operator" chart.
8. Follow the installation process and install the chart.
9. In the sidebar, navigate to "Workloads" -> "Deployments". Confirm that the deployment named "vcluster-rancher-operator" has the State "Active".

Once the operator is installed, all vClusters deployed in any downstream cluster in rancher will cause a corresponding Rancher cluster to be created, the vCluster to connect to the corresponding Rancher cluster, and cluster owners added.

## vCluster Rancher Extension: Bringing It All Together

The vCluster Rancher Extension seamlessly integrates vCluster functionality into Rancher's UI, making virtual clusters as easy to manage as regular ones.

To install:

1. In the Rancher UI, click on the Extensions in the left side menu. Click on the ellipsis menu on the top right and select Manage Repositories.
2. Click on Create on the right. Give the repository a name and enter https://charts.loft.sh/ as the Index URL.
3. Click on Create at the bottom.
4. Navigate back to the Extensions page and click on Available tab. Click Install on the extension named vCluster Rancher Extension UI.

## Deploying and Managing vClusters in Rancher

Now for the really fun part - creating virtual clusters through Rancher!

### Creating a vCluster

1. There are multiple ways to create a vCluster from the Rancher UI :
* Rancher homepage -> Create vCluster
* Rancher Cluster management page --> Create cluster
* vCluster List page left side menu --> Create vCluster
2. From the dropdown menu, choose the host cluster where you'd like to deploy your virtual cluster.
3. If the charts.loft.sh repository isn't already configured on your selected cluster, you'll be given the option to add it automatically or manually.
* If you choose to add it manually, click on Create on the right. Give the repository a name and enter https://charts.loft.sh/ as the Index URL.
4. Select your preferred vCluster version from the available options.
5. Specify a namespace and name for your virtual cluster, then click Create vCluster to begin the deployment.
6. Select vCluster List page left side menu to view the created vCluster
7. The vCluster should show up as a regular downstream cluster in Rancher and be available in the left side menu
8. Click on the vCluster to navigate to Cluster explorer page to use the cluster.

![rancher-vcluster.png](/assets/2025/04/04-09-25-rancher-vcluster1.png)

### Managing Your vCluster Empire

Once created, you can manage your virtual clusters just like regular ones - deploy apps, view logs, and generally feel like a Kubernetes wizard.

If your excitement wears off and you need to delete a vCluster:

1. In Rancher, navigate to "Cluster Management", click the 3 dots next to the cluster name and click "Delete" for the virtual cluster
2. Confirm deletion, and poof! It's gone

## Kubernetes Virtualization: The Future Is Now

With this setup, you've built a powerful platform for Kubernetes management that even Marie Kondo would appreciate - everything has its place, and there's a place for everything. Your DevOps team will thank you (maybe), your resource utilization will improve, and your ability to isolate workloads will reach new heights.

Remember that with K3s, Rancher, and vCluster working together, you're not just managing Kubernetes - you're experiencing it the way it was always meant to be: powerful, flexible, and only moderately anxiety-inducing.

Next time someone asks "Can you spin up a new Kubernetes environment for my project?" you can smile knowing you're just a few clicks away from making their day... and keeping your sanity intact.

Happy clustering, and may your pods always be Running, your nodes Ready, and your coffee strong!

## Links

* [Rancher](https://rancher.com/)
* [K3s](https://k3s.io/)
* [vCluster Operator](https://github.com/loft-sh/vcluster-rancher-operator)
* [vCluster Rancher Extension](https://github.com/loft-sh/vcluster-rancher-extension)
* [vCluster Platform](https://vcluster.sh/platform/)
