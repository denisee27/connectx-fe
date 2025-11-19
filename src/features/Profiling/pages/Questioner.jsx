import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
// Submission now happens in FormProfile per revised flow
import { useModal } from "../../../core/stores/uiStore";
import { TriangleAlert } from "lucide-react";
import { QUESTIONS } from "../utils/questions";

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

    const handleSubmit = () => {
        setLoading(true);
        setError(null);
        setSuccess(false);
        try {
            const answered = (answers || []).filter(Boolean);
            if (answered.length !== QUESTIONS.length) {
                throw new Error("Mohon jawab semua pertanyaan dulu.");
            }
            localStorage.setItem("profilingAnswers", JSON.stringify(answered));
            setSuccess(true);
            navigate("/profiling/preference");
        } catch (e) {
            const message = e?.message || "Terjadi kesalahan saat menyimpan jawaban";
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    // Detect refresh attempts and show confirmation modal, with guard to skip
    useEffect(() => {
        const handleKeyDown = (e) => {
            const isRefreshKey =
                e.key === "F5" ||
                ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "r");
            if (isRefreshKey) {
                e.preventDefault();
                // If coming from FormProfile reset, skip showing this modal once
                const skip = sessionStorage.getItem("profilingSkipRefreshModal") === "1";
                if (skip) {
                    try { sessionStorage.removeItem("profilingSkipRefreshModal"); } catch (_) {}
                    return; // do not open modal
                }
                refreshModal.open();
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [refreshModal]);

    useEffect(() => {
        const navigationEntries = performance.getEntriesByType?.("navigation") || [];
        const navType = navigationEntries[0]?.type || "navigate";
        const isReload = navType === "reload";
        // Also treat explicit reset navigation from FormProfile as a hard reset
        const fromFormReset = sessionStorage.getItem("profilingSkipRefreshModal") === "1";
        if (isReload || fromFormReset) {
            setAnswers(Array(total).fill(null));
            setIndex(0);
            try {
                localStorage.removeItem("profilingProfile");
                if (fromFormReset) sessionStorage.removeItem("profilingSkipRefreshModal");
            } catch (_) {}
        }
    }, [total]);

    const handleConfirmRefreshYes = () => {
        // User explicitly chose Yes via our modal (F5/Cmd+R path)
        refreshModal.close();
        setAnswers(Array(total).fill(null));
        setIndex(0);
        try {
            localStorage.removeItem("profilingProfile");
            Object.keys(sessionStorage).forEach((key) => {
                if (key.includes("profiling")) sessionStorage.removeItem(key);
            });
        } catch (_) { }
        navigate("/profiling/questioner", { replace: true });
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