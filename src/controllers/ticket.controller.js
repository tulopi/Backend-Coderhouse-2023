import { ticketServices } from "../services/ticket.services.js";

export const ticketController = {
    getAllTickets: async(req, res) => {
        try {
            const tickets = await ticketServices.getAllTickets();
            res.status(200).json({message:"Tickets found: ", tickets});
        } catch (error) {
            res.status(500).json({message: error.message})
        }
    }
};