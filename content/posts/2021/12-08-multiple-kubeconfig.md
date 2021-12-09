---
title: "Zero To Hero: Working With Multiple KUBECONFIGs"
description: "We show you how to manage and work with multiple KUBECONFIG files from the comfort of the Linux CLI."
slug: "zero-to-hero-working-with-multiple-kubeconfig"
date: 2021-12-08T13:00:00Z
draft: true
featuredImage: /assets/2021/12/multiple-kubeconfig-full.png
featuredImagePreview: /assets/2021/12/multiple-kubeconfig-full.png
images: [/assets/2021/12/multiple-kubeconfig-social.png]
seo:
  images: [/assets/2021/12/multiple-kubeconfig--social.png]
lightgallery: true
tags: [kubernetes, kubeconfig, krew]
author: AB Engineering
---
<!--more-->

## Install KREW

https://github.com/kubernetes-sigs/krew/

https://krew.sigs.k8s.io/docs/user-guide/setup/install/

(
  set -x; cd "$(mktemp -d)" &&
  OS="$(uname | tr '[:upper:]' '[:lower:]')" &&
  ARCH="$(uname -m | sed -e 's/x86_64/amd64/' -e 's/\(arm\)\(64\)\?.*/\1\2/' -e 's/aarch64$/arm64/')" &&
  KREW="krew-${OS}_${ARCH}" &&
  curl -fsSLO "https://github.com/kubernetes-sigs/krew/releases/latest/download/${KREW}.tar.gz" &&
  tar zxvf "${KREW}.tar.gz" &&
  ./"${KREW}" install krew
)

#add to ~/.bashrc
export PATH="${KREW_ROOT:-$HOME/.krew}/bin:$PATH"

kubectl krew version


## Install FZF

https://github.com/junegunn/fzf#installation

git clone --depth 1 https://github.com/junegunn/fzf.git ~/.fzf
~/.fzf/install


## INSTALL KREW PLUGINS

https://github.com/ahmetb/kubectx#kubectl-plugins-macos-and-linux

kubectl krew install ctx
kubectl krew install ns


## MERGE KUBECONFIGS

https://www.starkandwayne.com/blog/silly-kubectl-trick-7-merge-all-the-kubeconfigs/

export KUBECONFIG=~/.kube/rke2:~/.kube/k3s 

kubectl config view --raw > tmp \
&& mv tmp config

## Closing

Based on the instructions in the "Single Node RKE2" blogs, you should now have a solid foundation cluster for running, monitoring, and logging workloads on Kubernetes.

Deploying RKE2 or K3s as a highly available, multi-node, production-ready setup involves quite a few more steps. But this guide hopefully gives you the starting point and confidence to go start building that out for yourself or your organization.

If you have any questions or would like AlphaBravo's assistance in building production-grade Kubernetes clusters,  please reach out to us at info@alphabravo.io.

Thanks for reading!

---

*The AB Engineering Team*

**Website:** https://alphabravo.io

**Contact Us:** https://alphabravo.io/contact-us