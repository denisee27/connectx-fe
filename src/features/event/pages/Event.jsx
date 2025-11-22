import React from "react";
import { useLocation } from "react-router-dom";
import {
    MapPin,
    CalendarDays,
    Users,
    Tag,
    X,
    CheckCircle2,
    QrCode,
    CreditCard,
} from "lucide-react";

function Modal({ open, onClose, children }) {
    React.useEffect(() => {
        function onKey(e) {
            if (e.key === "Escape") onClose();
        }
        if (open) document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, [open, onClose]);

    if (!open) return null;
    return (
        <div className="fixed inset-0 z-50">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={onClose} />
            <div className="pointer-events-auto absolute inset-x-0 bottom-0 mx-auto w-full max-w-2xl rounded-t-2xl bg-card shadow-xl transition-transform duration-200 sm:inset-y-10 sm:bottom-auto sm:rounded-2xl">
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 rounded-full p-1 text-muted-foreground hover:bg-muted"
                    aria-label="Close"
                >
                    <X size={18} />
                </button>
                {children}
            </div>
        </div>
    );
}

function Badge({ type }) {
    const map = {
        meetup: "bg-indigo-100 text-indigo-700",
        dinner: "bg-pink-100 text-pink-700",
        event: "bg-orange-100 text-orange-700",
    };
    const label = type === "meetup" ? "Meetup" : type === "dinner" ? "Dinner" : "Event";
    return <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${map[type] || map.event}`}>{label}</span>;
}

function PasswordStrength({ value }) {
    const rules = [
        /[a-z]/.test(value),
        /[A-Z]/.test(value),
        /\d/.test(value),
        /[^A-Za-z0-9]/.test(value),
        value?.length >= 8,
    ];
    const score = rules.filter(Boolean).length;
    const bars = Array.from({ length: 5 });
    const colors = ["bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-green-500", "bg-green-600"];
    return (
        <div>
            <div className="mt-2 flex gap-1">
                {bars.map((_, i) => (
                    <div key={i} className={`h-1 flex-1 rounded ${i < score ? colors[score - 1] : "bg-muted"}`} />
                ))}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">Password strength: {score}/5</p>
        </div>
    );
}

export const Event = () => {
    const { state } = useLocation();
    const event = state?.event || {
        title: "Jakarta Tech Night",
        description:
            "Bergabunglah dalam malam diskusi teknologi seputar AI, produk, dan growth. Ajak teman, perluas jaringan, dan temukan peluang kolaborasi.",
        venue: "SCBD, Jakarta",
        type: "meetup",
        dateISO: "2025-11-21T19:00:00",
        capacity: 120,
        price: 50000,
        thumbnail:
            "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop",
    };

    const d = new Date(event.dateISO);
    const dateLabel = `${d.toLocaleDateString("id-ID", { weekday: "short", day: "2-digit", month: "short", year: "numeric" })}, ${String(
        d.getHours()
    ).padStart(2, "0")}.${String(d.getMinutes()).padStart(2, "0")}`;

    const [openRegister, setOpenRegister] = React.useState(false);
    const [openPayment, setOpenPayment] = React.useState(false);
    const [openSuccess, setOpenSuccess] = React.useState(false);
    const [processing, setProcessing] = React.useState(false);

    // Register form state
    const [form, setForm] = React.useState({ name: "", email: "", phone: "", age: "", password: "" });
    const [errors, setErrors] = React.useState({});

    function validate() {
        const e = {};
        if (!form.name.trim()) e.name = "Nama wajib";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Email tidak valid";
        if (!/^\d{9,15}$/.test(form.phone)) e.phone = "Nomor telepon 9-15 digit";
        const ageNum = Number(form.age);
        if (!ageNum || ageNum < 13) e.age = "Usia minimal 13";
        const passOk = /[a-z]/.test(form.password) && /[A-Z]/.test(form.password) && /\d/.test(form.password) && form.password.length >= 8;
        if (!passOk) e.password = "Password harus 8+ char, huruf besar/kecil & angka";
        setErrors(e);
        return Object.keys(e).length === 0;
    }

    function onSubmitRegister() {
        if (!validate()) return;
        setProcessing(true);
        setTimeout(() => {
            setProcessing(false);
            // Simulasi kegagalan kecil
            const failed = Math.random() < 0.1;
            if (failed) {
                setErrors((prev) => ({ ...prev, _form: "Registrasi gagal, coba lagi." }));
            } else {
                setOpenRegister(false);
                setOpenPayment(true);
            }
        }, 800);
    }

    // Payment state
    const [payMethod, setPayMethod] = React.useState("qris");
    const [selectedBank, setSelectedBank] = React.useState("");
    const [payError, setPayError] = React.useState("");
    const [showDetails, setShowDetails] = React.useState(""); // '', 'qris', 'va'
    const [vaCode, setVaCode] = React.useState("");
    const [reference] = React.useState(() => Math.random().toString(36).slice(2, 8).toUpperCase());
    const BANKS = [
        { key: "bca", label: "BCA", code: "014" },
        { key: "bri", label: "BRI", code: "002" },
        { key: "mandiri", label: "Mandiri", code: "008" },
        { key: "bni", label: "BNI", code: "009" },
    ];

    function generateVaCode(bank) {
        const bankCode = BANKS.find((b) => b.key === bank)?.code || "000";
        const rand = Array.from({ length: 10 }, () => Math.floor(Math.random() * 10)).join("");
        return `${bankCode}${rand}`;
    }

    function onStartPayment() {
        setPayError("");
        if (payMethod === "va") {
            if (!selectedBank) {
                setPayError("Pilih bank terlebih dahulu.");
                return;
            }
            const code = generateVaCode(selectedBank);
            setVaCode(code);
            setShowDetails("va");
        } else {
            setShowDetails("qris");
        }
    }

    function onConfirmPayment() {
        if (!showDetails) {
            setPayError("Lakukan langkah 'Payment Dulu' terlebih dahulu.");
            return;
        }
        setPayError("");
        setProcessing(true);
        setTimeout(() => {
            setProcessing(false);
            const failed = Math.random() < 0.1;
            if (failed) {
                setPayError("Pembayaran gagal, silakan ulangi.");
            } else {
                setOpenPayment(false);
                setOpenSuccess(true);
            }
        }, 900);
    }

    return (
        <div className="min-h-screen bg-card">
            {/* Hero image */}
            <div className="mx-auto w-full max-w-4xl">
                {event.thumbnail && (
                    <img
                        src={event.thumbnail}
                        alt={event.title}
                        className="h-56 w-full rounded-b-2xl object-cover sm:h-72 md:h-80"
                    />
                )}

                {/* Content */}
                <div className="px-4 py-6 sm:px-6 md:px-8">
                    <div className="flex items-start justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-card-foreground sm:text-3xl">{event.title}</h1>
                            <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                                <span className="inline-flex items-center gap-1"><MapPin size={16} /> {event.venue}</span>
                                <span className="inline-flex items-center gap-1"><CalendarDays size={16} /> {dateLabel}</span>
                                {event.capacity && (
                                    <span className="inline-flex items-center gap-1"><Users size={16} /> Kapasitas {event.capacity}</span>
                                )}
                                <span className="inline-flex items-center gap-1"><Tag size={16} /> <Badge type={event.type} /></span>
                            </div>
                        </div>
                    </div>

                    <p className="mt-6 max-w-3xl text-base leading-relaxed text-foreground/80">{event.description}</p>
                </div>
            </div>

            {/* Fixed CTA */}
            <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-glass backdrop-blur supports-[backdrop-filter]:bg-glass">
                <div className="mx-auto flex max-w-4xl items-center justify-between gap-3 px-4 py-3 sm:px-6 md:px-8">
                    <div className="text-sm text-muted-foreground">
                        Biaya Event: <span className="font-semibold text-foreground">Rp {event.price.toLocaleString("id-ID")}</span>
                    </div>
                    <button
                        onClick={() => setOpenRegister(true)}
                        className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground shadow hover:bg-secondary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    >
                        Join This Event
                    </button>
                </div>
            </div>

            {/* Register Modal */}
            <Modal open={openRegister} onClose={() => setOpenRegister(false)}>
                <div className="px-5 py-6">
                    <h3 className="text-xl font-semibold text-card-foreground">Registrasi</h3>
                    {errors._form && <p className="mt-2 rounded bg-destructive/10 px-3 py-2 text-sm text-destructive">{errors._form}</p>}
                    <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <label className="text-sm text-muted-foreground">Nama Lengkap</label>
                            <input
                                className="mt-1 w-full rounded-lg border border-input bg-card px-3 py-2 text-sm text-card-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                            />
                            {errors.name && <p className="mt-1 text-xs text-destructive">{errors.name}</p>}
                        </div>
                        <div>
                            <label className="text-sm text-muted-foreground">Email</label>
                            <input
                                type="email"
                                className="mt-1 w-full rounded-lg border border-input bg-card px-3 py-2 text-sm text-card-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                                value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                            />
                            {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email}</p>}
                        </div>
                        <div>
                            <label className="text-sm text-muted-foreground">Nomor Telepon</label>
                            <input
                                className="mt-1 w-full rounded-lg border border-input bg-card px-3 py-2 text-sm text-card-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                                value={form.phone}
                                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                            />
                            {errors.phone && <p className="mt-1 text-xs text-destructive">{errors.phone}</p>}
                        </div>
                        <div>
                            <label className="text-sm text-muted-foreground">Umur</label>
                            <input
                                type="number"
                                className="mt-1 w-full rounded-lg border border-input bg-card px-3 py-2 text-sm text-card-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                                value={form.age}
                                onChange={(e) => setForm({ ...form, age: e.target.value })}
                            />
                            {errors.age && <p className="mt-1 text-xs text-destructive">{errors.age}</p>}
                        </div>
                        <div className="sm:col-span-2">
                            <label className="text-sm text-muted-foreground">Password</label>
                            <input
                                type="password"
                                className="mt-1 w-full rounded-lg border border-input bg-card px-3 py-2 text-sm text-card-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                                value={form.password}
                                onChange={(e) => setForm({ ...form, password: e.target.value })}
                            />
                            <PasswordStrength value={form.password} />
                            {errors.password && <p className="mt-1 text-xs text-destructive">{errors.password}</p>}
                        </div>
                    </div>
                    <div className="mt-6 flex items-center justify-end gap-2">
                        <button
                            onClick={() => setOpenRegister(false)}
                            className="rounded-lg border border-input px-4 py-2 text-sm text-foreground hover:bg-muted"
                        >
                            Batal
                        </button>
                        <button
                            onClick={onSubmitRegister}
                            disabled={processing}
                            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-secondary disabled:opacity-60"
                        >
                            {processing ? "Memproses..." : "Lanjut Pembayaran"}
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Payment Modal */}
            <Modal open={openPayment} onClose={() => setOpenPayment(false)}>
                <div className="px-5 py-6">
                    <h3 className="text-xl font-semibold text-card-foreground">Pembayaran</h3>
                    <p className="mt-1 text-sm text-muted-foreground">Biaya: Rp {event.price.toLocaleString("id-ID")}</p>
                    <div className="mt-4 space-y-3">
                        <label className="flex items-center gap-3 rounded-lg border border-input p-3">
                            <input type="radio" name="pay" checked={payMethod === "qris"} onChange={() => setPayMethod("qris")} />
                            <QrCode size={18} /> QRIS
                        </label>
                        <label className="flex items-center gap-3 rounded-lg border border-input p-3">
                            <input type="radio" name="pay" checked={payMethod === "va"} onChange={() => setPayMethod("va")} />
                            <CreditCard size={18} /> Virtual Account
                        </label>
                        {payMethod === "va" && (
                            <div className="grid grid-cols-2 gap-2">
                                {BANKS.map((b) => (
                                    <label key={b.key} className="flex items-center gap-2 rounded-lg border border-input p-2">
                                        <input
                                            type="radio"
                                            name="bank"
                                            checked={selectedBank === b.key}
                                            onChange={() => setSelectedBank(b.key)}
                                        />
                                        <span className="text-sm text-card-foreground">{b.label}</span>
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>
                    {payError && <p className="mt-2 rounded bg-destructive/10 px-3 py-2 text-sm text-destructive">{payError}</p>}
                    <div className="mt-6 flex items-center justify-end gap-2">
                        <button onClick={() => setOpenPayment(false)} className="rounded-lg border border-input px-4 py-2 text-sm text-foreground hover:bg-muted">
                            Tutup
                        </button>
                        <button
                            onClick={onStartPayment}
                            disabled={processing}
                            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-secondary disabled:opacity-60"
                        >
                            {processing ? "Memproses..." : "Payment Dulu"}
                        </button>
                    </div>

                    {/* Payment details */}
                    {showDetails && (
                        <div className="mt-6 space-y-4 transition-opacity duration-200">
                            {showDetails === "qris" && (
                                <div className="rounded-lg border border-input bg-card p-4 text-center">
                                    <img
                                        className="mx-auto h-44 w-44"
                                        alt="QRIS"
                                        src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
                                            `CONNECTX:${reference}`
                                        )}`}
                                    />
                                    <p className="mt-2 text-sm text-muted-foreground">Scan QRIS untuk menyelesaikan pembayaran</p>
                                </div>
                            )}
                            {showDetails === "va" && (
                                <div className="rounded-lg border border-input bg-card p-4">
                                    <p className="text-sm text-muted-foreground">Bank: {BANKS.find((b) => b.key === selectedBank)?.label}</p>
                                    <p className="mt-1 text-2xl font-semibold tracking-wider text-card-foreground">{vaCode}</p>
                                    <p className="mt-2 text-sm text-muted-foreground">Transfer ke nomor virtual account di atas.</p>
                                </div>
                            )}

                            <div className="flex items-center justify-end">
                                <button
                                    onClick={onConfirmPayment}
                                    disabled={processing}
                                    className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-secondary disabled:opacity-60"
                                >
                                    {processing ? "Memproses..." : "Konfirmasi Payment"}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </Modal>

            {/* Success Modal */}
            <Modal open={openSuccess} onClose={() => setOpenSuccess(false)}>
                <div className="px-5 py-8 text-center">
                    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-700">
                        <CheckCircle2 size={24} />
                    </div>
                    <h3 className="text-xl font-semibold text-card-foreground">Payment Success</h3>
                    <p className="mt-2 text-sm text-muted-foreground">Anda sudah terdaftar di event ini</p>
                    <div className="mt-6 flex items-center justify-center">
                        <button onClick={() => setOpenSuccess(false)} className="rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground hover:bg-secondary">
                            OK
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
