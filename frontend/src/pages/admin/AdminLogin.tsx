import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router';
import { apiFetch } from '../../api/api';

// CSS는 main.tsx에서 한 번에 불러온다. (Admin.css)

function AdminLogin() {
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    // 요청 중에 Enter를 연타해도 중복 요청하지 않음
    if (isLoading) {
      return;
    }

    setError('');
    setIsLoading(true);

    let response: Response;

    try {
      response = await apiFetch(
        '/api/auth/login',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: username.trim(),
            password,
          }),
        }
      );
    } catch (error) {
      // 서버에 아예 연결하지 못한 경우 (무료 서버가 잠들어 있을 때 등)
      console.error(error);

      setError(
        '서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.'
      );
      setIsLoading(false);
      return;
    }

    try {
      if (
        response.status === 401 ||
        response.status === 403
      ) {
        throw new Error(
          '아이디 또는 비밀번호가 올바르지 않습니다.'
        );
      }

      if (!response.ok) {
        throw new Error(
          '로그인 중 서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'
        );
      }

      const data: { token?: string } =
        await response.json();

      // 토큰이 없으면 "undefined"가 저장되어 로그인된 것처럼 보이는 문제 방지
      if (!data.token) {
        throw new Error(
          '로그인 응답이 올바르지 않습니다.'
        );
      }

      localStorage.setItem(
        'admin_token',
        data.token
      );

      // 뒤로 가기를 눌러도 로그인 화면으로 돌아오지 않도록 replace
      navigate('/admin', { replace: true });
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : '로그인에 실패했습니다.'
      );

      // 비밀번호만 비워서 다시 입력하게 함
      setPassword('');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="admin-login">
      <div className="admin-login-card">

        <div className="admin-login-header">
          <p>ADMIN</p>
          <h1>Learning Manager</h1>
          <span>
            관리자 계정으로 로그인하세요.
          </span>
        </div>

        <form
          className="admin-login-form"
          onSubmit={handleSubmit}
        >
          <label>
            <span>USERNAME</span>
            <input
              type="text"
              value={username}
              onChange={(event) => {
                setUsername(event.target.value);
                setError('');
              }}
              autoComplete="username"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              placeholder="admin"
              required
            />
          </label>

          <label>
            <span>PASSWORD</span>
            <input
              type="password"
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
                setError('');
              }}
              autoComplete="current-password"
              placeholder="password"
              required
            />
          </label>

          {error && (
            <p
              className="admin-login-error"
              role="alert"
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? 'SIGNING IN...' : 'SIGN IN'}
          </button>
        </form>

      </div>
    </main>
  );
}

export default AdminLogin;
