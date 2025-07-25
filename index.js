const express = require('express') ;
const app = express() ;
const path = require('path') ;
const fs = require('fs') ;
 
app.set("view engine" ,"ejs");
app.use(express.json()) ;
app.use(express.urlencoded({extended:true}));

app.use(express.static(path.join(__dirname,"public")));

app.get('/', function (req, res) {
    fs.readdir('./files', function (err, files) {
        if (err) {
            console.error('Error reading files:', err);
            return res.render("index", { files: [] }); // send empty array to avoid crash
        }
        res.render("index", { files: files });
    });
});


app.get('/file/:filename' , function(req,res){
    fs.readFile(`./files/${req.params.filename}` , "utf-8" , function(err,filedata){
        res.render('show', {filename: req.params.filename , filedata: filedata}) ;
    })
    
})

app.get('/edit/:filename' , function(req,res){
    res.render('edit' , {filename:req.params.filename}) ;
    
})

app.post('/edit' , function(req,res){
    fs.rename(`./files/${req.body.previous}` , `./files/${req.body.new}` , function(err){
        res.redirect("/") ;
    }) 
    
})

app.post('/create' , function(req,res){
    fs.writeFile(`./files/${req.body.title.split(' ').join('')}.txt` , req.body.details, function(err){
        res.redirect("/") ;
    })
    
})

app.post('/delete', function(req, res) {
    fs.unlink(`./files/${req.body.filename}`, function(err) {
        res.redirect("/");
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
