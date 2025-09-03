"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationControlsProps {
  page: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
  onSetPage: (page: number) => void;
  showNumbers?: boolean; // 👈 optional
  children?: React.ReactNode; // ✅ add this
}

export default function PaginationControls({
  page,
  totalPages,
  onPrev,
  onNext,
  onSetPage,
  showNumbers = false, // 👈 default off
}: PaginationControlsProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex flex-col items-center gap-3 mt-4">
      {/* Prev / Next */}
      <div className="flex items-center gap-4">
        <button
          onClick={onPrev}
          disabled={page === 0}
          className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 disabled:opacity-40"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <span className="text-sm text-gray-400">
          Page {page + 1} of {totalPages}
        </span>

        <button
          onClick={onNext}
          disabled={page === totalPages - 1}
          className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 disabled:opacity-40"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Page Numbers (only if showNumbers is true) */}
      {showNumbers && (
        <div className="flex gap-2 flex-wrap justify-center">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => onSetPage(i)}
              className={`px-3 py-1 rounded-lg text-sm transition ${
                page === i
                  ? "bg-blue-600 text-white"
                  : "bg-gray-800 text-gray-400 hover:bg-gray-700"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
