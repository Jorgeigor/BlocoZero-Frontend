import { createContext, useEffect, useState } from "react";
import { api } from "../services/api";

type User = {
    id_user: number;
    name: string;
    email: string;
    userFunction: "manager" | "tender"; 
}

type AuthContextType = { 
    isLoading: boolean;
    session: User | null; 
    save: (data: User) => void; 
    remove: () => void;
}

const LOCAL_STORAGE_KEY = "@blocoZero";

export const AuthContext = createContext({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [isLoading, setIsLoading] = useState(true);
    const [session, setSession] = useState<User | null>(null); 

    function save(data: User) {
        localStorage.setItem(`${LOCAL_STORAGE_KEY}:user`, JSON.stringify(data));
        localStorage.setItem(`${LOCAL_STORAGE_KEY}:id_user`, data.id_user.toString());
        api.defaults.headers.common['Authorization'] = `Bearer ${data.id_user}`;
        setSession(data);
    }

    function remove() {
        setSession(null);
        localStorage.removeItem(`${LOCAL_STORAGE_KEY}:user`);
        localStorage.removeItem(`${LOCAL_STORAGE_KEY}:id_user`);
        delete api.defaults.headers.common["Authorization"];
        window.location.assign("/"); 
    }

    function loadUser() {
        const userStorage = localStorage.getItem(`${LOCAL_STORAGE_KEY}:user`);
        const tokenStorage = localStorage.getItem(`${LOCAL_STORAGE_KEY}:id_user`);

        if (tokenStorage && userStorage) {
            api.defaults.headers.common["Authorization"] = `Bearer ${tokenStorage}`;
            
            setSession(JSON.parse(userStorage));
        }
        setIsLoading(false);
    }

    useEffect(() => {
        loadUser();
    }, []);

    return (
        <AuthContext.Provider value={{ session, save, isLoading, remove }}>
            {children}
        </AuthContext.Provider>
    );
}