import PageHeader from "@/components/PageHeader";

export default function MembershipPage() {
  return (
    <div>
      <PageHeader title="Membership" subtitle="Join the Guwahati Electrical Merchants Association" />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-[var(--gray-800)] mb-4">Eligibility</h2>
            <ul className="space-y-3 text-[var(--gray-600)]">
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">✓</span>
                Must be an electrical business owner in Guwahati
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">✓</span>
                Valid trade license required
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">✓</span>
                GST registration required
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">✓</span>
                Recommendation from existing GEMA member
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-[var(--gray-800)] mb-4">Fee Structure</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                <span className="text-[var(--gray-600)]">Admission Fee</span>
                <span className="font-semibold text-[var(--gray-800)]">₹ X,XXX</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                <span className="text-[var(--gray-600)]">Annual Subscription</span>
                <span className="font-semibold text-[var(--gray-800)]">₹ X,XXX</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[var(--gray-600)]">Building Fund (One Time)</span>
                <span className="font-semibold text-[var(--gray-800)]">₹ X,XXX</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-white rounded-xl p-8 shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-[var(--gray-800)] mb-4">How to Apply</h2>
          <ol className="space-y-3 text-[var(--gray-600)] list-decimal list-inside">
            <li>Download the membership application form</li>
            <li>Fill in all required details along with supporting documents</li>
            <li>Get recommendation from an existing GEMA member</li>
            <li>Submit the form at the GEMA office along with the admission fee</li>
            <li>Application will be reviewed by the Executive Committee</li>
          </ol>
          <a
            href="#"
            className="inline-flex items-center gap-2 mt-6 px-6 py-3 rounded-lg bg-[var(--primary)] text-white font-semibold hover:bg-[var(--primary-dark)] transition-colors shadow-md"
          >
            📄 Download Application Form
          </a>
        </div>
      </div>
    </div>
  );
}
