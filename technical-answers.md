## How long did you spent in the coding test?
I spent 8 hours (not counting the time taken to write down the README.md and this file) in the coding test because Pulumi was a new technology that I wanted to try but hadn't had a project to try it on beforehand.

## What would you add to your solution if you had more time?
I would've added the following aspects:

1. Dynamic scraping of AMI IDs to select the correct [Amazon EKS Optimized Linux AMI](https://docs.aws.amazon.com/eks/latest/userguide/eks-optimized-ami.html) for the selected Region & Kubernetes version
1. More variables such as security group tags, node public key for SSH access (if required, having direct SSH to Kubernetes nodes is not a good practice) & user data for startup
1. Capabitility to create an EC2 instance in the same VPC for private endpoint access (if only private endpoint access was selected)

## Why did you choose the language and Kubernetes installer you used for the coding test? (answers taken from README.md)

### Pulumi
Pulumi is a relatively new configuration management tool that directly competes with Terraform in the Infrastructure as Code space, it is different from Terraform in the following ways:

1. Uses actual source code files instead of .tf files
1. Can use several different programming languages (Javascript, Typescript, Python & C#) instead of a templating language
1. Allows running arbitrary code before creating infrastructure, allowing for much more in-depth verification & validation
1. Allows creating Policy-as-Code for Infrastructure-as-Code services via [Pulumi Crossguard](https://www.pulumi.com/docs/get-started/crossguard/)

### Typescript
The language chosen for this particular repository was Typescript because it allows both the flexibility of an scripted language (Javascript) and progressive type checking, which allows adding the required amount of strictness to the code without having to take on a completely strongly typed language

### EKS
Amazon's [Elastic Kubernetes Service](https://aws.amazon.com/eks/), like all managed Kubernetes services allows operators to simplify their work by having the Kubernetes master(s) managed by an external entity, which means that operators only need to take care of worker nodes.

EKS was chosen because it simplifies the creation of the cluster, eliminates the need to have master nodes in any availability zones (masters are created, managed and served by Amazon and only cost U$10 a month) and greatly simplifies day 2 tasks because it completely eliminates an entire section of cluster management

The only downside to this is that the master already has a set of flags defined by Amazon that cannot be changed, greater analysis would be needed if Friday requires a non-standard master flag.

### Did you learn anything new while solving this challenge?
I learned a lot about Pulumi because before this challenge I had only done the basic tutorial and had no further experience with it, I also learned about all the current best practices that they suggest for creating EKS clusters which are already codified in both the `@pulumi/awsx` package and my own personal code in the `./modules/config.ts` file.

I learned how to codify all the best practices that I have gathered during my time creating/scaling/managing Kubernetes clusters so they can be verified in an automated way