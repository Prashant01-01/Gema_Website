import PageHeader from "@/components/PageHeader";

export default function ElectionsPage() {
  return (
    <div>
      <PageHeader title="Elections" subtitle="GEMA election information and results" />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-[var(--gray-800)] mb-4">Current Term: 2024 to 2026</h2>
          <p className="text-[var(--gray-600)] mb-6">
            Elections for the GEMA Executive Committee are held every two years as per the constitution. The current committee was elected in 2024.
          </p>
          <h3 className="font-semibold text-[var(--gray-800)] mb-3">Past Election Results</h3>
          <ul className="space-y-2 text-[var(--gray-600)]">
            <li className="flex items-center gap-2">📅 2024 Election Results <a href="#" className="text-[var(--primary)] hover:underline font-medium">View</a></li>
            <li className="flex items-center gap-2">📅 2022 Election Results <a href="#" className="text-[var(--primary)] hover:underline font-medium">View</a></li>
            <li className="flex items-center gap-2">📅 2020 Election Results <a href="#" className="text-[var(--primary)] hover:underline font-medium">View</a></li>
          </ul>
        </div>
      </div>
    </div>
  );
}
