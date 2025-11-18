import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";

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
    const {
        register,
        handleSubmit,
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

    const onSubmit = (data) => {
        try {
            localStorage.setItem("profilingProfile", JSON.stringify(data));
            navigate("/profiling/quiz");
        } catch (e) {
            console.error("Failed to store profile", e);
        }
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
                                <option value="non_binary">Non-binary</option>
                                <option value="prefer_not">Prefer not to say</option>
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
                        <button
                            type="button"
                            onClick={() => navigate("/")}
                            disabled={isSubmitting}
                            className="w-full hover:cursor-pointer rounded-full border border-primary text-primary hover:bg-secondary hover:text-white font-semibold py-3 transition-colors disabled:opacity-60"
                        >
                            Back To Home
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}