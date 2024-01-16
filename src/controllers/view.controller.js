import { productService } from "../services/product.services.js";
import { handleServerError } from "../loggers/errorHandler.js";
import { cartService } from "../services/cart.services.js";

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
            res.render("products", { product, cartId});
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

    renderCart: async (req, res) => {
        try {
            const { cid } = req.params;
            const cart = await cartService.findCartById(cid);
            if (!cart) {
                return res.status(404).json({ message: "Cart not found" });
            }
            res.render("carts", { cart });
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
        if (!req.session.passport) {
            return res.redirect("/login");
        }
        const { first_name, email } = req.user;
        res.render("profile", { user: { first_name, email } });
    },

    renderRestore: (req, res) => {
        res.render("restore");
    },

    renderError: (req, res) => {
        res.render("error");
    }
};

export default viewsController;