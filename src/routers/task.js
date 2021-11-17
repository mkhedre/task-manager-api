const express = require('express')
const auth = require('../middleware/auth')
require('../db/mongoose')
const Task =require('../models/task')
const router =new express.Router()


router.post('/tasks',auth,async(req,res)=>{
    const task = new Task({
        ...req.body,
        owner : req.user._id

    })
    try{
        await task.save()
        res.status(201).send(task)
    }catch(e){
        res.status(400).send(e)
        console.log(e)
    }
    
    // task.save().then(()=>{
    //     res.status(201).send(task)
    // }).catch((e)=>{
    //     res.status(400).send(e)
    // })   
})

router.get('/tasks',auth,async(req,res)=>{
    const match = {}
    const sort ={}

    if(req.query.completed){
        match.completed = req.query.completed ==='true'
    }
    if(req.query.sortBy){
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1]==='desc' ? -1 : 1
    }
    try{
        //const tasks = await Task.find({owner:req.user._id})
        await req.user.populate([{
            path : 'tasks',
            match,
            options :{
                limit :parseInt(req.query.limit),
                skip : parseInt(req.query.skip),
                sort:{
                    createdAt : -1
                }
            }
        }])
        res.send(req.user.tasks)
    }catch(e){
        res.status(500).send()
    }
    
    // Task.find({}).then((task)=>{
    //     res.send(task)
    // }).catch((e)=>{
    //     res.status(500).send(e)
    // })
})

router.get('/tasks/:id',auth,async(req,res)=>{
    const _id = req.params.id
    try{
        const task = await Task.findOne({_Id , owner : req.user._id})
        if(!task){
            return res.status(404).send()
        }
        res.send(task)
    }catch(e){
        res.status(500).send()
    }
    // Task.findById(_id).then((task)=>{
    //     if(!task){
    //         return res.status(404).send()
    //     }
    //     res.send(task)
    // }).catch((e)=>{
    //     res.status(500).send(e)
    // })
})

router.patch('/tasks/:id',auth,async(req,res)=>{
    const update = Object.keys(req.body)
    const allowedupdates = ['description', 'completed']
    const isValid = update.every((update)=> allowedupdates.includes(update))
    if(!isValid){
        res.status(400).send({"error": "invalid ubdate"})
    }
    try{
        const task = await Task.findOne({_id:req.params.id , owner:req.user._id})
        
        //const task = await Task.findByIdAndUpdate(req.params.id,req.body,{new: true , runValidators : true})
        if(!task){
            res.status(404).send()
        }
        update.forEach((update)=>task[update]=req.body[update])
        await task.save()
        res.send(task)
    }catch(e){
        res.status(400).send(e)
    }
})

router.delete('/tasks/:id',auth,async(req,res)=>{
    try{
        const task= await Task.findByIdAndDelete({ _id: req.params.id, owner: req.user._id })
        if(!task){
            res.status(404).send({"error": "invalid update"})
        }
        res.send(task)
    }catch(e){
        res.status(500).send(e)
    }
})
module.exports = router