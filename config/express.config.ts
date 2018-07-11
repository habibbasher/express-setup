const dotenv = require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const expressValidator = require("express-validator");
import * as mongoose from "mongoose";
import * as bluebird from "bluebird";
(<any>mongoose).Promise = bluebird;
import { mongooseConfig } from "./db.config";

const authentication = require("../auth/authentication").default;

export = () => {

    mongooseConfig(mongoose);

    let app = express();

    app.use(bodyParser.json());
    app.use(expressValidator({
        customValidators: {
            isArray: function (value) {
                return Array.isArray(value);
            }
        }
    }));

    // so we can get the client's IP address
    app.enable("trust proxy");

    app.use(authentication.initialize());

    app.all(process.env.API_BASE + "*", (req, res, next) => {
        if (req.path.includes(process.env.API_BASE + "login")) return next();

        return authentication.authenticate((err, user, info) => {
            if (err) { return next(err); }
            if (!user) {
                if (info.name === "TokenExpiredError") {
                    return res.status(401).json({ message: "Your token has expired. Please generate a new one" });
                } else {
                    return res.status(401).json({ message: info.message });
                }
            }
            app.set("user", user);
            return next();
        })(req, res, next);
    });

    const routes = require("../routes")(app);

    return app;
};
