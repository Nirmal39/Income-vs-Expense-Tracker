import {User} from '../models/user.js';
import bcrypt from 'bcrypt';
import {sendCookie} from '../utils/feature.js'
import ErrorHandler from '../middlewares/error.js'


export const getMyProfile = (req,res)=>{
    res.status(200).json({
        success: true,
        user: req.user
    })
}

export const login =async (req,res,next)=>{
    try {
        const {email,password} = req.body

        const user = await User.findOne({email}).select('+password');


        if(!user)return next(new ErrorHandler("Invalid email",400));

        const isMatch = await bcrypt.compare(password,user.password);

        if(!isMatch) return next(new ErrorHandler("Invalid Password",400));


        sendCookie(user,res, `Welcome Back, ${user.name}`, 200)
        
    } catch (error) {
       next(error);
    }
}



export const register = async (req,res,next)=>{
    try {

        const {name,email,password,confirmPassword} = req.body;

        if(password !== confirmPassword) return next(new ErrorHandler("Password Doesn't Match",400));

        let user = await User.findOne({email});

        if(user) return next(new ErrorHandler("User already exist",400));

        const hassedPass = await bcrypt.hash(password,10);

        user =await User.create({name,email,password:hassedPass});
        
        sendCookie(user,res, `Registred Succesfully `, 201)

    } catch (error) {
        next(error);
    }
}



export const logout = (req,res)=>{
    res
    .status(200)
    .cookie("token", "", {expires: new Date(Date.now())})
    .json({
        success: true,
        user: req.user
    })
}