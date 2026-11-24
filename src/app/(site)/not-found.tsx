import Link from "next/link";

export default function NotFound() {
  return (
    <section className="mx-auto grid min-h-[60vh] max-w-xl place-items-center px-6 text-center">
      <div>
        <p className="eyebrow mb-4">404</p>
        <h1 className="font-serif text-5xl italic">Page not found</h1>
        <p className="mb-8 mt-4 text-sm text-muted">The piece or page you’re looking for has moved on.</p>
        <Link href="/shop" className="btn">
          Back to shop
        </Link>
      </div>
    </section>
  );
}
