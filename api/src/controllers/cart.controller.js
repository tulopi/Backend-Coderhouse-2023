import { cartService } from "../services/cart.services.js";
import { userServices } from "../services/user.services.js";

import { handleServerError } from "../loggers/errorHandler.js";
import { transporter } from "../utils/nodemailer.js";

export const cartController = {
  getAllCarts: async (req, res) => {
    try {
      const carts = await cartService.findAll();
      res.status(200).json({ message: "Carts found", carts });
    } catch (error) {
      handleServerError(res, error, req);
    }
  },

  createCart: async (req, res) => {
    try {
      const newCart = await cartService.createCart(req);
      res.status(200).json({ message: "Cart created", cart: newCart });
    } catch (error) {
      handleServerError(res, error, req);
    }
  },

  createCartSocket: async (req, res) => {
    try {
      const newcart = await cartService.createSocketCart(req);
      return newcart;
    } catch (error) {
      console.log({ message: error.message }, "cart.controller");
    }
  },
  getCartById: async (req, res) => {
    const { id } = req.params;
    try {
      const cart = await cartService.findCartById(id);
      res.status(200).json({ message: "Cart found", cart });
    } catch (error) {
      handleServerError(res, error, req);
    }
  },

  addProductToCart: async (req, res) => {
    const user = req.user;
    console.log(user);
    const userFromDB = await userServices.findById(user);
    const { pid } = req.params;
    const cid = userFromDB.cart;
    const { quantity } = req.body;
    try {
      const updatedCart = await cartService.addProductToCart(
        cid,
        pid,
        quantity
      );
      res
        .status(200)
        .json({ message: "Product added to cart", cart: updatedCart });
    } catch (error) {
      handleServerError(res, error, req);
    }
  },

  removeProductFromCart: async (req, res) => {
    const user = req.user;
    const userFromDB = await userServices.findById(user);
    const { pid } = req.params;
    const cid = userFromDB.cart;
    try {
      const updatedCart = await cartService.removeProductFromCart(cid, pid);
      res
        .status(200)
        .json({ message: "Product removed from cart", cart: updatedCart });
    } catch (error) {
      handleServerError(res, error, req);
    }
  },

  updateProductQuantity: async (req, res) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    try {
      const updatedCart = await cartService.updateProductQuantity(
        cid,
        pid,
        quantity
      );
      res
        .status(200)
        .json({
          message: "Product quantity updated in cart",
          cart: updatedCart,
        });
    } catch (error) {
      handleServerError(res, error, req);
    }
  },

  clearCart: async (req, res) => {
    const { cid } = req.params;
    try {
      const clearedCart = await cartService.clearCartByCid(cid);
      res.status(200).json({ message: "Cart cleared", cart: clearedCart });
    } catch (error) {
      handleServerError(res, error, req);
    }
  },

  deleteCart: async (req, res) => {
    const { cid } = req.params;
    try {
      const deletedCart = await cartService.deleteCartByCid(cid);
      res.status(200).json({ message: "Cart deleted", cart: deletedCart });
    } catch (error) {
      handleServerError(res, error, req);
    }
  },
  purchase: async (req, res) => {
    try {
      const getUser = await userServices.findById(req.user._id);
      const idCart = getUser.cart;
      const user = req.user;
      const response = await cartService.purchase(idCart, user);
      const mailOptions = {
        from: "tulo.nv@gmail.com",
        to: getUser.email,
        subject: "Purchase Confirmation",
        html: `
                    <html>
                        <head>
                            <style>
                                body {
                                    font-family: Arial, sans-serif;
                                }
                                .container {
                                    max-width: 600px;
                                    margin: 0 auto;
                                }
                                .header {
                                    background-color: #4CAF50;
                                    color: white;
                                    padding: 1em;
                                    text-align: center;
                                }
                                .content {
                                    padding: 1em;
                                }
                                .footer {
                                    background-color: #f1f1f1;
                                    padding: 1em;
                                    text-align: center;
                                }
                            </style>
                        </head>
                        <body>
                            <div class="container">
                                <div class="header">
                                    <h2>Purchase Confirmation</h2>
                                </div>
                                <div class="content">
                                    <p>Dear ${getUser.firstName} ${getUser.lastName},</p>
                                    <p>Your purchase has been successfully processed.</p>
                                    <p>Details:</p>
                                    <ul>
                                        <li>Amount: $${response.newTicket.amount}</li>
                                        <li>Ticket Code: ${response.newTicket.code}</li>
                                        <li>Purchase Time: ${response.newTicket.purchase_datetime}</li>
                                    </ul>
                                    <p>Thank you for choosing our service!</p>
                                </div>
                                <div class="footer">
                                    <p>If you have any questions, please contact our support team.</p>
                                </div>
                            </div>
                        </body>
                    </html>
                `,
      };

      // Resto del código para enviar el correo...

      await transporter.sendMail(mailOptions);
      res.status(200).json({ response });
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  },
};
