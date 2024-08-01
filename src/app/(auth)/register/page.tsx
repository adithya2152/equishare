"use client";
import { useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import bcrypt from "bcryptjs";
import { useRouter } from "next/navigation";
import  "../../styles/register.css";

interface Credentials {
    username: string;
    phone: string;
    email: string;
}

export default function Register() {
    const [credentials, setCredentials] = useState<Credentials>({ username: "", phone: "", email: "" });
    const [isSent, setIsSent] = useState(false);
    const [isVerified, setIsVerified] = useState(false);
    const [otp, setOtp] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setIsLoading] = useState(false);
    const [genotp, setGenOtp] = useState("");
    const router = useRouter();

    function validateEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function validatePhone(phone: string): boolean {
        const phoneRegex = /^[0-9]{10}$/;
        return phoneRegex.test(phone);
    }

    async function OtpGen() {
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const salt = 10;
        const hashed = await bcrypt.hash(otp, salt);
        setGenOtp(hashed);
        return { otp, hashed };
    }

    const handleVerify = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setIsLoading(true);

        const { email, phone } = credentials;

        if (!validateEmail(email)) {
            toast.error("Invalid email format");
            setIsLoading(false);
            return;
        }

        if (!validatePhone(phone)) {
            toast.error("Invalid phone number");
            setIsLoading(false);
            return;
        }

        const { otp, hashed } = await OtpGen();

        try {
            const res = await axios.post("/api/sendmail", {
                email,
                otp: otp,
                phone: phone,
            });

            if (res.status === 200) {
                setIsSent(true);
                toast.success("Email sent successfully");
                console.log("Email sent successfully");
            } else {
                throw new Error(res.data.error);
            }
        } catch (err: any) {
            console.log(err);
            setIsSent(false);
            toast.error(err.response?.data?.error || "Error sending email");
        } finally {
            setIsLoading(false);
        }
    };

    const handleConfirm = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        const match = await bcrypt.compare(otp, genotp);
        if (match) {
            toast.success("Otp verified successfully", {
                style: {
                    border: "1px solid green",
                    padding: "16px",
                    color: "green",
                },
                iconTheme: {
                    primary: "green",
                    secondary: "white",
                },
            });
            setIsVerified(true);
        } else {
            toast.error("Otp not verified");
            setCredentials({ username: "", phone: "", email: "" });
            setIsSent(false);
            setOtp("");
            setGenOtp("");
            setPassword("");
            setError("");
        }
    };

    const handleRegister = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const salt = 10;
            const hashedPassword = await bcrypt.hash(password, salt);

            const res = await axios.post(
                "/api/users/register",
                { credentials, password: hashedPassword },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            if (res.status === 201) {
                setIsLoading(false);
                toast.success("User created successfully");
                router.push("/dashboard");
                console.log("successful ========= ", res.data.message);
            } else {
                setError(res.data.message);
                toast.error(res.data.message);
            }
        } catch (err: any) {
            console.log(err);
            toast.error(err.response?.data?.message || "An error occurred");
            setIsSent(false);
            setOtp("");
            setGenOtp("");
            setPassword("");
            setError("");
            setIsVerified(false);
            setCredentials({ username: "", phone: "", email: "" });
        } finally {
            setIsLoading(false);
        }
    };

    const isRegisterDisabled = !(credentials.username && credentials.phone && credentials.email && otp && password);

    return (
        <div className="register-container">
            {loading && <p>Loading...</p>}
            <form>
                <h1>Register</h1>
                <label htmlFor="username">Username</label>
                <input
                    type="text"
                    name="username"
                    onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                    value={credentials.username}
                    placeholder="Username"
                    required
                />

                <label htmlFor="phone">Phone</label>
                <input
                    type="tel"
                    name="phone"
                    pattern="[0-9]{10}"
                    onChange={(e) => setCredentials({ ...credentials, phone: e.target.value })}
                    value={credentials.phone}
                    placeholder="Phone"
                    required
                />

                <label htmlFor="email">Email</label>
                <div>
                    <input
                        type="email"
                        name="email"
                        onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                        value={credentials.email}
                        placeholder="Email"
                        required
                    />
                    <button disabled={!credentials.email} onClick={handleVerify} type="button">
                        {!isSent ? "Send Otp" : "Resend"}
                    </button>
                </div>

                {isSent && (
                    <div>
                        <label htmlFor="otp">Otp</label>
                        <div>
                            <input
                                type="number"
                                name="otp"
                                onChange={(e) => setOtp(e.target.value)}
                                value={otp}
                                placeholder="Otp"
                                required
                            />
                            <button disabled={!otp} onClick={handleConfirm} type="button">
                                Verify
                            </button>
                        </div>
                    </div>
                )}
                {isVerified && (
                    <div>
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            name="password"
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                            placeholder="Password"
                            required
                        />
                        <button onClick={handleRegister} disabled={isRegisterDisabled} type="button">
                            Register
                        </button>
                    </div>
                )}
                <p>
                    Already have an account? <a href="/login">Login</a>
                </p>
            </form>
            <Toaster />
        </div>
    );
}
