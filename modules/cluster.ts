/**
 * File: config.ts
 * Name: Julian Cuevas
 * Date: 21/01/2020
 * Desc: This file creates a cluster based on parsed configuration
 */
import * as awsx from '@pulumi/awsx'
import * as aws from '@pulumi/aws'
import * as eks from '@pulumi/eks'
import { Output } from '@pulumi/pulumi'
import { ClusterConfig } from './config'

let cluster: eks.Cluster

//Suggested managed policies for node groups
const managedPolicyArns: string[] = [
    "arn:aws:iam::aws:policy/AmazonEKSWorkerNodePolicy",
    "arn:aws:iam::aws:policy/AmazonEKS_CNI_Policy",
    "arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly",
];

const createCluster = (config: ClusterConfig, vpc: awsx.ec2.Vpc, subnets: Output<string>[]): eks.Cluster => {
    const role = createinstanceRole(config.roleName)
  
    if (config.skipDefaultNodeGroup) {
        cluster = new eks.Cluster(config.clusterName, {
            enabledClusterLogTypes: config.logTypes[0] !== '' ? config.logTypes : [],
            endpointPrivateAccess: config.privateEndpoint,
            endpointPublicAccess: config.publicEndpoint,
            fargate: config.fargate,
            nodeAssociatePublicIpAddress: config.createPublicIPs,
            vpcId: vpc.id,
            subnetIds: subnets,
            instanceRoles: [role],
            skipDefaultNodeGroup: config.skipDefaultNodeGroup,
            version: config.kubernetesVersion,
            deployDashboard: config.useDashboard
        }) 

        createNodeGroup(role, config, cluster)
    } else {
        cluster = new eks.Cluster(config.clusterName, {
            desiredCapacity: config.initialNodes,
            enabledClusterLogTypes: config.logTypes[0] !== '' ? config.logTypes : [],
            endpointPrivateAccess: config.privateEndpoint,
            endpointPublicAccess: config.publicEndpoint,
            fargate: config.fargate,
            instanceProfileName: config.instanceProfileName,
            instanceType: config.instanceType,
            maxSize: config.maxNodes,
            minSize: config.minNodes,
            nodeAssociatePublicIpAddress: config.createPublicIPs,
            vpcId: vpc.id,
            subnetIds: subnets,
            instanceRoles: [role],
            skipDefaultNodeGroup: config.skipDefaultNodeGroup,
            version: config.kubernetesVersion,
            deployDashboard: config.useDashboard
        }) 
    }

    return cluster
}


const createinstanceRole = (roleName: string) : aws.iam.Role => {
    const role = new aws.iam.Role(roleName, {
        assumeRolePolicy: aws.iam.assumeRolePolicyForPrincipal({
            Service: "ec2.amazonaws.com",
        }),
    });

    let counter = 0;
    for (const policy of managedPolicyArns) {
        // Create RolePolicyAttachment without returning it.
        const rpa = new aws.iam.RolePolicyAttachment(`${roleName}-policy-${counter++}`,
            { policyArn: policy, role: role },
        );
    }

    return role
   
}

const createNodeGroup = (role: aws.iam.Role, config: ClusterConfig, cluster: eks.Cluster) => {
    const instanceProfile = new aws.iam.InstanceProfile(config.instanceProfileName, {role: role});

    const nodeGroup = cluster.createNodeGroup(config.nodeGroupName, {
        instanceType: config.instanceType,
        desiredCapacity: config.initialNodes,
        minSize: config.minNodes,
        maxSize: config.maxNodes,
        labels: { "customNodeGroup": "true" },
        instanceProfile: instanceProfile,
        version: config.kubernetesVersion,
        amiId: config.amiID
    })
}


export {
    createCluster
}