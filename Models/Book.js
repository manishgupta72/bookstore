const  mongoose =require('mongoose');
const { Schema } = mongoose;


const BookSchema = new Schema({

    admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin'
    },
    BookName: {
        type: String,
        required: true,
    },
    AuthorName: {
        type: String,
        required: true,
    },
    Description: {
        type: String,
        required: true,

    },
    Price: {
        type: Number,
        required: true,

    },
    Image: {
        type: String,
        required: true,

    },
    date: {
        type: Date,
        default: Date.now,
    }
})



const Book = mongoose.model('Book', BookSchema)

module.exports = Book;