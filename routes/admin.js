const router = require('express').Router()
const Admin = require('../Models/Admin')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const { body, validationResult } = require('express-validator')
const fetchAdmin = require('../middleware/fetchadmin');
const JWT_SECRET = "manishgupta$goodboy";

let validationforNewAdmin = [
    body('name', 'Enter a valid name').isLength({ min: 3 }),
    body('email', 'Enter valid email').isEmail(),
    body('password', 'password should be minimum length 5').isLength({ min: 5 })
]



router.post('/createadmin', validationforNewAdmin, async (req, res) => {

    let success = false;
    //if there are errors, return bad request and then error
    const errors = validationResult(req);

    //is any error then send bad request 400
    if (!errors.isEmpty()) {
        return res.status(400).json({ success, errors: errors.array() });
    }
    try {

        let admin = await Admin.findOne({ email: req.body.email })
        // this line = if admin already in the db then return the admin details otherwise return null
        // if admin exist then send bad request using json format
        // console.log("admin data using findOne()");
        // console.log(admin);
        if (admin) {
            return res.status(400).json({ success, error: "sorry this admin with same email already exist" })
        }

        const secPass = await bcrypt.hash(req.body.password, 10);

        admin = await Admin.create({
            name: req.body.name,
            email: req.body.email,
            password: secPass,
        })
        const data = {
            admin: {
                id: admin.id
            }
        }
        const authtoken = jwt.sign(data, JWT_SECRET)
        success = true;
        res.json({ success, authtoken })



    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server error")
    }
})

let validationforLogin = [

    body('email', 'Enter valid email').isEmail(),
    body('password', 'password cannot be blank').exists()
]

router.post('/adminlogin', validationforLogin, async (req, res) => {

    let success = false;
    //if there are errors, return bad request and then error
    const errors = validationResult(req);

    //is any error then send bad request 400
    if (!errors.isEmpty()) {
        return res.status(400).json({ success, errors: errors.array() });
    }
    const { email, password } = req.body;

    try {
        //check whether the admin already exists
        let admin = await Admin.findOne({ email })

        console.log(admin);
        if (!admin) {

            return res.status(400).json({ error: "Please try to login with correct credentials" })
        }

        const passwordCompare = await bcrypt.compare(password, admin.password)
        if (!passwordCompare) {
            success = false;
            return res.status(400).json({ success, error: "Please try to login with correct credentials" })
        }
        const data = {
            admin: {
                id: admin.id
            }
        }
        // console.log(admin.id);
        const authtoken = jwt.sign(data, JWT_SECRET)
        // console.log(authtoken);
        success = true;
        res.json({ success, authtoken })
        // res.json({ admin })
        // send respose the admin details that admin fill the form


    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server error")
    }
})

router.post("/getadmin", fetchAdmin, async (req, res) => {
    try {
        // console.log(req);
        const adminId = req.admin.id;
        console.log("get the admin id from jwt")
        console.log(adminId);
        const admin = await Admin.findById(adminId).select("-password")
        res.send(admin)
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server error")
    }
})

module.exports = router;
