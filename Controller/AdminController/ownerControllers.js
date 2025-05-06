const owner = require('../../model/registrion');


exports.getOwnerData = async(req,res)=>{
    try{
        const ownerList = await owner.find();
        if(ownerList.length!=0){
            return res.status(200).json({
                error:false,
                message:"Data Fetch",
                data:ownerList
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