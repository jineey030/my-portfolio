interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  variant?: 'todo' | 'study-log';
}

type PageItem = number | 'ellipsis-left' | 'ellipsis-right';

// 이 개수 이하면 모든 페이지 번호를 보여준다
const MAX_VISIBLE_WITHOUT_ELLIPSIS = 7;

/**
 * 페이지가 많을 때 번호를 줄여서 보여준다.
 * 예) 20페이지 중 10페이지: 1 … 9 10 11 … 20
 * (전부 보여주면 모바일에서 버튼이 화면 밖으로 넘친다)
 */
function getPageItems(
  currentPage: number,
  totalPages: number
): PageItem[] {
  if (totalPages <= MAX_VISIBLE_WITHOUT_ELLIPSIS) {
    return Array.from(
      { length: totalPages },
      (_, index) => index + 1
    );
  }

  let start = Math.max(2, currentPage - 1);
  let end = Math.min(totalPages - 1, currentPage + 1);

  // 앞쪽/뒤쪽 끝에 가까우면 가운데 번호 개수를 일정하게 유지
  if (currentPage <= 3) {
    start = 2;
    end = 4;
  } else if (currentPage >= totalPages - 2) {
    start = totalPages - 3;
    end = totalPages - 1;
  }

  const items: PageItem[] = [1];

  if (start > 2) {
    items.push('ellipsis-left');
  }

  for (let page = start; page <= end; page += 1) {
    items.push(page);
  }

  if (end < totalPages - 1) {
    items.push('ellipsis-right');
  }

  items.push(totalPages);

  return items;
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

  const goToPage = (page: number) => {
    // 범위를 벗어나거나 현재 페이지를 다시 누르면 무시
    if (
      page < 1 ||
      page > totalPages ||
      page === currentPage
    ) {
      return;
    }

    onPageChange(page);
  };

  return (
    <nav
      className={`pagination pagination-${variant}`}
      aria-label="페이지네이션"
    >
      <button
        type="button"
        className="pagination-button"
        disabled={currentPage === 1}
        onClick={() => goToPage(currentPage - 1)}
        aria-label="이전 페이지"
      >
        &lt;
      </button>

      {getPageItems(currentPage, totalPages).map((item) => {
        if (typeof item !== 'number') {
          return (
            <span
              key={item}
              className="pagination-ellipsis"
              aria-hidden="true"
            >
              …
            </span>
          );
        }

        const isCurrent = currentPage === item;

        return (
          <button
            key={item}
            type="button"
            className={`pagination-button ${
              isCurrent ? 'active' : ''
            }`}
            onClick={() => goToPage(item)}
            aria-label={`${item} 페이지`}
            aria-current={isCurrent ? 'page' : undefined}
          >
            {item}
          </button>
        );
      })}

      <button
        type="button"
        className="pagination-button"
        disabled={currentPage === totalPages}
        onClick={() => goToPage(currentPage + 1)}
        aria-label="다음 페이지"
      >
        &gt;
      </button>
    </nav>
  );
}

export default Pagination;
