import jwt from "jsonwebtoken";

const auth = (req,res,next)=>{

    const { authorization } = req.headers;
    if(authorization){
        const token = authorization.split(" ")[1]
        jwt.verify(token,process.env.SECRIT,(error,user)=>{
            if(error){
                res.status(403).json({message:"token is not valid"})
            }
            req.user = user;
            next()
        })
    }else{
        res.status(403).json({message:"you are not authorize"})
    }
}

export default auth;