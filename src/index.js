const express = require('express')
const userRouter =require('./routers/user')
const taskRouter = require('./routers/task')
const Task = require('./models/task')
const User = require('./models/user')
require('./db/mongoose')

const app = express()
const port = process.env.PORT

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

app.listen(port ,()=>{
    console.log('conetcting to server',PORT)
})
// app.use((req,res,next)=>{
//     if(req.method === 'GET'){
//         res.send('cannt get this method')
//     }else{
//         next()
//     }
// })


// const jwt = require('jsonwebtoken')
// const myfun = async()=>{
//     const token =  jwt.sign({_id:'234232'},'thisismyfirstjwt')
//     console.log(token)
//     const data = jwt.verify(token, 'thisismyfirstjwt')
//     console.log(data)
// }

// myfun()

// const main = async()=>{
//     // const task = await Task.findById('61939df4b8d78a3f7869696e')
//     // await task.populate([{path : 'owner'}])
//     // console.log(task.owner)
//     const user = User.findById('61939988ccee3dc15f15dab5')
//     await user.populate([{path :'tasks'}])
//     console.log(user.tasks)
// }
// main()



// const multer = require('multer')
// const { response } = require('express')
// const upload = multer({
//     'dest':'images',
//     'limits':{
//         fileSize : 1000000
//     },
//     fileFilter(req,file,cb){
//         if(!file.originalname.match(/\.(doc|docx)$/)){
//             return cb(new Error('please enter doc file'))
//         }
//         cb(undefined,true)
//     }
// })
// app.post('/upload',upload.single('upload'),(req,res)=>{
//     res.send()
// },(error,req,res,next)=>{
//     res.status(400).send({'error':error.message})
// })