
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-100 flex flex-col items-center justify-center py-10 px-2">
      <div className="w-full max-w-5xl flex flex-col md:flex-row items-center gap-12 bg-white/90 shadow-2xl rounded-3xl p-10 border border-purple-100">
        <div className="flex-1 flex flex-col items-start gap-6">
          <h1 className="text-5xl font-extrabold text-purple-700 tracking-tight drop-shadow-lg leading-tight">
            Create a professional<br />resume easily
          </h1>
          <p className="text-lg text-gray-700 max-w-md">
            With this free, open-source, and powerful resume builder. No sign up required.
          </p>
          <Link href="/resume-builder" className="inline-block bg-gradient-to-r from-purple-600 to-blue-500 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg text-lg transition-all duration-200">
            Create Resume →
          </Link>
          <p className="text-sm text-gray-500 mt-2">
            Already have a resume? <Link href="/resume-parser" className="underline underline-offset-2 text-purple-700">Test its ATS readability</Link>
          </p>
        </div>
        <div className="flex-1 flex justify-center">
          <div className="bg-gradient-to-br from-purple-100 to-blue-100 rounded-2xl shadow-lg p-6 w-full max-w-md">
            <img src="/logo.png" alt="Mithra Resumes Logo" className="h-20 w-20 mx-auto mb-4 rounded-full shadow border-2 border-purple-200" />
            <div className="text-center text-xl font-semibold text-purple-700 mb-2">See your resume in action</div>
            <div className="text-gray-600 text-center">Preview, edit, and download beautiful resumes with AI-powered suggestions.</div>
          </div>
        </div>
      </div>
    </main>
  );
}

