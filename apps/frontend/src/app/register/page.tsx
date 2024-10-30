"use client";
// pages/signup.tsx
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from "../../../auth/supabaseClient";

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    const handleSignUp = async () => {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) {
            alert(error.message);
        } else {
            router.push('/');
        }
    };

    return (
        <div className="container mx-auto">
            <h1 className="text-2xl">Register</h1>
            <input
                type="email"
                placeholder="Email"
                className="border"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                type="password"
                placeholder="Password"
                className="border"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={handleSignUp} className="bg-green-500 text-white">
                Sign Up
            </button>
        </div>
    );
};

export default Register;