import {
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent
} from 'react';

interface AdminSelectProps {
  value: string;
  options: readonly string[];
  onChange: (value: string) => void;
  ariaLabel?: string;
  disabled?: boolean;
  className?: string;
}

/**
 * 네이티브 <select>의 드롭다운 목록은 OS가 그려서
 * CSS로 꾸밀 수 없기 때문에 직접 만든 드롭다운.
 */
function AdminSelect({
  value,
  options,
  onChange,
  ariaLabel,
  disabled = false,
  className = ''
}: AdminSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(
    Math.max(options.indexOf(value), 0)
  );

  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    return () =>
      document.removeEventListener('pointerdown', handlePointerDown);
  }, [isOpen]);

  const open = () => {
    setActiveIndex(Math.max(options.indexOf(value), 0));
    setIsOpen(true);
  };

  const select = (option: string) => {
    onChange(option);
    setIsOpen(false);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return;

    switch (event.key) {
      case 'ArrowDown':
      case 'ArrowUp': {
        event.preventDefault();

        if (!isOpen) {
          open();
          return;
        }

        const step = event.key === 'ArrowDown' ? 1 : -1;
        setActiveIndex(
          (index) => (index + step + options.length) % options.length
        );
        return;
      }
      case 'Enter':
      case ' ':
        event.preventDefault();

        if (isOpen) {
          select(options[activeIndex]);
        } else {
          open();
        }
        return;
      case 'Escape':
      case 'Tab':
        setIsOpen(false);
        return;
    }
  };

  return (
    <div
      ref={rootRef}
      className={`admin-select ${isOpen ? 'is-open' : ''} ${className}`}
    >
      <button
        type="button"
        className="admin-select-trigger"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={listId}
        aria-label={ariaLabel}
        disabled={disabled}
        onClick={() => (isOpen ? setIsOpen(false) : open())}
        onKeyDown={handleKeyDown}
      >
        <span>{value}</span>

        <svg
          className="admin-select-chevron"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {isOpen && (
        <ul
          id={listId}
          role="listbox"
          className="admin-select-menu"
        >
          {options.map((option, index) => (
            <li
              key={option}
              role="option"
              aria-selected={option === value}
              className={[
                'admin-select-option',
                option === value ? 'is-selected' : '',
                index === activeIndex ? 'is-active' : ''
              ].join(' ')}
              onMouseEnter={() => setActiveIndex(index)}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => select(option)}
            >
              <span>{option}</span>

              {option === value && (
                <svg
                  className="admin-select-check"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M5 12l4 4L19 6" />
                </svg>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default AdminSelect;
