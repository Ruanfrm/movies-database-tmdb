import React from 'react';
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;

  const handlePreviousPage = () => {
    if (!isFirstPage) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (!isLastPage) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div className="flex items-center justify-center mt-4">
      <button
        className={`mr-2 px-3 py-1 border border-gray-300 rounded-md ${
          isFirstPage ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-gray-700 text-white hover:bg-gray-600'
        }`}
        onClick={handlePreviousPage}
        disabled={isFirstPage}
      >
        <MdKeyboardArrowLeft size={20} />
      </button>
      <span className="text-gray-300">{`${currentPage} / ${totalPages}`}</span>
      <button
        className={`ml-2 px-3 py-1 border border-gray-300 rounded-md ${
          isLastPage ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-gray-700 text-white hover:bg-gray-600'
        }`}
        onClick={handleNextPage}
        disabled={isLastPage}
      >
        <MdKeyboardArrowRight size={20} />
      </button>
    </div>
  );
};

export default Pagination;
