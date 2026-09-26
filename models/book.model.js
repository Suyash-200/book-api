const mongoose = require("mongoose")
const mongoosePaginate = require("mongoose-paginate-v2")

const bookSchema = new mongoose.Schema({
    title:{
        type: String
    },
    author:{
        type: String,
        require: true
    },
    price:{
        type: String
    },
    category:{
        type: String
    },
    publishedYear:{
        type: String
    },
    description:{
        type: String
    },
})

bookSchema.plugin(mongoosePaginate)

const Book = mongoose.model("book", bookSchema)
module.exports = Book