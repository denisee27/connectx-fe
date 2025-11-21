import React from "react";
import PropTypes from "prop-types";

export default function EventCard({ title, venue, date, thumbnail, badge, meta }) {
  return (
    <div className="group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      {thumbnail && (
        <img
          src={thumbnail}
          alt={title}
          className="h-36 w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
        />
      )}
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="min-w-0">
            <h3 className="truncate text-base font-semibold text-gray-900">{title}</h3>
            <p className="mt-1 text-sm text-gray-600">{venue}</p>
          </div>
          {badge && (
            <span className="ml-2 inline-flex shrink-0 items-center rounded-full bg-orange-100 px-2.5 py-1 text-xs font-medium text-orange-700">
              {badge}
            </span>
          )}
        </div>
        {meta && <p className="mt-2 text-xs text-gray-500">{meta}</p>}
        <div className="mt-3 flex items-center justify-between">
          <span className="text-sm text-gray-700">{date}</span>
          <button className="rounded-full bg-orange-500 px-3 py-1.5 text-sm font-semibold text-white hover:bg-orange-600">
            Lihat Detail
          </button>
        </div>
      </div>
    </div>
  );
}

EventCard.propTypes = {
  title: PropTypes.string.isRequired,
  venue: PropTypes.string,
  date: PropTypes.string,
  thumbnail: PropTypes.string,
  badge: PropTypes.string,
  meta: PropTypes.string,
};