import axios from "axios";

const LoginUser = async (userData) => {
    let response = await axios.post("http://localhost:5000/login",userData);
    return response.data;
}

export default LoginUser;