var express = require('express');
var bodyParser = require('body-parser');
var fileupload = require ('express-fileupload');
var fs = require('fs');

var path = require('path')

var server = express();

var PORT = process.env.PORT || 3210

server.use(bodyParser.urlencoded({extended: false}));
server.use(bodyParser.json());
server.use(fileupload());
server.use(express.static(__dirname + '/public'))

server.get('/', function(req, res){
  res.sendFile(__dirname + '/public/index.html');
})

server.post('/', function(req, res){
  if(!req.files.file){
    res.send('Pas de fichier à traiter');
  } else {
    var file = req.files.file
    var ext = path.extname(file.name);
    if( ext !== ".txt" && ext !== ".dsio"){
      res.send('Format de fichier incorrect')
    } else {
      file.mv(__dirname+'/public/upload/'+file.name, function(err){
        if(err){
          res.status(500).send(err);
        } else {
          //res.send('Traitement du fichier')
          modifDsio(__dirname+'/public/upload/'+file.name, function(err, data){
            if(err){
              throw err
            } else {
              console.log('download: ',data)
              //res.download(data)
              //res.send('<div class="download-link"><a href="/download/dsio1533548851842.dsio">VOTRE FICHIER</a></div>')
              res.download(data,'Dsio.dsio')
            }
          })
        }
      })
    }    
  }
});

server.listen(PORT)

function modifDsio(dsioFile, cb){
  var dt = Date.now();

  let newFile = (__dirname+'/public/download/dsio'+dt+'.txt')//(__dirname+'/public/download/rico.txt');//;

  fs.readFile(dsioFile,'utf8', function (err, data){
    if(err) throw err;
    
    let content = data.replace(/\n/g,'\r');
    console.log('modifying file ....');
    fs.writeFileSync(newFile,content,'utf8');
    console.log('file saved !');

    console.log('callback');
    cb(undefined,newFile)
    
  })
}
