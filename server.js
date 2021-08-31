const cors = require('cors');
const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path')
var mime = require('mime');


const PORT = process.env.PORT || 3001 ;


app.use(cors());
app.use(express.json())

app.get('/api', (req, res) => {
    res.json({
        message: "Hello from backend express.js"
    })
})



app.listen(PORT, ()=>{
    console.log(`Sever is now listening at port ${PORT}...`);
})




app.get('/download1', async function(req, res){

    req.setEncoding("base64");

    req.on('data', function(chunk) {
      console.log("START");
      fs.appendFileSync('./download-folder/test1', chunk, "base64");
       
    });

    req.on('end', function() {
        try {
          //const filename = path.basename('./download-folder/test1.jpeg');
          const mimetype = mime.lookup('./download-folder/test1');
          //res.setHeader('Content-disposition', 'attachment; filename=' + filename);
          res.setHeader('Content-type', mimetype);
          console.log(mimetype);
          //console.log(filename);
          
          res.send(req.body);

          //const filestream = fs.createReadStream(file);
          //filestream.pipe(res, "base64");
          console.log("THE END");
        }catch (err){
          res.statusCode = 400;
        return res.end(`error: ${err.message}`);
        }
    });
});


app.get('/download', function(req, res){

  let file = __dirname + '/upload-folder/happy.jpeg';

  var filename = path.basename(file);
  var mimetype = mime.lookup(file);
  res.setHeader('Content-disposition', 'attachment; filename=' + filename);
  res.setHeader('Content-type', mimetype);

  const filestream = fs.createReadStream(file);
  
  filestream.pipe(res);
  
    
  });
  
  app.get('/download2', async function(req, res){
    let file= "";
    req.setEncoding("base64");

    req.on('data', function(chunk) {
        file += chunk;
        console.log(chunk);
    });

    req.on('end', function() {
        try {
          const filename = path.basename(file);
          const mimetype = mime.lookup(file);
          res.setHeader('Content-disposition', 'attachment; filename=' + filename);
          res.setHeader('Content-type', mimetype);
          fs.writeFileSync('./download-folder/'+ filename, file, "base64");
          res.send(file);

          //const filestream = fs.createReadStream(file);
          //filestream.pipe(res, "base64");
        }catch (err){
          res.statusCode = 400;
        return res.end(`error: ${err.message}`);
        }
    });
});

