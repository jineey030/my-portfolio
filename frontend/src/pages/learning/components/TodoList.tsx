import { useEffect, useState } from 'react';
import type { Todo } from '../types/learning';
import Pagination from './Pagination';

interface TodoListProps {
  onTodosChange: (todos: Todo[]) => void;
}

function TodoList({
  onTodosChange
}: TodoListProps) {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const [todos, setTodos] = useState<Todo[]>([]);

  const [isAdding, setIsAdding] = useState(false);
  const [newTodo, setNewTodo] = useState('');

  const [newPriority, setNewPriority] = useState<'high' | 'medium' | 'low'>('medium');

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingTitle, setEditingTitle] = useState('');

  const [editingPriority, setEditingPriority] = useState<'high' | 'medium' | 'low'>('medium');

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  useEffect(() => {
    setCurrentPage(1);
  }, [filter]);

  // 페이지네이션
  const [currentPage, setCurrentPage] = useState(1);

  const ITEMS_PER_PAGE = 5;

  const filteredTodos = todos.filter((todo) => {
    if (filter === 'active') {
      return !todo.completed;
    }

    if (filter === 'completed') {
      return todo.completed;
    }

    return true;
  });

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

  const completedCount = todos.filter(
    (todo) => todo.completed
  ).length;

  // [GET] Todo list 가져오기
  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/todos`
        );

        if (!response.ok) {
          throw new Error('Todo를 불러오지 못했습니다.');
        }

        const data: Todo[] = await response.json();

        setTodos(data);
      } catch (error) {
        console.error('Todo 조회 실패:', error);
        setError('Todo를 불러오지 못했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTodos();
  }, []);

  // 부모에게 전달용
  useEffect(() => {
    onTodosChange(todos);
  }, [todos, onTodosChange]);

  // 삭제 후 페이지네이션
  useEffect(() => {
    const nextTotalPages = Math.max(
      1,
      Math.ceil(todos.length / ITEMS_PER_PAGE)
    );

    if (currentPage > nextTotalPages) {
      setCurrentPage(nextTotalPages);
    }
  }, [todos, currentPage]);

  // [PUT] 완료 상태 체크
  const handleToggleTodo = async (id: number) => {
    const todo = todos.find(
      (todo) => todo.id === id
    );

    if (!todo) {
      return;
    }

    setError('');
    setIsSubmitting(true);

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/todos/${id}`,
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
        prev.map((todo) =>
          todo.id === id ? updatedTodo : todo
        )
      );
    } catch (error) {
      console.error(
        'Todo 상태 변경 실패:',
        error
      );

      setError(
        'Todo 상태 변경 실패하였습니다.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // [SET] 수정 대상 체크
  const handleStartEdit = (
    id: number,
    title: string,
    priority: 'high' | 'medium' | 'low'
  ) => {
    setEditingId(id);
    setEditingTitle(title);
    setEditingPriority(priority);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingTitle('');
    setEditingPriority('medium');
  };

  // [PUT] Todo 수정
  const handleSaveEdit = async (id: number) => {
    const title = editingTitle.trim();

    if (!title) {
      return;
    }

    const todo = todos.find(
      (todo) => todo.id === id
    );

    if (!todo) {
      return;
    }

    setError('');
    setIsSubmitting(true);

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/todos/${id}`,
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
        prev.map((todo) =>
          todo.id === id ? updatedTodo : todo
        )
      );

      handleCancelEdit();
    } catch (error) {
      console.error('Todo 수정 실패:', error);
      setError('Todo 수정 실패하였습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // [DELETE] Todo 삭제
  const handleDeleteTodo = async (id: number) => {
    const shouldDelete = window.confirm(
      '이 Todo를 삭제하시겠습니까?'
    );

    if (!shouldDelete) {
      return;
    }

    setError('');
    setIsSubmitting(true);

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/todos/${id}`,
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
        prev.filter((todo) => todo.id !== id)
      );
    } catch (error) {
      console.error('Todo 삭제 실패:', error);
      setError('Todo 삭제 실패하였습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // [POST] Todo 추가
  const handleAddTodo = async () => {
    const title = newTodo.trim();

    if (!title) {
      return;
    }

    setError('');
    setIsSubmitting(true);

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/todos`,
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

      setNewTodo('');
      setIsAdding(false);
    } catch (error) {
      console.error('Todo 추가 실패:', error);
      setError('Todo 추가 실패하였습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="learning-todo">
      <div className="learning-section-header">
        <div>
          <p className="learning-section-label">
            01 / TODO
          </p>

          <h2>Todo List</h2>
        </div>

        {!isAdding && (
          <button
            type="button"
            onClick={() => setIsAdding(true)}
          >
            + Todo 추가
          </button>
        )}
      </div>

      <div className="todo-filter">
        <button
          type="button"
          className={filter === 'all' ? 'active' : ''}
          onClick={() => setFilter('all')}
        >
          전체 {todos.length}
        </button>

        <button
          type="button"
          className={filter === 'active' ? 'active' : ''}
          onClick={() => setFilter('active')}
        >
          미완료 {activeCount}
        </button>

        <button
          type="button"
          className={filter === 'completed' ? 'active' : ''}
          onClick={() => setFilter('completed')}
        >
          완료 {completedCount}
        </button>
      </div>

      {isAdding && (
        <div className="todo-add-form">
          <input
            type="text"
            value={newTodo}
            onChange={(event) =>
              setNewTodo(event.target.value)
            }
            placeholder="할 일을 입력하세요"
            autoFocus
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                handleAddTodo();
              }
            }}
          />

          <select
            className={`todo-priority-select ${newPriority}`}
            value={newPriority}
            onChange={(event) =>
              setNewPriority(
                event.target.value as 'high' | 'medium' | 'low'
              )
            }
          >
            <option value="high">높음</option>
            <option value="medium">보통</option>
            <option value="low">낮음</option>
          </select>

          <button
            type="button"
            onClick={handleAddTodo}
            disabled={isSubmitting}
          >
            {isSubmitting
              ? '추가 중...'
              : '추가'}
          </button>

          <button
            type="button"
            onClick={() => {
              setNewTodo('');
              setIsAdding(false);
            }}
          >
            취소
          </button>
        </div>
      )}

      <div className="todo-list">
        {isLoading ? (
          <p className="todo-loading">
            Todo를 불러오는 중...
          </p>
        ) : error ? (
          <p className="todo-error">
            {error}
          </p>
        ) : todos.length === 0 ? (
          <p className="todo-empty">
            아직 등록된 Todo가 없습니다.
            <br />
            새로운 학습 목표를 추가해보세요.
          </p>
        ) : filteredTodos.length === 0 ? (
          <p className="todo-empty">
            {filter === 'active'
              ? '미완료 Todo가 없습니다.'
              : '완료된 Todo가 없습니다.'}
            <br />
            다른 필터를 선택해보세요.
          </p>
        ) : (
          currentTodos.map((todo) => (
            <div
              key={todo.id}
              className={`todo-item ${
                todo.completed
                  ? 'is-completed'
                  : ''
              }`}
            >
              {editingId === todo.id ? (
                <>
                  <input
                    type="text"
                    className="todo-edit-input"
                    value={editingTitle}
                    onChange={(event) =>
                      setEditingTitle(
                        event.target.value
                      )
                    }
                    autoFocus
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') {
                        handleSaveEdit(todo.id);
                      }

                      if (event.key === 'Escape') {
                        handleCancelEdit();
                      }
                    }}
                  />

                  <select
                    className={`todo-priority-select ${editingPriority}`}
                    value={editingPriority}
                    onChange={(event) =>
                      setEditingPriority(
                        event.target.value as 'high' | 'medium' | 'low'
                      )
                    }
                  >
                    <option value="high">높음</option>
                    <option value="medium">보통</option>
                    <option value="low">낮음</option>
                  </select>

                  <div className="todo-actions">
                    <button
                      type="button"
                      onClick={() =>
                        handleSaveEdit(todo.id)
                      }
                      disabled={isSubmitting}
                    >
                      {isSubmitting
                        ? '저장 중...'
                        : '저장'}
                    </button>

                    <button
                      type="button"
                      onClick={handleCancelEdit}
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
                    />

                    <span className={`todo-priority ${todo.priority}`}>
                      {todo.priority === 'high'
                        ? 'HIGH'
                        : todo.priority === 'medium'
                          ? 'MEDIUM'
                          : 'LOW'}
                    </span>

                    <span>
                      {todo.title}
                    </span>
                  </label>

                  <div className="todo-actions">
                    <button
                      type="button"
                      onClick={() =>
                        handleStartEdit(
                          todo.id,
                          todo.title,
                          todo.priority
                        )
                      }
                    >
                      수정
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleDeleteTodo(todo.id)
                      }
                      disabled={isSubmitting}
                    >
                      {isSubmitting
                        ? '삭제 중...'
                        : '삭제'}
                    </button>
                  </div>
                </>
              )}
            </div>
          ))
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
