const bcrypt = require("bcryptjs");
const User = require("../models/userModel");

exports.signUp = async (req, res) => {
    const { userName, password } = req.body;

    const isUserExist = await User.findOne({ userName });

    if (isUserExist) {
        return res.status(400).json({
            status: "Fail",
            message: "User exist"
        })
    }

    const hashPassword = await bcrypt.hash(password, 12);

    try {
        const newUser = await User.create({
            userName,
            password: hashPassword
        });

        req.session.user = newUser;
        res.status(201).json({
            status: "Success",
            data: {
                user: newUser
            }
        });
    } catch(e) {
        res.status(400).json({
            status: "Fail"
        })
    }
}

exports.login = async (req, res) => {
    const { userName, password } = req.body;

    try {
        const user = await User.findOne({ userName });

        if (!user) {
            return res.status(404).json({
                status: "Fail",
                message: "User not found"
            });
        }

        const isCorrect = await bcrypt.compare(password, user.password);

        if (isCorrect) {
            req.session.user = user;
            res.status(200).json({
                status: "Success"
            })
        } else {
            res.status(404).json({
                status: "Fail",
                message: "Incorrect userName or password"
            });
        }

    } catch(e) {
        res.status(400).json({
            status: "Fail"
        })
    }
}