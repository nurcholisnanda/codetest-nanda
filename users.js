const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const connectDB = require("./db");
connectDB();
const redis = require("./redis");
const authorize = require("./authorization");
const User = require("./user");
let port = process.env.PORT || 3000;

app.use(bodyParser.json());

require("./user")
const userdata = mongoose.model("userdata")



app.get("/token", (req, res) => {
    const payload ={
        name : "Nanda"
    }
    const token = jwt.sign(payload, "secret key");
    res.send(token);
})

app.get("/", (req, res) => {
    res.send({
        "name" : "nanda nurcholis",
        "generate token" : "get /token",
        "create user" : "post /user",
        "read all user" : "get /users",
        "read user by id" : "get /user/<id>",
        "read user by accountNumber" : "get /user?accountNumber=<accountNumber>",
        "read user by identityNumber" : "get /user?accountNumber=<identityNumber>",
        "update user" : "put /user/<id>",
        "delete user" : "delete /user/<id>"
    })
});

function createUser(request) {
    return new Promise((resolve, reject) => {
        // Instantiate Product Model by specified request body
        const newUser = new User(request);

        // Validate the model instance and handle the validation error's response.
        const errValidation = newUser.validateSync();
        if (errValidation) {
            console.log(`[ERROR] - <createUser> details: \n`, errValidation);
            return reject({ error: errValidation, message: 'Unable to create a new User.', status: 400});
        }

        // Save the Product instance into MongoDB server
        newUser.save((err, createdUser) => {
            // Handle error's response
            if (err) {
                console.log(`[ERROR] - <createUser> details: \n`, err);
                return reject({ error: err, message: 'Unable to create a new User.', status: 400});
            }
            console.log(`[INFO] - <createUser> Returning created record.`);
            resolve(createdUser);
        });
    });
}

function update(id, changedData) {
    return new Promise((resolve, reject) => {
        // Instantiate Product Model by specified request body
        const changedUser = new User(changedData);

        // Validate the model instance and handle the validation error's response.
        const errValidation = changedUser.validateSync();
        if (errValidation) {
            console.log(`[ERROR] - <update> details: \n`, errValidation);
            return reject({ error: errValidation, message: 'Unable to update a User.', status: 400});
        }
        
        User.findByIdAndUpdate(id, changedData, { new: true }, (err, updatedUser) => {
            if (err) {
                console.log(`[ERROR] - <update> Details: \n`, err);
                return reject({ error: err, message: 'Unable to update a User.', status: 400});
            }
            console.log(`[DEBUG] - <update> updatedUser: \n`, updatedUser);
            return resolve(updatedUser);
        });
    });
}

  

//Create userdata
app.post("/user", authorize(), async (req, res) => {
    try { 
        const createdUser = await createUser(req.body);
        res.status(200).json(createdUser);
        const redis_key = "users";
        redis.del(redis_key);
    } catch(err) {
        res.status(err.status).json(err);
    }
})

//Update userdata
app.put("/user/:id", authorize(), async (req, res) => {
    try {
        const changedUser = await update(req.params.id, req.body);
        redis.del(req.params.id)
        res.status(200).json(changedUser);
    } catch (err) {
        res.status(err.status).send(err);
    }
})

//Get all userdatas
app.get("/users", authorize(), async (req,res) => {
    console.log("Success fetch from database");
    const redis_key = "users";
    const { reply } = await redis.get(redis_key);

    if (reply) {
        res.status(200).send(reply);
    } else {
        userdata.find().then((userdatas) => {
            console.log(userdatas)
            const dataFromDB = {
                success : true,
                message : "success fetch data",
                data : userdatas,
            };
            redis.set(redis_key, JSON.stringify(dataFromDB));
            res.status(200).send(dataFromDB);
        }).catch(err => {
            if(err) {
                res.status(err.status).send(err);
            }
        })
    }
})

//Get one userdata
app.get("/user/:id", authorize(), async (req, res) => {
    const { reply } = await redis.get(req.params.id);

    if (reply) {
        res.status(200).send(reply);
    } else { 
        userdata.findById(req.params.id).then((user) => {
            if(user) {
                const dataFromDB = {
                    success : true,
                    message : "success fetch data",
                    data : user,
                };
                redis.set(req.params.id, JSON.stringify(dataFromDB));
                res.status(200).send(dataFromDB);
            } else {
                res.sendStatus(404);
            }
        }).catch(err => {
            if(err) {
                res.status(err.status).send(err);
            }
        });
    }
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
        redis.del(req.params.id);
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