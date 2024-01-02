import { ticketModel } from "../../models/ticket.model.js";
import BasicMongo from "./basic.dao.js";

class TicketMongo extends BasicMongo {
    constructor(){
        super(ticketModel)  
    };
    async createTicket(ticket) {
        const response = await ticketModel.create(ticket);
        return response
    };
    async getTickets() {
        const response = await ticketModel.find();
        return response
    }
};

export const ticketMongo = new TicketMongo();