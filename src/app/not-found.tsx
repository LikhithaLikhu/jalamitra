import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="max-w-md mx-auto py-20 text-center space-y-4">
      <h1 className="text-4xl font-extrabold text-slate-900">404</h1>
      <h2 className="text-lg font-bold text-slate-700">Page Not Found</h2>
      <p className="text-xs text-slate-500">The page you are looking for does not exist.</p>
      <Link
        href="/dashboard"
        className="inline-block bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-4 py-2 rounded-lg"
      >
        Return to Dashboard
      </Link>
    </div>
  );
}
