module.exports = (app) => {
    const Museum = require("../controllers/museum.controller.js");
    app.get("/api/visitors",Museum.fetchDetails)
};