const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const MessageSchema = new Schema({
    title: { type: String, required: true, maxLength: 30 },
    comment: { type: String, required: true, maxLength: 60 },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    timestamp: { type: Date, default: Date.now }})

MessageSchema.virtual("url").get(function () {
    return `/message/${this._id}`;
})

module.exports = mongoose.model("Message", MessageSchema);
