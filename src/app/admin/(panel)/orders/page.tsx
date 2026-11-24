export const dynamic = "force-dynamic";

export default function AdminOrders() {
  return (
    <div>
      <h1 className="mb-8 font-display text-4xl font-medium tracking-[-0.04em]">Orders</h1>
      <div className="rounded-3xl bg-soft p-10 text-center">
        <p className="font-display text-xl font-medium">No stored orders in demo mode</p>
        <p className="mt-2 text-sm text-muted">
          Checkout demonstrations are not saved. Connect a database when you are ready to enable order management.
        </p>
      </div>
    </div>
  );
}
