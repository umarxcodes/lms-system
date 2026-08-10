const StudentsPage = () => {
  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6  bg-white ">
        <div>
          <h1 className="text-3xl font-bold text-[#0F172A]">Students</h1>
          <p className="mt-1.5 text-base text-[#64748B]">
            Manage enrollments, track progress, and update student records.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm hover:bg-gray-50 focus:outline-none transition-all"
          >
            <svg
              className="w-4 h-4 text-slate-700"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M7.5 12l4.5 4.5m0 0l4.5-4.5M12 16.5V3"
              />
            </svg>
            Export
          </button>

          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg bg-[#2563EB] px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none transition-all"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
            Add Student
          </button>
        </div>
        {/*  */}
      </div>

      <div className='fiter className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-white'>
        <div className="w-full rounded-2xl border border-gray-100 bg-white p-5 shadow-sm mt-0 gap-6">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <select className="appearance-none rounded-xl border border-gray-200 bg-white py-2.5 pl-4 pr-10 text-sm font-medium text-slate-700 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500">
                <option>All Courses</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>

            <div className="relative">
              <select className="appearance-none rounded-xl border border-gray-200 bg-white py-2.5 pl-4 pr-10 text-sm font-medium text-slate-700 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500">
                <option>All Batches</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>

            <div className="relative">
              <select className="appearance-none rounded-xl border border-gray-200 bg-white py-2.5 pl-4 pr-10 text-sm font-medium text-slate-700 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500">
                <option>Status: Any</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>

            <div className="mx-1 h-6 w-px bg-gray-200 hidden sm:block"></div>

            <div className="flex items-center gap-2">
              <span className="text-sm font-normal text-slate-500">
                Active filters:
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200/60 bg-slate-100/70 px-3 py-1.5 text-xs font-semibold text-slate-800">
                Status: Active
                <button
                  type="button"
                  className="text-slate-500 hover:text-slate-800 focus:outline-none"
                >
                  <svg
                    className="h-3.5 w-3.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </span>
              <button
                type="button"
                className="ml-1 text-sm text-slate-600 hover:text-slate-900 focus:outline-none"
              >
                Clear all
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default StudentsPage;
