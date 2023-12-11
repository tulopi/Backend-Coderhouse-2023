export const cookieController = {
    session: async (req, res) => {
        const { name, email} = req.body;
        req.session.name = name;
        req.session.email = email;
        res.send("session");
    },
    view: async (req, res) => {
        res.send("View cookie");
    }
};