import User from "../ctrls/users";

export = (app) => {

    const endpoint = process.env.API_BASE + "users";

    app.post(endpoint, User.create);

    app.get(endpoint, User.getAll);

    app.put(endpoint + "/:id", User.update);

    app.delete(endpoint + "/:id", User.delete);
};
