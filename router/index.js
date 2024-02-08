const router = require("express").Router();
const message = require('./MessageRouter')

router.use("/", message);

module.exports = router;
