const mysql = require('mysql');
const con = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : '',
    database : 'marutimsm'
})

con.connect((err) =>{
   if(err){
    console.log(err)
   }else{
    console.log('Database Connected')
   }

  
})






module.exports = con