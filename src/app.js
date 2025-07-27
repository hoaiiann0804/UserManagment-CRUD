const express = require('express')
const mongoose = require('mongoose');
require('dotenv').config();
const { Schema } = mongoose;
const app = express();
app.use(express.json())
const MONGO_URI = process.env.MONGO_URI || 'mongodb://mongodb:27017/userManagement'
const PORT = process.env.PORT || 3000;
mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('MongoDB Connected')).catch(err => console.log(err));

const userSchema = new Schema({
    username: String,
    email: {
        type: String,
        unique: true,
        required: true,
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'], // regex để kiểm tra định dạng email
        trim: true,
        lowercase: true
    },
    phone: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    address: String

})

// Tạo index duy nhất cho email và phone để đảm bảo ràng buộc ở DB
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ phone: 1 }, { unique: true });
const User = mongoose.model('User', userSchema); // User là một model được tạo bởi Mongoose, đại diện cho một collection trong MongoDB. Tên collection sẽ là users (Mongoose tự động chuyển User thành số nhiều users trong database).
User.init()
app.post('/user', async (req, res) => {
    try {
        let { username, email, phone, address } = req.body;
        if (!email || !phone) {
            return res.status(400).send({ message: 'Email and phone are required' })
        }
        // loại bỏ khoảng trắng 
        // kiểm tra sự tồn tại của email hoặc phone
        const userExisting = await User.findOne({ $or: [{ email }, { phone }] })
        if (userExisting) {
            console.log('Duplicate user found:', userExisting);
            if (userExisting.email === email) {
                return res.status(400).send({ message: 'Email already exists' });
            }
            if (userExisting.phone === phone) {
                return res.status(400).send({ message: 'Phone number already exists' });
            }
        }
        // Nếu không có trùng lặp, tạo user mới
        const user = new User({
            username,
            email,
            phone,
            address
        })
        await user.save()
        res.status(201).send(user)
    }
    catch (err) {
        if (err.code === 11000) {
            return res.status(400).send({ message: "Duplicate email or phone number" })
        }
        res.status(500).send({ error: err.message })
    }
})

app.get('/user', async (req, res) => {
    try {
        const users = await User.find()
        if (users.length === 0) {
            return res.status(404).send({ message: "No users found" })
        }
        res.json(users)
    }
    catch (err) {

        res.status(500).send({ error: err.message })
    }
})

app.get('/user/:id', async (req, res) => {
    const {id} = req.params;
    try {
        const user = await User.findById(id)
        if (!user) {
            return res.status(404).send({ message: "User not found" })
        }
        res.json(user)
    }
    catch (err) {
        return res.status(500).send({ message: err.message })
    }   
})

app.put('/user/:id', async (req, res)=>{
    console.log("PUT /user/:id called", req.params.id);
    const {id} = req.params;
    const {username, email, phone, address} = req.body;
    try{
        const user = await User.findByIdAndUpdate(id, {username, email, phone, address}, {runValidators: true, new: true})
        if(!user)
        {
            return res.status(404).send({message:"User not found"})
        }
        res.json(user)
    }
    catch(error)
    {
        res.status(500).send({message: error.message})
    }
})

app.delete('/user/:id', async (req, res) => {
    const {id} = req.params;
    try{
        const user = await User.findByIdAndDelete(id)
        if(!user)
        {
            return res.status(404).send({message: "User not found"})
        }
        res.json({message: "User deleted successfully"})
    }
    catch(error)
    {
        return res.status(500).send(({message: error.message}))
    }
})

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))
