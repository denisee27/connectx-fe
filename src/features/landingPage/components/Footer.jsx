import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";
import logo from "../../../assets/logo/main-logo-white.png";

export const Footer = () => {
    return (
        <div className="w-full">
            <div
                className="w-full min-h-[350px] flex flex-col justify-center items-center px-4 py-12"
                style={{ backgroundColor: "var(--color-primary)" }}
            >
                <div className="max-w-2xl w-full flex flex-col items-center gap-6">
                    <h2 className="text-4xl sm:text-5xl font-bold text-center text-black mb-2">
                        Ready to make<br />new connections?
                    </h2>
                    <p className="text-lg text-center text-black mb-4">
                        Join thousands of people discovering meaningful friendships and experiences in their city
                    </p>
                    <div className="flex gap-4 mb-8">
                        <button className="bg-black text-white font-semibold px-6 py-3 rounded-full shadow hover:bg-gray-800 transition">Get Started Free</button>
                        <button className="bg-white text-black font-semibold px-6 py-3 rounded-full border border-black hover:bg-gray-100 transition">Learn More</button>
                    </div>
                    <hr className="w-full border-t border-black/30 mb-8" />
                    <div className="flex w-full justify-center gap-12 text-center">
                        <div>
                            <div className="text-2xl font-bold text-black">50K+</div>
                            <div className="text-sm text-black/80">Active Members</div>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-black">500+</div>
                            <div className="text-sm text-black/80">Monthly Events</div>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-black">15</div>
                            <div className="text-sm text-black/80">Cities</div>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-black flex items-center justify-center gap-1">4.8<span className="text-xl">★</span></div>
                            <div className="text-sm text-black/80">Avg Rating</div>
                        </div>
                    </div>
                </div>
            </div>
            <footer className="w-full bg-white border-t border-gray-200 py-8 px-4">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-6 md:gap-12">
                    <div className="flex-1 flex items-start justify-start md:justify-start mb-6 md:mb-0">
                        <img src={logo} alt="ConnectX" className="h-30  md:h-24 " />
                    </div>
                    <div className="flex flex-wrap md:flex-row gap-4 md:gap-10 flex-[2] justify-between md:justify-center px-2 md:px-0">
                        <div >
                            <h3 className="font-medium text-gray-500 mb-3">Company</h3>
                            <ul className="space-y-2 text-base md:text-lg text-gray-800">
                                <li>About</li>
                                <li>Contact us</li>
                                <li>Careers <span className="inline-block">↗</span></li>
                                <li>Investors <span className="inline-block">↗</span></li>
                                <li>The Shop <span className="inline-block">↗</span></li>
                                <li>The Buzz <span className="inline-block">↗</span></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-medium text-gray-500 mb-3">Legal</h3>
                            <ul className="space-y-2 text-base md:text-lg text-gray-800">
                                <li>Guidelines</li>
                                <li>Manage cookies</li>
                                <li>Privacy policy</li>
                                <li>Modern Slavery act</li>
                            </ul>
                        </div>
                    </div>
                </div >
            </footer >
            <div className="w-full border-t flex flex-col md:flex-row items-center justify-between px-4 md:px-12 py-6 md:py-9 gap-4 md:gap-0">
                <span className="text-black text-sm mb-2 md:mb-0">© 2024 ConnectX. All rights reserved.</span>
                <div className="flex gap-4">
                    <a href="#" className="rounded-full bg-gray-800 p-2 text-black hover:text-white"><Instagram className="h-4 w-4 text-white" /></a>
                    <a href="#" className="rounded-full bg-gray-800 p-2 text-black hover:text-white"><Twitter className="h-4 w-4 text-white" /></a>
                    <a href="#" className="rounded-full bg-gray-800 p-2 text-black hover:text-white"><Facebook className="h-4 w-4 text-white" /></a>
                    <a href="#" className="rounded-full bg-gray-800 p-2 text-black hover:text-white"><Linkedin className="h-4 w-4 text-white" /></a>
                </div>
            </div>
        </div >
    )
}
