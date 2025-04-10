import { useEffect, useState } from 'react';

const ApiTest = () => {
  const [data, setData] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch');
        return res.text();
      })
      .then((msg) => setData(msg))
      .catch((err) => setError(err.message));
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <h2>API Test</h2>
      {data && <p>✅ Response: {data}</p>}
      {error && <p>❌ Error: {error}</p>}
    </div>
  );
};

export default ApiTest;
