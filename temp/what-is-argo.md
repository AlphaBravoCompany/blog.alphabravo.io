What Is Argo: How To Get Stuff Done With Kubernetes
Dec 9
As the benefits of containerization are realized by more organizations, users are searching for better and more efficient ways to make Kubernetes and other container programs work for them. 

Argo is a unique tool that makes using Kubernetes more accessible to everyone. The power of containers is something that everyone should see, and with Argo, this is now possible.

Whether you are new to Kubernetes or just getting your toes wet, you may still have questions, including – what is Argo and how does it work? If that’s the case, you are in the right place. 

Introduction.
Before diving into the specifics of what Argo offers and how you can begin using the features, it’s a good idea to learn more about what it actually is. 

The official name is actually Argoproj; however, most people just say Argo. It’s a collection of open source tool that has been branded as something to help you “get stuff done” when using Kubernetes.

It includes Rollouts, Events, CD, and Workflows. Each of these offers unique services and features that make it an invaluable part of the Kubernetes package and that lends to improved efficiency for your processes.

Introducing Workflows
The Kubernetes-native Argo Workflows is a unique workflow engine for complex job orchestration. This includes parallel and serial execution. With Argo Workflows in place, you can simplify the process of using Kubernetes to help deploy these workflows.

A Brief Overview of How Argo Works
Argo is designed to add a new object to Kubernetes. This new object is referred to as a “Workflow.” It can be created and modified just like any other Kubernetes object, such as a “Deployment” or “Pod.” In industry talk, the “Workflow” is a directed acyclic graph of steps that should be followed.

Every “step” will execute in a pod and will run parallel with, or dependent on, several other steps.

Some of the features include:

Memorized resubmission

Cancelation, resume, suspend

Flow control and recursion

Retry logic and timeouts

Passing artifacts between each step

Conditional execution and parametrization

This provides a basic overview of the features involved, there are others to use, as well.

Use Cases.
Why should you use Argo? Why not opt for a different tool, such as Airflow or just use the existing Jenkins cluster?

The answer is simple and should be clear – Kubernetes.

Instead of trying to reinvent what Kubernetes is already providing, if you know the proper way to attach a volume to a pod, you know how to attach a volume to one of the steps in your workflow. This same concept applies to node/pod affinities or anti-affinities, service accounts, resource limits and requests, environmental variables, and anything else a pod is able to define.

This is because Workflows are using the same methods as vanilla Kubernetes Deployments or the DaemonSets.

Why the Container-Native Workflow Engine was Created
Argo is considered a robust workflow engine to use in Kubernetes that provides the capability of implementing every step in your workflow as a container. It offers flexible and simple mechanisms for determining the constraints between each step in the workflow and in artifact management for linking the step’s output as an input to any other steps. By integrating the artifact management with the workflows, it is possible to achieve improved simplicity, efficiency, and portability.

Unlike the VMs, containers offer a reliable and lightweight packaging for the execution application and environment in an image that is self-contained and portable. By creating the workflow steps all from containers, the workflow, including the execution of steps along with the interactions between the steps are managed and specified as single source code.

Even though there are several use cases for the workflows, a simple example would be in the CI (continuous integration) environment, which ensures fast innovation and iteration. With Kubernetes and Argo, users can create the needed “pipeline” to build an application.

While this is true, the actual pipeline can be specified as code and upgraded or built using containers. What this means is that you can use CI for managing the existing CI infrastructure.

Another benefit offered by the integrated container-native workflow management system is that you can define and manage workflows as code. When Argo is used, workflows will not only be portable, but they are also considered version controlled.

The workflow that runs on one of the Argo systems will operate exactly the same on another Argo system. All you have to do is to point the newly created Argo system to the same container repository and source repo that was used by the prior system.

The goal of using Argo is to ensure that operators and developers can adopt containers along with Kubernetes to develop and deploy various distributed applications. Today, Argo is being used by the community for several open-source projects and by an array of enterprises.

It is believed that Argo just represents another step toward the advancement of the Kubernetes ecosystem. The end goal is to make Kubernetes much more useful and accessible to a bigger audience and community.

How to Run Argo Locally
If you want to demo Argo quickly (the same applies to almost any Kubernetes tool), the best options include either:

K3d – offers lightweight k3s distribution or

Kind – provides full-fledged Kubernetes distribution

After you have one of these installed (along with the kubectl and docker), you can quickly and easily set up Argo. To do this, you can follow these steps:

Create the Kubernetes cluster

Create the namespace for Argo deployment

Because Argo will create pods for executing the steps in a workflow, you need to create a rolebinding for Argo’s workflow controller to have the permission needed to run pods in the default namespace.

Since kind will use containerd, you must configure the workflow controller to use the Pod Namespace Sharing or PNS. Once done, you can deploy Argo.

Once deployed, be sure to run the test workflow. You should expose the Argo UI on a local port that is available and then open the browser.

Argo also offers the CLI, which makes interacting with the workflow engine somewhat nicer. Once you are done, you can delete the cluster.

Taking a Deeper Dive into the Argoproj Suite
Workflows is not the only tool available in the Argoproj portfolio. There are other options too.

Getting to Know Argo Events
Argo Events, as the name implies, is an event-based dependence manager used with Kubernetes. Its goal is to help you define the various dependencies from several event sources, such as streams, schedules, s3, and webhook, among others, which will trigger Kubernetes objects after the resolution of event dependencies.

The Features of Argo Events
The features offered by using Argo Events includes:

Management of dependencies from several sources

Ability to customize constraint logic for event dependency resolution

Management for everything from real-time, linear, and simple dependencies to batch job, multi-source, and complex dependencies

CloudEvents compliant

Define the arbitrary Boolean logic for resolving event dependencies

Ability to extend the framework to add to your personal event source listener

Manage the even sources at runtime

These features make it a viable part of your Kubernetes setup.

Argo CD – Declarative Continuous Delivery for Kubernetes
Argo CB is a type of declarative, GitOps delivery tool used with Kubernetes.

Why Use Argo CD?
Environments, configurations, and application definitions need to be vision controlled and declarative. Lifecycle management and application deployment need to be easy to understand, auditable, and automated.

What is Argo: Now You Know
When it comes to the question, what is Argo, you should now have a pretty good idea of what it does and how it operates. If you use Kubernetes or if you have recently adopted this technology, it’s a good idea to consider implementing this into your process to achieve higher levels of efficiency and productivity.

Thanks for reading and contact us if you have any questions. 