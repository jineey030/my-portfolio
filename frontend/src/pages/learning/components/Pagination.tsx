interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  variant?: 'todo' | 'study-log';
}

function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  variant = 'todo',
}: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <nav
      className={`pagination pagination-${variant}`}
      aria-label="페이지네이션"
    >
      <button
        type="button"
        className="pagination-button"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        &lt;
      </button>

      {Array.from({ length: totalPages }, (_, index) => {
        const page = index + 1;

        return (
          <button
            key={page}
            type="button"
            className={`pagination-button ${
              currentPage === page ? 'active' : ''
            }`}
            onClick={() => onPageChange(page)}
          >
            {page}
          </button>
        );
      })}

      <button
        type="button"
        className="pagination-button"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        &gt;
      </button>
    </nav>
  );
}

export default Pagination;