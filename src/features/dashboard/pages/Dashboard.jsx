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
import { useCategories, useHighlights, usePopular, useRegionRooms } from "../hooks/useDashboard.js";

function DashboardContent({ initial }) {
  const navigate = useNavigate();
  const { data: categories = [], isPending: isPendingCategory } = useCategories();
  const { data: highlights = [], isPending: isHeighlights } = useHighlights();
  const { data: popular = [], isPending: isPopular } = usePopular();
  const { data: regions = [], isPending: isRegions } = useRegionRooms();
  console.log(regions);
  // Tabs for "Acara Populer"
  const popularTabs = useMemo(() => {
    if (!popular || popular.length === 0) {
      return [
        { key: "dinner", label: "Dinner" },
        { key: "meetup", label: "Meetup" },
        { key: "event", label: "Event" },
      ];
    }
    const types = [...new Set(popular.map((p) => p.type))];
    const tabOrder = ["dinner", "meetup", "event"];
    const tabs = tabOrder
      .filter((type) => types.includes(type))
      .map((type) => ({
        key: type,
        label: type.charAt(0).toUpperCase() + type.slice(1),
      }));
    return tabs.length > 0 ? tabs : [{ key: "event", label: "Event" }];
  }, [popular]);

  const [popularActive, setPopularActive] = React.useState("dinner");

  // Set initial active tab based on available data
  React.useEffect(() => {
    if (popularTabs.length > 0 && !popularTabs.find((t) => t.key === popularActive)) {
      setPopularActive(popularTabs[0].key);
    }
  }, [popularTabs, popularActive]);

  const popularData = useMemo(() => {
    if (!popular || popular.length === 0) {
      return { dinner: [], meetup: [], event: [] };
    }
    return popular.reduce((acc, item) => {
      const type = item.type || "event"; // Default to 'event' if type is not specified
      if (!acc[type]) {
        acc[type] = [];
      }
      acc[type].push({
        id: item.id,
        title: item.title,
        venue: item.address,
        slug: item.slug,
        dateISO: item.datetime,
        meta: `${item.category?.name || "General"} • ${item.city?.name || "City"}`,
        thumbnail: item.category?.banner
          ? item.category.banner.trim().replace(/`/g, "")
          : "https://images.unsplash.com/photo-1518779578993-ec3579fee39f?q=80&w=800&auto=format&fit=crop",
      });
      return acc;
    }, {});
  }, [popular]);

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

  const regions123 = useMemo(
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
            <h1 className="text-3xl font-bold text-gray-900">Find Your Vibe</h1>
            <p className="mt-2 max-w-2xl text-gray-600">
              Uncover exciting events happening right around the corner. Filter by your interests or explore our curated categories to find your perfect match.
            </p>
          </div>
        </div>

        {/* Featured */}
        <div className="mt-10">
          <SectionHeader
            title="Spotlight"
            action={
              <button
                onClick={() => navigate("/home/list-event")}
                className="cursor-pointer rounded-full border border-gray-300 px-3 py-1.5 text-sm text-gray-800 transition-colors hover:bg-gray-100"
              >
                View All
              </button>
            }
          />
          <FeaturedGrid items={highlights} />
        </div>

        {/* Popular area */}
        <div className="mt-14">
          <SectionHeader
            title="Trending Now"
            subtitle="Jakarta"
            action={<PopularTabs tabs={popularTabs} active={popularActive} onChange={setPopularActive} />}
          />
          <FadeIn deps={popularActive}>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {popularData[popularActive]?.map((e, i) => (
                <div onClick={() => window.open(`/home/event/${e.slug}`)}>
                  <EventCard key={i} {...e} />
                </div>
              ))}
            </div>
          </FadeIn>
        </div>

        {/* Categories */}
        <div className="mt-14">
          <CategoryGrid categories={categories} />
        </div>

        {/* Explore Local */}
        <div className="mt-14">
          <SectionHeader title="Discover Local Event" />
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