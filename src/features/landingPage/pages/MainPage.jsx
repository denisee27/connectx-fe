import { useNavigate } from "react-router-dom";

import { Footer } from "../components/Footer";
import { Navbar } from "../components/navbar";
import { Hero } from "../components/hero";
import Purpose from "../components/Purpose";
import HowItWorks from "../../auth/pages/HowItWorksPage";
import Event from "../../auth/pages/EventPage";

function MainPage() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen items-center justify-center bg-white">
            <Navbar />
            <Hero />
            <Purpose />
            <Event />
            <HowItWorks />
            <Footer />
        </div>
    )
}

export default MainPage