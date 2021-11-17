const mongoose = require('mongoose')
const validator= require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const userschema= mongoose.Schema({
    name : {
       type : String, // connstructor
       required :true,
       trim : true,
    },
    mail :{
       type : String,
       unique : true , 
       required :true,
       trim : true,
       lowercase:true,
       validate(value){
           if(!validator.isEmail(value)){
               throw new Error('email is invalid')
           }
       }
    },
    age :{
       type : Number,
       default :0,
    },
    password : {
        type:String,
        trim:true,
        required : true,
        minlength :7,
        validate(value){
           if(value.includes('password')){
               throw new Error('incorrect password')
           }
        }

    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    avatar :{
        type : Buffer
    }
}, {
    timestamps: true
})

userschema.virtual('tasks',{
    ref:'Task',
    localField : '_id',
    foreignField : 'owner'
})

userschema.methods.toJSON= function(){
    const user = this
    const userObject =user.toObject()
    delete userObject.password
    delete userObject.tokens

    return userObject
}

userschema.methods.generateauthtoken = async function(){
    const user = this // specify this user
    const token = jwt.sign({_id : user.id.toString()},process.env.JWT_VERIFY)

    user.tokens = user.tokens.concat({token})
    await user.save()
    return token
}

userschema.statics.findByCredentials = async function(mail,password){
    const user = await User.findOne({mail})
    if(!user){
        throw new Error('unable to login')
    }

    const isMatch = await bcrypt.compare(password,user.password)
    if(!isMatch){
        throw new Error('unable to login')
    }
    return user
}

userschema.pre('save', async function(next){
    const user =this
    if(user.isModified('password')){
        user.password  =await bcrypt.hash(user.password , 8)
    }
    next()
})

const User = mongoose.model('user',userschema)

module.exports = User