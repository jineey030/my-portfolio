import { Link } from 'react-router';
import './NotFound.css';

function NotFound() {
  return (
    <main className="not-found">
      <div className="not-found-content">
        <p className="not-found-code">
          404
        </p>

        <h1>PAGE NOT FOUND</h1>

        <p className="not-found-description">
          요청하신 페이지를 찾을 수 없습니다.
        </p>

        <Link
          to="/"
          className="not-found-link"
        >
          ← 홈으로 돌아가기
        </Link>
      </div>
    </main>
  );
}

export default NotFound;