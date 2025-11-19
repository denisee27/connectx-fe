import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useModal } from "../../../core/stores/uiStore";
import { TriangleAlert } from "lucide-react";

const TOPICS = [
    "Career & Networking",
    "Women Empowerment",
    "Healing & Self-Development",
    "Motherhood",
    "Tech & Startup",
    "Finance & Investment",
    "Social Hangout",
    "Book / Coffee Meetup",
    "Wellness & Fitness",
];

const MEET_UP = ["1:1", "Small group", "Open event"];

export default function Preference() {
    const navigate = useNavigate();
    const refreshModal = useModal("profilingRefreshConfirm");
    const [selected, setSelected] = useState(() => {
        try {
            const raw = localStorage.getItem("profilingPreferences");
            return raw ? JSON.parse(raw) : [];
        } catch (_) {
            return [];
        }
    });
    const [meetUp, setMeetUp] = useState(() => {
        try {
            const raw = localStorage.getItem("profilingMeetUpPref");
            return raw ? JSON.parse(raw) : "";
        } catch (_) {
            return "";
        }
    });
    const [error, setError] = useState(null);

    const canContinue = useMemo(() => {
        return selected.length >= 3 && selected.length <= 5 && Boolean(meetUp);
    }, [selected, meetUp]);

    const toggleTopic = (t) => {
        setSelected((prev) => {
            const exists = prev.includes(t);
            let next = exists ? prev.filter((x) => x !== t) : [...prev, t];
            if (next.length > 5) {
                // prevent adding more than 5
                return prev;
            }
            return next;
        });
    };

    const continueNext = () => {
        setError(null);
        if (selected.length < 3) {
            setError("Please select at least 3 preferences.");
            return;
        }
        if (selected.length > 5) {
            setError("You can select a maximum of 5 preferences.");
            return;
        }
        if (!meetUp) {
            setError("Please choose your meet up preference.");
            return;
        }
        try {
            localStorage.setItem("profilingPreferences", JSON.stringify(selected));
            localStorage.setItem("profilingMeetUpPref", JSON.stringify(meetUp));
        } catch (_) { }
        navigate("/profiling/form");
    };

    // Refresh handling (F5/Cmd+R)
    useEffect(() => {
        const handleKeyDown = (e) => {
            const isRefreshKey = e.key === "F5" || ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "r");
            if (isRefreshKey) {
                e.preventDefault();
                refreshModal.open();
            }
        };

        const beforeUnloadHandler = (e) => {
            const message = "Are you sure you want to restart? Your inputs will be cleared.";
            e.preventDefault();
            e.returnValue = message;
        };

        const pageHideHandler = () => {
            try {
                sessionStorage.setItem("profilingReloadPending", "1");
            } catch (_) { }
        };

        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("beforeunload", beforeUnloadHandler);
        window.addEventListener("pagehide", pageHideHandler);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("beforeunload", beforeUnloadHandler);
            window.removeEventListener("pagehide", pageHideHandler);
        };
    }, [refreshModal]);

    useEffect(() => {
        const navigationEntries = performance.getEntriesByType?.("navigation") || [];
        const navType = navigationEntries[0]?.type || "navigate";
        const isReload = navType === "reload";
        const pending = sessionStorage.getItem("profilingReloadPending") === "1";
        if (isReload && pending) {
            sessionStorage.removeItem("profilingReloadPending");
            try {
                localStorage.removeItem("profilingPreferences");
                localStorage.removeItem("profilingMeetUpPref");
            } catch (_) { }
            navigate("/profiling/questioner", { replace: true });
        }
    }, [navigate]);

    const confirmYes = () => {
        refreshModal.close();
        // Reset local state inputs on this page
        setSelected([]);
        setMeetUp("");
        try {
            localStorage.removeItem("profilingPreferences");
            localStorage.removeItem("profilingMeetUpPref");
        } catch (_) { }
        navigate("/profiling/questioner", { replace: true });
    };

    const confirmNo = () => refreshModal.close();

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
            <div className="w-full max-w-3xl bg-white shadow-md rounded-2xl p-8">
                <div className="text-center mb-6">
                    <h1 className="text-3xl font-semibold text-gray-900">Your Preferences</h1>
                    <p className="text-gray-600">Pick the topics that best match your energy</p>
                    <p className="text-sm text-gray-500 mt-1">Select a minimum of 3 and a maximum of 5</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
                    {TOPICS.map((t) => {
                        const active = selected.includes(t);
                        return (
                            <button
                                key={t}
                                type="button"
                                onClick={() => toggleTopic(t)}
                                className={`text-left px-4 py-3 rounded-xl border transition ${active ? "border-black bg-gray-100" : "border-gray-200 hover:border-gray-300"
                                    }`}
                            >
                                <span className="text-sm text-gray-800">{t}</span>
                            </button>
                        );
                    })}
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Prefer meet up</label>
                    <div className="flex flex-wrap gap-3">
                        {MEET_UP.map((m) => {
                            const active = meetUp === m;
                            return (
                                <button
                                    key={m}
                                    type="button"
                                    onClick={() => setMeetUp(m)}
                                    className={`px-4 py-2 rounded-full border text-sm transition ${active ? "border-black bg-gray-100" : "border-gray-200 hover:border-gray-300"
                                        }`}
                                >
                                    {m}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

                <div className="mt-6 flex items-center justify-end">
                    <button
                        type="button"
                        onClick={continueNext}
                        disabled={!canContinue}
                        className="rounded-full px-6 py-2.5 bg-orange-500 text-white font-semibold disabled:opacity-50"
                    >
                        Continue
                    </button>
                </div>

                {refreshModal.isOpen && (
                    <div>
                        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" aria-hidden="true" />
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                            <div
                                className="relative w-full max-w-md overflow-hidden rounded-xl bg-white shadow-2xl"
                                role="dialog"
                                aria-modal="true"
                                aria-labelledby="profiling-refresh-title"
                            >
                                <div className="bg-gradient-to-br from-orange-50 to-yellow-50 px-6 pt-8 pb-6 text-center">
                                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-orange-100">
                                        <svg className="h-8 w-8 text-orange-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                            <TriangleAlert />
                                        </svg>
                                    </div>
                                </div>
                                <div className="px-6 py-6">
                                    <h3 id="profiling-refresh-title" className="text-center text-lg font-semibold text-gray-900 mb-3">
                                        Konfirmasi Refresh
                                    </h3>
                                    <p className="text-center text-sm text-gray-600">
                                        Apakah Anda yakin ingin memulai ulang? Semua jawaban akan direset.
                                    </p>
                                    <div className="mt-6 flex items-center justify-center gap-3">
                                        <button
                                            id="profiling-refresh-yes-btn"
                                            onClick={confirmYes}
                                            className="rounded-full px-5 py-2.5 bg-orange-500 text-white font-semibold hover:bg-orange-600"
                                        >
                                            Yes
                                        </button>
                                        <button
                                            onClick={confirmNo}
                                            className="rounded-full px-5 py-2.5 border border-gray-300 bg-white text-gray-700"
                                        >
                                            No
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}