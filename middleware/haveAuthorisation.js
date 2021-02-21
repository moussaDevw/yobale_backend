
exports.isSuperAdmin= async (req, res, next) => {
    try{
        if(req.user.typeId === 1){
            return next()
        }
        else{
            return res.status(401).json({error: true, error: "your permission are insufficient"});
        }
    }
    catch (err){
        // console.log(err)
        return res.status(400).json({error: true, error: err})
    }
    
};

exports.isAdmin = async (req, res, next) => {
    try{
        console.log(req.user)
        if(req.user.typeId === 1 || req.user.typeId === 2 ){
            return next()
        }
        else{
            return res.status(401).json({error: true, error: "your permission are insufficient"});
        }
    }
    catch (err){
        // console.log(err)
        return res.status(400).json({error: true, error: err})
    }
    
};


exports.isCustmer= async (req, res, next) => {
    try{

        if(req.user.typeId === 3 || req.user.typeId === 1 || req.user.typeId === 2){
            return next()
        }
        else{
            return res.status(401).json({error: true, error: "your permission are insufficient"});
        }
    }
    catch (err){
        // console.log(err)
        return res.status(400).json({error: true, error: err})
    }
    
};

exports.isShop= async (req, res, next) => {
    try{
        if(req.user.typeId === 4 || req.user.typeId === 1 || req.user.typeId === 2){
            return next()
        }
        else{
            return res.status(401).json({error: true, error: "your permission are insufficient"});
        }
    }
    catch (err){
        // console.log(err)
        return res.status(400).json({error: true, error: err})
    }
    
};

exports.isLivreur= async (req, res, next) => {
    try{
        if(req.user.typeId === 5 || req.user.typeId === 1 || req.user.typeId === 2){
            return next()
        }
        else{
            return res.status(401).json({error: true, error: "your permission are insufficient"});
        }
    }
    catch (err){
        // console.log(err)
        return res.status(400).json({error: true, error: err})
    }
    
};