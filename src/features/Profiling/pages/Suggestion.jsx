import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function Loading() {
    return (
        <div className="flex min-h-[300px] items-center justify-center">
            <div className="text-center">
                {/* Brand ring animation */}
                <div className="relative mx-auto mb-5 h-14 w-14">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-orange-400 via-yellow-300 to-orange-500 opacity-80 animate-spin" style={{ animationDuration: "1.4s" }}></div>
                    <div className="absolute inset-2 rounded-full bg-white"></div>
                    {/* Pulsing dots */}
                    <div className="absolute inset-0 flex items-center justify-center gap-1">
                        <span className="h-2 w-2 rounded-full bg-orange-500 animate-bounce" style={{ animationDelay: "0ms" }}></span>
                        <span className="h-2 w-2 rounded-full bg-orange-400 animate-bounce" style={{ animationDelay: "150ms" }}></span>
                        <span className="h-2 w-2 rounded-full bg-yellow-400 animate-bounce" style={{ animationDelay: "300ms" }}></span>
                    </div>
                </div>
                {/* Status copy */}
                <p className="text-sm text-gray-700">Please wait, your personalization is being processed and will be generated shortly.</p>
            </div>
        </div>
    );
}

export default function Suggestion() {
    const navigate = useNavigate();
    const { state } = useLocation();
    const [loading, setLoading] = useState(Boolean(state?.submitting));
    const [error, setError] = useState(state?.error || null);

    useEffect(() => {
        if (loading) {
            const t = setTimeout(() => setLoading(false), 3200);
            return () => clearTimeout(t);
        }
    }, [loading]);

    const cards = useMemo(() => {
        return [
            {
                title: "Women in Tech Meetup",
                desc: "Connect with peers in a warm and collaborative setting.",
                meta: "Jakarta • Fri, 7 PM",
            },
            {
                title: "Mindful Wellness Circle",
                desc: "Gentle sharing and guided relaxation with small group.",
                meta: "Bandung • Sat, 10 AM",
            },
            {
                title: "Coffee & Books",
                desc: "Casual 1:1 or small group conversation over favorite reads.",
                meta: "Online • Sun, 4 PM",
            },
        ];
    }, []);

    const goDashboard = () =>
        navigate("/dashboard", {
            state: {
                from: "suggestion",
                ...(state || {}),
            },
        });

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
            <div className="w-full max-w-4xl bg-white shadow-md rounded-2xl p-8">
                <div className="text-center mb-6">
                    <h1 className="text-3xl font-semibold text-gray-900">Your Suggestions</h1>
                    <p className="text-gray-600">Curated events that match your preferences</p>
                </div>

                {loading && <Loading />}
                {error && (
                    <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 mb-4">
                        {error}
                    </div>
                )}

                {!loading && !error && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {cards.map((c, idx) => (
                            <div key={idx} className="rounded-xl border border-gray-200 p-5">
                                <h3 className="text-lg font-semibold text-gray-900">{c.title}</h3>
                                <p className="mt-2 text-sm text-gray-600">{c.desc}</p>
                                <p className="mt-3 text-xs text-gray-500">{c.meta}</p>
                                <button className="mt-4 w-full rounded-full bg-orange-500 text-white py-2 font-semibold">View Details</button>
                            </div>
                        ))}
                    </div>
                )}

                {!loading && !error && (
                    <div className="mt-8 flex justify-end">
                        <button onClick={goDashboard} className="rounded-full px-6 py-2.5 border border-gray-300 text-gray-800 hover:bg-gray-100">
                            Other Event
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}