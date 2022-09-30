import mongoose, {model} from "mongoose";
import uniqueValidator from "mongoose-unique-validator"

const {Schema} = mongoose

const UserSchema = new Schema({
    firstName: String,
    lastName: String,
    mail: String,
    password: String
})

UserSchema.plugin(uniqueValidator);

export const UserModel = model("user", UserSchema)