require('dotenv').config();

const express = require("express");
const app = express();
const port = process.env.PORT;
const bcrypt = require("bcrypt");

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
	res.json({message: "Welcome to the parking API REST"});
});

require("./routes/auth/auth")(app);
require("./routes/users/users")(app);
require("./routes/parkings/parkings")(app);
require("./routes/bookings/bookings")(app);

app.listen(port, () => {
	console.log(`Server running on ${port}`);
});