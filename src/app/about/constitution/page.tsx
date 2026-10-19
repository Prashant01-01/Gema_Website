import PageHeader from "@/components/PageHeader";

export default function ConstitutionPage() {
  return (
    <div>
      <PageHeader title="Constitution & Bylaws" subtitle="Official governing documents of GEMA" />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
          <p className="text-[var(--gray-600)] mb-6">
            The GEMA Constitution and Bylaws govern the functioning of the Guwahati Electrical Merchants Association. Download the complete document below.
          </p>
          <a
            href="#"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[var(--primary)] text-white font-semibold hover:bg-[var(--primary-dark)] transition-colors shadow-md"
          >
            📄 Download Constitution (PDF)
          </a>
        </div>
      </div>
    </div>
  );
}
