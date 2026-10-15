import { useEffect, useState } from 'react';
import { apiFetch } from '../../../api/api';
import { useAdminRefreshKey } from '../../../api/adminRefresh';

import type { Todo } from '../types/learning';
import Pagination from './Pagination';

interface TodoListProps {
  onTodosChange: (todos: Todo[]) => void;
}

type Priority = 'high' | 'medium' | 'low';
type StatusFilter = 'all' | 'active' | 'completed';
type PriorityFilter = 'all' | Priority;

const ITEMS_PER_PAGE = 5;

const PRIORITY_LABELS: Record<Priority, string> = {
  high: 'HIGH',
  medium: 'MEDIUM',
  low: 'LOW'
};

const PRIORITY_OPTIONS: { value: Priority; label: string }[] = [
  { value: 'high', label: '높음' },
  { value: 'medium', label: '보통' },
  { value: 'low', label: '낮음' }
];

function TodoList({
  onTodosChange
}: TodoListProps) {
  const [todos, setTodos] = useState<Todo[]>([]);

  // 추가 폼
  const [isAdding, setIsAdding] = useState(false);
  const [newTodo, setNewTodo] = useState('');
  const [newPriority, setNewPriority] = useState<Priority>('medium');
  const [isCreating, setIsCreating] = useState(false);

  // 수정
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [editingPriority, setEditingPriority] = useState<Priority>('medium');
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  // 완료 체크 / 삭제 중인 Todo
  const [togglingTodoId, setTogglingTodoId] = useState<number | null>(null);
  const [deletingTodoId, setDeletingTodoId] = useState<number | null>(null);

  // 필터
  const [filter, setFilter] = useState<StatusFilter>('all');
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>('all');

  // 페이지네이션
  const [currentPage, setCurrentPage] = useState(1);

  // 목록 불러오기 실패(목록 자리에 표시) / 추가·수정·삭제 실패(목록 위에 표시)를 분리
  const [loadError, setLoadError] = useState('');
  const [actionError, setActionError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const refreshKey = useAdminRefreshKey();

  const matchesFilters = (todo: Todo) => {
    if (filter === 'active' && todo.completed) {
      return false;
    }

    if (filter === 'completed' && !todo.completed) {
      return false;
    }

    if (
      priorityFilter !== 'all' &&
      todo.priority !== priorityFilter
    ) {
      return false;
    }

    return true;
  };

  const filteredTodos = todos.filter(matchesFilters);

  const totalPages = Math.ceil(
    filteredTodos.length / ITEMS_PER_PAGE
  );

  const startIndex =
    (currentPage - 1) * ITEMS_PER_PAGE;

  const currentTodos = filteredTodos.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const activeCount = todos.filter(
    (todo) => !todo.completed
  ).length;

  const completedCount = todos.length - activeCount;

  // [GET] Todo list 가져오기
  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await apiFetch(
          `/api/todos`
        );

        if (!response.ok) {
          throw new Error(
            'Todo를 불러오지 못했습니다.'
          );
        }

        const data: Todo[] =
          await response.json();

        setTodos(data);
        setLoadError('');
      } catch (error) {
        console.error(
          'Todo 조회 실패:',
          error
        );

        setLoadError(
          'Todo를 불러오지 못했습니다.'
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchTodos();
  }, [refreshKey]);

  // 부모에게 전달용
  useEffect(() => {
    onTodosChange(todos);
  }, [todos, onTodosChange]);

  // 삭제나 필터로 페이지 수가 줄면 마지막 페이지로 이동
  useEffect(() => {
    const lastPage = Math.max(1, totalPages);

    if (currentPage > lastPage) {
      setCurrentPage(lastPage);
    }
  }, [totalPages, currentPage]);

  // 필터를 바꾸면 첫 페이지로
  const changeFilter = (nextFilter: StatusFilter) => {
    setFilter(nextFilter);
    setCurrentPage(1);
  };

  const changePriorityFilter = (
    nextFilter: PriorityFilter
  ) => {
    setPriorityFilter(nextFilter);
    setCurrentPage(1);
  };

  const closeAddForm = () => {
    setNewTodo('');
    setNewPriority('medium');
    setIsAdding(false);
  };

  // [PUT] 완료 상태 체크
  const handleToggleTodo = async (
    id: number
  ) => {
    // 같은 Todo를 빠르게 여러 번 눌러도 요청은 한 번만
    if (togglingTodoId !== null) {
      return;
    }

    const todo = todos.find(
      (item) => item.id === id
    );

    if (!todo) {
      return;
    }

    setActionError('');
    setTogglingTodoId(id);

    try {
      const response = await apiFetch(
        `/api/todos/${id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title: todo.title,
            completed: !todo.completed,
            priority: todo.priority
          }),
        }
      );

      if (!response.ok) {
        throw new Error(
          'Todo 상태 변경에 실패했습니다.'
        );
      }

      const updatedTodo: Todo =
        await response.json();

      setTodos((prev) =>
        prev.map((item) =>
          item.id === id
            ? updatedTodo
            : item
        )
      );
    } catch (error) {
      console.error(
        'Todo 상태 변경 실패:',
        error
      );

      setActionError(
        'Todo 상태 변경에 실패했습니다.'
      );
    } finally {
      setTogglingTodoId(null);
    }
  };

  // [SET] 수정 대상 체크
  const handleStartEdit = (todo: Todo) => {
    setActionError('');
    setEditingId(todo.id);
    setEditingTitle(todo.title);
    setEditingPriority(todo.priority ?? 'medium');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingTitle('');
    setEditingPriority('medium');
  };

  // [PUT] Todo 수정
  const handleSaveEdit = async (
    id: number
  ) => {
    const title = editingTitle.trim();

    if (!title || isSavingEdit) {
      return;
    }

    const todo = todos.find(
      (item) => item.id === id
    );

    if (!todo) {
      return;
    }

    setActionError('');
    setIsSavingEdit(true);

    try {
      const response = await apiFetch(
        `/api/todos/${id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title,
            completed: todo.completed,
            priority: editingPriority
          }),
        }
      );

      if (!response.ok) {
        throw new Error(
          'Todo 수정에 실패했습니다.'
        );
      }

      const updatedTodo: Todo =
        await response.json();

      setTodos((prev) =>
        prev.map((item) =>
          item.id === id
            ? updatedTodo
            : item
        )
      );

      handleCancelEdit();
    } catch (error) {
      console.error(
        'Todo 수정 실패:',
        error
      );

      setActionError(
        'Todo 수정에 실패했습니다.'
      );
    } finally {
      setIsSavingEdit(false);
    }
  };

  // [DELETE] Todo 삭제
  const handleDeleteTodo = async (
    id: number
  ) => {
    const shouldDelete = window.confirm(
      '이 Todo를 삭제하시겠습니까?'
    );

    if (!shouldDelete) {
      return;
    }

    setActionError('');
    setDeletingTodoId(id);

    try {
      const response = await apiFetch(
        `/api/todos/${id}`,
        {
          method: 'DELETE',
        }
      );

      if (!response.ok) {
        throw new Error(
          'Todo 삭제에 실패했습니다.'
        );
      }

      setTodos((prev) =>
        prev.filter(
          (item) => item.id !== id
        )
      );

      // 수정 중이던 Todo를 삭제했다면 수정 상태도 정리
      if (editingId === id) {
        handleCancelEdit();
      }
    } catch (error) {
      console.error(
        'Todo 삭제 실패:',
        error
      );

      setActionError(
        'Todo 삭제에 실패했습니다.'
      );
    } finally {
      setDeletingTodoId(null);
    }
  };

  // [POST] Todo 추가
  const handleAddTodo = async () => {
    const title = newTodo.trim();

    if (!title || isCreating) {
      return;
    }

    setActionError('');
    setIsCreating(true);

    try {
      const response = await apiFetch(
        `/api/todos`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title,
            priority: newPriority
          }),
        }
      );

      if (!response.ok) {
        throw new Error(
          'Todo 추가에 실패했습니다.'
        );
      }

      const createdTodo: Todo =
        await response.json();

      setTodos((prev) => [
        ...prev,
        createdTodo,
      ]);

      // 방금 추가한 Todo가 보이도록 (목록 맨 뒤에 붙으므로 마지막 페이지로)
      // 지금 필터에 안 맞으면(예: "완료" 필터) 필터를 풀어준다
      if (matchesFilters(createdTodo)) {
        setCurrentPage(
          Math.ceil((filteredTodos.length + 1) / ITEMS_PER_PAGE)
        );
      } else {
        setFilter('all');
        setPriorityFilter('all');
        setCurrentPage(
          Math.ceil((todos.length + 1) / ITEMS_PER_PAGE)
        );
      }

      closeAddForm();
    } catch (error) {
      console.error(
        'Todo 추가 실패:',
        error
      );

      setActionError(
        'Todo 추가에 실패했습니다.'
      );
    } finally {
      setIsCreating(false);
    }
  };

  const renderPrioritySelect = (
    value: Priority,
    onChange: (value: Priority) => void
  ) => (
    <select
      className={`todo-priority-select ${value}`}
      value={value}
      onChange={(event) =>
        onChange(event.target.value as Priority)
      }
      aria-label="우선순위"
    >
      {PRIORITY_OPTIONS.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );

  return (
    <section className="learning-todo">
      <div className="learning-section-header">
        <div>
          <h2>Todo List</h2>
        </div>

        {!isAdding && (
          <button
            type="button"
            onClick={() => {
              setActionError('');
              setIsAdding(true);
            }}
          >
            + Todo 추가
          </button>
        )}
      </div>

      {/* =========================
          Todo Filters
          ========================= */}

      <div className="todo-filters">
        {/* 상태 필터 */}
        <div className="todo-filter">
          <span className="todo-filter-label">
            상태
          </span>

          {([
            ['all', `전체 ${todos.length}`],
            ['active', `미완료 ${activeCount}`],
            ['completed', `완료 ${completedCount}`]
          ] as [StatusFilter, string][]).map(([value, label]) => (
            <button
              key={value}
              type="button"
              className={filter === value ? 'active' : ''}
              aria-pressed={filter === value}
              onClick={() => changeFilter(value)}
            >
              {label}
            </button>
          ))}
        </div>

        {/* 우선순위 필터 */}
        <div className="todo-priority-filter">
          <span className="todo-filter-label">
            우선순위
          </span>

          {([
            ['all', '전체'],
            ...PRIORITY_OPTIONS.map(
              (option) => [option.value, option.label]
            )
          ] as [PriorityFilter, string][]).map(([value, label]) => (
            <button
              key={value}
              type="button"
              className={priorityFilter === value ? 'active' : ''}
              aria-pressed={priorityFilter === value}
              onClick={() => changePriorityFilter(value)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* =========================
          Todo Add
          ========================= */}

      {isAdding && (
        <div className="todo-add-form">
          <input
            type="text"
            value={newTodo}
            onChange={(event) => {
              setNewTodo(event.target.value);
              setActionError('');
            }}
            placeholder="할 일을 입력하세요"
            aria-label="새 Todo"
            autoFocus
            onKeyDown={(event) => {
              // 한글 조합 중 Enter는 무시 (같은 Todo가 두 번 추가되는 문제 방지)
              if (event.nativeEvent.isComposing) {
                return;
              }

              if (event.key === 'Enter') {
                event.preventDefault();
                handleAddTodo();
              }

              if (event.key === 'Escape') {
                closeAddForm();
              }
            }}
          />

          {renderPrioritySelect(newPriority, setNewPriority)}

          <button
            type="button"
            onClick={handleAddTodo}
            disabled={isCreating || !newTodo.trim()}
          >
            {isCreating ? '추가 중...' : '추가'}
          </button>

          <button
            type="button"
            onClick={closeAddForm}
            disabled={isCreating}
          >
            취소
          </button>
        </div>
      )}

      {/* 추가/수정/삭제 실패는 목록을 가리지 않고 위에 표시 */}
      {actionError && (
        <p className="todo-error" role="alert">
          {actionError}
        </p>
      )}

      {/* =========================
          Todo List
          ========================= */}

      <div className="todo-list">
        {isLoading ? (
          <p className="todo-loading">
            Todo를 불러오는 중...
          </p>
        ) : loadError ? (
          <p className="todo-error">
            {loadError}
          </p>
        ) : todos.length === 0 ? (
          <p className="todo-empty">
            아직 등록된 Todo가 없습니다.
            <br />
            새로운 학습 목표를 추가해보세요.
          </p>
        ) : filteredTodos.length === 0 ? (
          <p className="todo-empty">
            선택한 조건에 해당하는 Todo가 없습니다.
            <br />
            다른 필터를 선택해보세요.
          </p>
        ) : (
          currentTodos.map((todo) => {
            const isEditing = editingId === todo.id;
            const priority: Priority = todo.priority ?? 'medium';

            return (
              <div
                key={todo.id}
                className={`todo-item ${
                  todo.completed ? 'is-completed' : ''
                }`}
              >
                {isEditing ? (
                  <>
                    <input
                      type="text"
                      className="todo-edit-input"
                      value={editingTitle}
                      onChange={(event) =>
                        setEditingTitle(event.target.value)
                      }
                      aria-label="Todo 수정"
                      autoFocus
                      onKeyDown={(event) => {
                        if (event.nativeEvent.isComposing) {
                          return;
                        }

                        if (event.key === 'Enter') {
                          event.preventDefault();
                          handleSaveEdit(todo.id);
                        }

                        if (event.key === 'Escape') {
                          handleCancelEdit();
                        }
                      }}
                    />

                    {renderPrioritySelect(
                      editingPriority,
                      setEditingPriority
                    )}

                    <div className="todo-actions">
                      <button
                        type="button"
                        onClick={() =>
                          handleSaveEdit(todo.id)
                        }
                        disabled={
                          isSavingEdit ||
                          !editingTitle.trim()
                        }
                      >
                        {isSavingEdit
                          ? '저장 중...'
                          : '저장'}
                      </button>

                      <button
                        type="button"
                        onClick={handleCancelEdit}
                        disabled={isSavingEdit}
                      >
                        취소
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <label>
                      <input
                        type="checkbox"
                        checked={todo.completed}
                        onChange={() =>
                          handleToggleTodo(todo.id)
                        }
                        // 상태 변경 요청 중에는 다시 누를 수 없게
                        disabled={togglingTodoId === todo.id}
                      />

                      <span
                        className={`todo-priority ${priority}`}
                      >
                        {PRIORITY_LABELS[priority]}
                      </span>

                      <span>
                        {todo.title}
                      </span>
                    </label>

                    <div className="todo-actions">
                      <button
                        type="button"
                        onClick={() =>
                          handleStartEdit(todo)
                        }
                      >
                        수정
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleDeleteTodo(todo.id)
                        }
                        disabled={deletingTodoId !== null}
                      >
                        {deletingTodoId === todo.id
                          ? '삭제 중...'
                          : '삭제'}
                      </button>
                    </div>
                  </>
                )}
              </div>
            );
          })
        )}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        variant="todo"
      />
    </section>
  );
}

export default TodoList;
