require("dotenv").config();
const express = require("express"),
    bcrypt = require('bcrypt'),
    jwt = require('jsonwebtoken'),
    app = express(),
    {ObjectId} = require("mongodb"),
    User = require('./models/user'),
    Mailer = require('./models/mail'),
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
        return res.send("Yayyy your are successfully connected to the project. Please visit <a href='https://github.com/rajat-0206/glorio_internship'>here</a> to find api documentation");
    })

    app.post("/signup", async (req, result) => {
        data = await User.validateUser(req.body);
        if (data == true) {
            let { email, password, name } = req.body;
            password = await encrypt(password);
            const res = await Users().insertOne({
                email,
                password,
                name,
                is_validated:false,
                created: Date(),
            });
            if(res.insertedCount==1){
                
                Mailer(res.ops[0].email,"Verify your Email",`Click on the following link to verify your email<br><a href=${process.env.SITE}/verify/${res.ops[0]._id}>${process.env.SITE}/verify/${res.ops[0]._id}</a>`,()=>{
                    console.log(`Mail has been sent on ${res.ops[0].email}`);
                });

            }
            return res.insertedCount == 1 ? result.json({ "id": res.ops[0]._id,"message":"Activation email has been sent to your email id" }) : result.json({ "response": "Some unknown error occured" });
        }
        else {
            return result.json({ "response": data });
        }
    });


    app.get("/verify/:userid",async (req,res)=>{
       let user = await Users().findOne({_id: ObjectId(req.params.userid)});
       if(user && !user.is_validated){
            let update = await Users().findOneAndUpdate({email:user.email},{$set:{is_validated:true}});
            if(update.ok){
                return res.send(`${user.email} verified successfull`);
            }
       }
       return res.send("Invalid verification link");
    })

    app.post("/login", async (req, result) => {
        let { email, password } = req.body;
        chkUser = await User.userExist(email);
        if (chkUser) {
            let data = await Users().findOne({ email });
            if(!data.is_validated){
                Mailer(data.email,"Verify your Email",`Click on the following link to verify your email<br><a href=${process.env.SITE}/verify/${data._id}>${process.env.SITE}/verify/${data._id}</a>`);
                return result.json({ "response": "Please verify your email to login. Verification link has been sent to your mail id" });
            }
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

