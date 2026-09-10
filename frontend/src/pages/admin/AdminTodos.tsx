import TodoList from '../learning/components/TodoList';
import { useLearning } from '../learning/context/LearningContext';

function AdminTodos() {
  const {
    setTodos
  } = useLearning();

  return (
    <main className="admin-page">
      <header className="admin-page-header">
        <p className="admin-page-label">
          ADMIN / TODOS
        </p>

        <h1>Todos</h1>

        <p className="admin-page-description">
          학습 목표를 관리합니다.
        </p>
      </header>

      <TodoList
        onTodosChange={setTodos}
      />
    </main>
  );
}

export default AdminTodos;