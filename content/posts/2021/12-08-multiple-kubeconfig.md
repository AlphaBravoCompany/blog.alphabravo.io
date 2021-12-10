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
author: Mike 'MJ' Johnson
code: 
  maxShownLines: 20
asciinema: true
---
<!--more-->

Scaling beyond managing a single Kubernetes cluster from the CLI get hard quickly. 

Even after digging in on the [official documentation](https://kubernetes.io/docs/tasks/access-application-cluster/configure-access-multiple-clusters/), we feel that the process is just too complex to use efficiently on a daily basis.

Luckily we have some tips and tools that should help you with that process.

## `kubeconfig` File Management

Let's start with managing our `kubeconfig` files. They need to be treated with care as they are literally the keys to your Kubernetes kingdom.

- Keep them SAFE! Store them in a secret vault or password manager. Lock them down with proper permissions on your systems. Don't share them publically (or even privately).
- Update them to be meaningful. Usually the `kubeconfig` files are output using the name `default` for everything, which is fine for a single cluster but does not work when trying to manage multiple files/clusters.
- Organize them on your system so they can be reused again and again. Some folks merge their Kubeconfigs and toss the originals. I think being able to regenerate that merged `kubeconfig` on-demand from the original sources is important.

## Updating the fields in your `kubeconfig`

The first thing we need to do is update the fields in each `kubeconfig` to be unique and meaningful.

Here is the `kubeconfig` with the often found `default` values:

```
apiVersion: v1
clusters:
- cluster:
    certificate-authority-data: fake-ca-file
    server: https://0.0.0.0:6443
  name: default
contexts:
- context:
    cluster: default
    user: default
  name: default
current-context: default
kind: Config
preferences: {}
users:
- name: default
  user:
    client-certificate-data: fake-cert-file
    client-key-data: fake-key-file

```

Here it is updated to be unique and descriptive:

```
apiVersion: v1
clusters:
- cluster:
    certificate-authority-data: fake-ca-file
    server: https://0.0.0.0:6443
  name: prod-cluster
contexts:
- context:
    cluster: prod-cluster
    user: admin@prod-cluster
  name: prod-cluster
current-context: prod-cluster
kind: Config
preferences: {}
users:
- name: admin@prod-cluster
  user:
    client-certificate-data: fake-cert-file
    client-key-data: fake-key-file
```

Once you have done this cleanup on all of your files and given them meaningful names, move them into the `~/.kube/` directory on your system.

## Welcome to Krew

Now that you have your `kubeconfig` files all in order, let's leverage some of the excellent `kubectl` tools that are out there.

Kubernetes [Krew](https://github.com/kubernetes-sigs/krew/) "is the package manager for kubectl plugins."

You can get started by [installing Krew here](https://krew.sigs.k8s.io/docs/user-guide/setup/install/).

I typically install it by running their included script on my system:

```bash
(
  set -x; cd "$(mktemp -d)" &&
  OS="$(uname | tr '[:upper:]' '[:lower:]')" &&
  ARCH="$(uname -m | sed -e 's/x86_64/amd64/' -e 's/\(arm\)\(64\)\?.*/\1\2/' -e 's/aarch64$/arm64/')" &&
  KREW="krew-${OS}_${ARCH}" &&
  curl -fsSLO "https://github.com/kubernetes-sigs/krew/releases/latest/download/${KREW}.tar.gz" &&
  tar zxvf "${KREW}.tar.gz" &&
  ./"${KREW}" install krew
)
```

And add the path export to the `~/.bashrc` file.
```bash
export PATH="${KREW_ROOT:-$HOME/.krew}/bin:$PATH"
```

Exit your shell and log back in, then run the following command to see if Krew is working.

```bash
kubectl krew version
```

Output:
```
OPTION            VALUE
GitTag            v0.4.2
GitCommit         6fcdb79
IndexURI          https://github.com/kubernetes-sigs/krew-index.git
BasePath          /root/.krew
IndexPath         /root/.krew/index/default
InstallPath       /root/.krew/store
BinPath           /root/.krew/bin
DetectedPlatform  linux/amd64

```

Now that we have Krew installed, we can install the specific plugins we are interested in for this excercise.

## Install `kubectx` and `kubens` with Krew

The 2 plugins that we will use are [`kubectx` and `kubens`](https://github.com/ahmetb/kubectx). They can be installed standalone, but I prefer to use them as part of Krew.

- `kubectx`: A tool to switch between contexts (clusters) on kubectl faster.
- `kubens` : A tool to switch between Kubernetes namespaces (and configure them for kubectl) easily.

You can follow the [install instructions here](https://github.com/ahmetb/kubectx#kubectl-plugins-macos-and-linux).

Run the following commands to install with KREW.
```bash
kubectl krew install ctx
kubectl krew install ns
```

Krew also has numerous other useful plugins. To view them all run:
```bash
kubectl krew search
```

## Install FZF (Optional)

FZF is not a necessary plugin, but it is recommended by `kubens` and `kubectx` to make selections a bit more intuitive.

Recommendation for FZF by the `kubectx` and `kubens` dev [here](https://github.com/ahmetb/kubectx#interactive-mode).

Install instructions for FZF [here](https://github.com/junegunn/fzf#installation).

```bash
git clone --depth 1 https://github.com/junegunn/fzf.git ~/.fzf
~/.fzf/install
```
You will need to close your shell and log back in for this to work.

## Merging `kubeconfig` files

This part is highly opinionated. This what works for me, but I am interested to hear if you know of a better / more efficient way!

All kubeconfig files should be in your `~/.kube/` directory for this and properly named / sanitized (per above).

```
root@rke2-test:~# ls ~/.kube -lah
total 44K
drwxr-xr-x  2 root root 4.0K Dec  9 18:24 .
drwx------ 10 root root 4.0K Dec  8 18:26 ..
-rw-r--r--  1 root root  15K Dec  9 18:24 config
-rw-r--r--  1 root root 3.0K Dec  9 18:20 dev-cluster
-rw-r--r--  1 root root 3.0K Dec  9 18:17 prod-cluster
-rw-r--r--  1 root root 3.0K Dec  9 18:21 qa-cluster
-rw-------  1 root root 3.0K Dec  9 18:13 rke2-homelab
-rw-r--r--  1 root root 3.0K Dec  9 18:21 test-cluster
```

Next, will use kubeconfig to merge all of the files we want (in this case I use every `kubeconfig` file) into a single file at `~/.kube/config`. Since this is the default location where `kubectl` looks, we dont need to update our `KUBECONFIG` variable anymore.

```
KUBECONFIG=~/.kube/rke2-homelab:~/.kube/prod-cluster:~/.kube/dev-cluster:~/.kube/qa-cluster:~/.kube/test-cluster \
kubectl config view --flatten > tmp && mv tmp ~/.kube/config
```

Now if we were to look at our `~/.kube/config` file, we would see all the separate files merged into one (Click the arrow next to YAML to expand):

```yaml
apiVersion: v1
clusters:
- cluster:
    certificate-authority-data: fake-ca-file
    server: https://127.0.0.3:6443
  name: dev-cluster
- cluster:
    certificate-authority-data: fake-ca-file
    server: https://127.0.0.2:6443
  name: prod-cluster
- cluster:
    certificate-authority-data: fake-ca-file
    server: https://127.0.0.4:6443
  name: qa-cluster
- cluster:
    certificate-authority-data: fake-ca-file
    server: https://127.0.0.1:6443
  name: rke2-homelab
- cluster:
    certificate-authority-data: fake-ca-file
    server: https://127.0.0.5:6443
  name: test-cluster
contexts:
- context:
    cluster: dev-cluster
    user: dev-cluster
  name: dev-cluster
- context:
    cluster: prod-cluster
    user: prod-cluster
  name: prod-cluster
- context:
    cluster: qa-cluster
    user: qa-cluster
  name: qa-cluster
- context:
    cluster: rke2-homelab
    user: rke2-homelab
  name: rke2-homelab
- context:
    cluster: test-cluster
    user: test-cluster
  name: test-cluster
current-context: rke2-homelab
kind: Config
preferences: {}
users:
- name: dev-cluster
  user:
    client-certificate-data: fake-cert-file
    client-key-data: fake-key-file
- name: prod-cluster
  user:
    client-certificate-data: fake-cert-file
    client-key-data: fake-key-file
- name: qa-cluster
  user:
    client-certificate-data: fake-cert-file
    client-key-data: fake-key-file
- name: rke2-homelab
  user:
    client-certificate-data: fake-cert-file
    client-key-data: fake-key-file
- name: test-cluster
  user:
    client-certificate-data: fake-cert-file
    client-key-data: fake-key-file

```

## Using `kubectx` and `kubens`

Now that we have our files all merged, we can start easily switching contexts and namespaces with `kubectx` and `kubens`.

- Swith to the prod cluster:
```
kubectl ctx prod-cluster
# Switched to context "prod-cluster".
```

- Switch to the dev cluster:
```
kubectl ctx dev-cluster
# Switched to context "dev-cluster".
```

- Get a selectable list of clusters you can switch to (if you instaled FZF):
```
kubectl ctx
```

- Switch to a the cattle-system namespace on the prod-cluster:
```
kubectl ctx prod-cluster
kubectl ns cattle-system
```

## Closing

Hopefully this blog helps you get a handle on the your ever growing list of Kubernetes clusters that you are managing. 

We recommend using [Rancher](https://rancher.com/products/rancher) if you want a powerful Web UI to manage your clusters, but sometimes the CLI is necessary.

If you have any questions or would like AlphaBravo's assistance in building production-grade Kubernetes clusters,  please reach out to us at info@alphabravo.io.

Thanks for reading!

---

*The AB Engineering Team*

**Website:** https://alphabravo.io

**Contact Us:** https://alphabravo.io/contact-us