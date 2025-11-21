import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { submitProfiling } from "../api";
import { buildProfilingPayload } from "../utils/payload";
import { QUESTIONS } from "../utils/questions";
import { useModal } from "../../../core/stores/uiStore";
import { TriangleAlert } from "lucide-react";

const profileSchema = z.object({
    fullName: z.string().min(2, "Nama minimal 2 karakter"),
    age: z
        .string()
        .refine((val) => /^\d+$/.test(val), "Usia harus berupa angka")
        .transform((val) => Number(val))
        .refine((val) => val >= 13 && val <= 120, "Usia harus 13-120"),
    gender: z.string().min(1, "Pilih gender"),
    city: z.string().min(2, "Kota wajib diisi"),
    occupation: z.string().min(2, "Pekerjaan wajib diisi"),
});

export default function FormProfile() {
    const navigate = useNavigate();
    const refreshModal = useModal("profilingRefreshConfirm");
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            fullName: "",
            age: "",
            gender: "",
            city: "",
            occupation: "",
        },
        mode: "onBlur",
    });

    const onSubmit = async (data) => {
        try {
            const answersRaw = localStorage.getItem("profilingAnswers");
            const prefsRaw = localStorage.getItem("profilingPreferences");
            const meetUpRaw = localStorage.getItem("profilingMeetUpPref");
            const answers = answersRaw ? JSON.parse(answersRaw) : null;
            const preferences = prefsRaw ? JSON.parse(prefsRaw) : [];
            const meetUp = meetUpRaw ? JSON.parse(meetUpRaw) : "";

            if (!answers || !Array.isArray(answers) || answers.length !== QUESTIONS.length) {
                throw new Error("Jawaban quiz tidak lengkap. Silakan kembali ke langkah sebelumnya.");
            }

            const payload = buildProfilingPayload(data, answers);
            const questionTextById = QUESTIONS.reduce((acc, curr) => {
                acc[curr.id] = curr.text || "";
                return acc;
            }, {});
            payload.answers = (payload.answers || []).map((a) => ({
                ...a,
                question: questionTextById[a.id],
            }));
            payload.preferences = preferences;
            payload.meetUpPreference = meetUp;

            // Navigate to suggestion page with loading indicator
            navigate("/profiling/suggestion", { state: { submitting: true } });
            await submitProfiling(payload);
            // Clear temporary storage on success
            try {
                localStorage.removeItem("profilingAnswers");
                localStorage.removeItem("profilingPreferences");
                localStorage.removeItem("profilingMeetUpPref");
            } catch (_) { }
            // Pass results via state or rely on suggestion page to fetch
            navigate("/profiling/suggestion", { replace: true, state: { success: true } });
        } catch (e) {
            const message = e?.response?.data?.message || e?.message || "Gagal mengirim data";
            navigate("/profiling/suggestion", { replace: true, state: { error: message } });
        }
    };

    // Alert sebelum refresh dan tandai reload terkonfirmasi
    useEffect(() => {
        const onBeforeUnload = (e) => {
            const message = "Perubahan Anda belum disimpan. Apakah Anda yakin ingin memuat ulang halaman?";
            e.preventDefault();
            e.returnValue = message;
            return message;
        };
        const onPageHide = () => {
            try {
                sessionStorage.setItem("profilingReloadConfirmed", "1");
                sessionStorage.setItem("profilingReloadOrigin", "form");
            } catch (_) { }
        };
        window.addEventListener("beforeunload", onBeforeUnload);
        window.addEventListener("pagehide", onPageHide);
        return () => {
            window.removeEventListener("beforeunload", onBeforeUnload);
            window.removeEventListener("pagehide", onPageHide);
        };
    }, []);

    // Saat reload terkonfirmasi, reset semua input dan kembali ke questioner
    useEffect(() => {
        try {
            const navigationEntries = performance.getEntriesByType?.("navigation") || [];
            const navType = navigationEntries[0]?.type || "navigate";
            const confirmed = sessionStorage.getItem("profilingReloadConfirmed") === "1";
            const origin = sessionStorage.getItem("profilingReloadOrigin");
            if (navType === "reload" && confirmed) {
                // Reset semua inputan
                reset({ fullName: "", age: "", gender: "", city: "", occupation: "" });
                try {
                    localStorage.removeItem("profilingAnswers");
                    localStorage.removeItem("profilingCurrentIndex");
                    localStorage.removeItem("profilingPreferences");
                    localStorage.removeItem("profilingMeetUpPref");
                    localStorage.removeItem("profilingProfile");
                } catch (_) { }
                // Hapus flag
                try {
                    sessionStorage.removeItem("profilingReloadConfirmed");
                    sessionStorage.removeItem("profilingReloadOrigin");
                } catch (_) { }
                // Redirect ke questioner
                try {
                    navigate("/profiling/questioner", { replace: true });
                } catch (_) {
                    // Jika navigasi gagal, biarkan halaman tetap; tampilkan fallback via modal
                }
            }
        } catch (err) {
            // Jika terjadi error saat reset
            console.error("Reset saat reload gagal:", err);
        }
    }, [navigate, reset]);

    const confirmNo = () => {
        refreshModal.close();
    };

    const confirmYes = () => {
        localStorage.removeItem("profilingProfile");
        localStorage.removeItem("profilingAnswers");
        localStorage.removeItem("profilingPreferences");
        localStorage.removeItem("profilingMeetUpPref");
        sessionStorage.setItem("profilingSkipRefreshModal", "1");
        reset({ fullName: "", age: "", gender: "", city: "", occupation: "" }); refreshModal.close(); navigate("/profiling/questioner", { replace: true });

    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
            <div className="w-full max-w-2xl bg-white shadow-md rounded-2xl p-8">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-semibold text-gray-900">Tell us about yourself</h1>
                    <p className="text-gray-500">Help us create your ConnectX profile</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Full Name *
                        </label>
                        <input
                            type="text"
                            placeholder="John Doe"
                            className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-400"
                            {...register("fullName")}
                        />
                        {errors.fullName && (
                            <p className="mt-1 text-sm text-red-600">{errors.fullName.message}</p>
                        )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Age *</label>
                            <input
                                type="text"
                                placeholder="25"
                                className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-400"
                                {...register("age")}
                            />
                            {errors.age && (
                                <p className="mt-1 text-sm text-red-600">{errors.age.message}</p>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Gender *</label>
                            <select
                                className="w-full rounded-xl border border-gray-200 px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-orange-400"
                                {...register("gender")}
                            >
                                <option value="">Select gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                            </select>
                            {errors.gender && (
                                <p className="mt-1 text-sm text-red-600">{errors.gender.message}</p>
                            )}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                        <input
                            type="text"
                            placeholder="New York, NY"
                            className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-400"
                            {...register("city")}
                        />
                        {errors.city && (
                            <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Occupation *</label>
                        <input
                            type="text"
                            placeholder="Software Engineer"
                            className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-400"
                            {...register("occupation")}
                        />
                        {errors.occupation && (
                            <p className="mt-1 text-sm text-red-600">{errors.occupation.message}</p>
                        )}
                    </div>
                    <div className="gap-2 flex flex-col">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full hover:cursor-pointer rounded-full bg-primary hover:bg-secondary text-white font-semibold py-3 transition-colors disabled:opacity-60"
                        >
                            Continue
                        </button>
                    </div>
                </form>
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
                    // <div>
                    //     <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" aria-hidden="true" />
                    //     <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    //         <div className="relative w-full max-w-md overflow-hidden rounded-xl bg-white shadow-2xl">
                    //             <div className="p-6">
                    //                 <h3 className="text-lg font-semibold text-gray-900 mb-2">Konfirmasi Refresh</h3>
                    //                 <p className="text-sm text-gray-600">Apakah Anda yakin ingin memulai ulang? Semua jawaban akan direset.</p>
                    //                 <div className="mt-6 flex justify-end gap-3">
                    //                     <button onClick={() => refreshModal.close()} className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700">Tidak, tetap</button>
                    //                     <button onClick={() => {  }} className="px-4 py-2 rounded-lg bg-orange-500 text-white">Ya, mulai ulang</button>
                    //                 </div>
                    //             </div>
                    //         </div>
                    //     </div>
                    // </div>
                )}
            </div>
        </div>
    );
}