// Start: Imports
"use client";
import React from 'react';
// End: Imports

// Start: Type Definitions
interface PaginationButtonProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}
// End: Type Definitions

// Start: PaginationButton Component
export default function PaginationButton({
  currentPage,
  totalPages,
  onPageChange,
  className = '',
}: PaginationButtonProps) {
  // Start: Handle Previous Page
  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };
  // End: Handle Previous Page

  // Start: Handle Next Page
  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };
  // End: Handle Next Page

  // Start: Handle Page Click
  const handlePageClick = (page: number) => {
    onPageChange(page);
  };
  // End: Handle Page Click

  // Start: Render Page Numbers
  const renderPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
    
    if (endPage - startPage < maxPagesToShow - 1) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageClick(i)}
          className={`w-8 h-8 flex items-center justify-center rounded-md text-sm font-medium transition-colors ${
            i === currentPage
              ? 'bg-blue-600 text-white retro-btn-active'
              : 'retro-btn-secondary hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          {i}
        </button>
      );
    }
    
    return pages;
  };
  // End: Render Page Numbers

  // Start: Render Pagination Button
  return (
    <div className={`flex items-center justify-center space-x-1 ${className}`}>
      <button
        onClick={handlePrevious}
        disabled={currentPage === 1}
        className="retro-btn-secondary text-xs px-3 py-1 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        ← Sebelum
      </button>
      
      {renderPageNumbers()}
      
      <button
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className="retro-btn-secondary text-xs px-3 py-1 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Seterusnya →
      </button>
    </div>
  );
}
// End: PaginationButton Component
