import { create } from "domain";
import mongoose , {Schema,Document} from "mongoose";
export interface Message extends Document{
    _id: string; 
    content: string;
    createdAt: Date;
}
export interface User extends Document{
    username: string;
    email: string;
    password: string;
    verifyCode: string;
    verifyCodeExpiry: Date;
    isVerified: boolean;
    isAcceptingMessages: boolean;
    messages: Message[];
}

const messageSchema: Schema<Message> = new Schema({
    content: { 
        type: String, 
        required: true
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
});
const UserSchema: Schema<User> = new Schema({
    username: { 
        type: String, 
        required: [true, 'Username is required'],
    },
    email: { 
        type: String, 
        required: [true, 'Email is required'],
        unique: true,
        match: [/\S+@\S+\.\S+/, 'Email is invalid']
    },
    password: { 
        type: String, 
        required: true
    },
    verifyCode: { 
        type: String, 
        required: [true, 'Verification code is required']
    },
    verifyCodeExpiry: { 
        type: Date, 
        required: [ true, 'Verification code expiry is required']
    },
    isAcceptingMessages: { 
        type: Boolean, 
        default: true
    },
    isVerified: { 
        type: Boolean, 
        default: false
    },
    messages: [messageSchema]
});

const UserModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>('User', UserSchema);

export default UserModel;