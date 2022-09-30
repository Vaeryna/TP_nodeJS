import jwt from "jsonwebtoken";

export default async function (req, res, next) {
    console.log("token", req.cookies.token)

    if (!req.cookies.token.token) {
        return res.status(403).json({
            error: "Vous devez être connecté pour accéder à cette route, veuillez obtenir un token"
        })
    }
    try {
        const token = jwt.verify(req.cookies.token.token, "RANDOM TOKEN SECRET")
        next();

    } catch (err) {
        res.status(403).json({
            error: "Token invalide"
        })
    }
};