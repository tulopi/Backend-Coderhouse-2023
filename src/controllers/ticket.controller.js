import { ticketServices } from "../services/ticket.services.js";
import { handleServerError } from "../loggers/errorHandler.js";

export const ticketController = {
    getAllTickets: async(req, res) => {
        try {
            const tickets = await ticketServices.getAllTickets();
            res.status(200).json({message:"Tickets found: ", tickets});
        } catch (error) {
            handleServerError(res, error, req);
        }
    }
};

