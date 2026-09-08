import './LearningTracker.css';

function LearningTracker() {
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

      {/* Todo */}
      <section className="learning-todo">
        <div className="learning-section-header">
          <div>
            <p className="learning-section-label">
              01 / TODO
            </p>

            <h2>Todo List</h2>
          </div>

          <button type="button">
            + Todo 추가
          </button>
        </div>

        <div className="todo-list">
          <div className="todo-item">
            <label>
              <input type="checkbox" />
              <span>React useEffect 정리</span>
            </label>

            <div className="todo-actions">
              <button type="button">
                수정
              </button>

              <button type="button">
                삭제
              </button>
            </div>
          </div>

          <div className="todo-item is-completed">
            <label>
              <input
                type="checkbox"
                defaultChecked
              />

              <span>
                Spring Boot REST API 공부
              </span>
            </label>

            <div className="todo-actions">
              <button type="button">
                수정
              </button>

              <button type="button">
                삭제
              </button>
            </div>
          </div>

          <div className="todo-item">
            <label>
              <input type="checkbox" />

              <span>
                MariaDB 연동
              </span>
            </label>

            <div className="todo-actions">
              <button type="button">
                수정
              </button>

              <button type="button">
                삭제
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default LearningTracker;