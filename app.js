//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const mongoose = require("mongoose");

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
mongoose.connect("mongodb+srv://admin-josue:LKAZyNsgRIbq83fZ@cluster0.p9dfg.mongodb.net/todoListDB?retryWrites=true&w=majority", {useUnifiedTopology: true, useNewUrlParser: true});

let route = "home";

const taskSchema = mongoose.Schema({
  name: String,
  type: String
});

const Task = mongoose.model("Task", taskSchema);

app.get("/", function(req, res) {
  Task.find({type: route}, function(err, data){
    if(err){
      console.log(err);
    }
    else{
      res.render("list", {listTitle: route, newListItems: data});
    }
  });
});

app.get("/:routeParam", function(req, res){
  if(req.params.routeParam !== "favicon.ico"){
    route = req.params.routeParam;
  }
  res.redirect("/");
});

app.post("/", function(req, res){

  const newTask = new Task({
    name: req.body.newItem,
    type: route
  });
  newTask.save();
  res.redirect("/");
});

app.post("/delete", function(req, res){
  const checkedItem = req.body.checkBox;

  Task.findByIdAndRemove(checkedItem, function(err){
    if(err){
      console.log(err);
    }
    else{
      res.redirect("/");
    }
  });
});

app.get("/about", function(req, res){
  res.render("about");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});