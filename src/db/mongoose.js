const mongoose = require('mongoose')

mongoose.connect(process.env.MONGOOSE_URL,{
    useNewUrlParser: true, 
    useUnifiedTopology: true
})
 //dfine model 

//new instance from model
// const me = new user({
//      name : '   ahmed',
//      mail : '    m@gmail.com',
//      age : 12,
//      password : '  mostafa'
// })

//  me.save().then(()=>{
//     console.log(me)
//  }).catch((error)=>{
//      console.log('Error!',error)
//  })



//  const newTask = new task({
//      description : 'this is about math',
//      completed : true
//  })

//  newTask.save().then(()=>{
//     console.log(newTask)
//  }).catch(error=>{
//      console.log('Error!',error)
//  })