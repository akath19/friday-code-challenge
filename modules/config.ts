/**
 * File: config.ts
 * Name: Julian Cuevas
 * Date: 21/01/2020
 * Desc: This file retrieves & validates environment config
 */
import { Config } from '@pulumi/pulumi'
import { InstanceTypes, InstanceType } from '@pulumi/aws/ec2'

interface ClusterConfig {
    vpcName: string;
    clusterName: string;
    initialNodes: number;
    minNodes: number;
    maxNodes: number;
    createPublicIPs: boolean;
    securityGroupTags: Array<string>;
    logTypes: Array<string>;
    privateEndpoint: boolean;
    publicEndpoint: boolean;
    fargate: boolean;
    instanceProfileName: string;
    instanceTypeName: string,
    instanceType: InstanceType;
    roleName: string;
    skipDefaultNodeGroup: boolean;
    autoscalingGroupName: string;
    nodeGroupName: string;
    kubernetesVersion: string;
    useDashboard: boolean;
    amiID: string;
}

interface ConfigInfo {
    errors: Array<string>;
    recommendations: Array<string>;
}

let conf: ClusterConfig


const getConfig = () : ClusterConfig => {
    const config = new Config()

    conf = {
        vpcName: config.require('vpc-name'),
        clusterName: config.require('cluster-name'),
        initialNodes: config.requireNumber('initial-nodes'),
        minNodes: config.requireNumber('min-nodes'),
        maxNodes: config.requireNumber('max-nodes'),
        createPublicIPs: config.requireBoolean('create-public-ips'),
        securityGroupTags: config.require('security-group-tags').split(','),
        logTypes: config.require('log-types').split(','),
        privateEndpoint: config.requireBoolean('private-endpoint'),
        publicEndpoint: config.requireBoolean('public-endpoint'),
        fargate: config.requireBoolean('fargate'),
        instanceProfileName: config.require('instance-profile-name'),
        instanceTypeName: config.require('instance-type'),
        instanceType: InstanceTypes.T2_Medium,
        roleName: config.require('role-name'),
        skipDefaultNodeGroup: config.requireBoolean('skip-default-node-group'),
        autoscalingGroupName: config.require('autoscaling-group-name'),
        nodeGroupName: config.require('node-group-name'),
        kubernetesVersion: config.require('kubernetes-version'),
        useDashboard: config.requireBoolean('use-dashboard'),
        amiID: config.require('ami-id')
    }

    return conf
}

const validateConfig = () : ConfigInfo => {
    return {
        errors: getConfigErrors(),
        recommendations: getConfigRecommendations()
    }
}


const getConfigErrors = () : Array<string> => {
    const errs = new Array<string>()

    if (!conf.vpcName) {
        errs.push('VPC Name cannot be empty')
    }

    if (!conf.clusterName) {
        errs.push('Cluster name cannot be empty')
    }
    
    if (!conf.initialNodes) {
        errs.push('Initial nodes cannot be empty')
    }

    if (conf.initialNodes < 1) {
        errs.push('Initial nodes cannot be less than one')
    }

    if (conf.maxNodes < conf.initialNodes) {
        errs.push('Max nodes cannot be less than initial nodes')
    }

    if (conf.maxNodes < conf.minNodes) {
        errs.push('Max nodes cannot be less than min nodes')
    }

    if (!conf.privateEndpoint && !conf.publicEndpoint) {
        errs.push('Either public or private endpoint access must be enabled')
    }

    if (conf.kubernetesVersion !== '1.14' && conf.kubernetesVersion !== '1.13' && conf.kubernetesVersion !== '1.12') {
        errs.push(`Kubernetes version ${conf.kubernetesVersion} is not supported by EKS currently, please check https://docs.aws.amazon.com/eks/latest/userguide/kubernetes-versions.html for supported versions`)
    }

    if (conf.instanceTypeName === '') {
        errs.push('Instance type cannot be empty')
    }

    let found = false

    for (const type of Object.values(InstanceTypes)) {
        if (type === conf.instanceTypeName) {
            conf.instanceType = type
            found = true
        }
    }

    if (!found) {
        errs.push('Instance type not recognized')
    }

    if (conf.autoscalingGroupName === '') {
        errs.push('Autoscaling group name cannot be empty')
    }
    
    if (conf.nodeGroupName === '' && !conf.skipDefaultNodeGroup) {
        errs.push('Node group name cannot be empty if skipDefaultNodeGroup is set')
    }
    
    if (conf.amiID === '') {
        errs.push('AMI ID cannot be empty')
    }

    return errs
}

const getConfigRecommendations = () : Array<string> => {
    const recs = new Array<string>()

    if (conf.initialNodes < 3) {
        recs.push('Please consider an initial node size of 3 or more nodes')
    }

    if (conf.minNodes < 2) {
        recs.push('Please consider a minimum node size of at least 2 nodes')
    }
    
    if (conf.createPublicIPs) {
        recs.push('Please consider creating node pools without public IPs for better security')
    }

    if (conf.securityGroupTags[0] === '') {
        recs.push('Please consider adding at least 1 tag to the created security group')
    }

    if (conf.logTypes[0] === '') {
        recs.push('Please consider adding at least api and audit log types for audit purposes')
    }

    if (!conf.privateEndpoint && conf.publicEndpoint) {
        recs.push('Please consider adding private endpoint access only')
    }

    if (conf.fargate) {
        recs.push('Please consider not using fargate for a traditional kubernetes cluster')
    }

    if (!conf.skipDefaultNodeGroup) {
        recs.push('Please consider skipping the default node group so groups are created with secure roles')
    }

    if (conf.useDashboard) {
        recs.push('Please consider disabling the default kubernetes dashboard because it has been deprecated and it can introduce security vulnerabilities')
    }
    
    return recs
}


export {
    getConfig,
    validateConfig,
    ClusterConfig,
    ConfigInfo
}