import React from "react";
import PropTypes from "prop-types";
import Chip from "./Chip.jsx";

export default function CityGrid({ title, cities }) {
  return (
    <div>
      <h3 className="mb-3 text-lg font-semibold text-gray-900">{title}</h3>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {cities.map((city) => (
          <div key={city.name} className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white p-3">
            <div className="h-6 w-6 shrink-0 rounded-full bg-gray-100 text-center text-xs font-semibold text-gray-700">
              {city.abbr}
            </div>
            <div className="flex-1 text-sm text-gray-800">{city.name}</div>
            <Chip label={`${city.count} Acara`} color="gray" />
          </div>
        ))}
      </div>
    </div>
  );
}

CityGrid.propTypes = {
  title: PropTypes.string.isRequired,
  cities: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      abbr: PropTypes.string.isRequired,
      count: PropTypes.number.isRequired,
    })
  ).isRequired,
};