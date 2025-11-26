import React from "react";
import { useMemo, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import SectionHeader from "../../dashboard/components/SectionHeader.jsx";
import EventCard from "../../dashboard/components/EventCard.jsx";
import PopularTabs from "../../dashboard/components/PopularTabs.jsx";
import { useListEvent } from "../hooks/useListEvent.js";

function parseISO(iso) {
    const d = new Date(iso);
    return Number.isNaN(d.getTime()) ? null : d.getTime();
}

function makeData() {
    const base = [
        {
            id: 1,
            title: "UR Team Strength Training Night",
            venue: "Senayan Park Mall",
            dateISO: "2025-11-27T19:00:00",
            meta: "Fitness • Jakarta",
            thumbnail: "https://images.unsplash.com/photo-1517836357463-d25dfeac3e9f?q=80&w=800&auto=format&fit=crop",
            popularity: 92,
        },
        {
            id: 2,
            title: "City Music Festival",
            venue: "JIExpo Kemayoran",
            dateISO: "2025-12-01T17:00:00",
            meta: "Music • Jakarta",
            thumbnail: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=800&auto=format&fit=crop",
            popularity: 88,
        },
        {
            id: 3,
            title: "Product Conference",
            venue: "Balai Kartini",
            dateISO: "2025-12-05T09:00:00",
            meta: "Conference • Jakarta",
            thumbnail: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=800&auto=format&fit=crop",
            popularity: 75,
        },
        {
            id: 4,
            title: "Art Expo Week",
            venue: "Museum Nasional",
            dateISO: "2025-12-09T11:00:00",
            meta: "Art • Jakarta",
            thumbnail: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=800&auto=format&fit=crop",
            popularity: 64,
        },
        {
            id: 5,
            title: "React Jakarta Meetup",
            venue: "Goltrix Treasury Tower",
            dateISO: "2025-11-28T18:30:00",
            meta: "Tech • Jakarta",
            thumbnail: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=800&auto=format&fit=crop",
            popularity: 83,
        },
        {
            id: 6,
            title: "Startup Coffee Chat",
            venue: "SCBD",
            dateISO: "2025-12-03T09:00:00",
            meta: "Startup • Jakarta",
            thumbnail: "https://images.unsplash.com/photo-1447933604927-51323c4f564f?q=80&w=800&auto=format&fit=crop",
            popularity: 72,
        },
        {
            id: 7,
            title: "AI Builders Meetup",
            venue: "Kota Kasablanka",
            dateISO: "2025-12-08T18:00:00",
            meta: "AI • Jakarta",
            thumbnail: "https://images.unsplash.com/photo-1518779578993-ec3579fee39f?q=80&w=800&auto=format&fit=crop",
            popularity: 68,
        },
        {
            id: 8,
            title: "Wine & Talk Dinner",
            venue: "Kuningan",
            dateISO: "2025-12-06T20:00:00",
            meta: "Food & Drink • Jakarta",
            thumbnail: "https://images.unsplash.com/photo-1510627498534-ff0c5a59be0b?q=80&w=800&auto=format&fit=crop",
            popularity: 74,
        },
        {
            id: 9,
            title: "Chef's Table Night",
            venue: "Senopati",
            dateISO: "2025-12-12T19:00:00",
            meta: "Food & Drink • Jakarta",
            thumbnail: "https://images.unsplash.com/photo-1526318472351-c75fd3eb77af?q=80&w=800&auto=format&fit=crop",
            popularity: 69,
        },
    ];

    // Expand to ~24 items per category by cloning with small tweaks
    function expand(items, extraCount, mutate) {
        const arr = [...items];
        for (let i = 0; i < extraCount; i++) {
            const src = items[i % items.length];
            arr.push({ ...src, id: src.id * 100 + i, popularity: src.popularity - (i % 5), ...mutate(i, src) });
        }
        return arr;
    }

    const events = expand(base, 16, (i, src) => ({ title: `${src.title} #${i + 1}` }));
    const meetups = expand(base.filter((e) => /Meetup/i.test(e.title)), 16, (i, src) => ({ title: `${src.title} • ${i + 1}` }));
    const dinners = expand(base.filter((e) => /Dinner|Table/i.test(e.title)), 16, (i, src) => ({ title: `${src.title} • ${i + 1}` }));
    return { events, meetups, dinners };
}

export const ListEvent = () => {
    const navigate = useNavigate();
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);

    const filters = useMemo(() => {
        return {
            page,
            limit,
        };
    }, [page, limit]);

    const {
        data: { data: eventList = [], meta } = {},
        isLoading,
        isFetching,
        error,
    } = useListEvent(filters);

    console.log("eventList", eventList);
    console.log("meta", meta);
    const tabs = useMemo(
        () => [
            { key: "event", label: "Event" },
            { key: "meetup", label: "Meetup" },
            { key: "dinner", label: "Dinner" },
        ],
        []
    );
    const [activeTab, setActiveTab] = useState("event");
    const { events, meetups, dinners } = useMemo(makeData, []);

    // Filters & search & sorting
    const [search, setSearch] = useState("");
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");
    const [sortBy, setSortBy] = useState("nearest"); // 'nearest' | 'popular'

    const pageSize = 12;
    // const [page, setPage] = useState(1);

    const currentList = useMemo(() => {
        const raw = activeTab === "event" ? events : activeTab === "meetup" ? meetups : dinners;
        return raw;
    }, [activeTab, events, meetups, dinners]);

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        return currentList
            .filter((e) => (q ? e.title.toLowerCase().includes(q) || e.venue.toLowerCase().includes(q) : true))
            .filter((e) => {
                const t = parseISO(e.dateISO);
                if (!t) return true;
                const fromOk = dateFrom ? t >= parseISO(`${dateFrom}T00:00:00`) : true;
                const toOk = dateTo ? t <= parseISO(`${dateTo}T23:59:59`) : true;
                return fromOk && toOk;
            })
            .sort((a, b) => {
                if (sortBy === "popular") return (b.popularity || 0) - (a.popularity || 0);
                const ta = parseISO(a.dateISO) || 0;
                const tb = parseISO(b.dateISO) || 0;
                return ta - tb;
            });
    }, [currentList, search, dateFrom, dateTo, sortBy]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
    const pageItems = useMemo(() => {
        const start = (page - 1) * pageSize;
        return filtered.slice(start, start + pageSize);
    }, [filtered, page, pageSize]);

    // Reset page when filters change
    React.useEffect(() => {
        setPage(1);
    }, [activeTab, search, dateFrom, dateTo, sortBy]);

    const handleDetail = useCallback((id) => navigate(`/home/event/${id}`), [navigate]);

    // Smooth transitions for grid changes
    function FadeIn({ deps, children }) {
        const [visible, setVisible] = useState(false);
        React.useEffect(() => {
            setVisible(false);
            const t = setTimeout(() => setVisible(true), 10);
            return () => clearTimeout(t);
        }, [deps]);
        return (
            <div className={"transition-all duration-300 " + (visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1")}>{children}</div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <SectionHeader title="Daftar Event Unggulan" action={<PopularTabs tabs={tabs} active={activeTab} onChange={setActiveTab} />} />

                {/* Controls: search, filters, sort */}
                <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                        <div>
                            <label className="text-sm text-gray-700">Search</label>
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Cari judul atau lokasi"
                                className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="text-sm text-gray-700">Tanggal dari</label>
                            <input
                                type="date"
                                value={dateFrom}
                                onChange={(e) => setDateFrom(e.target.value)}
                                className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="text-sm text-gray-700">Tanggal hingga</label>
                            <input
                                type="date"
                                value={dateTo}
                                onChange={(e) => setDateTo(e.target.value)}
                                className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="text-sm text-gray-700">Sorting</label>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none"
                            >
                                <option value="nearest">Tanggal Terdekat</option>
                                <option value="popular">Popularitas</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Grid */}
                <div className="mt-6">
                    <FadeIn deps={{ activeTab, page }}>
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {pageItems.map((e) => (
                                <div key={e.id} className="relative" onClick={() => handleDetail(e.id)}>
                                    <EventCard {...e} />
                                </div>
                            ))}
                        </div>
                    </FadeIn>
                </div>

                {/* Pagination */}
                <div className="mt-8 flex items-center justify-between">
                    <button
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="rounded-full border border-gray-300 px-3 py-1.5 text-sm text-gray-800 transition-colors disabled:opacity-50 hover:bg-gray-100"
                    >
                        Sebelumnya
                    </button>

                    <div className="flex items-center gap-2">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                            <button
                                key={n}
                                onClick={() => setPage(n)}
                                className={
                                    "h-8 w-8 rounded-full text-sm transition-colors " +
                                    (page === n ? "bg-gray-900 text-white" : "border border-gray-300 bg-white text-gray-800 hover:bg-gray-100")
                                }
                            >
                                {n}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                        className="rounded-full border border-gray-300 px-3 py-1.5 text-sm text-gray-800 transition-colors disabled:opacity-50 hover:bg-gray-100"
                    >
                        Selanjutnya
                    </button>
                </div>
            </div>
        </div>
    );
};
