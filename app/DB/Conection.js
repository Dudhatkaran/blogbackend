const mongoose = require('mongoose');
mongoose.set('strictQuery', false);

mongoose.connect("mongodb+srv://karanvd2002:bloglist123@clusterbloglist.pnzieqh.mongodb.net/bloglist", {
    useNewUrlParser: true,
}).then(() => {
    console.log("DB Conection Done....");
}).catch((error) => {
    console.log("error", error);
})