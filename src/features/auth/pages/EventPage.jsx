import React from 'react';
import Event1 from "../../../assets/event/event1.svg";
import Event2 from "../../../assets/event/event2.svg";
import Event3 from "../../../assets/event/event3.svg";
import Event4 from "../../../assets/event/event4.svg";
import { Calendar, MapPin, Users } from 'lucide-react';

// Data untuk setiap acara
const events = [
    {
        image: Event1,
        tag: "Networking",
        title: "Monday Night Social",
        date: "Mon, Dec 18 at 7:00 PM",
        location: "Downtown Bar",
        attendees: "18/20 attending",
    },
    {
        image: Event2,
        tag: "Learning",
        title: "Creative Workshop",
        date: "Wed, Dec 20 at 6:30 PM",
        location: "Art Studio",
        attendees: "12/15 attending",
    },
    {
        image: Event3,
        tag: "Social",
        title: "Food & Friends",
        date: "Thu, Dec 21 at 8:00 PM",
        location: "Italian Bistro",
        attendees: "10/12 attending",
    },
    {
        image: Event4,
        tag: "Outdoor",
        title: "Weekend Hike",
        date: "Sat, Dec 23 at 9:00 AM",
        location: "Mountain Trail",
        attendees: "15/20 attending",
    },
];


const CardIcon = ({ icon }) => (
    // Ikon kecil abu-abu (untuk kalender, lokasi, orang)
    <span className="text-gray-500 mr-2 text-sm">{icon}</span>
);

export default function Event() {
    return (
        <div className="py-16 md:py-24 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

                <h2 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-2">
                    This week's events
                </h2>
                <p className="text-lg text-gray-600 mb-12">
                    Join unique experiences designed to help you connect and grow
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                    {events.map((event, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden text-left"
                        >
                            <div className="relative h-48 w-full overflow-hidden">
                                <img
                                    src={event.image}
                                    alt={event.title}
                                    className="w-full h-full object-cover"
                                />
                                <span
                                    className={`absolute top-3 right-3 text-xs font-semibold px-3 py-1 rounded-full text-black bg-[var(--color-primary)]`}>
                                    {event.tag}
                                </span>
                            </div>

                            <div className="p-4 flex flex-col justify-between h-[calc(100%-12rem)]">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                                        {event.title}
                                    </h3>

                                    <div className="flex items-center text-sm text-gray-700 mb-1">
                                        <span className="mr-2 text-sm"><Calendar size={15} /></span>
                                        <span>{event.date}</span>
                                    </div>

                                    <div className="flex items-center text-sm text-gray-700 mb-1">
                                        <span className="mr-2 text-sm"><MapPin size={15} /></span>
                                        <span>{event.location}</span>
                                    </div>

                                    <div className="flex items-center text-sm text-gray-700 mb-4">
                                        <span className="mr-2 text-sm"><Users size={15} /></span>
                                        <span>{event.attendees}</span>
                                    </div>
                                </div>

                                <button
                                    className="w-full bg-black text-white font-semibold py-2 rounded-4xl hover:bg-foreground cursor-pointer transition duration-300 mt-auto"
                                >
                                    Join Event
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <button className="inline-flex items-center justify-center border border-gray-400 text-gray-800 font-semibold py-3 px-8 rounded-lg hover:bg-gray-100 cursor-pointer transition duration-300">
                    View All Events
                </button>

            </div>
        </div>
    );
}