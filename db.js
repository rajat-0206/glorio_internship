require("dotenv").config();
const { MongoClient } = require("mongodb");



var dbobj;
module.exports = {
  connectToDB: (callback) => 
    MongoClient.connect(
      process.env.DBLINK,
      { useNewUrlParser: true, useUnifiedTopology: true },
      (err, client) => {
        if (!err) dbobj = client.db(process.env.DBNAME);
        return callback(err,process.env.DBNAME);
      }
    ),
  /**
   * 
   * @returns  { import("mongodb").Collection}
   */
  Users: () => dbobj.collection("users"),
  Email_validation: ()=>dbobj.collection("verification"),
};