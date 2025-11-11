import { useState } from "react"
import { Link } from "react-router-dom"
import { login } from "../../services/fetchers"

const Login = () => {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")

    const handleSubmit = async () => {
        const loginResponse = await login({ username, password })
        console.log(loginResponse)
    }
    return (
        <div className="flex h-full">
            <div className="w-1/2 bg-slate-50">

            </div>
            <div className="w-1/2 items-center flex flex-col gap-y-5">
                <p>Welcome!</p>
                <div className="flex flex-col">
                    <input
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="border border-black rounded-md px-3 py-2"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="border border-black rounded-md px-3 py-2"
                    />
                </div>
                <button className="bg-black text-white px-10 py-2 rounded-3xl" onClick={handleSubmit}>Login</button>
                <p>Don't have an account? <Link to="/signup">Sign Up</Link></p>
            </div>
        </div>
    )
}


export default Login