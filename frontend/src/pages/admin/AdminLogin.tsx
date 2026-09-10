import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router';

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

    setError('');
    setIsLoading(true);

    try {
      const response = await fetch(
        'http://localhost:8080/api/auth/login',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username,
            password,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(
          '아이디 또는 비밀번호가 올바르지 않습니다.'
        );
      }

      const data = await response.json();

      localStorage.setItem(
        'admin_token',
        data.token
      );

      navigate('/admin');
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : '로그인에 실패했습니다.'
      );
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
              onChange={(event) =>
                setUsername(event.target.value)
              }
              autoComplete="username"
              placeholder="admin"
              required
            />
          </label>

          <label>
            <span>PASSWORD</span>
            <input
              type="password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              autoComplete="current-password"
              placeholder="password"
              required
            />
          </label>

          {error && (
            <p className="admin-login-error">
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
