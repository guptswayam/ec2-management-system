const aws = require("aws-sdk")
const redis = require("redis")
const util = require("util")


const redisClient = redis.createClient({
    url: process.env.REDIS_URL || "redis://localhost:6379",
})

exports.redisClient = redisClient

redisClient.flushall()

redisClient.hget = util.promisify(redisClient.hget)
redisClient.get = util.promisify(redisClient.get)

const AppError = require("../utils/appError")

const regions = [
    "ap-south-1",
    "us-east-1",
    "us-east-2",
    "us-west-1",
    "us-west-2",
    "af-south-1",
    "ap-east-1",
    "ap-northeast-3",
    "ap-northeast-2",
    "ap-southeast-1",
    "ap-southeast-2",
    "ap-northeast-1",
    "ca-central-1",
    "eu-central-1",
    "eu-west-1",
    "eu-west-2",
    "eu-south-1",
    "eu-west-3",
    "eu-north-1",
    "me-south-1",
    "sa-east-1"
]

const fetchInstances = async (accessKey, secretKey) => {
    const data = []
    await Promise.all(regions.map(async el => {
        try {
            const ec2 = new aws.EC2({apiVersion: '2016-11-15', accessKeyId: accessKey, secretAccessKey: secretKey, region: el})
            const instances = await ec2.describeInstances({}).promise()
            // .then(data => {console.log(data.Reservations)})
            if(instances.Reservations.length > 0){
                instances.Reservations.map(ins => {
                    data.push({
                        id: ins.Instances[0].InstanceId,
                        region: el,
                        InstanceType: ins.Instances[0].InstanceType,
                        LaunchTime: ins.Instances[0].LaunchTime,
                        PublicDnsName: ins.Instances[0].PublicDnsName,
                        PublicIpAddress: ins.Instances[0].PublicIpAddress,
                        State: ins.Instances[0].State,
                        Tags: ins.Instances[0].Tags,
                        CpuOptions: ins.Instances[0].CpuOptions
                    })
                })
            }
        } catch (error) {
            
        }
    }))
    return data
}

exports.getInstances = async (req, res, next) => {
    try{
        const {accessKey, secretKey} = req.currentUser

        if(!accessKey || !secretKey)
            throw new AppError("Please add the AWS Credentials first!", 400)
        const {useCache = "yes"} = req.query

        if(useCache === "no"){
            
            const data = await fetchInstances(accessKey, secretKey)
    
            res.json({
                status: "success",
                data
            })

            console.log("Instances not served from cache")

            redisClient.hset("instances", `${req.currentUser._id.toString()}`, JSON.stringify(data))
        }

        else {
            let data = await redisClient.hget("instances", `${req.currentUser._id.toString()}`)
            if(!data){
                data = await fetchInstances(accessKey, secretKey)
                res.json({
                    status: "success",
                    data
                })
                console.log("Instances not served from cache")
                redisClient.hset("instances", `${req.currentUser._id.toString()}`, JSON.stringify(data))
            }
            else{
                data = JSON.parse(data)
                res.json({
                    status: "success",
                    data
                })
                console.log("Data served from cache")
            }
        }

        
    } catch(err) {
        next(err)
    }
    
}

const fetchInstanceDetail = async (accessKey, secretKey, id, region) => {
    const ec2 = new aws.EC2({apiVersion: '2016-11-15', accessKeyId: accessKey, secretAccessKey: secretKey, region})
    let instance = await ec2.describeInstances({InstanceIds: [id]}).promise()
    instance = {
        id,
        region,
        InstanceType: instance.Reservations[0].Instances[0].InstanceType,
        LaunchTime: instance.Reservations[0].Instances[0].LaunchTime,
        PublicDnsName: instance.Reservations[0].Instances[0].PublicDnsName,
        PublicIpAddress: instance.Reservations[0].Instances[0].PublicIpAddress,
        State: instance.Reservations[0].Instances[0].State,
        Tags: instance.Reservations[0].Instances[0].Tags,
        CpuOptions: instance.Reservations[0].Instances[0].CpuOptions
    }

    return instance
}

exports.getInstanceDetail = async (req, res, next) => {
    try{
        const {accessKey, secretKey} = req.currentUser
        const {id, region} = req.params

        if(!accessKey || !secretKey)
            throw new AppError("Please add the AWS Credentials first!", 400)

    
        const {useCache = "yes"} = req.query

        if(useCache === "no"){
            
            const data = await fetchInstanceDetail(accessKey, secretKey, id, region)
    
            res.json({
                status: "success",
                data
            })

            console.log("Instances not served from cache")

            redisClient.hset(`instanceDetail_${req.currentUser._id.toString()}`, `${id}_${region}`, JSON.stringify(data))
        }

        else {
            let data = await redisClient.hget(`instanceDetail_${req.currentUser._id.toString()}`, `${id}_${region}`)
            if(!data){
                data = await fetchInstanceDetail(accessKey, secretKey, id, region)
                res.json({
                    status: "success",
                    data
                })
                console.log("Instances not served from cache")
                redisClient.hset(`instanceDetail_${req.currentUser._id.toString()}`, `${id}_${region}`, JSON.stringify(data))
            }
            else{
                data = JSON.parse(data)
                res.json({
                    status: "success",
                    data
                })
                console.log("Data served from cache")
            }
        }
    } catch(err) {
        next(err)
    }
    
}

exports.startInstance = async (req, res, next) => {
    try {
        const {id, region} = req.params;
        const {accessKey, secretKey} = req.currentUser

        const ec2 = new aws.EC2({region, apiVersion: '2016-11-15', accessKeyId: accessKey, secretAccessKey: secretKey})

        const data = await ec2.startInstances({InstanceIds: [id]}).promise()

        res.json({
            status: "success",
            data
        })

        redisClient.hdel(`instanceDetail_${req.currentUser._id.toString()}`, `${id}_${region}`)
        redisClient.hdel("instances", req.currentUser._id.toString())
        
    } catch (error) {
        next(error)
    }

}

exports.stopInstance = async (req, res, next) => {
    try {
        const {id, region} = req.params;
        const {accessKey, secretKey} = req.currentUser

        const ec2 = new aws.EC2({region, apiVersion: '2016-11-15', accessKeyId: accessKey, secretAccessKey: secretKey})

        const data = await ec2.stopInstances({InstanceIds: [id]}).promise()

        res.json({
            status: "success",
            data
        })

        redisClient.hdel(`instanceDetail_${req.currentUser._id.toString()}`, `${id}_${region}`)
        redisClient.hdel("instances", req.currentUser._id.toString())
    } catch (error) {
        next(error)
    }

}