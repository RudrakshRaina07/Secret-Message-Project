import mongoose, {Schema, Document} from "mongoose"

export interface Message extends Document{
    content: string;
    createdAt: Date
}

export const MessageSchema: Schema<Message> = new Schema({
    content:{
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    }
})

export interface User extends Document{
    username: string;
    email: string;
    password: string;
    verifyCode: string;
    verifyExpiryCode: Date;
    isVerified: boolean;
    isAcceptingMessage: boolean;
    message: Message[];
}

const UserSchema = new Schema({
    username:{
        type: String,
        unique: true,
        required: [true, "Username is required"],
        trim: true,
    },
    email:{
        type: String,
        unique: true,
        required: [true, "Email is required"],
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please use a valid email address"]
    },
    password:{
        type: String,
        required: [true, "Password is required"],
    },
    verifyCode:{
        type: String,
        required: [true, "Verify Code is required"],
    },
    verifyExpiryCode:{
        type: Date,
        required: [true, "Verify Expiry Code is required"],
    },
    isVerified:{
        type: Boolean,
        default: false
    },  
    isAcceptingMessage:{
        type: Boolean,
        default: true,
    },
    messages: [MessageSchema]
})

const UserModel = mongoose.models.User as mongoose.Model<User> || mongoose.model("User", UserSchema)

export default UserModel