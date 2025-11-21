import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { NavLink, useNavigate } from "react-router-dom";
import { CalendarDays, LayoutDashboard, Plus, ChevronDown } from "lucide-react";

export default function NavbarMain({ user, onCreateEvent }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const popRef = useRef(null);

  useEffect(() => {
    const onDocClick = (e) => {
      if (open && popRef.current && !popRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    const onEsc = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onEsc);
    };
  }, [open]);

  const handleCreate = () => {
    if (typeof onCreateEvent === "function") {
      onCreateEvent();
    } else {
      navigate("/dashboard");
    }
  };

  return (
    <nav className="sticky top-0 z-30 w-full backdrop-blur-2xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 sm:px-6">
        {/* Left: navigation */}
        <div className="flex items-center md:gap-6 gap-1 ">
          <NavItem to="/home/schedule" icon={<CalendarDays size={18} />} label="Schedule" />
          <NavItem to="/home" icon={<LayoutDashboard size={18} />} label="Dashboard" />
        </div>

        {/* Right: actions */}
        <div className="flex items-center gap-4">
          <button
            onClick={handleCreate}
            className="inline-flex items-center gap-2 rounded-full bg-orange-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors duration-200 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-400"
          >
            Create Event
          </button>

          <button
            onClick={() => setOpen((v) => !v)}
            aria-haspopup="true"
            aria-expanded={open}
            className="relative inline-flex items-center gap-2 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 p-1.5 text-white shadow-sm ring-1 ring-white/20 transition-transform duration-200 hover:scale-[1.03] focus:outline-none focus:ring-2 focus:ring-purple-400"
          >
            <span className="grid h-10 w-10 place-items-center rounded-fulltext-lg">☺️</span>
          </button>

          {/* Dropdown */}
          <div
            ref={popRef}
            className={`absolute right-1 top-17 w-72 origin-top-right rounded-2xl  bg-muted-foreground p-3 text-white shadow-2xl transition-all duration-200 ${open ? "pointer-events-auto scale-100 opacity-100" : "pointer-events-none scale-95 opacity-0"
              }`}
          >
            <div className="flex items-center gap-3 rounded-xl bg-white/5 p-3">
              <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 text-lg">☺️</div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{user?.name || "Guest User"}</p>
                <p className="truncate text-xs text-gray-300">{user?.email || "guest@example.com"}</p>
              </div>
            </div>
            <div className="mt-2">
              <DropItem label="My Profile" onClick={() => navigate("/profile")} />
              <DropItem label="Settings" onClick={() => navigate("/settings")} />
              <DropItem label="Logout" onClick={() => navigate("/login")} />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

function NavItem({ to, icon, label }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `cursor-pointer  inline-flex font-bold items-center gap-2 rounded-full px-3 py-1 text-sm transition-colors duration-200 ${isActive
          ? " text-black "
          : "text-gray-400"
        }`
      }
    >
      <span>{icon}</span>
      <span className="md:block hidden">{label}</span>
    </NavLink >
  );
}

NavItem.propTypes = {
  to: PropTypes.string.isRequired,
  icon: PropTypes.node,
  label: PropTypes.string.isRequired,
};

function DropItem({ label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm text-gray-200 transition-colors duration-200 hover:bg-white/5 hover:text-white"
    >
      <span>{label}</span>
      <span className="text-xs text-gray-400">›</span>
    </button>
  );
}

DropItem.propTypes = {
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func,
};

NavbarMain.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string,
    email: PropTypes.string,
  }),
  onCreateEvent: PropTypes.func,
};