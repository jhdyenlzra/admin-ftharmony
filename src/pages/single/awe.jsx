useAuth.js 

import React, { useState, useEffect, createContext, useContext } from "react";
import { supabase } from "./supabaseClient";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser ] = useState(null);

    useEffect(()) => {
        // Function to fetch initial session
        const fetchUser = async () => {
            try {
                const {data: { session },} = await supabase.auth.getSession()
                console.log('session',session.user.user_metadata);
                setUser(session?.user ?? null);
            } catch (error) {
                console.error('Error fetching session:', error.message);
            }
        };
        
        // Fetch initial session on component mount
        fetchUser();

        // Listener for auth state changes 
        const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        // Clean up listener on component unmount
        return () => {
            authListener?.subscription.unsubscribe();
        };
    }, []};

    return {
        <AuthContext.Provider value={{ user }}>
            {children}
        </AuthContext.Provider>
    };
};

export const useAuth = () => useContext(AuthContext);

