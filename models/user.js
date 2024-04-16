const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    first_name: { type: String, required: true, maxLength: 20 },
    last_name: { type: String, required: true, maxLength: 20 },
    username: { type: String, required: true, maxLength: 20 },
    password: { type: String, required: true },
    isMember: { type: Boolean, default: false },
    isAdmin: { type: Boolean, default: false }

});

UserSchema.virtual("name").get(function () {
    let fullname = `${this.first_name} ${this.last_name}`;
    return fullname;
})

UserSchema.virtual("url").get(function () {
    return `/user/${this._id}`;
})

module.exports = mongoose.model("User", UserSchema);
