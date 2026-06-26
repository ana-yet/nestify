import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <span className="material-symbols-outlined text-8xl text-primary/30 mb-4">search_off</span>
      <h1 className="text-5xl font-bold text-text-main mb-2">404</h1>
      <p className="text-xl text-text-muted mb-8">Page not found</p>
      <div className="flex gap-4">
        <Link href="/" className="btn btn-primary-nestify">Go Home</Link>
        <Link href="/properties" className="btn btn-outline-nestify">Browse Properties</Link>
      </div>
    </div>
  );
}
