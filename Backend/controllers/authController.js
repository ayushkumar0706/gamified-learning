const bcrypt = require('bcrypt');
const User = require("../Models/user");



async function register(req, res) {
    try {
        const { firstName, lastName, email, password, age, gender } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: "Email already registered" });
        }

        const user = await User.create({
            firstName,
            lastName,
            email,
            password,
            age,
            gender
        });

        res.status(201).json({
            message: "User registered successfully",
            user: {
                id: user._id,
                firstName: user.firstName,
                email: user.email,
                role: user.role
            }
        });

    }
    catch (err) {
        // console.error(err.stack);
        res.status(500).json({ message: "Server error", error: err.message });
    }
}



async function login ( req, res ){
    try{
        const { email, password } = req.body;

        const user = await User.findOne({email});
        if(!user){
            return res.status(401).json({message: 'Invalid email or password'});
        }

        const isAllowed = await bcrypt.compare(password, user.password);
         if (!isAllowed) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const token = user.getJWT();
        res.cookie('token', token);

        res.status(200).json({ message: "Login successful" });


    }
    catch(err){
        res.status(500).json({message: "Server error", error: err.message});
    }
}


module.exports = { login, register };