import PageHeader from "@/components/PageHeader";

const diaries = [
  { year: "2025", pages: 120 },
  { year: "2024", pages: 115 },
  { year: "2023", pages: 110 },
  { year: "2022", pages: 108 },
  { year: "2021", pages: 105 },
];

export default function GemaDiaryPage() {
  return (
    <div>
      <PageHeader title="GEMA Diary" subtitle="Download PDF versions of the annual GEMA diary" />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-4">
          {diaries.map((diary) => (
            <a
              key={diary.year}
              href="#"
              className="flex items-center justify-between bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:border-[var(--primary-light)] hover:shadow-md transition-all group"
            >
              <div className="flex items-center gap-4">
                <span className="text-3xl">📔</span>
                <div>
                  <h3 className="font-semibold text-[var(--gray-800)] group-hover:text-[var(--primary)]">
                    GEMA Diary {diary.year}
                  </h3>
                  <p className="text-sm text-[var(--gray-600)]">{diary.pages} pages • PDF</p>
                </div>
              </div>
              <span className="text-[var(--primary)] font-medium text-sm">Download ↓</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
