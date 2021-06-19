require("dotenv").config();
const express = require("express"),
    cors = require("cors"),
    bcrypt = require('bcrypt'),
    jwt = require('jsonwebtoken'),
    app = express(),
    { ObjectId } = require("mongodb"),
    User = require('./models/user'),
    Mailer = require('./models/mail'),
    { connectToDB, Users, Buildings, History } = require("./db");

const encrypt = async (plaintext) => {
    return await bcrypt.hash(plaintext, 10);
}

const verifyPass = async (userpass, storedpass) => {
    return await bcrypt.compare(userpass, storedpass);
}

app.use(cors());
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



      /*
    Request to register
    */

    app.post("/signup", async (req, result) => {
        data = await User.validateUser(req.body);
        if (data == true) {
            let { email, password, name } = req.body;
            password = await encrypt(password);
            const res = await Users().insertOne({
                email,
                password,
                name,
                balance: 0,
                is_validated: false,
                created: Date(),
            });
            if (res.insertedCount == 1) {

                Mailer(res.ops[0].email, "Verify your Email", `Click on the following link to verify your email<br><a href=${process.env.SITE}/verify/${res.ops[0]._id}>${process.env.SITE}/verify/${res.ops[0]._id}</a>`, () => {
                    console.log(`Mail has been sent on ${res.ops[0].email}`);
                });

            }
            return res.insertedCount == 1 ? result.json({ "id": res.ops[0]._id, "message": "Activation email has been sent to your email id", "code": true }) : result.json({ "response": "Some unknown error occured", "code": false });
        }
        else {
            return result.json({ "response": data, "code": false });
        }
    });


      /*
    Request to verify user account
    */

    app.get("/verify/:userid", async (req, res) => {
        let user = await Users().findOne({ _id: ObjectId(req.params.userid) });
        if (user && !user.is_validated) {
            let update = await Users().findOneAndUpdate({ email: user.email }, { $set: { is_validated: true } });
            if (update.ok) {
                return res.send(`${user.email} verified successfull`);
            }
        }
        return res.send("Invalid verification link");
    })

      /*
    Request to login
    */

    app.post("/login", async (req, result) => {
        let { email, password } = req.body;
        chkUser = await User.userExist(email);
        if (chkUser) {
            let data = await Users().findOne({ email });
            if (!data.is_validated) {
                Mailer(data.email, "Verify your Email", `Click on the following link to verify your email<br><a href=${process.env.SITE}/verify/${data._id}>${process.env.SITE}/verify/${data._id}</a>`);
                return result.json({ "response": "Please verify your email to login. Verification link has been sent to your mail id" });
            }
            chkcred = await verifyPass(password, data.password);
            if (chkcred) {
                let token = jwt.sign({ email }, process.env.SECRET, { expiresIn: "4h" })
                return result.json({ "id": data._id, "token": token, "code": true });
            }
            else {
                result.json({ "response": "Login failed. Please check you credentials", "code": false })
            }
        }
        else {
            result.json({ "response": "No such user found", "code": false });
        }
    });



      /*
    Request to main dashboard
    */

    app.get("/dashboard", async (req, result) => {
        let chkUser = "";

        chkUser = User.validateToken(req.headers.authorization);

        if (chkUser) {
            let user = await Users().findOne({ email: chkUser.email });
            let all_buildings = await Buildings().find({}).toArray();
            return result.json({ "user": user, "buildings": all_buildings });
        }
        else {
            result.json({ "response": "User authentication failed" });
        }
    });


      /*
    Request to add balance
    */

    app.post("/addbalance", async (req, res) => {
        let chkUser = "";

        chkUser = User.validateToken(req.headers.authorization);

        if (chkUser) {
            let amount = req.body.amount;
            let user = await Users().findOne({ email: chkUser.email });
            let newamount = Number(user.balance) + Number(amount);
            console.log(user);
            let addAmount = await Users().findOneAndUpdate({ email: chkUser.email }, { $set: { balance: newamount } });

            return res.json({ "new_balance": `${newamount}`, "code": true });
        }
        else {
            result.json({ "response": "User authentication failed" });
        }
    });


    /*
    Request to park the carr
    */

    app.post("/parkcar", async (req, res) => {
        let chkUser = "";

        chkUser = User.validateToken(req.headers.authorization);

        if (chkUser) {
            building = req.body.building;
            slot = req.body.slot;

            bObj = await Buildings().findOne({ "name": building });
            if (bObj) {
                if (Number(slot) < 0 || Number(slot) > bObj.total_slots) {
                    res.json({ "response": "The building do not have the given slot number", "code": false });
                }
                else {
                    filled = bObj.filled;
                    if (!filled) {
                        filled = Array();
                    }
                    if (filled.includes(slot)) {
                        res.json({ "response": "This slot is already filled", code: false })
                    }
                    else {
                        console.log(bObj);
                        filled.push(slot);
                        let newvalues = { "available_slots": Number(bObj.available_slots) - 1, "filled": filled }
                        let updateSlot = Buildings().findOneAndUpdate({ name: bObj.name }, { $set: newvalues });
                        let addHistory = await History().insertOne({
                            "user": chkUser.email,
                            "parking_time": Date(),
                            "charges": 0,
                            "slot": `${building} slot ${slot}`,
                            "unpark_time": "NA"
                        });

                        return addHistory.insertedCount == 1 ? res.json({ "response": "car parked successfull", "code": true }) : res.json({ "response": "Some error occured", "code": false });
                    }
                }
            }
            else {
                res.json({ "response": "Invalid building code", "code": false });
            }


        }
        else {
            result.json({ "response": "User authentication failed" });
        }
    });



      /*
    Request to get parking history
    */

    app.get("/history", async (req, res) => {
        let chkUser = "";

        chkUser = User.validateToken(req.headers.authorization);

        if (chkUser) {
            let history = await History().find({ user: chkUser.email }).toArray();
            if (history) {
                return res.json({ "response": history });
            }
            else {
                return res.json({ "response": "No history present for given user", response: false });
            }
        }
        else {
            res.json({ "response": "User authentication failed" });
        }
    })


      /*
    Request to unpark the carr
    */
    app.post("/unparkcar", async (req, res) => {
        let chkUser = "";

        chkUser = User.validateToken(req.headers.authorization);

        if (chkUser) {
            let history = ""
            try{
            history = await History().findOne({"_id":ObjectId(req.body.bookingid)});
            }
            catch(e){
                res.json({ "response": "Invalid booking id", "code": false });
            }
            if (history && history.unpark_time==="NA") {
            let parked_time = new Date(history.parking_time);
            let current_time = new Date();
            let diffTime = Math.abs(current_time - parked_time)
            let diff_hour = Math.ceil(diffTime / (1000 * 60 * 60 ));
            let charges = 0;
            console.log(diff_hour);
            charges = 100 + (diff_hour - 1) * 60;
            let updated = {"charges":charges,"unpark_time":Date()}
            let updateHistory = await History().findOneAndUpdate({"_id":ObjectId(req.body.bookingid)},{$set:updated});
            let temp = history.slot.split(" ");
            let bObj = await Buildings().findOne({"name":`Building ${temp[1]}`});
            let filled = bObj.filled;
            filled = filled.filter((item) =>{
                return item !== Number(temp[3])
            })
            let update = {"available_slots":bObj.available_slots+1,filled:filled}
            let updateBuilding = await Buildings().findOneAndUpdate({"name":`Building ${temp[1]}`},{$set:update})
            let user = await Users().findOne({"email":chkUser.email});
            update = {"balance":user.balance - charges};
            let updateUser = await Users().findOneAndUpdate({"email":chkUser.email},{$set:update})
            return res.json({"response":"car unparked successfully","code":true})
        
            }
            else {
                return res.json({ "response": "No car available to unpark", "code": false });
            }
        }
        else {
            result.json({ "response": "User authentication failed" });
        }
    })



});



const server_port = process.env.PORT || 5000,
    server_host = "0.0.0.0" || "localhost";


app.listen(server_port, server_host, () => {
    console.log(`Server on ${server_host}:${server_port}`)
})



