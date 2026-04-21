import axios from "axios"
import { useState } from "react"
import { useNavigate } from "react-router"

interface SignUp  {
    email: string

}

const SignUp = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const navigate = useNavigate()

}