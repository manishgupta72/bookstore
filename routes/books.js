const router = require('express').Router();
const fetchadmin = require('../middleware/fetchadmin');
const fetchuser = require('../middleware/fetchuser');
const Book = require('../Models/Book')
const { body, validationResult } = require('express-validator'); //validation of user using 

var validationforAddBook = [
    body('BookName', 'enter a valid Book Name').isLength({ min: 5 }),
    body('AuthorName', 'enter a valid Author name').isLength({ min: 3 }),
    body('Description', 'enter descriptions at least 5 word').isLength({ min: 5 }),

]

//route 1 add books in mongo
router.post('/addbook', fetchadmin,validationforAddBook, async (req, res) => {

    try {

        const errors = validationResult(req);
        console.log("validatio errors", errors);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { BookName, AuthorName, Description, Price, Image } = req.body;
        console.log(BookName,AuthorName);
        const book = new Book({
            BookName,
            AuthorName,
            Description,
            Price,
            Image,
            admin: req.admin.id

        })

        const saveBook = await book.save();
        // console.log(req);
        res.json(saveBook);

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server error")
    }
})

//route 2 fetch all books from mongo

router.get("/fetchbooks", fetchadmin,fetchuser, async (req, res) => {

    try {

        // const books = await Book.find({ admin: req.admin.id })        
        const books = await Book.find({ admin: ("65aceeb0c789ea912314d6d7") })  //gives the static admin id for all users take the books 
        res.json(books);
        console.log(books);
            

    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Server Error")
    }

})



//route 2 update books in mongo
router.put('/updatebook/:id', fetchadmin, async (req, res) => {

    try {



        const { BookName, AuthorName, Description, Price, Image } = req.body;

        const newbook = {}
        if (BookName) { newbook.BookName = BookName };
        if (AuthorName) { newbook.AuthorName = AuthorName };
        if (Description) { newbook.Description = Description };
        if (Price) { newbook.Price = Price };
        if (Image) { newbook.Image = Image };

        let book = await Book.findById(req.params.id);

        // console.log(newbook);
        if (!book) { return res.status(404).send("Not Found") }
        console.log("req", req.admin);
        console.log(book.admin.toString());
        if (book.admin.toString() !== req.admin.id) {
            return res.status(401).send("Not Allowed");
        }
        book = await Book.findByIdAndUpdate(req.params.id, { $set: newbook }, { new: true })



        res.json({ book });

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server error")
    }
})

//route 2 update books in mongo
router.delete('/deletebook/:id', fetchadmin, async (req, res) => {

    try {





        let book = await Book.findById(req.params.id);

        console.log(book);
        if (!book) { return res.status(404).send("Not Found") }

        if (book.admin.toString() !== req.admin.id) {
            return res.status(401).send("Not Allowed");
        }

        console.log("delete", book.admin.toString())
        // console.log("delete",req)


        book = await Book.findByIdAndDelete(req.params.id)

        res.json({ "Success": "book has been deleted", book: book });

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server error")
    }
})

module.exports = router;