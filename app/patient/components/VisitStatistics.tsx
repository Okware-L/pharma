"use client";

import React from "react";

interface VisitStatisticsProps {
  visitCount: number;
}

export const VisitStatistics: React.FC<VisitStatisticsProps> = ({
  visitCount,
}) => {
  return (
    <div className="mt-8 p-6 bg-blue-100 rounded-lg shadow">
      <h2 className="text-2xl font-bold text-blue-800 mb-4">
        Visit Statistics
      </h2>
      <p className="text-4xl font-bold text-blue-600">{visitCount}</p>
      <p className="text-sm text-blue-500">Total Visits</p>
    </div>
  );
};
