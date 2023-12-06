const express = require('express');
const app = express();
const router = express.Router();
app.use(express.json());

// JWT token 
const jwt = require('jsonwebtoken');
const jwtKey = 'ramesh';

const fs = require('fs');
const { promisify } = require('util');

// Imageupload codes

const multer = require("multer");
const unlinkAsync = promisify(fs.unlink);

const singup = require('../Schema/singupSchema');
const blog = require('../Schema/BlogSchema');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./public/");
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
});

const fileFilter = (req, file, cb) => {
    if (
        file.mimetype === "image/jpg" ||
        file.mimetype === "image/png" ||
        file.mimetype === "image/jpeg" ||
        file.mimetype === "image/webp" ||
        file.minetype === "image/gif"
    ) {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
});

router.post('/add-user', async (req, res) => {
    try {
        const { username, email, phone, password } = req.body;
        const addAdmin = await singup.create({
            username: username,
            email: email,
            phone: phone,
            password: password,
            count: 0
        })
        console.log('addAdmin::: ', addAdmin);
        res.send({ message: "user added...", token: addAdmin._id });
    } catch (error) {
        console.log('error::: ', error);
        return res.send(error)
    }
})

router.post('/user-login', async (req, res, next) => {
    try {
        const loginValidate = await singup.findOne({
            username: req.body.username,
            password: req.body.password
        });
        if (loginValidate && loginValidate.count <= 3) {

            jwt.sign({ loginValidate }, jwtKey, { expiresIn: "60min" }, async (error, token) => {
                if (error) {
                    return res.send({ error: "User in invalid" });
                } else {
                    console.log('token::: ', token);
                    loginValidate.count = 0;
                    await loginValidate.save();
                    return res.send({ massage: "Login success...", auth: token });
                }
            })
        } else {
            const userNameFind = await singup.findOne({ username: req.body.username });
            if (userNameFind) {
                userNameFind.count = userNameFind.count + 1;
                await userNameFind.save();
                if (userNameFind.count < 3) {
                    return res.send({ massage: `User password is incorrect try ${3 - userNameFind.count}` })
                } else {
                    // await userNameFind.deleteOne();
                    return res.send({ massage: 'User is locked...' })
                }
            } else {
                return res.send({ massage: 'User is not found...' })
            }
        }
    } catch (error) {
        console.log('error::: ', error);
        return res.send({ massage: error });
    }
})

// Middleware
function verify(req, res, next) {
    const tokenValidation = req.headers['authentication'];
    if (tokenValidation) {
        const validTokenD = tokenValidation;
        jwt.verify(validTokenD, jwtKey, (error, valid) => {
            if (error) {
                console.log('error::: ', error);
                res.send(403, { massage: "Authentication failed..." });
            } else { next(); }
        })
    } else {
        res.send(403, { err: "Authentication not found error..." });
    }
}

// blog api start //

router.post('/createBlog', upload.single("image"), async (req, res) => {
    try {
        const data = JSON.parse(req.body.data);
        console.log('data::: ', data);
        const dataAdd = await blog.create({
            title: data.title,
            Description: data.describe,
            type: data.type,
            Filepath: req.file.originalname,
            url: data.url
        });
        if (dataAdd == undefined) {
            res.send({ responce: 0 });
        } else {
            res.send(dataAdd);
        }
    } catch (error) {
        res.send({ err: error })
        console.log('error::: ', error);
    }
})

router.get('/getAllBlogs', async (req, res) => {
    try {
        const dataAdd = await blog.find({});
        return res.send(dataAdd);
    } catch (error) {
        console.log('error::: ', error);
        return res.send({ err: error });
    }
})

// router.get('/api/share/:postId', (req, res) => {
//     const postId = req.params.postId;
//     const post = {
//         id: postId,
//         title: data.title,
//         Description: data.describe,
//         type: data.type,
//         Filepath: req.file.originalname,
//         url: data.url
//     };
//     res.json(post);
// });

router.post('/getEditdata/:id', async (req, res) => {
    try {
        const getBlogData = await blog.findById(req.params.id);
        const path = `./public/${getBlogData.Filepath}`
        const edit = await unlinkAsync(path);
        return res.send({ datas: getBlogData })
    } catch (error) {
        console.log('error::: ', error);
        return res.send({ err: error });
    }
})

router.put('/getupdatedata/:id', upload.single('image'), async (req, res) => {
    try {
        console.log('req::: ', req.body);
        const getBlogData = await blog.findByIdAndUpdate(req.params.id, {
            title: req.body.title,
            Description: req.body.describe,
            type: req.body.type,
            Filepath: req.body.originalname,
            url: req.body.url
        });
        const path = `./public/${getBlogData.Filepath}`
        const up = await unlinkAsync(path);
        return res.send({ datas: getBlogData })
    } catch (error) {
        console.log('error::: ', error);
        return res.send({ err: error });
    }
})

router.delete('/delete/:id', async (req, res) => {
    try {
        const getBlogData = await blog.findByIdAndRemove(req.params.id);
        const path = `./public/${getBlogData.Filepath}`
        const delet = await unlinkAsync(path);
        return res.send({ message: "the data was remove" });
    } catch (error) {
        console.log('error::: ', error);
        return res.send(error);
    }
})

module.exports = router;