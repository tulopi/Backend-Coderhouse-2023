import { ticketMongo } from "../DAL/dao/tickets.dao.js";
import { ticketModel } from "../models/ticket.model.js";

class TicketServices {
    async getAllTickets() {
        return ticketMongo.getTickets();
    }
}

export const ticketServices = new TicketServices();