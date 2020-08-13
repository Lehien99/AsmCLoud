const express = require('express');
const engines = require('consolidate');
const app = express();

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));

var publicDir = require('path').join(__dirname,'/public');
app.use(express.static(publicDir));

//npm i handlebars consolidate --save
app.engine('hbs',engines.handlebars);
app.set('views','./views');
app.set('view engine','hbs');

app.get('/insert', (req,res)=>{
    res.render('insert');
})

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb+srv://vanhien:hienvan123@cluster0.7hfpc.mongodb.net/test";

app.post('/doInsert',async (req,res)=>{
    let inputName = req.body.txtName;
    let inputWeight = req.body.txtWeight;
    let newStudent = {name : inputName, weigh:inputWeight};

    let client= await MongoClient.connect(url);
    let dbo = client.db("StudentDB");
    await dbo.collection("Student").insertOne(newStudent);
    res.redirect('/');//
})

//localhost:3000
app.get('/',async function(req,res){
    let client= await MongoClient.connect(url);
    let dbo = client.db("StudentDB");
    let result = await dbo.collection("Student").find({}).toArray();
    res.render('index',{model:result});
})

app.get('/remove', async (req,res)=>{
    let id = req.query.id;
    var ObjectID = require('mongodb').ObjectID;
    let client= await MongoClient.connect(url);
    let dbo = client.db("StudentDB");
    await dbo.collection("Student").deleteOne({_id:ObjectID(id)});
    res.redirect('/');

})

const PORT = process.env.PORT || 3000;
app.listen(PORT);