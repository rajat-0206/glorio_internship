import axios from "axios"



const createUser = async (userData) =>{
    let response = await axios.post("http://localhost:5000/signup",userData)
    return response.data;
}

export default createUser;