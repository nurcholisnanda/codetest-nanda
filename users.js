const express = require("express");
const jwt = require("jsonwebtoken");
const authorize = require("./authorization")
let port = process.env.PORT || 3000;

const app = express();
const bodyParser = require("body-parser");

app.use(bodyParser.json());

const mongoose = require("mongoose");

require("./user")
const userdata = mongoose.model("userdata")

mongoose.connect("mongodb+srv://nurcholis:nurcholis@clusterjp-u9ur2.mongodb.net/nanda-nurcholis?retryWrites=true&w=majority", () => {
    console.log("Database is connected")
});

app.get("/token", (req, res) => {
    const payload ={
        name : "Nanda"
    }
    const token = jwt.sign(payload, "secret key");
    res.send(token);
})


//Create userdata
app.post("/user", authorize(), (req, res) => {
    //this is our create func
    console.log(req.body)
    var newUser = {
        userName: req.body.userName,
        accountNumber: req.body.accountNumber,
        emailAddress: req.body.emailAddress,
        identityNumber: req.body.identityNumber
    }   
    var user = new userdata(newUser)
    user.save().then((user) => {
        res.json(user)
    }).catch((err) => {
        if(err) {
            res.status(err.status).send(err);
        }
    })
})

//Update userdata
app.put("/user/:id", authorize(), (req, res) => {
    //this is our create func
    console.log(req.body)
    var changedUser = {
        userName: req.body.userName,
        accountNumber: req.body.accountNumber,
        emailAddress: req.body.emailAddress,
        identityNumber: req.body.identityNumber
    }   
    var user = new userdata(changedUser)
    userdata.findByIdAndUpdate(req.params.id).then((user) => {
        res.json(user)
    }).catch((err) => {
        if(err) {
            res.status(err.status).send(err);
        }
    })
})

//Get all userdatas
app.get("/users", authorize(), (req,res) => {
    userdata.find().then((userdatas) => {
        console.log(userdatas)
        res.json(userdatas)
    }).catch(err => {
        if(err) {
            res.status(err.status).send(err);
        }
    })
})

//Get one userdata
app.get("/user/:id", authorize(), (req, res) => {
    userdata.findById(req.params.id).then((user) => {
        if(user) {
            res.json(user)
        } else {
            res.sendStatus(404);
        }
    }).catch(err => {
        if(err) {
            res.status(err.status).send(err);
        }
    })
})

//Get one userdata by query
app.get("/user", authorize(), (req, res) => {
    userdata.find(
        {
            $or: [
                {accountNumber:req.query.accountNumber},
                {identityNumber:req.query.identityNumber}
            ]
        }, function(err, user) {
        if (err) res.status(err.status).send(err);
        res.send(user)
    });
});

//Delete one userdata
app.delete("/user/:id", authorize(), (req, res) => {
    userdata.findByIdAndRemove(req.params.id).then(() => {
        res.send("User successfully removed!")
    }).catch(err => {
        if(err){
            res.status(err.status).send(err);;
        }
    })
})

app.listen(port, () => {
    console.log("Up and running! -- This is our user service")
})