/**
 * File: vpc.ts
 * Name: Julian Cuevas
 * Date: 21/01/2020
 * Desc: This file creates a VPC and returns all relevant info required to create an EKS cluster
 */
import { Output } from '@pulumi/pulumi'
import * as awsx from '@pulumi/awsx'

//VPC object
let vpc: awsx.ec2.Vpc

/**
 * Create a VPC and return
 * @param name VPC Name
 * @returns id VPC ID
 */
const createVPC = (name: string) : awsx.ec2.Vpc => {
    vpc = new awsx.ec2.Vpc(name)
    return vpc
}

/**
 * Returns all available subnets for the VPC
 */
const getSubnets = () : Array<Output<string>> => {
    return vpc.privateSubnetIds.concat(vpc.publicSubnetIds)
}


export default {
    createVPC,
    getSubnets,
}