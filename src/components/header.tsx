"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import "@/app/styles/header.css";

export default function Header() {
    const router = useRouter();
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const handleLogout = async () => {
        try {
            await axios.post('/api/users/logout');  
            router.push("/login");  
        } catch (error) {
            console.error("Failed to logout", error);
        }
    };

    return (
        <div className="header">
            <h2>Equishare</h2>
            <div>
                <ul>
                    <li><Link href="/dashboard">Dashboard</Link></li>
                    <li><Link href="/addexpense">Add Expense</Link></li>
                    <li><Link href="/expenselogs">Expense Logs</Link></li>
                    <li><p>Notification</p></li>
                    <li>
                        <div className="dropdown">
                            <div 
                                className="profile" 
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                            ></div>
                            {dropdownOpen && (
                                <div className="dropdown-content">
                                    <p>Profile</p>
                                    <p onClick={handleLogout}>Logout</p>
                                </div>
                            )}
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    );
}
