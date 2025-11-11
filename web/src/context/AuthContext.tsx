import { createContext, useState, ReactNode, useContext } from "react";
import { jwtDecode } from "jwt-decode"

type User = { username: string; email: string };
type AuthContextType = {
    user: User | null;
    token: string | null;
    loginToken: (token: string, user: User) => void;
    logoutToken: () => void;
    isAuthenticated: boolean
    checkAuth: () => boolean
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);


export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [token, setToken] = useState<string | null>(localStorage.getItem("user"));
    const [user, setUser] = useState<User | null>(
        JSON.parse(localStorage.getItem("user") || "null")
    );

    const isAuthenticated = Boolean(token && user);

    const checkAuth = () => {
        const savedToken = localStorage.getItem("token");
        if (!savedToken) return false;
        return true
        // Time limit
        // try {
        //     const decoded: any = jwtDecode(savedToken);
        //     if (decoded.exp * 1000 < Date.now()) {
        //         // token expired
        //         logoutToken();
        //         return false;
        //     }
        //     return true;
        // } catch {
        //     logoutToken();
        //     return false;
        // }
    }

    const loginToken = (token: string, user: User) => {
        setToken(token);
        setUser(user);
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        return ("Login Success")
    };

    const logoutToken = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
    };

    return (
        <AuthContext.Provider value={{ user, token, loginToken, logoutToken, isAuthenticated, checkAuth }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within a AuthProvider");
    }
    return context;
};
