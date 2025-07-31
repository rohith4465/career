"use client";
import { useState, useEffect } from "react";

import { readPdf } from "lib/parse-resume-from-pdf/read-pdf";
import type { TextItems } from "lib/parse-resume-from-pdf/types";
import { groupTextItemsIntoLines } from "lib/parse-resume-from-pdf/group-text-items-into-lines";
import { groupLinesIntoSections } from "lib/parse-resume-from-pdf/group-lines-into-sections";
import { extractResumeFromSections } from "lib/parse-resume-from-pdf/extract-resume-from-sections";
import { ResumeDropzone } from "components/ResumeDropzone";
import { cx } from "lib/cx";
import { Heading, Link, Paragraph } from "components/documentation";
import { ResumeTable } from "resume-parser/ResumeTable";
import { ResumeParserAlgorithmArticle } from "resume-parser/ResumeParserAlgorithmArticle";
import { SunIcon, MoonIcon, UserIcon, EnvelopeIcon, DevicePhoneMobileIcon, MapPinIcon, AcademicCapIcon, SparklesIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import { useTheme } from "next-themes";

const RESUME_EXAMPLES = [
  {
    fileUrl: "resume-example/laverne-resume.pdf",
    description: (
      <span>
        Borrowed from University of La Verne Career Center -{" "}
        <Link href="https://laverne.edu/careers/wp-content/uploads/sites/15/2010/12/Undergraduate-Student-Resume-Examples.pdf">
          Link
        </Link>
      </span>
    ),
  },
];

const defaultFileUrl = RESUME_EXAMPLES[0]["fileUrl"];

export default function ResumeParser() {
  const [fileUrl, setFileUrl] = useState(defaultFileUrl);
  const [textItems, setTextItems] = useState<TextItems>([]);
  const lines = groupTextItemsIntoLines(textItems || []);
  const sections = groupLinesIntoSections(lines);
  const resume = extractResumeFromSections(sections);
  const { theme, setTheme } = useTheme();
  useEffect(() => {
    async function test() {
      const textItems = await readPdf(fileUrl);
      setTextItems(textItems);
    }
    test();
  }, [fileUrl]);

  // Animated parsing steps
  const parsingSteps = [
    { label: "Step 1: Line Detection", icon: <DocumentTextIcon className="w-5 h-5 text-blue-400" /> },
    { label: "Step 2: Section Grouping", icon: <SparklesIcon className="w-5 h-5 text-purple-400" /> },
    { label: "Step 3: Field Extraction", icon: <UserIcon className="w-5 h-5 text-green-400" /> },
    { label: "Step 4: Data Structuring", icon: <AcademicCapIcon className="w-5 h-5 text-yellow-400" /> },
  ];

  // Parsed fields with icons
  const parsedFields = [
    { label: "Name", value: resume.profile?.name, icon: <UserIcon className="w-5 h-5 text-blue-500" /> },
    { label: "Email", value: resume.profile?.email, icon: <EnvelopeIcon className="w-5 h-5 text-purple-500" /> },
    { label: "Phone", value: resume.profile?.phone, icon: <DevicePhoneMobileIcon className="w-5 h-5 text-green-500" /> },
    { label: "Location", value: resume.profile?.location, icon: <MapPinIcon className="w-5 h-5 text-yellow-500" /> },
    { label: "Summary", value: resume.profile?.summary, icon: <SparklesIcon className="w-5 h-5 text-pink-500" /> },
  ];

  return (
    <main className={cx(
      "min-h-screen flex flex-col items-center justify-center py-10 px-2 font-sans transition-colors duration-300",
      theme === "dark" ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100" : "bg-gradient-to-br from-blue-50 via-white to-purple-100 text-gray-900"
    )}>
      <div className="w-full max-w-7xl flex flex-row gap-0 bg-white/95 dark:bg-gray-900 shadow-2xl rounded-3xl overflow-hidden border border-purple-100">
        {/* PDF Preview & Upload Section */}
        <div className="flex-1 flex flex-col p-0 md:p-0 min-h-[80vh] bg-gradient-to-br from-white to-blue-50 dark:from-gray-900 dark:to-gray-800">
          <div className="w-full flex items-center justify-between px-8 py-6 border-b border-purple-50 bg-white/80 dark:bg-gray-900/80">
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="Logo" className="h-10 w-10 rounded-full shadow border-2 border-purple-200" />
              <h2 className="text-2xl font-extrabold text-purple-700 dark:text-purple-300 tracking-tight drop-shadow">Mithra Resumes</h2>
            </div>
            <button
              className="rounded-full p-2 bg-purple-100 dark:bg-gray-800 hover:bg-purple-200 dark:hover:bg-gray-700 transition"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              aria-label="Toggle Dark Mode"
            >
              {theme === "dark" ? <SunIcon className="w-6 h-6 text-yellow-400" /> : <MoonIcon className="w-6 h-6 text-purple-600" />}
            </button>
          </div>
          <div className="flex flex-col gap-4 px-8 py-6">
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-lg p-4 w-full max-w-md">
              <div className="aspect-h-[9.5] aspect-w-7 mb-2">
                <iframe src={`${fileUrl}#navpanes=0`} className="h-full w-full rounded-lg border border-purple-100 dark:border-gray-700" />
              </div>
              <div className="flex gap-2 mb-2">
                {RESUME_EXAMPLES.map((ex, idx) => (
                  <button
                    key={idx}
                    className={cx(
                      "rounded-lg border px-4 py-2 text-sm font-semibold transition-all",
                      fileUrl === ex.fileUrl
                        ? "border-blue-600 bg-blue-50 text-blue-700 dark:bg-gray-800 dark:text-blue-300"
                        : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700"
                    )}
                    onClick={() => setFileUrl(ex.fileUrl)}
                  >
                    Resume Example {idx + 1}
                  </button>
                ))}
              </div>
              <ResumeDropzone onFileUrlChange={setFileUrl} className="mb-2" playgroundView />
            </div>
          </div>
        </div>
        {/* Results Section */}
        <div className="flex-1 flex flex-col items-center justify-between bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-0 md:p-0 min-h-[80vh]">
          <div className="w-full flex-1 flex flex-col items-center justify-center px-8 py-6">
            <div className="w-full max-w-2xl mx-auto">
              <Heading level={1} className="mb-4 text-2xl font-bold text-blue-700 dark:text-blue-300">Parsed Resume Data</Heading>
              <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 p-6 md:p-8 min-h-[400px] flex flex-col gap-6">
                {/* Animated Parsing Steps */}
                <div className="flex gap-4 mb-4 animate-fade-in">
                  {parsingSteps.map((step, idx) => (
                    <div key={idx} className="flex flex-col items-center">
                      <div className="bg-purple-100 dark:bg-gray-800 rounded-full p-2 mb-1 shadow">
                        {step.icon}
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400 font-semibold">{step.label}</span>
                    </div>
                  ))}
                </div>
                {/* Parsed Fields with Icons */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {parsedFields.map((field, idx) => (
                    <div key={idx} className="flex items-center gap-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 rounded-lg p-3 shadow-sm">
                      {field.icon}
                      <span className="font-semibold text-gray-700 dark:text-gray-200 w-24">{field.label}:</span>
                      <span className="text-gray-900 dark:text-gray-100">{field.value || <span className="italic text-gray-400">Not found</span>}</span>
                    </div>
                  ))}
                </div>
                {/* Education, Skills, etc. */}
                <div className="mt-6">
                  <ResumeTable resume={resume} />
                </div>
              </div>
              <div className="mt-8 animate-fade-in">
                <ResumeParserAlgorithmArticle textItems={textItems} lines={lines} sections={sections} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        .animate-fade-in { animation: fadeIn 0.7s ease; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: none; } }
      `}</style>
    </main>
  );
}
