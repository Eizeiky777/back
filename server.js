require("dotenv").config();

const express = require("express");
const bodyParser=require('body-parser');
const router = require("./routes");
var cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;


app.enable('trust proxy');

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
// app.use(express.static('public'));



app.use(cors());
app.options('*', cors());

app.use('/public', express.static('public/img'));

app.use("/api/v1", router);
// app.use('/static', express.static(path.join(__dirname,'public')));


app.listen(port, () =>
	console.log(`Server is running at http://localhost:${port}`)
);

// https://dumbsound-backend-777.herokuapp.com/api/v1/users --> deploy site