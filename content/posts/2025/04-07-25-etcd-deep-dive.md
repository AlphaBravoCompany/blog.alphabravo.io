---
title: "ETCD and Kubernetes: A Deep Dive with K3s - Where Your Cluster's Secrets Hide"
description: "A beginner's guide to etcd and Kubernetes with K3s."
slug: "etcd-k3s-deep-dive"
date: 2025-04-06T09:00:00Z
draft: false
featuredImage: /assets/2025/04/04-07-25-k3s-etcd.jpg
featuredImagePreview: /assets/2025/04/04-07-25-k3s-etcd.jpg
featuredImageAlt: "K3s and ETCD"
images: ["/assets/2025/04/04-07-25-k3s-etcd.jpg"]
seo:
  images: ["/assets/2025/04/04-07-25-k3s-etcd.jpg"]
lightgallery: true
tags: [devsecops, kubernetes, etcd, k3s]
author: AB Engineering
---
<!--more-->

Before diving into the fascinating world of Kubernetes' memory bank (aka etcd), let me quickly summarize the key findings from this exploration. Etcd serves as the brain behind your Kubernetes cluster's operations, storing critical configuration data and state information. When integrated with K3s, it offers a lightweight yet powerful solution for maintaining cluster continuity. Through direct interaction with etcd using etcdctl, we can glimpse the inner workings of Kubernetes' decision-making processes and even manipulate stored values – though with great power comes great responsibility (and potential cluster chaos).

## What is ETCD and Why Should You Care?

In the grand theater of Kubernetes orchestration, etcd plays the unsung hero - the meticulous record-keeper responsible for storing every configuration detail, state record, and metadata that makes your cluster tick. Without etcd, your Kubernetes cluster would suffer from a severe case of digital amnesia, unable to remember what containers should be running where, or which services are mapped to which endpoints.

While etcd wasn't specifically built for Kubernetes (it was actually created by the folks at CoreOS for their distributed systems), it's been enthusiastically adopted by the Kubernetes community like that one exchange student everyone immediately befriends. Its distributed key-value architecture makes it perfect for the high-availability, consistency-focused needs of container orchestration.

As one of my mentors once quipped, "If your containers are the actors, and Kubernetes is the director, then etcd is the script supervisor making sure nobody forgets their lines."

## K3s and ETCD: The Lightweight Dynamic Duo

Unlike its more resource-hungry cousins, K3s offers a refreshingly svelte approach to Kubernetes. One of its standout features is the flexibility to choose your datastore poison. You can opt for:

- **Embedded SQLite**: Perfect for single-node setups when you're just testing things out on that Raspberry Pi gathering dust in your drawer. Note: As reliable as your memory after an all-night deployment session when you try to scale beyond one server.

- **Embedded etcd**: The high-availability option we're exploring today. Automatically activated when you configure K3s to initialize a cluster. It's like SQLite but with friends it can talk to.

- **External Databases**: For the enterprise folks who already have a dedicated database team glaring at you for not using their "perfectly optimized" MySQL setup.

Today, we're focusing on the embedded etcd option because, let's face it, we want our Kubernetes to be both lightweight AND resilient - like a marathon runner who can also deadlift.

## Prerequisites

Before we embark on this journey of etcd enlightenment, you should be familiar with:

- Basic Kubernetes concepts (pods, nodes, clusters) - if "kubectl" sounds like a noise your cat makes when coughing up a hairball, you might want to brush up first
- Command-line familiarity (if you get anxious seeing a blinking cursor, this might be challenging)
- Basic understanding of etcd as a distributed key-value store
- K3s installed or ready to install (we'll help with that)
- Your favorite caffeinated beverage (troubleshooting distributed systems is thirsty work)

## Setting Up K3s with Embedded Etcd

Let's get our hands dirty with a properly configured K3s cluster using embedded etcd. For high availability, etcd clusters need an odd number of server nodes to maintain quorum. Remember the old saying: "In the land of distributed consensus, three nodes are better than two, and five is better than four."

### Step 1: Start Your First K3s Server with Embedded Etcd

```bash
curl -sfL https://get.k3s.io | K3S_TOKEN=supersecrettoken sh -s - server \
  --cluster-init \
  --tls-san=YOURSERVERIP
```

The `--cluster-init` flag is where the magic happens - it tells K3s to initialize a new cluster using embedded etcd instead of the default SQLite database. Like choosing the deluxe package at a car wash, it's a small option with significant benefits.

### Step 2: Verify K3s is Running

```bash
sudo k3s kubectl get nodes
```

You should see your server node with roles that include 'master' and 'etcd', proudly displaying its dual citizenship in the land of Kubernetes.

### Step 3: Installing etcdctl (The Skeleton Key to Your Cluster's Data)

K3s, in its quest for minimalism, doesn't include etcdctl. Like those "assembly required" furniture pieces that don't include the required tools, we need to bring our own:

```bash
ETCD_VERSION="v3.5.5"
ETCD_URL="https://github.com/etcd-io/etcd/releases/download/${ETCD_VERSION}/etcd-${ETCD_VERSION}-linux-amd64.tar.gz"
curl -sL ${ETCD_URL} | sudo tar -zxv --strip-components=1 -C /usr/local/bin
```

This downloads and installs etcdctl, our Swiss Army knife for etcd interactions.

## Peeking Inside ETCD: Where Kubernetes Stores Its Secrets

Now that we have our etcdctl ready, let's use it to peek into the heart of our Kubernetes cluster. Accessing etcd data requires proper credentials - it's not giving up its secrets to just anyone.

### Step 4: Verifying Your etcdctl Installation

First, let's check that our etcdctl is properly installed:

```bash
sudo etcdctl version \
  --cacert=/var/lib/rancher/k3s/server/tls/etcd/server-ca.crt \
  --cert=/var/lib/rancher/k3s/server/tls/etcd/client.crt \
  --key=/var/lib/rancher/k3s/server/tls/etcd/client.key
```

If all goes well, you'll see the version information - your backstage pass is working.

### Step 5: Retrieving All Keys from ETCD

Let's see what secrets our cluster is keeping:

```bash
sudo etcdctl \
  --endpoints=https://127.0.0.1:2379 \
  --cacert=/var/lib/rancher/k3s/server/tls/etcd/server-ca.crt \
  --key=/var/lib/rancher/k3s/server/tls/etcd/client.key \
  --cert=/var/lib/rancher/k3s/server/tls/etcd/client.crt \
  get / --prefix --keys-only
```

This command is like opening the filing cabinet of Kubernetes. The `--prefix` flag tells etcdctl to show all keys under the specified path, while `--keys-only` keeps things tidy by showing just the keys without their values.

You'll likely see a treasure trove of keys, many starting with `/registry/` - that's Kubernetes' organizational system at work.

### Step 6: Focusing on Pod Data

To zoom in on just pod-related information:

```bash
sudo etcdctl \
  --endpoints=https://127.0.0.1:2379 \
  --cacert=/var/lib/rancher/k3s/server/tls/etcd/server-ca.crt \
  --key=/var/lib/rancher/k3s/server/tls/etcd/client.key \
  --cert=/var/lib/rancher/k3s/server/tls/etcd/client.crt \
  get /registry/pods --prefix --keys-only
```

Now you're looking at the addresses where Kubernetes stores information about every pod in your cluster. It's like having the building directory for your containerized applications.

## Playing with Fire: Storing and Retrieving Custom Values

Let's have some fun (the responsible sysadmin kind of fun) by storing and retrieving our own values in etcd.

### Step 7: Storing a Custom Value

```bash
sudo etcdctl \
  --endpoints=https://127.0.0.1:2379 \
  --cacert=/var/lib/rancher/k3s/server/tls/etcd/server-ca.crt \
  --key=/var/lib/rancher/k3s/server/tls/etcd/client.key \
  --cert=/var/lib/rancher/k3s/server/tls/etcd/client.crt \
  put name k3s-wizard
```

If successful, etcd will respond with "OK" - its way of saying "I've recorded your note in the cosmic ledger of Kubernetes".

### Step 8: Retrieving Our Custom Value

```bash
sudo etcdctl \
  --endpoints=https://127.0.0.1:2379 \
  --cacert=/var/lib/rancher/k3s/server/tls/etcd/server-ca.crt \
  --key=/var/lib/rancher/k3s/server/tls/etcd/client.key \
  --cert=/var/lib/rancher/k3s/server/tls/etcd/client.crt \
  get name
```

This should return "k3s-wizard", confirming our data survived its journey to and from etcd.

## Living Dangerously: Command Variations and Their Consequences

Now, let's experiment with modified commands to understand the security mechanisms protecting our etcd data. Warning: This is like removing safety guardrails to see what happens - educational but potentially messy.

### Variation 1: Removing the Certificate

If we try without the certificate:

```bash
sudo etcdctl \
  --endpoints=https://127.0.0.1:2379 \
  --cacert=/var/lib/rancher/k3s/server/tls/etcd/server-ca.crt \
  --key=/var/lib/rancher/k3s/server/tls/etcd/client.key \
  get name
```

You'll likely meet etcd's bouncer: a connection error. The certificate is your VIP pass, and without it, you're not getting past the velvet rope.

### Variation 2: Skipping the Endpoint

Interestingly, if we run the command from within the server node, we might be able to omit the endpoint:

```bash
sudo etcdctl \
  --cacert=/var/lib/rancher/k3s/server/tls/etcd/server-ca.crt \
  --key=/var/lib/rancher/k3s/server/tls/etcd/client.key \
  --cert=/var/lib/rancher/k3s/server/tls/etcd/client.crt \
  get name
```

This works because etcdctl defaults to localhost:2379 when no endpoint is specified. It's like not having to tell your GPS your current location.

## Checking If You're Running with Embedded Etcd

If you inherited a cluster and aren't sure if it's using embedded etcd, here's how to check:

```bash
sudo journalctl -u k3s.service --no-pager | grep "database"
```

If you see messages about "Running embedded etcd" or "Defragmenting etcd database," congratulations! You're in the etcd club.

Alternatively:

```bash
sudo ls -l /var/lib/rancher/k3s/server/db/
```

If you see an `etcd` directory rather than just a `k3s.db` file, you're running with embedded etcd.

## Conclusion: ETCD - The Unsung Hero of Your K3s Cluster

Throughout this journey into the heart of Kubernetes data storage, we've seen how etcd serves as the reliable backbone of cluster state management. We've learned how to:

- Set up K3s with embedded etcd for better reliability
- Install and use etcdctl to interact directly with the etcd datastore
- Retrieve, store, and manage data in etcd
- Navigate the security mechanisms protecting your cluster's most sensitive information
- Verify which datastore your K3s cluster is using

Remember, etcd is like the black box flight recorder of your Kubernetes cluster - it knows everything that's happening, but needs special tools to reveal its secrets. With the knowledge you've gained today, you're now equipped to both understand and manipulate this critical component of your Kubernetes infrastructure.

As one wise DevOps engineer once said, "Those who understand etcd are destined to rebuild their clusters less often." Happy clustering!