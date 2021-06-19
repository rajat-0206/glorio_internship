import axios from "axios"



const createUser = (userData) =>{
    axios.post("https://localhost:5000/signup",userData)
}