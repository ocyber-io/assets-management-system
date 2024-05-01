import React from "react";

interface PaginationProps {
  totalFiles: number;
  filesPerPage: number;
  currentPage: number;
  setCurrentPage: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  totalFiles,
  filesPerPage,
  currentPage,
  setCurrentPage,
}) => {
  const pageNumbers = [];
  const totalPages = Math.ceil(totalFiles / filesPerPage);

  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  // Handler to move to the next page
  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  // Handler to move to the previous page
  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <nav className="mt-4 flex justify-end w-full">
      <ul className="list-none flex items-center">
        {/* Previous Page Button */}
        <li>
          <button
            onClick={prevPage}
            className={`px-2 py-1 border rounded ${
              currentPage === 1
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-white hover:bg-blue-100"
            }`}
            disabled={currentPage === 1}
          >
            Prev
          </button>
        </li>
        {pageNumbers.map((number) => (
          <li key={number} className="mx-1">
            <button
              onClick={() => setCurrentPage(number)}
              className={`px-2 py-1 text-sm border rounded ${
                currentPage === number ? "bg-blue-500 text-white" : "bg-white"
              } hover:bg-blue-100`}
            >
              {number}
            </button>
          </li>
        ))}
        {/* Next Page Button */}
        <li>
          <button
            onClick={nextPage}
            className={`px-2 py-1 border rounded ${
              currentPage === totalPages
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-white hover:bg-blue-100"
            }`}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;
