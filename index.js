require("dotenv").config();
const express = require("express"),
    bcrypt = require('bcrypt'),
    jwt = require('jsonwebtoken'),
    app = express(),
    User = require('./models/user'),
    { connectToDB, Users } = require("./db");

const encrypt = async (plaintext) => {
    return await bcrypt.hash(plaintext, 10);
}

const verifyPass = async (userpass, storedpass) => {
    return await bcrypt.compare(userpass, storedpass);
}

app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());
connectToDB((err, dbname) => {
    if (err) return console.log(err);
    console.log(`Connected to ${dbname}`)


    app.get("/", (req, res) => {
        return res.send("Yayyy your are successfully connected to the project. Please visit <a href='https://github.com/rajat-0206/socialcomments/blob/main/readme.md'>here</a> to find api documentation");
    })

    app.post("/signup", async (req, result) => {
        data = await User.validateUser(req.body);
        if (data == true) {
            let { email, password, name, gender } = req.body;
            password = await encrypt(password);
            const res = await Users().insertOne({
                email,
                password,
                name,
                created: Date(),
            });
            console.log(res.insertedCount);
            return res.insertedCount == 1 ? result.json({ "id": res.ops[0]._id }) : result.json({ "response": "Some unknown error occured" });
        }
        else {
            return res.json({ "response": data });
        }
    });

    app.post("/login", async (req, result) => {
        let { email, password } = req.body;
        chkUser = await User.userExist(email);
        if (chkUser) {
            let data = await Users().findOne({ email });
            chkcred = await verifyPass(password, data.password);
            if (chkcred) {
                let token = jwt.sign({ email }, process.env.SECRET, { expiresIn: "4h" })
                return result.json({ "id": data._id, "token": token });
            }
            else {
                result.json({ "response": "Login failed. Please check you credentials" })
            }
        }
        else {
            result.json({ "response": "No such user found" });
        }
    });


});

const server_port = process.env.PORT || 5000,
    server_host = "0.0.0.0" || "localhost";


app.listen(server_port, server_host, () => {
    console.log(`Server on ${server_host}:${server_port}`)
})

