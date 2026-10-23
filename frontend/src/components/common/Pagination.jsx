import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const Pagination = ({
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  totalItems = 0,
  itemsPerPage = 5
}) => {
  if (totalPages <= 1 && totalItems <= itemsPerPage) return null;

  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endItem   = Math.min(currentPage * itemsPerPage, totalItems);

  // Generate page numbers array with optional ellipsis
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);

      let start = Math.max(2, currentPage - 1);
      let end   = Math.min(totalPages - 1, currentPage + 1);

      if (currentPage <= 2) {
        end = 3;
      } else if (currentPage >= totalPages - 1) {
        start = totalPages - 2;
      }

      if (start > 2) pages.push('...');
      for (let i = start; i <= end; i++) pages.push(i);
      if (end < totalPages - 1) pages.push('...');

      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="flex items-center justify-center w-full gap-4 pt-4 border-t border-slate-800/80 select-none">
      {/* Item info */}
      {/* <div className="text-xs text-slate-400 font-medium">
        Showing <span className="font-mono font-bold text-slate-200">{startItem}</span> to{' '}
        <span className="font-mono font-bold text-slate-200">{endItem}</span> of{' '}
        <span className="font-mono font-bold text-orange-400">{totalItems}</span> records
      </div> */}

      {/* Pagination Controls */}
      <div className="flex items-center gap-1.5">
        {/* Previous Button */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`flex items-center justify-center p-2 rounded-xl border text-xs cursor-pointer font-semibold transition-all ${
            currentPage === 1
              ? 'border-slate-800/50 text-slate-600 cursor-not-allowed'
              : 'border-slate-800 text-slate-300 hover:border-orange-500/40 cursor-pointer active:scale-95'
          }`}
          title="Previous Page"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Page Numbers */}
        {getPageNumbers().map((page, index) => {
          if (page === '...') {
            return (
              <span key={`ellipsis-${index}`} className="px-2 text-xs text-slate-500 font-mono">
                ...
              </span>
            );
          }

          const isActive = page === currentPage;
          return (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`min-w-[36px] h-9 px-2.5 rounded-xl border text-xs font-mono font-bold transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 border-orange-400 shadow-md shadow-orange-500/20'
                  : 'border-slate-800 text-slate-300 cursor-pointer active:scale-95'
              }`}
            >
              {page}
            </button>
          );
        })}

        {/* Next Button */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages || totalPages === 0}
          className={`flex items-center justify-center p-2 rounded-xl border text-xs font-semibold transition-all ${
            currentPage === totalPages || totalPages === 0
              ? 'border-slate-800/50 text-slate-600 cursor-not-allowed'
              : 'border-slate-800 text-slate-300 hover:border-orange-500/40 cursor-pointer active:scale-95'
          }`}
          title="Next Page"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
