import React from 'react';
import { Link } from 'react-router-dom';

const Error: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-gray-900">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <p className="text-xl mb-4">Sorry, the page you are looking for does not exist.</p>
      <Link to="/" className="text-blue-500 hover:text-blue-700 font-semibold">
        Go back to Home
      </Link>
    </div>
  );
}

export default Error;
