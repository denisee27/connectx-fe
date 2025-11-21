import React, { useMemo } from "react";
import PropTypes from "prop-types";
import { useLocation, useNavigate } from "react-router-dom";
import ErrorBoundary from "../../../shared/components/ui/ErrorBoundary.jsx";
import SectionHeader from "../components/SectionHeader.jsx";
import EventCard from "../components/EventCard.jsx";
import Chip from "../components/Chip.jsx";
import CityGrid from "../components/CityGrid.jsx";

function DashboardContent({ initial }) {
  const navigate = useNavigate();
  const { state } = useLocation();

  const featured = useMemo(
    () => [
      {
        title: "Tech That Matters: Build AI Products That Actually Sell",
        venue: "Goltrix Treasury Tower - Coworking",
        date: "Besok, 18.00",
        meta: "Tech • Jakarta",
        badge: "Unggulan",
        thumbnail: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop",
      },
      {
        title: "Web3 Social Hour by Yepp, Supported by Gate & Trevea",
        venue: "The Bar",
        date: "Sabtu, 19.00",
        meta: "Blockchain • Jakarta",
        thumbnail: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?q=80&w=800&auto=format&fit=crop",
      },
      {
        title: "Yepp Friends Open - Americana Format",
        venue: "Pabloon",
        date: "Minggu, 16.00",
        meta: "Community • Bandung",
        thumbnail: "https://images.unsplash.com/photo-1556157382-97eda2c8ad07?q=80&w=800&auto=format&fit=crop",
      },
      {
        title: "UR RUN CONNECT",
        venue: "STUA Coffee",
        date: "Minggu, 06.00",
        meta: "Running • Bandung",
        thumbnail: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=800&auto=format&fit=crop",
      },
    ],
    []
  );

  const categories = useMemo(
    () => [
      { label: "Teknologi", color: "indigo" },
      { label: "Makanan & Minuman", color: "orange" },
      { label: "Acara 1:1", color: "green" },
      { label: "Seni & Budaya", color: "pink" },
      { label: "Islam", color: "teal" },
      { label: "Kebugaran", color: "purple" },
      { label: "Kesehatan", color: "blue" },
      { label: "Kripto", color: "indigo" },
    ],
    []
  );

  const cities = useMemo(
    () => [
      { name: "Bangkok", abbr: "BK", count: 30 },
      { name: "Hong Kong", abbr: "HK", count: 18 },
      { name: "Jakarta", abbr: "JK", count: 42 },
      { name: "Singapore", abbr: "SG", count: 25 },
      { name: "Bengaluru", abbr: "BL", count: 21 },
      { name: "Kuala Lumpur", abbr: "KL", count: 16 },
      { name: "Manila", abbr: "MN", count: 14 },
      { name: "Makati", abbr: "MK", count: 8 },
      { name: "Brisbane", abbr: "BR", count: 12 },
      { name: "Tel Aviv-Yafo", abbr: "TA", count: 9 },
      { name: "Dubai", abbr: "DB", count: 20 },
      { name: "Kota Ho Chi Minh", abbr: "HM", count: 11 },
    ],
    []
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Hero and search */}
      <div className="mx-auto max-w-7xl px-4 pt-10 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Temukan Acara</h1>
            <p className="mt-2 max-w-2xl text-gray-600">
              Jelajahi acara populer di dekat Anda, telusuri berdasarkan kategori, atau lihat beberapa
              kalender komunitas yang bagus.
            </p>
          </div>
        </div>

        {/* Featured */}
        <div className="mt-10">
          <SectionHeader title="Unggulan" />
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((e, i) => (
              <EventCard key={i} {...e} />
            ))}
          </div>
        </div>

        {/* Popular area */}
        <div className="mt-14">
          <SectionHeader title="Acara Populer" subtitle="Jakarta" action={<FilterAction />} />
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featured.slice(0, 4).map((e, i) => (
              <EventCard key={`popular-${i}`} {...e} />
            ))}
          </div>
        </div>

        {/* Categories */}
        <div className="mt-14">
          <SectionHeader title="Jelajahi berdasarkan Kategori" />
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <Chip key={c.label} label={c.label} color={c.color} />
            ))}
          </div>
        </div>

        {/* Cities */}
        <div className="mt-14">
          <SectionHeader title="Jelajahi Acara Lokal" subtitle="Asia & Pasifik" />
          <CityGrid title="Jakarta & Sekitar" cities={cities} />
        </div>
      </div>
    </div>
  );
}

function FilterAction() {
  return (
    <div className="flex items-center gap-2">
      <button className="rounded-full border border-gray-300 px-3 py-1.5 text-sm text-gray-800 hover:bg-gray-100">
        Event
      </button>
      <button className="rounded-full border border-gray-300 px-3 py-1.5 text-sm text-gray-800 hover:bg-gray-100">
        Online
      </button>
      <button className="rounded-full border border-gray-300 px-3 py-1.5 text-sm text-gray-800 hover:bg-gray-100">
        Nearby
      </button>
    </div>
  );
}

DashboardContent.propTypes = {
  initial: PropTypes.object,
};

export default function Dashboard(props) {
  return (
    <ErrorBoundary>
      <DashboardContent {...props} />
    </ErrorBoundary>
  );
}