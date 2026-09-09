import './LearningTracker.css';
import { useState } from 'react';
import { INITIAL_TODOS } from './constants/todos';

function LearningTracker() {
  const [todos, setTodos] = useState(INITIAL_TODOS);
  const [isAdding, setIsAdding] = useState(false);
  const [newTodo, setNewTodo] = useState('');

  const [editingId, setEditingId] = useState<number | null>(
    null
  );
  const [editingTitle, setEditingTitle] = useState('');

  const handleAddTodo = () => {
    const title = newTodo.trim();

    if (!title) {
      return;
    }

    const todo = {
      id: Date.now(),
      title,
      completed: false,
    };

    setTodos((prev) => [...prev, todo]);

    setNewTodo('');
    setIsAdding(false);
  };

  const handleToggleTodo = (id: number) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id
          ? {
              ...todo,
              completed: !todo.completed,
            }
          : todo
      )
    );
  };

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

  const handleSaveEdit = (id: number) => {
    const title = editingTitle.trim();

    if (!title) {
      return;
    }

    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id
          ? {
              ...todo,
              title,
            }
          : todo
      )
    );

    handleCancelEdit();
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
            >
              추가
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
          {todos.map((todo) => (
            <div
              key={todo.id}
              className={`todo-item ${
                todo.completed ? 'is-completed' : ''
              }`}
            >
              {editingId === todo.id ? (
                <>
                  <input
                    type="text"
                    className="todo-edit-input"
                    value={editingTitle}
                    onChange={(event) =>
                      setEditingTitle(event.target.value)
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
                    >
                      저장
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

                    <span>{todo.title}</span>
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

                    <button type="button">
                      삭제
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

export default LearningTracker;
