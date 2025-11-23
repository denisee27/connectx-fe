import React, { useMemo, useState } from "react";
import { MapPin, Users, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

/**
 * Schedule Page
 * - Tabs: Upcoming / Past
 * - Vertical timeline line (continuous), dot per day
 * - Responsive cards with smooth tab transitions
 */
export const Schedule = () => {
    const [activeTab, setActiveTab] = useState("upcoming");
    const navigate = useNavigate();
    const upcoming = useMemo(
        () => [
            {
                dayLabel: "Nov 15",
                dayName: "Saturday",
                items: [
                    {
                        time: "10:00 AM",
                        title:
                            "Nail The Interview - Bedah CV, Portfolio dan Interview Simulation with HRD and User",
                        location: "Yogyakarta",
                        guests: "No guests",
                        thumbnail:
                            "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=600&auto=format&fit=crop",
                    },
                    {
                        time: "5:00 PM",
                        title:
                            "Career Launchpad - Nail the Interview: CV, Portfolio, & Simulation Workshop",
                        location: "Yogyakarta",
                        guests: "No guests",
                        thumbnail:
                            "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=600&auto=format&fit=crop",
                    },
                ],
            },
            {
                dayLabel: "Nov 16",
                dayName: "Sunday",
                items: [
                    {
                        time: "2:00 PM",
                        title: "Community Coding Meetup: Build & Share",
                        location: "Jakarta",
                        guests: "18 guests",
                        thumbnail:
                            "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=600&auto=format&fit=crop",
                    },
                ],
            },
        ],
        []
    );

    const past = useMemo(
        () => [
            {
                dayLabel: "Nov 10",
                dayName: "Monday",
                items: [
                    {
                        time: "3:00 PM",
                        title: "Portfolio Review Session",
                        location: "Bandung",
                        guests: "24 guests",
                        thumbnail:
                            "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=600&auto=format&fit=crop",
                    },
                ],
            },
            {
                dayLabel: "Nov 08",
                dayName: "Saturday",
                items: [
                    {
                        time: "7:00 PM",
                        title: "Networking Night",
                        location: "Jakarta",
                        guests: "10 guests",
                        thumbnail:
                            "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=600&auto=format&fit=crop",
                    },
                ],
            },
        ],
        []
    );

    const data = activeTab === "upcoming" ? upcoming : past;

    return (
        <div className="mx-auto max-w-7xl bg-white px-4 sm:px-8 text-foreground">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">Schedules</h1>

                {/* Tabs */}
                <div className="flex items-center gap-2 rounded-full border border-border p-1 bg-card">
                    <TabButton
                        active={activeTab === "upcoming"}
                        onClick={() => setActiveTab("upcoming")}
                    >
                        Upcoming
                    </TabButton>
                    <TabButton
                        active={activeTab === "past"}
                        onClick={() => setActiveTab("past")}
                    >
                        Past
                    </TabButton>
                </div>
            </div>

            {/* Content */}
            <div className="mt-8 relative">
                {/* Continuous vertical timeline line (adjusted for mobile) */}
                <div className="absolute left-[9px] md:left-[178px] top-2 bottom-0 w-px bg-border" aria-hidden />
                {/* Animated list container */}
                <div
                    key={activeTab}
                    className="space-y-8 md:space-y-10 transition-all duration-300 ease-out"
                >
                    {data.map((day, di) => (
                        <div key={`${day.dayLabel}-${di}`} className="relative">
                            <div className="grid grid-cols-[20px_1fr] md:grid-cols-[140px_28px_1fr] gap-3 md:gap-6 items-start">
                                {/* 1. Date & Day (desktop only) */}
                                <div className="hidden md:block text-right pr-2 md:pr-3">
                                    <div className="text-xl md:text-2xl font-semibold leading-tight">{day.dayLabel}</div>
                                    <div className="text-sm md:text-base text-muted-foreground leading-tight">{day.dayName}</div>
                                </div>

                                {/* 2. Timeline column with dot; line is global */}
                                <div className="relative">
                                    <div className="absolute left-1/2 -translate-x-1/2 top-1.5 h-3 w-3 rounded-full bg-accent border-2 border-white shadow" aria-hidden />
                                </div>

                                {/* 3. Cards column */}
                                <div className="space-y-4 md:space-y-6 pl-2 md:pl-0">
                                    <div className="block md:hidden text-left pr-2 md:pr-3">
                                        <div className="text-xl md:text-2xl font-semibold leading-tight">{day.dayLabel}</div>
                                        <div className="text-sm md:text-base text-muted-foreground leading-tight">{day.dayName}</div>
                                    </div>
                                    {/* Mobile date above cards */}
                                    {day.items.map((ev, ei) => (
                                        <EventCard key={`${day.dayLabel}-${ei}`} {...ev} onClick={() => navigate(`/home/event/123`)} />
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

/** Tab Button */
const TabButton = ({ active, children, onClick }) => (
    <button
        type="button"
        onClick={onClick}
        className={
            "px-4 py-1.5 text-sm sm:text-base rounded-full transition-all duration-200 " +
            (active
                ? "bg-primary text-white shadow-sm"
                : "bg-muted text-foreground hover:bg-primary/10")
        }
    >
        {children}
    </button>
);

/** Event Card */
const EventCard = ({ time, title, location, guests, thumbnail, onClick }) => (
    <div onClick={onClick} className="cursor-pointer flex items-center justify-between gap-3 md:gap-6 rounded-2xl border border-border bg-card p-4 md:p-6 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex-1 min-w-0">
            <div className="text-xs md:text-sm text-muted-foreground">{time}</div>
            <h3 className="mt-1 text-base md:text-xl font-semibold leading-tight md:leading-snug line-clamp-2">
                {title}
            </h3>

            <div className="mt-2 md:mt-3 flex flex-wrap items-center gap-2 md:gap-3 text-xs md:text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-1"><MapPin size={16} /> {location}</span>
                <span className="inline-flex items-center gap-1"><Users size={16} /> {guests}</span>
            </div>
        </div>

        {/* Thumbnail */}
        <div className="shrink-0">
            <img
                src={thumbnail}
                alt="event thumbnail"
                className="h-24 w-24 md:h-36 md:w-36 rounded-xl object-cover"
                loading="lazy"
                decoding="async"
                sizes="(max-width: 767px) 96px, 144px"
            />
        </div>
    </div>
);
