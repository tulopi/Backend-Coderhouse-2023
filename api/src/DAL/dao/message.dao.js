import { messagesModel } from "../../models/message.model.js"
import BasicMongo from "./basic.dao.js";
import { StatusError } from "../../utils/statusError.js";

class MessagesMongo extends BasicMongo {
    constructor() {
        super(messagesModel);
    }

    async getMessages() {
        try {
            const response = await messagesModel.find().lean();
            return response;
        } catch (error) {
            throw new StatusError(error.message, 500);
        }
    }

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
            throw new StatusError(error.message, 500);
        }
    }

    async createMessage(userEmail, messageContent) {
        try {
            const user = await messagesModel.findOne({ email: userEmail });

            if (!user) {
                throw new StatusError("User not found", 404);
            }

            user.message.push(messageContent);
            const userResponse = await user.save();
            return userResponse;
        } catch (error) {
            if (error instanceof StatusError) {
                throw error;
            } else {
                throw new StatusError(error.message, 500);
            }
        }
    }

    async deleteAllMessages() {
        try {
            const deletedMessages = await messagesModel.deleteMany({});
            console.log("Messages deleted", deletedMessages);
            return deletedMessages;
        } catch (error) {
            console.log("Error deleting messages", error);
            throw new StatusError(error.message, 500);
        }
    }
}

export const messagesMongo = new MessagesMongo();