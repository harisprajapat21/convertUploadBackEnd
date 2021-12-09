const Joi = require('joi');
const cors = require('cors')
const mongoose = require('mongoose');
const express = require('express');
const app = express();
app.use(express.json());

main().then(() => console.log('connection successfully...')).catch(err => console.log(err));

const schema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: { type: String, required: true, unique: true },
    date: {
        type: Date,
        default: Date.now
    },
    active: Boolean
})

const User = mongoose.model('User', schema);

module.exports = User;

async function main() {
    await mongoose.connect('mongodb://localhost:27017/uploadConverter');
}


const getUsers = async (param1, param2, res) => {
    try {
        const result = await User.find(param1).select(param2)
        const resultObj = {};
        if (result && result.length > 0) {
            resultObj.isSuccess = true;
            resultObj.data = result;
            res.send(resultObj)
        } else {
            resultObj.isSuccess = false;
            resultObj.message = "user is not available!";
            res.status(200).send(resultObj)
        }

    } catch (err) {
        res.status(404).send(err)
    }
}

function validateApi(apiType, data) {
    let objValidation;
    switch (apiType) {
        case 'login':
            objValidation = {
                username: Joi.string().min(3).required(),
                password: Joi.string().min(6).required()
            };
            break;

        default:
            break;
    }
    const schema = Joi.object(objValidation);
    return schema.validate(data);
}
// getUsers({userName:'hkuma118'},{email:1,active:2,date:3});

// //cors//
var corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
  }
app.use(cors(corsOptions));
app.get('/api/users', (req, res) => {
    getUsers({ username: 'hkuma118' }, { email: 1, active: 2, date: 3 }, res);
})
app.post('/api/login', (req, res) => {
    const { error } = validateApi('login', req.body);
    if (error) return res.status(400).send(error.details[0].message);
    getUsers(req.body, { email: 1, active: 2, date: 3 }, res);
});
const port = process.env.PORT || 3000
app.listen(port, () => { console.log(`listening on port ${port}....`) })