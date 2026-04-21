import jwt from "jsonwebtoken"

// Doctor authentication middleware
const authDoctor = async (req, res, next)=>
{
    try{

        const dToken = req.header("dToken");
        if(!dToken){
            return res.json({success:false, message:"not authorized to login"})

        }
        const token_decode = jwt.verify(dToken, process.env.JWT_SECRET)
        req.docId= token_decode.id;
     
       next();
    }catch(error){
            console.log(error);
      res.json({success:false , message:error.message});

    }
}

export default authDoctor