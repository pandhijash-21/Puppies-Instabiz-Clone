import Link from "next/link";
import { getDashboardStats } from "@/lib/db/dashboard";

export default async function DashboardPage() {
  const stats = await getDashboardStats();

  const cards = [
    { label: "Total puppies", value: stats.totalPuppies },
    { label: "Available", value: stats.availablePuppies },
    { label: "Enquiries", value: stats.totalEnquiries },
    { label: "New enquiries", value: stats.newEnquiries },
    { label: "Published stories", value: stats.publishedStories },
    { label: "Approved reviews", value: stats.approvedReviews },
  ];

  return (
    <div>
      <h1 className="font-plush text-4xl font-extrabold">Dashboard</h1>
      <p className="mt-2 text-cocoa-soft">Overview of TeddyPups content and leads.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => (
          <div key={card.label} className="rounded-2xl bg-white p-5 shadow-sm">
            <p className="text-sm text-cocoa-soft">{card.label}</p>
            <p className="mt-2 font-plush text-4xl font-extrabold">{card.value}</p>
          </div>
        ))}
      </div>

      <section className="mt-10">
        <h2 className="font-plush text-2xl font-bold">Recent activity</h2>
        <ul className="mt-4 space-y-2">
          {stats.recentActivity.length === 0 && (
            <li className="rounded-xl bg-white p-4 text-cocoa-soft">No recent activity yet.</li>
          )}
          {stats.recentActivity.map((item) => (
            <li key={item.id}>
              <Link
                href={item.href}
                className="flex items-center justify-between rounded-xl bg-white px-4 py-3 shadow-sm hover:bg-honey-soft/40"
              >
                <span>{item.label}</span>
                <time className="text-sm text-cocoa-soft">
                  {new Date(item.at).toLocaleString()}
                </time>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
