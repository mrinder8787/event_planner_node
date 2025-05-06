const user = require('../../model/UserModel/userBaseRegisration');


exports.getUserData = async(req,res)=>{
    try{
        const userList = await user.find();
        if(userList.length!=0){
            return res.status(200).json({
                error:false,
                message:"Data Fetch",
                data:userList
            });
        }else{
            return res.status(401).json({
                error:true,
                message:"Data Empty"
            });
        }

    }catch(e){
        console.error("Catch Error:",e.message);
        return res.status(500).json({
            error:true,
            message:e.message
        });
    }
}