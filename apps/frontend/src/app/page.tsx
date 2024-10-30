"use client";
import { supabase } from "../../auth/supabaseClient";
import { useState } from "react";
import axios from "axios";

export default function Home() {
    const [access_token, setAccessToken] = useState('');
    const test = async () => {

        const res = await supabase.auth.getSession()
        const {data} = res
        setAccessToken(data.session.access_token)
        console.log('res', res)
    }
    console.log('access_token', access_token)
    const tryLoggedInRoute = async () => {
        const res = await axios.get('http://localhost:3001/protected', {
            headers: {
                Authorization: `Bearer ${access_token}`
            }
        })
        console.log('res', res)
    }


    return (
        <div>
            <button className="bg-blue-500 px-4 py-2 rounded-xl mr-2" onClick={test}>test</button>
            <button className="bg-amber-500 px-4 py-2 rounded-xl" onClick={tryLoggedInRoute}>test protected route</button>
        </div>
    );
}
