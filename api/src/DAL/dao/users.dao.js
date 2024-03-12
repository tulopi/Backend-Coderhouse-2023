import { userModel } from "../../models/user.model.js";
import { transporter } from "../../utils/nodemailer.js";
import { StatusError } from "../../utils/statusError.js";
import BasicMongo from "./basic.dao.js";

class UsersMongo extends BasicMongo {
  constructor() {
    super(userModel);
  }

  async findOneByEmail(email) {
    try {
      const user = await this.model.findOne({ email });
      return user;
    } catch (error) {
      throw new StatusError("Error finding user by email", 500);
    }
  }

  async findById(id) {
    try {
      const user = await userModel.findById(id).populate("cart");
      if (!user) {
        throw new StatusError(`User with ID ${id} not found`, 404);
      }
      return user;
    } catch (error) {
      throw new StatusError("Error finding user by ID", 500);
    }
  }

  async getUserById(id) {
    try {
      const user = await userModel.findById(id);
      if (!user) {
        throw new StatusError(`User with ID ${id} not found`, 404);
      }
      return user;
    } catch (error) {
      throw new StatusError("Error finding user by ID", 500);
    }
  }
  async createUser(user) {
    try {
      const response = await userModel.create(user);
      return response;
    } catch (error) {
      throw new StatusError("Error creating user", 500);
    }
  }

  async updatePremium(id) {
    try {
      const userFromDb = await userModel.findById(id);
      if (!userFromDb) throw new StatusError("user not found", 404);

      const newRole =
        userFromDb.role === "user"
          ? "premium"
          : userFromDb.role === "premium"
          ? "user"
          : userFromDb.role;

      const updatedUser = await userModel.findByIdAndUpdate(
        id,
        { role: newRole },
        { new: true }
      );
      return updatedUser;
    } catch (error) {
      throw new StatusError(error.message, 500);
    }
  }

  async getAllUsers() {
    try {
      const users = await userModel
        .find()
        .select("first_name last_name email role")
        .exec();
      return users;
    } catch (error) {
      throw new StatusError(error.message, 500);
    }
  }

  async softDelete() {
    try {
      const twoDaysAgo = new Date();
      twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

      const users = await userModel.find({
        last_connection: { $lt: twoDaysAgo },
      });

      await Promise.all(
        users.map(async (user) => {
          const mailOptions = {
            from: "tulo.nv@gmail.com",
            to: user.email,
            subject: "Account Deletion Notification",
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
                                    background-color: #f44336;
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
                                    <h2>Account Deletion Notification</h2>
                                </div>
                                <div class="content">
                                    <p>Dear ${user.first_name} ${user.last_name},</p>
                                    <p>We regret to inform you that your account has been deleted due to inactivity.</p>
                                    <p>If you wish to continue using our service, please feel free to create a new account.</p>
                                    <p>Thank you for your understanding.</p>
                                </div>
                                <div class="footer">
                                    <p>If you have any questions, please contact our support team.</p>
                                </div>
                            </div>
                        </body>
                    </html>
                `,
          };
          await transporter.sendMail(mailOptions);
        })
      );

      const deletedUsers = await userModel.deleteMany({
        last_connection: { $lt: twoDaysAgo },
      });

      return deletedUsers;
    } catch (error) {
      throw new StatusError(error.message, 500);
    }
  }
}

export const usersMongo = new UsersMongo();
