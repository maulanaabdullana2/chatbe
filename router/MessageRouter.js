const router = require("express").Router();
const message = require("../controllers/MessageControllers")

router.get('/messages', message.getmessage)

module.exports = router