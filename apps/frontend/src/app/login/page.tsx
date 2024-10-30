// pages/login.tsx
"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from "../../../auth/supabaseClient";

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    const handleLogin = async () => {
        const { error, data } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
            alert(error.message);
        } else {
            console.log('data', data)
            router.push('/');
        }
    };
    const test = async () => {

        const res = await supabase.auth.getSession()
        console.log('res', res)
    }


    return (
        <div className="container mx-auto">
            <h1 className="text-2xl">Login</h1>
            <button className="py-2 px-4 bg-amber-500 rounded-xl" onClick={test}>test</button>
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
            <button onClick={handleLogin} className="bg-blue-500 text-white">
                Login
            </button>
        </div>
    );
};

export default Login;