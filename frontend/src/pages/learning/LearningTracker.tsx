import './LearningTracker.css';
import { useEffect, useState } from 'react';
import type { Todo } from './types/learning';
import StudyLog from './components/StudyLog';

function LearningTracker() {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // todo list
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newTodo, setNewTodo] = useState('');

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingTitle, setEditingTitle] = useState('');

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);

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
    title: string
  ) => {
    setEditingId(id);
    setEditingTitle(title);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingTitle('');
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
    <main className="learning-tracker">
      <header className="learning-tracker-header">
        <p className="learning-tracker-label">
          PROJECT / LEARNING TRACKER
        </p>

        <h1>Learning Tracker</h1>

        <p className="learning-tracker-description">
          React와 Kotlin 학습 현황과 Todo를 관리합니다.
        </p>
      </header>

      {/* 학습 현황 */}
      <section className="learning-summary">
        <div className="learning-summary-card">
          <span className="learning-summary-label">
            REACT
          </span>

          <strong>65%</strong>
        </div>

        <div className="learning-summary-card">
          <span className="learning-summary-label">
            KOTLIN
          </span>

          <strong>40%</strong>
        </div>

        <div className="learning-summary-card">
          <span className="learning-summary-label">
            STUDY TIME
          </span>

          <strong>12h 30m</strong>
        </div>
      </section>

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
          ) : (
            todos.map((todo) => (
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
                            todo.title
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
      </section>

      <StudyLog />
    </main>
  );
}

export default LearningTracker;
