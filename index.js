const express = require('express');
const app = express();

const cors = require('cors');
app.use(cors());
app.use(express.json());

require('./app/DB/Conection');

const { json } = require('express');
app.use(json());

app.use('/public', express.static('public'));

app.listen(1030, () => {
    console.log("Post Start...");
})

app.use('/api', require('./app/API/singupApi'));

app.use('/', (req, res) => {
    return res.send('<h1>JWT Backend Start...</h1>')
})

