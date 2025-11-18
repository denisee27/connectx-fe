import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { submitProfiling } from "../api";
import { buildProfilingPayload } from "../utils/payload";
import { useModal } from "../../../core/stores/uiStore";
import { TriangleAlert } from "lucide-react";

const QUESTIONS = [
    {
        id: 1,
        type: "single",
        text: "Do you prefer large social gatherings or intimate settings?",
        options: [
            "Large gatherings",
            "Small groups",
            "One-on-one",
            "Mix of both",
        ],
    },
    {
        id: 2,
        type: "single",
        text: "How do you recharge after a long day?",
        options: ["Quiet time", "Exercise", "Socializing", "Creative hobby"],
    },
    {
        id: 3,
        type: "single",
        text: "What best describes your communication style?",
        options: ["Direct", "Diplomatic", "Analytical", "Expressive"],
    },
    {
        id: 4,
        type: "single",
        text: "How do you make decisions?",
        options: ["Gut feeling", "Pros & cons", "Ask others", "Research deeply"],
    },
    {
        id: 5,
        type: "single",
        text: "What motivates you most?",
        options: ["Achievement", "Connection", "Stability", "Discovery"],
    },
    {
        id: 6,
        type: "single",
        text: "Your ideal weekend looks like…",
        options: ["Outdoor adventures", "Stay home & relax", "Social events", "Learning something new"],
    },
    {
        id: 7,
        type: "single",
        text: "In a team, you often…",
        options: ["Lead", "Support", "Strategize", "Execute"],
    },
    {
        id: 8,
        type: "single",
        text: "You handle conflict by…",
        options: ["Address immediately", "Pause & reflect", "Seek mediation", "Avoid if possible"],
    },
    {
        id: 9,
        type: "single",
        text: "When meeting new people, you…",
        options: ["Start conversations", "Wait to be approached", "Observe first", "Stick with friends"],
    },
    {
        id: 10,
        type: "single",
        text: "Which environments help you thrive?",
        options: ["Fast-paced", "Structured", "Flexible", "Collaborative"],
    },
];

function ProgressBar({ current, total }) {
    const percent = useMemo(() => Math.round((current / total) * 100), [current, total]);
    return (
        <div className="w-full h-2 bg-orange-100 rounded-full">
            <div
                className="h-2 rounded-full bg-gradient-to-r from-orange-300 via-yellow-300 to-orange-500 transition-all"
                style={{ width: `${percent}%` }}
            />
        </div>
    );
}

export default function Questioner() {
    const navigate = useNavigate();
    const total = QUESTIONS.length;
    const [index, setIndex] = useState(0);
    const [answers, setAnswers] = useState(Array(total).fill(null));
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const refreshModal = useModal("profilingRefreshConfirm");

    const q = QUESTIONS[index];

    const selectOption = (value) => {
        setAnswers((prev) => {
            const next = [...prev];
            next[index] = { id: q.id, value };
            return next;
        });
    };

    const next = () => setIndex((i) => Math.min(i + 1, total - 1));
    const prev = () => setIndex((i) => Math.max(i - 1, 0));

    const canNext = answers[index] && answers[index].value !== null;
    const isLast = index === total - 1;

    const handleSubmit = async () => {
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const profileRaw = localStorage.getItem("profilingProfile");
            const profile = profileRaw ? JSON.parse(profileRaw) : null;
            if (!profile) throw new Error("Data profil tidak ditemukan");

            // Build mapping id -> question text
            const questionTextById = QUESTIONS.reduce((acc, curr) => {
                acc[curr.id] = curr.text || "";
                return acc;
            }, {});

            // Validate question text exists for all answered items
            const answered = (answers || []).filter(Boolean);
            const hasEmptyQuestion = answered.some((a) => {
                const t = questionTextById[a.id];
                return !t || !String(t).trim();
            });
            if (hasEmptyQuestion) {
                throw new Error("Pertanyaan tidak boleh kosong.");
            }

            // Build base payload, then enrich answers with question text
            const payload = buildProfilingPayload(profile, answers);
            payload.answers = (payload.answers || []).map((a) => ({
                ...a,
                question: questionTextById[a.id],
            }));

            await submitProfiling(payload);
            setSuccess(true);
            // Optionally clear storage
            localStorage.removeItem("profilingProfile");
            // Navigate or show success message
            setTimeout(() => navigate("/"), 1200);
        } catch (e) {
            // Map and display friendly error
            const message = e?.response?.data?.message || e?.message || "Gagal mengirim data";
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    // Detect refresh attempts and show confirmation modal
    useEffect(() => {
        const handleKeyDown = (e) => {
            const isRefreshKey =
                e.key === "F5" ||
                ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "r");
            if (isRefreshKey) {
                e.preventDefault();
                refreshModal.open();
            }
        };

        const beforeUnloadHandler = (e) => {
            const message =
                "Apakah Anda yakin ingin memulai ulang? Semua jawaban akan direset.";
            e.preventDefault();
            e.returnValue = message; // Native browser dialog only
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
            // Clean flag first to avoid loops
            sessionStorage.removeItem("profilingReloadPending");
            // Reset state and storage, then redirect
            setAnswers(Array(total).fill(null));
            try {
                // Clear temporary profiling data
                localStorage.removeItem("profilingProfile");
                // Clear any profiling-related session keys
                Object.keys(sessionStorage).forEach((key) => {
                    if (key.includes("profiling")) sessionStorage.removeItem(key);
                });
            } catch (_) { }
            navigate("/profiling/form", { replace: true });
        }
    }, [navigate, total]);

    const handleConfirmRefreshYes = () => {
        // User explicitly chose Yes via our modal (F5/Cmd+R path)
        refreshModal.close();
        setAnswers(Array(total).fill(null));
        try {
            localStorage.removeItem("profilingProfile");
            Object.keys(sessionStorage).forEach((key) => {
                if (key.includes("profiling")) sessionStorage.removeItem(key);
            });
        } catch (_) { }
        navigate("/profiling/form", { replace: true });
    };

    const handleConfirmRefreshNo = () => {
        // Do nothing; keep the current page/state
        refreshModal.close();
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
            <div className="w-full max-w-2xl bg-white shadow-md rounded-2xl p-8">
                <div className="text-center mb-6">
                    <h1 className="text-3xl font-semibold text-gray-900">Personality Quiz</h1>
                    <p className="text-gray-500">Help us understand you better for perfect matches</p>
                </div>

                <div className="mb-4">
                    <ProgressBar current={index + 1} total={total} />
                </div>
                <p className="text-center text-sm text-gray-600 mb-6">Question {index + 1} of {total}</p>

                <div className="rounded-2xl border border-gray-200 p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">{q.text}</h2>
                    <ul className="space-y-3">
                        {q.options.map((opt) => {
                            const selected = answers[index]?.value === opt;
                            return (
                                <li key={opt}>
                                    <button
                                        type="button"
                                        onClick={() => selectOption(opt)}
                                        aria-pressed={selected}
                                        className={
                                            "w-full text-left px-4 py-3 rounded-xl border transition " +
                                            (selected
                                                ? "border-orange-400 bg-orange-50"
                                                : "border-gray-200 hover:border-orange-300 hover:bg-orange-50")
                                        }
                                    >
                                        <span className="inline-flex items-center gap-3">
                                            <span
                                                className={
                                                    "h-5 w-5 rounded-full border flex items-center justify-center " +
                                                    (selected ? "border-orange-500" : "border-gray-300")
                                                }
                                                aria-hidden="true"
                                            >
                                                {selected && <span className="h-3 w-3 bg-orange-500 rounded-full" />}
                                            </span>
                                            <span className="text-gray-800">{opt}</span>
                                        </span>
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                </div>

                {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
                {success && <p className="mt-4 text-sm text-green-600">Berhasil dikirim!</p>}

                <div className="mt-6 flex items-center justify-between">
                    <button
                        type="button"
                        onClick={prev}
                        disabled={index === 0 || loading}
                        className="rounded-full px-5 py-2.5 border border-gray-300 text-gray-700 bg-white disabled:opacity-50"
                    >
                        Previous
                    </button>
                    {!isLast ? (
                        <button
                            type="button"
                            onClick={next}
                            disabled={!canNext || loading}
                            className="rounded-full px-6 py-2.5 bg-orange-500 text-white font-semibold disabled:opacity-50"
                        >
                            Next
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={!canNext || loading}
                            className="rounded-full px-6 py-2.5 bg-orange-500 text-white font-semibold disabled:opacity-50"
                        >
                            {loading ? "Submitting..." : "Submit"}
                        </button>
                    )}
                </div>

                {/* Refresh Confirmation Modal */}
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
                                            onClick={handleConfirmRefreshYes}
                                            className="rounded-full px-5 py-2.5 bg-orange-500 text-white font-semibold hover:bg-orange-600"
                                        >
                                            Yes
                                        </button>
                                        <button
                                            onClick={handleConfirmRefreshNo}
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