const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser')
const dbConfig = require('./database/db.config');


mongoose.Promise = global.Promise;
mongoose.connect(dbConfig.db).then(() => {
    console.log('Database Successfully connected');
}, error => {
    console.log('Could not connect to database ', error)
});

const users = require('./models/user');
const app = express();
const router = express.Router();
app.use(router)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(cors());
app.use('Users', users);

app.listen(5001, () => {
    console.log('server is running on port 5001');
});

app.get('/getAllusers', async (req, res) => {
    let userData = await users.find({})
    try {
        res.send(userData);
    } catch (error) {
        res.status(500).send(error)
    }
});

app.post('/createUser', async (req, res) => {
    try {
        let { name, email, age } = req.body;
        const newUser = new users({
            name: name,
            email: email,
            age: age,
            slug: new Date().getTime()
        });

        newUser.save()
            .then(item => {
                console.log('Item saved to database');
            }).catch(error => {
                console.log('Unable to save to database');
            })
        res.send(newUser)
    } catch (error) {
        console.error(error);
    }
});

app.put('/updateUser', async (req, res) => {
    try {
        await users.findOneAndUpdate(req.query, req.body)
            .then(() => res.send({ message: 'User Updated Successfully' }))
            .catch((err) => console.log(err));
    } catch (error) {
        console.log(error);
    }
});

app.delete('/deleteUser', async (req, res) => {
    try {
        await users.findOneAndDelete(req.query).
            then(() => { res.status(200).send({ message: 'User Deleted Successfully' }) })
            .catch((error) => console.log(error))
    } catch (error) {

        console.log(error);
    }
})
