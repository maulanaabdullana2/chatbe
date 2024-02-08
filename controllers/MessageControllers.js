const Message = require('../models/MessagesModels');
const getmessage = async (req,res) =>{
    try {
        const message = await Message.find()
        res.status(200).json({
            status:"suksess",
            message:"get data message successfully",
            data:{
                message
            }
        })
    } catch (error) {
        res.status(500).json({ message: err.message });
    }
}

module.exports = {getmessage}




