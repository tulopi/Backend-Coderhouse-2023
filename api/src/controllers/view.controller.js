import { productService } from "../services/product.services.js";
import { handleServerError } from "../loggers/errorHandler.js";
import { cartService } from "../services/cart.services.js";
import { StatusError } from "../utils/statusError.js";
import { productMongo } from "../DAL/dao/product.dao.js";
import mongoose from "mongoose";
import { productsModel } from "../models/product.model.js";
import { ticketMongo } from "../DAL/dao/tickets.dao.js";
import { usersMongo } from "../DAL/dao/users.dao.js";

export const viewsController = {
  renderProducts: async (req, res) => {
    try {
      const sortParam = req.query.sort;
      const query = await productService.getSortedQuery(sortParam);
      const user = req.user;
      const object = await productService.findAll({
        limit: req.query.limit,
        page: req.query.page,
        sortField: req.query.sort,
      });
      res.render("home", { object, user });
    } catch (error) {
      handleServerError(res, error, req);
    }
  },

  renderProductDetails: async (req, res) => {
    try {
      const cartId = req.user && req.user.cart ? req.user.cart : null;
      const { pid } = req.params;
      const product = await productService.findById(pid);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.render("products", { product, cartId });
    } catch (error) {
      handleServerError(res, error, req);
    }
  },

  renderChat: async (req, res) => {
    try {
      res.render("chat");
    } catch (error) {
      handleServerError(res, error, req);
    }
  },

  renderUsers: async (req, res) => {
    try {
      const data = await usersMongo.getAllUsers();
      res.render("users", {data});
    } catch (error) {
      handleServerError(res, error, req);
    }
  },

  renderCart: async (req, res) => {
    try {
      const cid = req.user.cart.toString();
      const cart = await cartService.findCartById(cid);

      if (!cart) throw new StatusError("Cart not found", 400);

      res.render("carts", { cart, cid });
    } catch (error) {
      handleServerError(res, error, req);
    }
  },
  renderLogin: (req, res) => {
    if (req.session.passport?.user) {
      return res.redirect("/profile");
    }
    res.render("login");
  },

  renderSignup: (req, res) => {
    if (req.session.user) {
      return res.redirect("/profile");
    }
    res.render("signup");
  },

  renderProfile: (req, res) => {
    if (!req.session || !req.user) {
      return res.status(500).send("Error: Sesión de usuario no encontrada");
    }
    const { first_name, email, role, _id } = req.user;
    res.render("profile", { user: { first_name, email, role, _id } });
  },

  renderChange: (req, res) => {
    res.render("change");
  },

  renderRestart: (req, res) => {
    try {
      const { id } = req.params;
      res.render("restart", { id });
    } catch (error) {
      handleServerError(res, error, req);
    }
  },

  renderRestore: (req, res) => {
    res.render("restore");
  },

  renderError: (req, res) => {
    res.render("error");
  },

  renderTicket: async (req, res) => {
    try {
      const {id} = req.params;
      const ticketFromDb = await ticketMongo.getById(id.toString());
      const userFromDb = await usersMongo.getById(ticketFromDb.purchaser.toString());
      const ticketData = {
        first_name: userFromDb.first_name,
        last_name: userFromDb.last_name,
        email: userFromDb.email,
        ticket_code: ticketFromDb.code,
        totalAmount: ticketFromDb.amount,
        date: ticketFromDb.purchase_datetime
      }
      ticketData.totalAmount = ticketData.totalAmount.toFixed(2);
      ticketData.date = ticketData.date.toLocaleDateString();
      res.render("ticket", {ticketData});
    } catch (error) {
      handleServerError(res, error, req);
    }
  },
};

export default viewsController;
