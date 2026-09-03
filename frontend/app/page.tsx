'use client';

import { useEffect, useState } from 'react';

export default function Home() {
  const [message, setMessage] = useState('Loading...');

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/health`)
      .then((res) => res.json())
      .then((data) => setMessage(JSON.stringify(data)))
      .catch((err) => setMessage('Error connecting to backend: ' + err.message));
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-2xl font-bold mb-4">Edge API Gateway Frontend</h1>
      <p className="p-4 bg-gray-100 dark:bg-gray-800 rounded">
        Backend Response: {message}
      </p>
    </main>
  );
}
