"use client";
import { Provider } from "react-redux";
import { store } from "lib/redux/store";
import { ResumeForm } from "components/ResumeForm";
import { Resume } from "components/Resume";




export default function Create() {
  return (
    <Provider store={store}>
      <main className="min-h-0 bg-gradient-to-br from-blue-50 via-white to-purple-100 flex flex-col items-center justify-center py-10 px-2">
        <div className="w-full max-w-7xl flex flex-col md:flex-row gap-0 md:gap-0 bg-white/95 shadow-2xl rounded-3xl overflow-hidden border border-purple-100">
          {/* Form Section */}
          <div className="flex-1 flex flex-col gap-8 p-8 md:p-12 bg-gradient-to-br from-white to-blue-50">
            <div className="flex items-center gap-3 mb-2">
              <img src="/logo.png" alt="Logo" className="h-10 w-10 rounded-full shadow border-2 border-purple-200" />
              <h2 className="text-3xl font-extrabold text-purple-700 tracking-tight drop-shadow">Resume Builder</h2>
            </div>
            <div className="text-gray-600 mb-4 text-base">Fill in your details and instantly preview your professional resume. All data stays in your browser.</div>
            <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
              <div className="space-y-8 divide-y divide-purple-100">
                {/* Each section of ResumeForm can be wrapped in a card for visual separation if desired */}
                <ResumeForm />
              </div>
            </div>
          </div>
          {/* Divider */}
          <div className="hidden md:block w-2 bg-gradient-to-b from-purple-100 via-blue-100 to-white" />
          {/* Preview Section */}
          <div className="flex-1 flex flex-col items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 p-8 md:p-12">
            <div className="w-full max-w-2xl mx-auto">
              <div className="flex items-center gap-2 mb-4">
                <span className="inline-flex items-center gap-1 bg-purple-600 text-white rounded-full px-3 py-1 text-xs font-bold shadow">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2a4 4 0 018 0v2M12 7a4 4 0 110-8 4 4 0 010 8z" /></svg>
                  Live Preview
                </span>
                <span className="text-gray-400 text-xs">(What recruiters see)</span>
              </div>
              <div className="bg-white rounded-xl shadow-xl border border-gray-100 p-6 md:p-8 min-h-[600px] flex flex-col gap-4 relative">
                <div className="absolute top-4 right-4 text-purple-200 text-xs font-bold uppercase tracking-widest">Preview</div>
                <Resume />
              </div>
            </div>
          </div>
        </div>
      </main>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 8px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e0e7ff; border-radius: 4px; }
      `}</style>
    </Provider>
  );
}
