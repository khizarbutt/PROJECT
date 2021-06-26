const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true

    },
    cpassword: {
        type: String,
        required: true

    },
    country: {
        type: String,
        required: true

    },
    checkbox: {
        type: String,
        required: true

    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]



});

//As we are using instance not static so thats why .method is used
//Generating Tokens
userSchema.methods.generateAuthToken = async function() {
    try {
        const token = jwt.sign({ _id: this._id.toString() }, process.env.SECRET_KEY);
        this.tokens = this.tokens.concat({ token: token });
        await this.save();
        return token;
    } catch (error) {
        res.send('The error is' + error);
        console.log('The error is' + error);

    }
}

// Hashing using pre method(before saving data)
userSchema.pre('save', async function(next) {
    // Bcrypt hashing using 10 rounds
    if (this.isModified('password')) {
        //console.log(`The current password is ${this.password}`);
        this.password = await bcrypt.hash(this.password, 10);
        //console.log(`The current password is ${this.password}`);
        this.cpassword = await bcrypt.hash(this.password, 10);
    }

    next();
})






const Register = new mongoose.model("Steam", userSchema);
module.exports = Register;