
import express from "express";

import { DriverFactory } from "./drivers/driverFactory.ts";
import StorageDriver from "./drivers/storageDriver.ts";


const app = express();
app.use(express.json());


// Create the storage driver
const driver = DriverFactory.createDriver("mongo", {
    connectionString: "mongodb://localhost:27017",
    dbName: "nie-db"
});



// Create a wrapper for each method in the driver to be called via RPC
const handlers: { [key: string]: Function } = {
};

for (const methodName of Object.getOwnPropertyNames(Object.getPrototypeOf(driver))) {
    if (methodName !== "constructor" && typeof driver[methodName] === "function") {
        handlers[methodName] = async (...args: any[]) => {
            return await driver[methodName](...args);
        };
    }
}

// Expose the RPC endpoint, which takes a method name and parameters, calls the corresponding handler, and returns the result
app.post("/rpc", async (req, res) => {

    // TODO: Authentication :)

    const { method, params } = req.body;

    if (!(method in handlers)) {
        return res.status(400).json({ error: "Unknown method" });
    }

    const out = await handlers[method](...params);
    res.json({ result: out });
});

app.listen(3000);
