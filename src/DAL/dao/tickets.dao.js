import { ticketModel } from "../../models/ticket.model.js";
import { StatusError } from "../../utils/statusError.js";
import BasicMongo from "./basic.dao.js";

class TicketMongo extends BasicMongo {
    constructor(){
        super(ticketModel);
    }

    async createTicket(ticket) {
        try {
            const response = await ticketModel.create(ticket);
            return response;
        } catch (error) {
            throw new StatusError("Error creating ticket", 500);
        }
    }

    async getTickets() {
        try {
            const response = await ticketModel.find();
            return response;
        } catch (error) {
            throw new StatusError("Error retrieving tickets", 500);
        }
    }
}

export const ticketMongo = new TicketMongo();
