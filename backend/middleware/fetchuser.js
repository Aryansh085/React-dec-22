var jwt=require('jsonwebtoken');
const JWT_SEC="edcmba123"
const fetchuser=(req,res,next)=>{

    // Get The user from the jwt token and add id to req object
    const token=req.header('auth-token');
    if(!token)
    {
        res.status(401).send({error:"Please send valid token no."})
    }
    try{
        const data= jwt.verify(token,JWT_SEC)
    req.user=data.user;
    next();
    }
    catch(error)
    {
        es.status(401).send({error:"Please send valid token no."})
    }
}

module.exports= fetchuser