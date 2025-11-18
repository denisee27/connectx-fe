import { useNavigate } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { Hero } from "../components/Hero";
import HowItWorks from "../../auth/pages/HowItWorksPage";
import Event from "../../auth/pages/EventPage";
import { Footer } from "../components/Footer";
import { Purpose } from "../components/Purpose";


function MainPage() {
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