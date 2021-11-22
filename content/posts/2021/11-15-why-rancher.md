---
title: "Why We Use Rancher"
slug: "why-we-use-rancher"
date: 2021-11-15T11:35:58Z
draft: false
featuredImage: /assets/ab-uses-rancher-full.png
featuredImagePreview: /assets/ab-uses-rancher-small.png
---
# Why We Use Rancher

Ok, let's get this out of the way. Yes, we are a [Rancher Gold Partner](https://alphabravo.io/press/alphabravo-suse-rancher-gold-partner) and yes, we provide [Rancher Training](https://alphabravo.io/training).

We are not those things because we are corpo shills. We partnered with Rancher because we use their products anyway.

- We use them in production (RKE2 and K3s).

- We use them on our Raspberry Pi clusters (K3s).

- We use them in Docker (K3d)

- And we manage it all with the Rancher UI.

So what are some of the reasons why we use Rancher?

- The products are open source. At AlphaBravo we love Open Source technology and companies that find a way to open source their technology and still provide immense value beyond that open source project.
-  Secure (or at least securable with minimal configuration tweaks). There are varying "out of the box" security settings across the product line, but Rancher does a great job of focusing on differentiating in each area (K3s vs RKE2 for example).
- Simple to deploy. This is a big one. As engineers who need to do our full-time jobs while also keeping track of the latest technology, it is important to be able to quickly deploy and assess new technologies is critical. With Rancher software and some basic Linux knowledge and some Linux systems around, you can deploy many of their products including a functioning Kubernetes cluster with a SINGLE CLI COMMAND. Let that sink in. 
- Easy to use. When it is 2 AM and you are troubleshooting a production micro-service issue, you definitely need this as a feature.

---

*(Shout out to my Pager Duty crew.)*

![](/assets/20211111_234943_worked-fine-in-dev.jpg)

---

I am obviously kidding. We should all be striving to expand our technical capabilities, play well with others, and operate as one big Dev and Ops family. Breaking down the silos and sharing our knowledge is what makes us stronger as a team.

Rancher certainly assists in that mission. I mean, have you SEEN the sheer number of open-source products they have?

- [Rancher UI](https://rancher.com/products/rancher) - The Enterprise Kubernetes Management Platform. Rancher is a complete platform for managing Kubernetes clusters wherever you deploy them.
- [RKE](https://rancher.com/products/rke) - RKE is a CNCF-certified Kubernetes distribution that runs entirely within Docker containers. It solves the common frustration of installation complexity with Kubernetes by removing most host dependencies and presenting a stable path for deployment, upgrades, and rollbacks.
- [RKE2](https://docs.rke2.io/) - RKE2, also known as RKE Government, is Rancher's next-generation Kubernetes distribution. It is a fully conformant Kubernetes distribution that focuses on security and compliance within the U.S. Federal Government sector.
- [K3s](https://k3s.io/) is a highly available, certified Kubernetes distribution designed for production workloads in unattended, resource-constrained, remote locations or inside IoT appliances.
- [K3os](https://k3os.io/) - k3OS is purpose-built to simplify Kubernetes operations in low-resource computing environments. Installs fast. Boots faster. Managed through Kubernetes.
- [k3d](https://k3d.io) -  k3d is a lightweight wrapper to run k3s (Rancher Lab’s minimal Kubernetes distribution) in docker. k3d makes it very easy to create single- and multi-node k3s clusters in docker, e.g. for local development on Kubernetes.
- [Longhorn](https://longhorn.io) - Longhorn is a lightweight, reliable, and easy-to-use distributed block storage system for Kubernetes. Longhorn is free, open-source software. Originally developed by Rancher Labs, it is now being developed as an incubating project of the Cloud Native Computing Foundation.
- [Fleet](https://fleet.rancher.io/) - Fleet is GitOps at scale. Fleet is designed to manage up to a million clusters. It's also lightweight enough that it works great for a single cluster too, but it really shines when you get to a large scale. By large scale, we mean either a lot of clusters, a lot of deployments, or a lot of teams in a single organization.
- [Harvester](https://harvesterhci.io/) - Harvester is a modern Hyperconverged infrastructure (HCI) solution built for bare metal servers using enterprise-grade open source technologies including Kubernetes, Kubevirt, and Longhorn. Designed for users looking for a cloud-native HCI solution, Harvester is a flexible and affordable offering capable of putting VM workloads on the edge, close to your IoT, and integrated into your cloud infrastructure.

Importantly, more than just a list of nerdy tech tools, this toolset enables Kubernetes. Kubernetes.... Everywhere....

---


![](/assets/20211111_235846_kubernetes-everywhere.jpg)

---

More in-depth, technical looks at Rancher coming in future posts.

If you are interested in running containerized workloads, even if you use EKS, GKE, etc, give Rancher a look. It will save you time and frustration.

If you want help accelerating your cloud-native and DevSecOps adoption, contact Alphabravo at info@alphabravo.io

Until next time!

---

*The AB Engineering Team*

**Website:** https://alphabravo.io

**Contact Us:** https://alphabravo.io/contact-us

