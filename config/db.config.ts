const log = require("./logger.config").log;

export function mongooseConfig(mongoose: any) {
    const gracefulExit = function () {
        mongoose.connection.close(() => {
            console.log(`Mongoose connection ` +
                `has disconnected through app termination`);

            process.exit(0);
        });
    };

    mongoose.connection.on("connected", (ref: any) => {

        console.log(`Successfully connected to ${process.env.NODE_ENV}` +
            ` database on startup `);
    });

    // If the connection throws an error
    mongoose.connection.on("error", (err: Error) => {

        console.error(`Failed to connect to ${process.env.NODE_ENV} ` +
            ` database on startup `, err);
    });

    // When the connection is disconnected
    mongoose.connection.on("disconnected", () => {

        console.log(`Mongoose default connection to ${process.env.NODE_ENV}` +
            ` database disconnected`);
    });

    // If the Node process ends, close the Mongoose connection
    process.on("SIGINT", gracefulExit).on("SIGTERM", gracefulExit);

    // Connect to our MongoDB database using the MongoDB
    // connection URI from our predefined environment variable
    mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true }, (error: Error) => {

        if (error)
            throw error;
    });
}


// switch (process.env.NODE_ENV) {
//     case "test":
//         dbName = "todo_test";
//         break;
//     case "production":
//         dbName = "todo";
//         break;
//     default:
//         dbName = "todo_dev";
// }

// mongoose.connect(`mongodb://${process.env.DB_IP}:27017/${dbName}`);

// mongoose.connection.on("error", (err) => {
//     if (err.message.indexOf("ECONNREFUSED") !== -1) {
//         log.error("Error: The server was not able to reach MongoDB.\nMaybe it"s not running?");
//         process.exit(1);
//     } else {
//         throw err;
//     }
// });
