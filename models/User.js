const mongoose=require('mongoose');
const bcrypt=require('bcryptjs');
const validator=require('validator');
const jwt = require("jsonwebtoken");

const userSchema= new mongoose.Schema({
    username:{
        type:String,
        required:[true,"Please Enter Your Name"],
        trim: true
    },
    email:{
        type:String,
        required:[true,"Please Enter Your Email"],
        unique:true,
        trim:true,
        validate:[validator.isEmail,"Please Enter a Valid Email"],
        lowercase:true
    },
    password:{
        type: String,
        required:[true,"Please Enter Your Password"],
        minLength:[8,"Password should be greater then 8 characters"]
    },
    isEmailConfirmed:{
      type:Boolean,
      default:false
    },
    confirmationToken:String,
    confirmationTokenExpires:Date

},{timestamps:true});

userSchema.pre('save', async function (next) {
    if(!this.isModified('password')) return next();
    try{
     const salt=await bcrypt.genSalt(10);
     this.password=await bcrypt.hash(this.password,salt);
     next()
    }
    catch(error){
     next(error);
    }
});

userSchema.methods.comparePassword=async function(candidatePassword){
   return bcrypt.compare(candidatePassword,this.password);
};

userSchema.methods.getJWTToken=async function(){
    return jwt.sign({id:this._id},process.env.JWT_SECRET,{
        expiresIn:'5d'
    });
}

module.exports=mongoose.model('User',userSchema);