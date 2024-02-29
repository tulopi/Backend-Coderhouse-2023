import { messagesMongo } from "../DAL/dao/message.dao.js";

class MessagesManager {
    async getMessages() {
        return messagesMongo.getMessages();
    };
    async createUser(email) {
        return messagesMongo.createUser(email);
    };

    async createMessage(userEmail, messageContent) {
        return messagesMongo.createMessage(userEmail, messageContent);
    };

    async deleteAllMessages() {
        return messagesMongo.deleteAllMessages();
    };
};

export const messageServices = new MessagesManager();