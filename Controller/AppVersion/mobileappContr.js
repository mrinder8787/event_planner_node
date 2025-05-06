

exports.mobileAppController = async(req,res)=>{
    try{
        return res.status(200).json({
            error:false,
            message:"App Version fetch",
            version:"1.0.0+1",
            url:"https://eventplaner.site/downloads/app-release.apk"
        })

    }catch(e){
        console.log("Catch error",e.message);
        return res.status(500).json({
            error:true,
            message:e.message
        })
    }

}