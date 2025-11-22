import React, { useMemo } from "react";
import PropTypes from "prop-types";
import { useLocation, useNavigate } from "react-router-dom";
import ErrorBoundary from "../../../shared/components/ui/ErrorBoundary.jsx";
import SectionHeader from "../components/SectionHeader.jsx";
import EventCard from "../components/EventCard.jsx";
import CategoryGrid from "../components/CategoryGrid.jsx";
import CityGrid from "../components/CityGrid.jsx";
import PopularTabs from "../components/PopularTabs.jsx";
import FeaturedGrid from "../components/FeaturedGrid.jsx";

function DashboardContent({ initial }) {
  const navigate = useNavigate();
  const { state } = useLocation();

  const featured = useMemo(
    () => [
      {
        title: "Tech That Matters: Build AI Products That Actually Sell",
        venue: "Goltrix Treasury Tower - Coworking",
        dateISO: "2025-11-21T18:00:00",
        meta: "Tech • Jakarta",
        badge: "Unggulan",
        thumbnail: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop",
      },
      {
        title: "Web3 Social Hour by Yepp, Supported by Gate & Trevea",
        venue: "The Bar",
        dateISO: "2025-11-22T19:00:00",
        meta: "Blockchain • Jakarta",
        thumbnail: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?q=80&w=800&auto=format&fit=crop",
      },
      {
        title: "Yepp Friends Open - Americana Format",
        venue: "Pabloon",
        dateISO: "2025-11-23T16:00:00",
        meta: "Community • Bandung",
        thumbnail: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?q=80&w=800&auto=format&fit=crop",
      },
      {
        title: "UR RUN CONNECT",
        venue: "STUA Coffee",
        dateISO: "2025-11-23T06:00:00",
        meta: "Running • Bandung",
        thumbnail: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=800&auto=format&fit=crop",
      },
      {
        title: "Yepp Friends Open - Americana Format",
        venue: "Pabloon",
        dateISO: "2025-11-23T16:00:00",
        meta: "Community • Bandung",
        thumbnail: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?q=80&w=800&auto=format&fit=crop",
      },
      {
        title: "Yepp Friends Open - Americana Format",
        venue: "Pabloon",
        dateISO: "2025-11-23T16:00:00",
        meta: "Community • Bandung",
        thumbnail: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?q=80&w=800&auto=format&fit=crop",
      },
    ],
    []
  );

  // Tabs for "Acara Populer"
  const popularTabs = useMemo(
    () => [
      { key: "dinner", label: "Dinner" },
      { key: "meetup", label: "Meetup" },
      { key: "event", label: "Event" },
    ],
    []
  );
  const [popularActive, setPopularActive] = React.useState("dinner");

  const popularData = useMemo(
    () => ({
      dinner: [
        {
          title: "Chef's Table Night",
          venue: "Senayan Park Mall",
          dateISO: "2025-11-27T19:00:00",
          meta: "Food & Drink • Jakarta",
          thumbnail: "https://images.unsplash.com/photo-1518779578993-ec3579fee39f?q=80&w=800&auto=format&fit=crop",
        },
        {
          title: "Community Dinner Meetup",
          venue: "Kemang District",
          dateISO: "2025-12-02T19:00:00",
          meta: "Food & Drink • Jakarta",
          thumbnail: "https://images.unsplash.com/photo-1498654896293-37aacf113fd9?q=80&w=800&auto=format&fit=crop",
        },
        {
          title: "UR Team Strength Training Night",
          venue: "Senayan Park Mall",
          dateISO: "2025-11-27T19:00:00",
          meta: "Fitness • Jakarta",
          thumbnail: "https://images.unsplash.com/photo-1498654896293-37aacf113fd9?q=80&w=800&auto=format&fit=crop",
        },
        {
          title: "Wine & Talk",
          venue: "Kuningan",
          dateISO: "2025-12-06T20:00:00",
          meta: "Food & Drink • Jakarta",
          thumbnail: "https://images.unsplash.com/photo-1518779578993-ec3579fee39f?q=80&w=800&auto=format&fit=crop",
        },
      ],
      meetup: [
        {
          title: "React Jakarta Meetup",
          venue: "Goltrix Treasury Tower",
          dateISO: "2025-11-28T18:30:00",
          meta: "Tech • Jakarta",
          thumbnail: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=800&auto=format&fit=crop",
        },
        {
          title: "Startup Coffee Chat",
          venue: "SCBD",
          dateISO: "2025-12-03T09:00:00",
          meta: "Startup • Jakarta",
          thumbnail: "https://images.unsplash.com/photo-1498654896293-37aacf113fd9?q=80&w=800&auto=format&fit=crop",
        },
        {
          title: "AI Builders Meetup",
          venue: "Kota Kasablanka",
          dateISO: "2025-12-08T18:00:00",
          meta: "AI • Jakarta",
          thumbnail: "https://images.unsplash.com/photo-1518779578993-ec3579fee39f?q=80&w=800&auto=format&fit=crop",
        },
        {
          title: "Open Source Night",
          venue: "Blok M",
          dateISO: "2025-12-12T19:00:00",
          meta: "Community • Jakarta",
          thumbnail: "https://images.unsplash.com/photo-1551836022-4c4c79ecde51?q=80&w=800&auto=format&fit=crop",
        },
      ],
      event: [
        {
          title: "City Music Festival",
          venue: "JIExpo Kemayoran",
          dateISO: "2025-12-01T17:00:00",
          meta: "Music • Jakarta",
          thumbnail: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=800&auto=format&fit=crop",
        },
        {
          title: "Product Conference",
          venue: "Balai Kartini",
          dateISO: "2025-12-05T09:00:00",
          meta: "Conference • Jakarta",
          thumbnail: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=800&auto=format&fit=crop",
        },
        {
          title: "Art Expo Week",
          venue: "Museum Nasional",
          dateISO: "2025-12-09T11:00:00",
          meta: "Art • Jakarta",
          thumbnail: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=800&auto=format&fit=crop",
        },
        {
          title: "Dev Summit Day",
          venue: "BSD Green Office Park",
          dateISO: "2025-12-14T10:00:00",
          meta: "Tech • Tangerang",
          thumbnail: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?q=80&w=800&auto=format&fit=crop",
        },
      ],
    }),
    []
  );

  /**
   * FadeIn wrapper for smooth content transitions when tab changes
   */
  function FadeIn({ deps, children }) {
    const [visible, setVisible] = React.useState(false);
    React.useEffect(() => {
      setVisible(false);
      const t = setTimeout(() => setVisible(true), 10);
      return () => clearTimeout(t);
    }, [deps]);
    return (
      <div className={"transition-all duration-300 " + (visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1")}>{children}</div>
    );
  }

  const categoryTiles = useMemo(
    () => [
      { label: "Teknologi", countText: "2 rb Acara", icon: "teknologi" },
      { label: "Makanan & Minuman", countText: "21 Acara", icon: "makanan" },
      { label: "AI", countText: "2 rb Acara", icon: "ai" },
      { label: "Seni & Budaya", countText: "1 rb Acara", icon: "seni" },
      { label: "Iklim", countText: "405 Acara", icon: "iklim" },
      { label: "Kebugaran", countText: "754 Acara", icon: "kebugaran" },
      { label: "Kesehatan", countText: "1 rb Acara", icon: "kesehatan" },
      { label: "Kripto", countText: "815 Acara", icon: "kripto" },
    ],
    []
  );

  const cities = useMemo(
    () => [
      { name: "Bangkok", abbr: "BK", count: 7 },
      { name: "Bengaluru", abbr: "BL", count: 10 },
      { name: "Brisbane", abbr: "BR", count: 4 },
      { name: "Dubai", abbr: "DB", count: 6 },
      { name: "Hong Kong", abbr: "HK", count: 6 },
      { name: "Honolulu", abbr: "HN", count: 2 },
      { name: "Jakarta", abbr: "JK", count: 6 },
      { name: "Kota Ho Chi Minh", abbr: "HM", count: 4 },
      { name: "Kuala Lumpur", abbr: "KL", count: 14 },
      { name: "Manila", abbr: "MN", count: 3 },
      { name: "Melbourne", abbr: "MB", count: 8 },
      { name: "Mumbai", abbr: "MM", count: 4 },
      { name: "New Delhi", abbr: "ND", count: 4 },
      { name: "Seoul", abbr: "SL", count: 3 },
      { name: "Singapura", abbr: "SG", count: 11 },
      { name: "Sydney", abbr: "SY", count: 23 },
      { name: "Taipei", abbr: "TP", count: 10 },
      { name: "Tel Aviv-Yafo", abbr: "TA", count: 13 },
      { name: "Tokyo", abbr: "TK", count: 15 },
    ],
    []
  );

  const regions = useMemo(
    () => [
      {
        key: "asia",
        label: "Asia & Pasifik",
        cities,
        events: [
          {
            title: "Jakarta Tech Night",
            venue: "SCBD",
            dateISO: "2025-11-21T19:00:00",
            meta: "Tech • Jakarta",
            thumbnail:
              "https://images.unsplash.com/photo-1542834369-f10ebf06d3cb?q=80&w=800&auto=format&fit=crop",
          },
          {
            title: "Bangkok Startup Meetup",
            venue: "WeWork Thonglor",
            dateISO: "2025-11-22T18:30:00",
            meta: "Startup • Bangkok",
            thumbnail:
              "https://images.unsplash.com/photo-1551434672-9b16f2c6b08d?q=80&w=800&auto=format&fit=crop",
          },
          {
            title: "Singapore FinTech Friday",
            venue: "Raffles Place",
            dateISO: "2025-11-28T17:00:00",
            meta: "Finance • Singapore",
            thumbnail:
              "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=800&auto=format&fit=crop",
          },
          {
            title: "Taipei AI Forum",
            venue: "Taipei 101",
            dateISO: "2025-12-02T14:00:00",
            meta: "AI • Taipei",
            thumbnail:
              "https://images.unsplash.com/photo-1518779578993-ec3579fee39f?q=80&w=800&auto=format&fit=crop",
          },
        ],
      },
      {
        key: "africa",
        label: "Afrika",
        cities: [
          { name: "Cairo", abbr: "CR", count: 5 },
          { name: "Nairobi", abbr: "NB", count: 7 },
          { name: "Cape Town", abbr: "CT", count: 6 },
          { name: "Lagos", abbr: "LG", count: 9 },
          { name: "Accra", abbr: "AC", count: 4 },
          { name: "Kigali", abbr: "KG", count: 3 },
        ],
        events: [
          {
            title: "Nairobi DevFest",
            venue: "iHub",
            dateISO: "2025-11-25T10:00:00",
            meta: "Tech • Nairobi",
            thumbnail:
              "https://images.unsplash.com/photo-1517433456452-f9633a875f6f?q=80&w=800&auto=format&fit=crop",
          },
          {
            title: "Cape Town Makers",
            venue: "Woodstock",
            dateISO: "2025-11-26T18:00:00",
            meta: "Community • Cape Town",
            thumbnail:
              "https://images.unsplash.com/photo-1519337265831-281ec6cc8514?q=80&w=800&auto=format&fit=crop",
          },
        ],
      },
      {
        key: "europe",
        label: "Eropa",
        cities: [
          { name: "London", abbr: "LD", count: 20 },
          { name: "Paris", abbr: "PA", count: 18 },
          { name: "Berlin", abbr: "BL", count: 16 },
          { name: "Barcelona", abbr: "BC", count: 14 },
          { name: "Amsterdam", abbr: "AM", count: 12 },
          { name: "Lisboa", abbr: "LS", count: 9 },
        ],
        events: [
          {
            title: "London AI Drinks",
            venue: "Shoreditch",
            dateISO: "2025-11-29T19:00:00",
            meta: "AI • London",
            thumbnail:
              "https://images.unsplash.com/photo-1529336953121-b03b65fdfaf8?q=80&w=800&auto=format&fit=crop",
          },
          {
            title: "Berlin Web Week",
            venue: "Mitte",
            dateISO: "2025-12-01T09:00:00",
            meta: "Web • Berlin",
            thumbnail:
              "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop",
          },
        ],
      },
      {
        key: "north_america",
        label: "Amerika Utara",
        cities: [
          { name: "New York", abbr: "NY", count: 30 },
          { name: "San Francisco", abbr: "SF", count: 22 },
          { name: "Toronto", abbr: "TO", count: 17 },
          { name: "Vancouver", abbr: "VA", count: 12 },
          { name: "Mexico City", abbr: "MX", count: 15 },
          { name: "Montreal", abbr: "MT", count: 11 },
        ],
        events: [
          {
            title: "SF Product Meetup",
            venue: "SOMA",
            dateISO: "2025-12-03T18:30:00",
            meta: "Product • San Francisco",
            thumbnail:
              "https://images.unsplash.com/photo-1557800636-894a64c1696f?q=80&w=800&auto=format&fit=crop",
          },
          {
            title: "NYC Blockchain Night",
            venue: "Chelsea",
            dateISO: "2025-12-05T19:00:00",
            meta: "Blockchain • New York",
            thumbnail:
              "https://images.unsplash.com/photo-1492724441997-5dc865305da7?q=80&w=800&auto=format&fit=crop",
          },
        ],
      },
      {
        key: "south_america",
        label: "Amerika Selatan",
        cities: [
          { name: "São Paulo", abbr: "SP", count: 19 },
          { name: "Rio de Janeiro", abbr: "RJ", count: 12 },
          { name: "Buenos Aires", abbr: "BA", count: 14 },
          { name: "Santiago", abbr: "SA", count: 9 },
          { name: "Bogotá", abbr: "BG", count: 11 },
          { name: "Lima", abbr: "LM", count: 8 },
        ],
        events: [
          {
            title: "São Paulo Devs",
            venue: "Paulista",
            dateISO: "2025-12-07T16:00:00",
            meta: "Tech • São Paulo",
            thumbnail:
              "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?q=80&w=800&auto=format&fit=crop",
          },
          {
            title: "Buenos Aires Startups",
            venue: "Palermo",
            dateISO: "2025-12-09T18:00:00",
            meta: "Startup • Buenos Aires",
            thumbnail:
              "https://images.unsplash.com/photo-1519337265831-281ec6cc8514?q=80&w=800&auto=format&fit=crop",
          },
        ],
      },
    ],
    [cities]
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Hero and search */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
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
          <SectionHeader
            title="Unggulan"
            action={
              <button
                onClick={() => navigate("/home/list-event")}
                className="cursor-pointer rounded-full border border-gray-300 px-3 py-1.5 text-sm text-gray-800 transition-colors hover:bg-gray-100"
              >
                Lihat Semua
              </button>
            }
          />
          <FeaturedGrid items={featured} />
        </div>

        {/* Popular area */}
        <div className="mt-14">
          <SectionHeader
            title="Acara Populer"
            subtitle="Jakarta"
            action={<PopularTabs tabs={popularTabs} active={popularActive} onChange={setPopularActive} />}
          />
          <FadeIn deps={popularActive}>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {popularData[popularActive]?.map((e, i) => (
                <div onClick={() => navigate(`/home/event/${e.id}`)}>
                  <EventCard key={`popular-${popularActive}-${i}`} {...e} />
                </div>
              ))}
            </div>
          </FadeIn>
        </div>

        {/* Categories */}
        <div className="mt-14">
          <CategoryGrid categories={categoryTiles} />
        </div>

        {/* Explore Local */}
        <div className="mt-14">
          <SectionHeader title="Jelajahi Acara Lokal" />
          <CityGrid regions={regions} />
        </div>
      </div>
    </div>
  );
}

// Removed old FilterAction; using PopularTabs component.

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