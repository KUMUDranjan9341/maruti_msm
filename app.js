const express = require('express');
const app = express();

app.use(express.static('views'))
app.use('/static',express.static('public'))
app.use('/static',express.static('upload'))
app.use('/static',express.static('profile_img'))

app.set('view engine','ejs')
const bodyparser = require('body-parser');
app.use(bodyparser.urlencoded ({extended : true}));
const multer = require('multer')
const con= require('./config');
const { error } = require('console');
const cookieParser = require("cookie-parser");
app.use(cookieParser());
const session = require('express-session')
const time = 1000 * 60 * 60 * 24;
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: time }
  }))
//   redirect
const redirectlogin = ((req,res,next)=>{
    if(!req.session.user){
        res.redirect('/login')
    }else{
        next()
    }
});
  



app.get('/',(req,res) =>{
    res.render('index')
})
app.get('/aboutus',(req,res) =>{
    res.render('aboutus')
})
app.get('/services',(req,res) =>{
    res.render('service')
})
app.get('/carservices',(req,res) =>{
    res.render('carservice')
})
app.get('/bodypaint',(req,res) =>{
    res.render('bodypaint')
})
app.get('/contactus',(req,res) =>{
    res.render('contactus')
})  
app.get('/form',(req,res) =>{
    res.render('serviceform')
})
app.get('/FAQS',(req,res) =>{
    res.render('faqs')
})
app.get('/careers',(req,res) =>{
    res.render('careers')
})
app.get('/insurancerenewal',(req,res) =>{
    res.render('insurancerenewal')
})
app.get('/amcprivilegeclub',(req,res) =>{
    res.render('amcprivilegeclub')
})
app.get('/labour',(req,res) =>{
    res.render('labour')
})
app.get('/insuranceform',(req,res) =>{
    res.render('insuranceform')
})
app.get('/jobforms',(req,res) =>{
    res.render('jobforms')
})
app.get('/amcform',(req,res) =>{
    res.render('amcform')
})
// #### Dashboard 

const storage2 = multer.diskStorage({
    destination : function(req,file,cb){
        cb(null,'profile_img')
    },filename:function(req,file,cb){
        cb(null,Date.now()+"-"+file.originalname)
    } 
})
// const fileFilter2 =(req, file, cb) => {
//     if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
//         return cb(new Error('File must be of type JPG, JPEG, or PNG and nore more than 2MB in size'))
//     }
//     cb(undefined, true)
//   }

const profile_img  = multer({storage2})   
app.post('/signup',profile_img.single("photo"),(req,res)=>{
    const {photo,name,email,number,password,cpassword} =req.body;
    //  const photo =  req.file
    console.log(photo)
    let service = 'insert into msm_signup(photo,name,email,number,password,cpassword) values(?)'
    let val = [photo,name,email,number,password,cpassword]
    con.query(service,[val],(err,result) =>{
                if(err){
                    console.log(err)
                }
                else{
                    console.log(result)
                    console.log('data saved')
                    res.redirect('/admin')
                 }
            })
    });

// app.get('/login', async (req, res, next) => {
//     try {
//         req.session.destroy(function (err) {
//             if (err) {
//                 console.log(err);
//             } else {
//                 res.clearCookie();
//             }
//             res.render('dashboard/login');
//         });
//     } catch (err) {
//         console.log(err)
//         return next(err);
//     }
//   });
// app.get('/logout',  function (req, res, next)  {
//     if (req.session) {
//       // delete session object
//       req.session.destroy(function (err) {
//         if (err) {
//           return next(err);
//         } else {
//           return res.redirect('/login');
//         }
//       });
//     }
//   });





    app.get('/login',(req,res) =>{
        res.render('dashboard/login')
    })
    app.post('/login',(req,res) =>{
        
         let email = req.body.email;
        let password = req.body.password;
       
    
        let signup = " select * from msm_signup where email=? and password=?";
       
        con.query(signup,[email,password],(err,result)=>{
            if(err){
                console.log(err)
            }  else{
                if(result.length > 0){
                    req.session.user=email
                    res.redirect('/admin')
                }
                else{
                    res.redirect('/login')
                }
            }
        })
    })



app.get('/admin',redirectlogin,(req,res)=>{
    if(req.session.user){
        res.render('dashboard/admin') 
    }else{
        res.render('dashboard/login')
    }
    
})

app.get('/viewservices',redirectlogin,(req,res) =>{

    let masmservice = "select * from msm_car_service";
    
    con.query(masmservice,(err,result) =>{
        if(err) throw err;
     
        res.render('dashboard/viewservice',{data : result})
      
    })
    
    });

    app.get('/viewcontact', redirectlogin,(req,res)=>{
        let msmcontact = "select * from msm_contact";
        con.query(msmcontact,(err,result)=>{
            if(err) throw err
            res.render('dashboard/viewcontact',{data : result})
        })
    });

    app.get('/viewinsurance', redirectlogin,(req,res)=>{
        let msminsurance = "select * from msm_insurence";
        con.query(msminsurance,(err,result)=>{
            if(err) throw err
            res.render('dashboard/viewinsurance',{data : result})
        })
    });

    
    app.get('/viewservices', redirectlogin,(req,res) =>{

        let masmservice = "select * from msm_car_service";
        
        con.query(masmservice,(err,result) =>{
            if(err) throw err;
         
            res.render('dashboard/viewservice',{data : result})
          
        })
        
        });

        app.get('/viewjobs', redirectlogin,(req,res)=>{
            let msmjobs = "select * from msm_job";
            con.query( msmjobs,(err,result)=>{
                if(err) throw err
                res.render('dashboard/viewjobs',{data : result})
            })
        });

        app.get('/viewamc', redirectlogin,(req,res)=>{
            let amcform = "select * from msm_amc";
            con.query(amcform,(err,result)=>{
                if(err) throw err
                res.render('dashboard/viewamc',{data : result})
            })
        });

// ***************** post data

app.post('/contactus',(req,res)=>{

    const {name,email,subject,message} =req.body;
    let service = 'insert into msm_contact(name,email,subject,message) values(?)'
    let val = [name,email,subject,message]
    con.query(service,[val],(err,result) =>{
                if(err){
                    console.log(err)
                }
                else{
                    console.log(result)
                    console.log('data saved')
                    res.redirect('/contactus')
                 }
            })
    });

app.post('/form',(req,res)=>{

    const {servicetype,addwork,location,carmodel,regnumber,pdate,fname,lname,email,pincode,pnumber,pick} =req.body;
    
       
    
        let service = 'insert into msm_car_service(servicetype,addwork,location,carmodel,regnumber,pdate,fname,lname,email,pincode,pnumber,pick) values(?)'
    
        let val = [servicetype,addwork,location,carmodel,regnumber,pdate,fname,lname,email,pincode,pnumber,pick]
    
        con.query(service,[val],(err,result) =>{
                if(err){
                    console.log(err)
                }
                else{
                    console.log(result)
                    console.log('data saved')
                    res.redirect('/form')
                 }
            })
    });

app.post('/insuranceform',(req,res)=>{

    const {location,servicetype,carmodel,regnumber,chassisnumber,enginenumber,currentinsurance,firstname,lastname,email,pincode,phonenumber} =req.body;
    let service = 'insert into msm_insurence(location,servicetype,carmodel,regnumber,chassisnumber,enginenumber,currentinsurance,firstname,lastname,email,pincode,phonenumber) values(?)'
    let val = [location,servicetype,carmodel,regnumber,chassisnumber,enginenumber,currentinsurance,firstname,lastname,email,pincode,phonenumber]
    con.query(service,[val],(err,result) =>{
                if(err){
                    console.log(err)
                }
                else{
                    console.log(result)
                    console.log('data saved')
                    res.redirect('/insuranceform')
                 }
            })
    });

// 
const storage = multer.diskStorage({
    destination : function(req,file,cb){
        cb(null,'upload')
    },filename:function(req,file,cb){
        cb(null,Date.now()+"-"+file.originalname)
    } 
})
const fileFilter =(req, file, cb) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|pdf|PDF)$/)) {
        return cb(new Error('File must be of type JPG, JPEG, or PNG and nore more than 2MB in size'))
    }
    cb(undefined, true)
  }
//   const upload = multer({dest:'/upload'})     short form
const upload  = multer({storage , fileFilter})
    app.post('/jobforms',upload.single("resume"),(req,res) =>{
        const {location,postapply,name,fathername,dateofbirth,phonenumber,email,qualification,tecqualification,branch,experience,accept} =req.body;
         const resume =  req.file.filename
         console.log(resume)
        let jobform = 'insert into msm_job(location,postapply,name,fathername,dateofbirth,phonenumber,email,qualification,tecqualification,branch,experience,resume,accept) values (?)'

        let val = [location,postapply,name,fathername,dateofbirth,phonenumber,email,qualification,tecqualification,branch,experience,resume,accept]

        con.query(jobform,[val],(err,result)=>{
            if(err){
                console.log(err)
            }
            else{
                console.log(result)
                console.log('data saved')
                res.redirect('/jobforms')
             }
        })

    });

    app.post('/amcform',(req,res)=>{
        const {location,fname,lname,email,pnumber,regnumber,carmodel,reading,plan}=req.body;
        let amcform = "insert into msm_amc(location,fname,lname,email,pnumber,regnumber,carmodel,reading,plan) values (?)";
        let val = [location,fname,lname,email,pnumber,regnumber,carmodel,reading,plan]

        con.query(amcform,[val],(err,result) =>{
            if(err){
                console.log(err)
            }
            else{
                console.log(result)
                console.log('data saved')
                res.redirect('/amcform')
             }
        })
    })
    
   
    
   


app.listen(5000)