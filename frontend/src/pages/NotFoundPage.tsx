import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center">
        <p className="text-8xl font-bold text-primary-200">404</p>
        <h1 className="text-2xl font-bold text-gray-900 mt-4 mb-2">Page not found</h1>
        <p className="text-gray-500 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-primary-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-primary-700 transition-colors"
        >
          Go back home
        </Link>
      </div>
    </div>
  )
}
