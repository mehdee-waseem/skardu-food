import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminLogin } from '../api';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { token } = await adminLogin(password);
      localStorage.setItem('skardu-admin-token', token);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="section">
      <div className="admin-login">
        <h1>Admin Login</h1>
        <form onSubmit={handleSubmit}>
          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>

          {error && <p className="status-text error">{error}</p>}

          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? 'Checking...' : 'Login'}
          </button>
        </form>
      </div>
    </section>
  );
}
