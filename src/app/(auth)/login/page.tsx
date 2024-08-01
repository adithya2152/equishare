"use client";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";
import "../../styles/login.css";

export default function Login() {
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); // Prevent default form submission
        setLoading(true);

        try {
            const res = await axios.post("/api/users/login", {credentials}, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (res.status === 200) {
                setLoading(false);
                router.push('/dashboard');
                console.log("successful ========= ", res.data.message);
            } else {
                setError(res.data.error);
                toast.error(res.data.message);
            }
        } catch (err:any) {
            console.error("Error:", err);
            toast.error(err.response?.data?.error || "An error occurred");
            setLoading(false);
            setCredentials({ username: '', password: '' });
            setError('');
        }
    };

    return (
        <div className="login-container">
            {loading && <p>Loading...</p>}
            <form onSubmit={handleSubmit}>
                <h1>Login</h1>
                <label htmlFor="username">Username</label>
                <input
                    type="text"
                    name="username"
                    onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                    value={credentials.username}
                    placeholder="Username"
                    required
                />
                <label htmlFor="password">Password</label>
                <input
                    type="password"
                    name="password"
                    onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                    value={credentials.password}
                    placeholder="Password"
                    required
                />
                <button disabled={loading || !credentials.username || !credentials.password} type="submit">
                    Login
                </button>
                <p>New User?<a href="/register">Register</a></p>
            </form>
            <Toaster />
        </div>
    );
}
