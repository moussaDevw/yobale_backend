
module.exports = {
    admin: [
        {
            name:"type", 
            get: true,
            post:true,
            put:true,
            patch:true,
        },
        {
            name:"user", 
            get: true,
            post:true,
            put:true,
            patch:true,
        },
        {
            name:"order", 
            get: true,
            post:true,
            put:true,
            patch:true,
        },
        // { 
        // type: ["get", "post", "put", "patch"],
        // user: ["get", "post", "put", "patch"],
        // order : ["get", "post", "put", "patch"],
        // }
    ],
    custmer :[
        {
            name:"type", 
            get: false,
            post:false,
            put:false,
            patch:false,
        },
        {
            name:"user", 
            get: false,
            post:false,
            put:false,
            patch:false,
        },
        {
            name:"order", 
            get: true,
            post:true,
            put:true,
            patch:true,
        },
    ],
    shop: {

    }

}