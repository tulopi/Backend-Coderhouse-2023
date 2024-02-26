import { ticketMongo } from "../DAL/dao/tickets.dao.js";

class TicketServices {
    async getAllTickets() {
        return ticketMongo.getTickets();
    }
}

export const ticketServices = new TicketServices();