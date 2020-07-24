require("dotenv").config();


//const bodyParser=require('body-parser');
const router = require("./routes");
var cors = require('cors');
const compression = require('compression');
const express = require("express");
const app = express();
const port = process.env.PORT || 5000;

app.options('*', cors());
app.enable('trust proxy');

app.use(express.json());
// app.use(bodyParser.json());
app.use(express.urlencoded({extended: true}));
// app.use(express.static('public'));


app.use(cors({origin: true, credentials: true, methods: ['GET', 'PUT', 'POST', 'DELETE', 'PATCH', 'HEAD'] }));
app.use(compression());

app.use('/public', express.static('public/img'));
app.use("/api/v1", router);
// app.use('/static', express.static(path.join(__dirname,'public')));


app.listen(port, () =>
	console.log(`Server is running at http://localhost:${port}`)
);

// https://dumbsound-backend-777.herokuapp.com/api/v1/users --> deploy site