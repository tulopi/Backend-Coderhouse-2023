import { messagesModel } from "../../models/message.model.js"
import BasicMongo from "./basic.dao.js";

class MessagesMongo extends BasicMongo {
    constructor(){
        super(messagesModel)
    };

    async getMessages() {
        try {
            const response = await messagesModel.find().lean();
            return response;
        } catch (error) {
            throw error;
        }
    };
    async createUser(email) {
        try {
            const existingUser = await messagesModel.findOne({ email });
    
            if (existingUser) {
                return null;
            }
    
            const user = { email };
            const userResponse = await messagesModel.create(user);
            return userResponse;
        } catch (error) {
            throw error;
        }
    };
    async createMessage(userEmail, messageContent) {
        try {
    
            const user = await messagesModel.findOne({ email: userEmail });
            if (!user) {
                return null;
            }
            user.message.push(messageContent);
            const userResponse = await user.save();
            return userResponse;
        } catch (error) {
            throw error;
        }
    };
    async deleteAllMessages() {
        try {
            const deletedMessages = await messagesModel.deleteMany({});
            console.log("Messages deleted", deletedMessages);
            return deletedMessages;
        } catch (error) {
            console.log("Error deleting messages", error)
            throw error;
        }
        };
};

export const messagesMongo = new MessagesMongo();