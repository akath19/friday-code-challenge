# Friday Code Challenge
---
This repository holds all code required to setup an EKS cluster with the following settings/options:

1. Private VPC & subnets (mandatory)
1. Configurable number of nodes with autoscaling (mandatory)
1. Configurable instance type
1. Configurable public IPs
1. Configurable logging types for Cloudwatch
1. Configurable master endpoint access
1. Configurable usage of fargate
1. Configurable node group
1. Configurable Kubernetes version
1. Configurable usage of Kubernetes Dashboard
1. Configurable AMI ID

## Technologies Used
---
1. [Pulumi](https://www.pulumi.com)
1. [Amazon AWS IAM Authenticator](https://docs.aws.amazon.com/eks/latest/userguide/install-aws-iam-authenticator.html)
1. [Amazon AWS CLI](https://aws.amazon.com/cli/)
1. [Typescript](https://www.typescriptlang.org)
1. [Node.js](https://nodejs.org/)

An explanation on how to use and why these technologies used will be given below

## How To Run
---
1. Clone this repository
1. Install [Node.js](https://nodejs.org/) on your local machine (required for running this code only)
1. Run `npm install` on the root folder of this repository to download all required packages
1. Create an account on [Pulumi](https://app.pulumi.com/signin) (it's free for single user usage)
1. Install [Amazon AWS IAM Authenticator](https://docs.aws.amazon.com/eks/latest/userguide/install-aws-iam-authenticator.html) for setting up Kubernetes IAM Authentication
1. Install [Amazon AWS CLI](https://aws.amazon.com/cli/) and setup credentials
1. Login to Pulumi on your console by running `pulumi login` and follow the instructions
1. Setup your variables in the `Pulumi.dev.yaml` file
1. Run `pulumi up` to see a preview of the process, variable errors & recommendations
1. If you're satisfied with the result, respond yes to the prompt
1. If you're not satisfied with the result, respond no and fix the appropriate configuration values
1. To get the cluster's kubeconfig run `pulumi stack output kubeconfig > kubeconfig.yaml`, this saves the cluster's kubeconfig file to the local directory

## Technology Choices
---

### Pulumi
Pulumi is a relatively new configuration management tool that directly competes with Terraform in the Infrastructure as Code space, it is different from Terraform in the following ways:

1. Uses actual source code files instead of .tf files
1. Can use several different programming languages (Javascript, Typescript, Python & C#) instead of a templating language
1. Allows running arbitrary code before creating infrastructure, allowing for much more in-depth verification & validation
1. Allows creating Policy-as-Code for Infrastructure-as-Code services via [Pulumi Crossguard](https://www.pulumi.com/docs/get-started/crossguard/)

### Pulumi Dashboard
Pulumi also has a dashboard on the web which gives a complete history of every run of every project created with it, this allows teams to maintain a full history of each project and gives auditors a base for reviewing requested changes, the dashboard is available [here](https://app.pulumi.com/)

### Typescript
The language chosen for this particular repository was Typescript because it allows both the flexibility of an scripted language (Javascript) and progressive type checking, which allows adding the required amount of strictness to the code without having to take on a completely strongly typed language

### EKS
Amazon's [Elastic Kubernetes Service](https://aws.amazon.com/eks/), like all managed Kubernetes services allows operators to simplify their work by having the Kubernetes master(s) managed by an external entity, which means that operators only need to take care of worker nodes.

EKS was chosen because it simplifies the creation of the cluster, eliminates the need to have master nodes in any availability zones (masters are created, managed and served by Amazon and only cost U$10 a month) and greatly simplifies day 2 tasks because it completely eliminates an entire section of cluster management

The only downside to this is that the master already has a set of flags defined by Amazon that cannot be changed, greater analysis would be needed if Friday requires a non-standard master flag.