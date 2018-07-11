import Authentication from "../auth/authentication";

export = (app) => {
    app.post(process.env.API_BASE + "login", Authentication.login);
};
