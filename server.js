const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const port = 3000;

const app = express();
app.use(express.static(__dirname));
app.use(express.urlencoded({ extended: true }));

mongoose.connect("mongodb+srv://ganeshyadavudl:H7UQAdi4xrjsyCSQ@ganesh.pgf9yg2.mongodb.net/?retryWrites=true&w=majority&appName=Ganesh", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
const db = mongoose.connection;
db.once('open', () => {
    console.log("MongoDB connection successful");
});

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String
});

const Users = mongoose.model("Users", userSchema);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/signup', async (req, res) => {
    const { name, email, password } = req.body;
    const user = new Users({
        name,
        email,
        password
    });
    await user.save();
    console.log(user);  
    res.redirect('/'); // Redirect to login page after signup
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await Users.findOne({ email });

    if (user && user.password === password) {
        res.redirect('/home'); // Redirect to home page if login is successful
    } else {
        res.send('<script>alert("Your password is wrong"); window.location.href = "/";</script>');
    }
});

app.get('/home', (req, res) => {
    res.send('<h1>Welcome to the R.G.M Company!</h1>');
});

app.listen(port, () => {
    console.log("Server started on port", port);
});
