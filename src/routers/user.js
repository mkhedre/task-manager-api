const express = require('express')
const multer = require('multer')
const sharp = require('sharp')
const { welcomeEmail, cancelEmail } = require('../emails/account')
const auth = require('../middleware/auth')
const User = require('../models/user')
require('../db/mongoose')
const router =new express.Router()

router.post('/users',async(req,res)=>{
    const user = new User(req.body)
    try{
        await user.save()
        welcomeEmail(user.mail,user.name)
        const token = await user.generateauthtoken()
        
        res.status(201).send({user,token})
    }catch(e){
        res.status(400).send(e)
        console.log(e)
    }
    
})

router.get('/users/me',auth,async(req,res)=>{
    res.send(req.user)

})

router.get('/users/:id',async(req,res)=>{
    const _id = req.params.id
    try{
        const user = await User.findById(_id)
        if(!user){
            return res.status(404).send()
        }
        res.send(user)
    }catch(e){
        res.status(500).send()
    }
   
})

router.patch('/users/me',auth,async(req,res)=>{
    const updates = Object.keys(req.body)
    const allowedupdates = ['name','age','mail','password']
    const isValid = updates.every((update)=>allowedupdates.includes(update))
    if(!isValid){
        res.status(400).send({"error": "invalid updatee"})
    }

    try{
        updates.forEach((update)=>req.user[update] = req.body[update])

        await req.user.save()
        
        //const user = await User.findByIdAndUpdate(req.params.id,req.body,{new : true , runValidators : true})
        
        res.send(req.user)
    }catch(e){
        res.status(400).send(e)
        console.log(e)
    }
})

router.delete('/users/me',auth,async(req,res)=>{
    try{
        // const user= await User.findByIdAndDelete(req.params.id)
        // if(!user){
        //     res.status(404).send({"error": "invalid update"})
        // }
        cancelEmail(req.user.mail,req.user.name)
        await req.user.remove()
        res.send(req.user)
    }catch(e){
        res.status(500).send(e)
    }
})

router.post('/users/login',async(req,res)=>{
    try{
       const user= await User.findByCredentials(req.body.mail,req.body.password)
       const token = await user.generateauthtoken()
       console.log(user,token)
       res.send({user,token})
    }catch(e){
        res.status(400).send(e)
        console.log(e)
    }
})

router.post('/users/logout',auth,async(req,res)=>{
    try{
        req.user.tokens = req.user.tokens.filter((token)=>{
            return token.token !== req.token
        })
        await req.user.save()
        res.send()
    }catch(e){
        res.status(500).send(e)
    }
})

router.post('/users/logoutAll',auth,async(req,res)=>{
    try{
        req.user.tokens = []
        await req.user.save()
        res.send()
    }catch(e){
        res.status(500).send(e)
        console.log(e)
    }
})
const upload =multer({
    'limits':{
        fileSize:1000000
    },
    fileFilter(req,file,cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            return cb(new Error('pleasre upload jpjs files'))
        }
        cb(undefined,true)
    }

})
router.post('/users/me/avatar',auth,upload.single('avatar'),async(req,res)=>{
    const buffer = await sharp(req.file.buffer).resize({width : 250 , height : 250}).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.send()
},(error,req,res,next)=>{
    res.status(400).send({'error':error.message})
})

router.delete('/users/me/avatar',auth,async(req,res)=>{
    req.user.avatar =undefined
    await req.user.save()
    res.send()

})

router.get('/users/:id/avatar',async(req,res)=>{
    try{
        const user = await User.findById(req.params.id)
        if(!user||!user.avatar){
             throw new Error('invalid user')
        }
        res.set('content-type','image/png')
        res.send(user.avatar)
        
    }catch(e){
        res.status(400).send()
    }
})

module.exports = router