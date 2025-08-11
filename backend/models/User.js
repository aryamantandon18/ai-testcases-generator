import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    githubId: String,
    login: String,
    accessToken: String,
},{
    timestamps:true
});

export default mongoose.model("User",userSchema);
