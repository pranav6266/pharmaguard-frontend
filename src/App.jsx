import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import Landing from "./pages/Landing";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import Dashboard from "./pages/Dashboard";
import AuthCallback from "./pages/AuthCallback";
import Navbar from "./components/Navbar";

export default function App() {
    const { isSignedIn } = useUser();

    return (
        <Router>
            {isSignedIn && <Navbar />}
            <Routes>
                <Route path="/" element={isSignedIn ? <Dashboard /> : <Landing />} />
                <Route path="/sign-up" element={<SignUp />} />
                <Route path="/sign-in" element={<SignIn />} />
                <Route path="/auth-callback" element={<AuthCallback />} />
                <Route path="/dashboard" element={isSignedIn ? <Dashboard /> : <Landing />} />
            </Routes>
        </Router>
    );
}