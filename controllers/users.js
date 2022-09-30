import {UserModel} from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pug from "pug";

export function destroyed(req, res, next) {
    res.clearCookie('Token');
    console.log("destroyed")
    res.redirect("/")
    next()
}

export function home(req, res, next) {
    res.render("home.pug")
    next()
}

export function newUserForm(req, res, next) {
    res.render("newUser.pug")

    next()
}

export function loginForm(req, res, next) {
    res.render("login.pug")
    next()
}

export function dashboard(req, res, next) {
    console.log("dash", req.cookies.token.token)
    res.render("dashboard.pug")
    next()
}

export async function newUser(req, res, next) {
    UserModel.findOne({mail: req.body.mail}, function (err, docs) {

        if (docs == null) {
            if (req.body.password === req.body.confirmPassword) {
                try {
                    bcrypt.hash(req.body.password, 10)
                        .then(async (hash) => {
                            const user = new UserModel({
                                firstName: req.body.firstName,
                                lastName: req.body.lastName,
                                mail: req.body.mail,
                                password: hash
                            })
                            const newUser = await UserModel.create(user)
                            //  res.status(200).json({status: "succès", data: newUser})
                            res.redirect("/signin")
                            next()
                        })
                } catch (err) {
                    res.status(500).json({status: "Erreur", message: err.message})
                    next()
                }
            } else {
                res.render("newUser.pug", {messages: req.flash('Les mdp doivent etre identiques')})
                next()
            }
        } else {
            res.redirect('/signin')
            next()
        }
    });
}

export function login(req, res, next) {
    UserModel.findOne({email: req.body.email})
        .then((user) => {
            if (!user) {
                res.redirect("/login")
                next()
            }
            bcrypt
                .compare(req.body.password, user.password)
                .then((valid) => {
                    if (!valid) {
                        return res.status(401).json({error: "Mot de passe incorrect"});
                    } else {
                        let token = {
                            userID: user._id,
                            token: jwt.sign(
                                {
                                    userID: user._id,
                                },
                                "RANDOM TOKEN SECRET",
                                {expiresIn: "24h"}
                            ),
                        }
                        console.log("toekn", token.token)
                        res.cookie("token", token.token)
                        // res.status(200).json(token)
                    }
                })
                .catch((error) => {
                    // res.status(500).json({error});
                    //si je fais un res.status : erreur "Cannot set headers after they are sent to the client"
                });
        })
        .catch((error) => {
            //si je fais un res.status : erreur "Cannot set headers after they are sent to the client"

        });
    // console.log("cookie", res.cookies.Token )
    res.redirect("/dashboard")

}

