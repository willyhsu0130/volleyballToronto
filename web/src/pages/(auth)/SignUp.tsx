import { useState, ChangeEvent } from "react"
import { signup } from "../../services/fetchers"

const Signup = () => {
    const [username, setUsername] = useState<string>("willyhsu0130")
    const [email, setEmail] = useState<string>("willyhsu0130@gmail.com")
    const [password, setPassword] = useState<string>("12345678")
    const [confirmPassword, setConfirmPassword] = useState<string>("12345678")

    const handleInputChange =
        (setter: React.Dispatch<React.SetStateAction<string>>) =>
            (e: ChangeEvent<HTMLInputElement>) => {
                setter(e.target.value)
            }

    const handleSubmit = async () => {
        const signupResponse = await signup({ username, email, password })
        setUsername("")
        setEmail("")
        setPassword("")
        console.log(signupResponse)
    }
    return (
        <div className="flex h-full">
            {/* Left section */}
            <div className="w-1/2 bg-slate-50"></div>

            {/* Right section */}
            <div className="w-1/2 flex flex-col items-center gap-y-5">
                <p className="text-xl font-bold mt-10">Create Your Account</p>

                <div className="flex flex-col gap-y-3 w-[60%]">
                    <input
                        placeholder="Username"
                        value={username}
                        onChange={handleInputChange(setUsername)}
                        className="border border-black rounded-md px-3 py-2"
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={handleInputChange(setEmail)}
                        className="border border-black rounded-md px-3 py-2"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={handleInputChange(setPassword)}
                        className="border border-black rounded-md px-3 py-2"
                    />
                    <input
                        type="password"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={handleInputChange(setConfirmPassword)}
                        className="border border-black rounded-md px-3 py-2"
                    />
                </div>

                <button onClick={handleSubmit} className="bg-black text-white px-10 py-2 rounded-3xl mt-3">
                    Sign Up
                </button>

                <p className="text-sm text-gray-600">
                    Already have an account?{" "}
                    <a href="/(auth)/login" className="text-black font-semibold underline">
                        Login
                    </a>
                </p>
            </div>
        </div>
    )
}


export default Signup