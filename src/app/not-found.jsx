import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white border border-gray-300 rounded-lg p-8 text-center">
        <div className="mb-6">
          <svg className="mx-auto h-12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z" stroke="#262626" strokeWidth="2"/>
            <path d="M3 16V8C3 5.23858 5.23858 3 8 3H16C18.7614 3 21 5.23858 21 8V16C21 18.7614 18.7614 21 16 21H8C5.23858 21 3 18.7614 3 16Z" stroke="#262626" strokeWidth="2"/>
            <circle cx="17.5" cy="6.5" r="1.5" fill="#262626"/>
          </svg>
        </div>

        <h1 className="text-3xl font-light mb-6">Page Not Found</h1>
        
        <p className="text-gray-500 mb-6">
          The page you're looking for doesn't exist or has been moved.
        </p>
        
        < Link
          href="/" 
          className="block w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded text-sm transition-colors duration-200"
        >
          Go Back Home
        </Link>

        <div className="mt-8 pt-6 border-t border-gray-300">
          <p className="text-xs text-gray-400">© {new Date().getFullYear()} INSTAGRAM CLONE</p>
        </div>
      </div>
    </div>
  );
}