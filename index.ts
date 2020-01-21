/**
 * File: index.ts
 * Name: Julian Cuevas
 * Date: 21/01/2020
 * Desc: Pulumi program to create an AWS EKS cluster
 */
import * as eks from '@pulumi/eks'
import * as conf from './modules/config'
import * as vpc from './modules/vpc'
import * as clusterCreator from './modules/cluster'
import { Output } from '@pulumi/pulumi'
import { Vpc } from '@pulumi/awsx/ec2'

//Get cluster config
const config : conf.ClusterConfig = conf.getConfig()

//Validate cluster config
const info : conf.ConfigInfo = conf.validateConfig()

//Print all configuration errors if any
if (info.errors.length !== 0) {
    console.error(`${info.errors.length} errorrs were found during config validation, describing below...`)
    info.errors.forEach(error => {
        console.error(`* ${error}`)
    });
    console.error('Please fix the above errors before continuing.')
    process.exit(1)
} else {
    console.log('No configuration errors found')
}

//Print all configuration recommendations if any
if (info.recommendations.length !== 0) {
    console.info(`${info.recommendations.length} recommendations were generated during config validation, describing below...`)
    info.recommendations.forEach(recommendation => {
        console.info(`* ${recommendation}`)
    })
    console.info('Please consider the above recommendations before creating the cluster.')
} else {
    console.log('No configuration recommendations found')
}
 

const clusterVPC: Vpc = vpc.default.createVPC(config.vpcName)
const subnets: Output<string>[] = vpc.default.getSubnets()
const cluster: eks.Cluster = clusterCreator.createCluster(config, clusterVPC, subnets)

export const kubeconfig = cluster.kubeconfig