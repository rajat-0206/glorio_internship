const jwt = require('jsonwebtoken'),
  { Users,Email_validation } = require("../db");

class User {
  validateEmail(email) {
    const re = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    return re.test(String(email).toLowerCase());
  }

  validatePassword(pw) {
    return /[A-Z]/.test(pw) &&
      /[a-z]/.test(pw) &&
      /[0-9]/.test(pw) &&
      /[^A-Za-z0-9]/.test(pw) &&
      pw.length > 4;
  }

  validateName(name) {
    return /^[A-Za-z ]+$/.test(name);
  }

  async userExist(email) {
    let doc = await Users().findOne({ email });
    if (doc) {
      return true;
    }
    else {
      return false;
    }
  }


  validateToken(token) {
    try {
      let data = jwt.verify(token.split(" ")[1], process.env.SECRET);
      return data.exp < Date.now() / 1000 ? false : data;
    }
    catch (err) {
      return false;
    }
  }

  async validateUser(user = { email, password, name }) {
    let userPresent = await this.userExist(user.email);
    if (!this.validateEmail(user.email)) {
      return "Email is not valid";
    }
    else if (!this.validatePassword(user.password)) {
      return "Password is not valid";
    }
    else if (!this.validateName(user.name)) {
      return "Name is not valid";
    }
    else if (userPresent) {
      return "User with this email already exist. Please choose a new one";
    }
    else {
      return true;
    }
  }
}

module.exports = new User();