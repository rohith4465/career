"use client";
import { useState, useRef, useEffect } from "react";

// --- Mocking external dependencies for self-containment ---

// Simple mock for Heading component
const Heading = ({ level, className, children }: { level: number; className?: string; children: React.ReactNode }) => {
  const Tag = `h${level}` as keyof JSX.IntrinsicElements;
  return <Tag className={className}>{children}</Tag>;
};

// Simple mock for cx utility
const cx = (...args: (string | undefined | null | boolean)[]) => args.filter(Boolean).join(" ");

// Mocking PDF parsing functions
// In a real application, these would involve a client-side library like 'pdf.js'
// to extract raw text content from the PDF.
// Extracting structured data (like experiences, skills, education) from raw text
// is a complex Natural Language Processing (NLP) task that is typically done
// on a backend server using more advanced NLP models or sophisticated heuristics.
const readPdf = async (file: File) => {
  // Simulate reading PDF and parsing content
  const dummyTextContent = `
    John Doe
    Software Engineer
    john.doe@example.com | 555-123-4567 | [LinkedIn.com/in/johndoe](https://LinkedIn.com/in/johndoe)

    Summary
    Highly motivated Software Engineer with 5 years of experience in developing scalable web applications using React, Node.js, and Python. Proven ability to deliver high-quality code and collaborate effectively in agile environments.

    Experience
    Senior Software Engineer | Tech Solutions Inc. | 2022 - Present
    - Led development of a new microservices architecture, improving system performance by 30%.
    - Mentored junior engineers and conducted code reviews.
    - Implemented CI/CD pipelines, reducing deployment time by 50%.

    Software Engineer | Innovate Corp. | 2019 - 2022
    - Developed and maintained RESTful APIs using Node.js and Express.
    - Built responsive user interfaces with React and Redux.
    - Collaborated with product team to define feature requirements.

    Education
    M.S. in Computer Science | University of Tech | 2019
    B.S. in Computer Science | State University | 2017

    Skills
    Programming Languages: JavaScript, Python, TypeScript, Java
    Frameworks: React, Node.js, Express, Django, Flask
    Databases: PostgreSQL, MongoDB
    Tools: Git, Docker, AWS, Kubernetes, Jira
    Concepts: Agile, Microservices, CI/CD, RESTful APIs, Data Structures, Algorithms

    Projects
    E-commerce Platform | Personal Project | 2023
    - Developed a full-stack e-commerce application using React, Node.js, and MongoDB.
    - Implemented user authentication, product catalog, and payment gateway.
    AI Chatbot | University Project | 2018
    - Designed and implemented a natural language processing chatbot using Python and NLTK.
  `;

  const dummyParsedResume = {
    profile: {
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "555-123-4567",
      linkedin: "[LinkedIn.com/in/johndoe](https://LinkedIn.com/in/johndoe)",
      summary: "Highly motivated Software Engineer with 5 years of experience in developing scalable web applications using React, Node.js, and Python. Proven ability to deliver high-quality code and collaborate effectively in agile environments."
    },
    workExperiences: [
      {
        jobTitle: "Senior Software Engineer",
        company: "Tech Solutions Inc.",
        years: "2022 - Present",
        descriptions: [
          "Led development of a new microservices architecture, improving system performance by 30%.",
          "Mentored junior engineers and conducted code reviews.",
          "Implemented CI/CD pipelines, reducing deployment time by 50%."
        ]
      },
      {
        jobTitle: "Software Engineer",
        company: "Innovate Corp.",
        years: "2019 - 2022",
        descriptions: [
          "Developed and maintained RESTful APIs using Node.js and Express.",
          "Built responsive user interfaces with React and Redux.",
          "Collaborated with product team to define feature requirements."
        ]
      }
    ],
    educations: [
      {
        degree: "M.S. in Computer Science",
        school: "University of Tech",
        year: "2019"
      },
      {
        degree: "B.S. in Computer Science",
        school: "State University",
        year: "2017"
      }
    ],
    skills: {
      featuredSkills: [
        { skill: "JavaScript" }, { skill: "Python" }, { skill: "TypeScript" }, { skill: "Java" },
        { skill: "React" }, { skill: "Node.js" }, { skill: "Express" }, { skill: "Django" }, { skill: "Flask" },
        { skill: "PostgreSQL" }, { skill: "MongoDB" },
        { skill: "Git" }, { skill: "Docker" }, { skill: "AWS" }, { skill: "Kubernetes" }, { skill: "Jira" },
        { skill: "Agile" }, { skill: "Microservices" }, { skill: "CI/CD" }, { skill: "RESTful APIs" }, { skill: "Data Structures" }, { skill: "Algorithms" }
      ],
      descriptions: []
    },
    projects: [
      {
        project: "E-commerce Platform",
        date: "2023",
        descriptions: [
          "Developed a full-stack e-commerce application using React, Node.js, and MongoDB.",
          "Implemented user authentication, product catalog, and payment gateway."
        ]
      },
      {
        project: "AI Chatbot",
        date: "2018",
        descriptions: [
          "Designed and implemented a natural language processing chatbot using Python and NLTK."
        ]
      }
    ]
  };

  // Simulate async operation
  await new Promise(resolve => setTimeout(resolve, 500));

  return { textContent: dummyTextContent, lines: [], parsedResume: dummyParsedResume };
};

// These functions are kept for structural consistency but are not fully implemented
// as their logic is complex and dependent on a proper PDF parsing library.
const groupTextItemsIntoLines = (textItems: any) => [];
const groupLinesIntoSections = (lines: any) => [];
const extractResumeFromSections = (sections: any) => ({});

// --- End Mocking external dependencies ---

const ROLES = [
  "Software Engineer",
  "Data Scientist",
  "Product Manager",
  "UX Designer",
  "QA Engineer",
  "Lawyer",
  "Doctor",
];

const JOB_DESCRIPTIONS: { [key: string]: string } = {
  "Software Engineer": "Design, develop, and maintain software applications. Collaborate with cross-functional teams to deliver high-quality products. Required skills: programming, problem-solving, teamwork.",
  "Data Scientist": "Analyze large datasets to extract insights and build predictive models. Required skills: statistics, machine learning, Python, data visualization.",
  "Product Manager": "Lead product development, define requirements, and coordinate teams. Required skills: communication, strategy, market research, leadership.",
  "UX Designer": "Design user interfaces and experiences for web and mobile applications. Required skills: wireframing, prototyping, user research, Figma.",
  "QA Engineer": "Test software applications, write test cases, and ensure product quality. Required skills: manual/automated testing, attention to detail, bug tracking.",
  "Lawyer": "Provide legal advice, draft legal documents, represent clients in court, and ensure compliance with laws and regulations. Required skills: legal research, communication, negotiation, analytical thinking.",
  "Doctor": "Diagnose and treat illnesses, prescribe medication, and provide preventive healthcare. Required skills: medical knowledge, patient care, communication, problem-solving, empathy."
};

export default function ResumeAnalysis() {
  // State for file upload and job description
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [targetRole, setTargetRole] = useState("");
  // State for analysis results, loading, errors, etc.
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Debug and parsed resume state
  const [parsedResume, setParsedResume] = useState<any>(null);
  const [showParsedDebug, setShowParsedDebug] = useState(false);
  const [showGeminiDebug, setShowGeminiDebug] = useState(false);

  // Effect to pre-fill job description when target role changes
  useEffect(() => {
    if (targetRole && JOB_DESCRIPTIONS[targetRole]) {
      setJobDescription(JOB_DESCRIPTIONS[targetRole]);
    } else if (!targetRole) {
      setJobDescription(""); // Clear if no role selected
    }
  }, [targetRole]);

  // Function to handle file input change
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setResumeFile(file);
      setError("");
      setLoading(true);
      setAnalysisResult(null); // Clear previous analysis results
      setParsedResume(null); // Clear previous parsed resume

      try {
        let textContent = "";
        let extractedResume: any = null;

        if (file.type === "application/pdf") {
          // In a real application, you would use a library like pdf.js to extract text.
          // Example:
          // import { getDocument } from 'pdfjs-dist'; // You'd need to install pdfjs-dist
          // const pdf = await getDocument({ data: await file.arrayBuffer() }).promise;
          // const page = await pdf.getPage(1);
          // const text = await page.getTextContent();
          // textContent = text.items.map(item => item.str).join(' ');
          // Then, you'd need a backend or advanced client-side NLP to structure this text.
          const { textContent: pdfText, parsedResume: mockParsedResume } = await readPdf(file);
          textContent = pdfText;
          extractedResume = mockParsedResume;
        } else if (file.type === "text/plain") {
          textContent = await file.text();
          // For plain text, a very basic parsing for skills/experience might be done
          // or just treat the raw text as the resume content.
          extractedResume = {
            rawText: textContent,
            profile: { summary: "Content from plain text resume." },
            skills: { featuredSkills: textContent.split(/[\s,.]+/).filter(s => s.length > 2).map(s => ({ skill: s })) },
            workExperiences: [],
            educations: [],
            projects: []
          };
        } else {
          setError("Unsupported file type. Please upload a PDF or TXT file.");
          setLoading(false);
          return;
        }
        setResumeText(textContent);
        setParsedResume(extractedResume);
        setLoading(false);
      } catch (err) {
        console.error("Error reading file:", err);
        setError("Failed to read file.");
        setLoading(false);
      }
    }
  };

  // Function to handle resume analysis
  const handleAnalyze = async () => {
    if (!resumeText) {
      setError("Please upload a resume first.");
      return;
    }
    if (!targetRole) {
      setError("Please select a target role.");
      return;
    }

    setLoading(true);
    setError("");
    setAnalysisResult(null);

    const fullJobDescription = jobDescription || JOB_DESCRIPTIONS[targetRole] || "";

    if (!fullJobDescription) {
      setError("Please provide a job description or select a role with a predefined description.");
      setLoading(false);
      return;
    }

    try {
      // --- START: Real-world API call to your backend ---
      // This fetch call will send the resume data to your Node.js backend.
      // Your backend will then call the Gemini API securely.
      const response = await fetch("http://localhost:3001/api/analyze-resume", { // Adjust port if your backend runs on a different one
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          resumeText,
          jobDescription: fullJobDescription,
          targetRole,
          parsedResume: parsedResume // Sending parsedResume for more structured analysis on backend
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to analyze resume on the server.");
      }

      // 'data' will be the actual analysis result from your backend (which came from Gemini)
      const data = await response.json();
      setAnalysisResult(data);

      // --- END: Real-world API call to your backend ---

    } catch (err: any) {
      setError(err.message || "An unexpected error occurred during analysis.");
    } finally {
      setLoading(false);
    }
  };

  // Conditional rendering for the analysis results section
  let analysisSection = null;
  if (analysisResult) {
    // Parse Gemini response
    // If your backend directly returns structured fields (e.g., ats_score, strengths),
    // you can use them directly. Otherwise, parse from the 'text' content.
    const analysisText = analysisResult?.candidates?.[0]?.content?.parts?.[0]?.text || "";
    const extractSection = (title: string) => {
      const regex = new RegExp(`## ${title}\n([\\s\\S]*?)(?=\n##|$)`, "i");
      const match = analysisText.match(regex);
      return match ? match[1].trim() : "";
    };
    // Fallbacks from parsed resume
    const parsedSkills = parsedResume?.skills?.featuredSkills?.map((s: any) => s.skill).filter(Boolean) || [];
    const parsedSkillDescriptions = parsedResume?.skills?.descriptions || [];
    const parsedProjects = parsedResume?.projects || [];
    const parsedExperiences = parsedResume?.workExperiences || [];
    const parsedEducations = parsedResume?.educations || [];
    const parsedProfile = parsedResume?.profile || {};

    // Use backend fields if present, else fallback to Gemini extraction
    const atsScore = analysisResult?.ats_score ?? (() => {
      const ats = extractSection("ATS Optimization Assessment");
      let scoreMatch = ats.match(/ATS Score:?\s*(\d{1,3})/i);
      if (!scoreMatch) {
        const lines: string[] = ats.split(/\n|\r/).map((l: string) => l.trim());
        for (const line of lines) {
          const m = line.match(/(\d{1,3})/);
          if (m && parseInt(m[1]) <= 100) {
            scoreMatch = m;
            break;
          }
        }
      }
      if (scoreMatch) return scoreMatch[1];
      if (parsedResume?.atsScore) return parsedResume.atsScore;
      return "Not found";
    })();
    const strengths: string[] = analysisResult?.strengths || extractSection("Key Strengths").split(/\n\* |\n- |\n• |\n/).filter(Boolean);
    const improvements: string[] = analysisResult?.areas_for_improvement ?? extractSection("Areas for Improvement").split(/\n\* |\n- |\n• |\n/).filter(Boolean);
    let missingSkills: string[] = analysisResult?.missing_skills ?? extractSection("Missing Skills").split(/\n\* |\n- |\n• |\n/).filter(Boolean);
    if (missingSkills.length === 0 && parsedSkills.length > 0) {
      missingSkills = parsedSkills;
    }
    const roleFeedback: string = analysisResult?.role_feedback ?? (extractSection("Role Alignment Analysis") || extractSection("Role-Specific Feedback"));
    const quickWins: string[] = analysisResult?.quick_wins || extractSection("Quick Wins").split(/\n\* |\n- |\n• |\n/).filter(Boolean);
    const longTerm: string[] = analysisResult?.long_term || extractSection("Long-term Development").split(/\n\* |\n- |\n• |\n/).filter(Boolean);
    const learningResources: string[] = analysisResult?.learning_resources || extractSection("Learning Resources").split(/\n\* |\n- |\n• |\n/).filter(Boolean);


    analysisSection = (
      <div className="mt-8">
        <Heading level={2} className="mb-2 text-xl font-bold text-green-700">Resume Analysis Results</Heading>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* ATS Score */}
          <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
            <div className="text-lg font-semibold mb-2">ATS Compatibility Score</div>
            <div className="relative flex items-center justify-center mb-2">
              <span className="text-4xl font-bold text-teal-600">{atsScore}</span>
              <span className="ml-2 text-sm text-gray-500">/100</span>
            </div>
            {/* Dynamic badge based on score (mock logic) */}
            <span className={cx(
              "px-3 py-1 rounded-full text-xs font-semibold mb-2",
              parseInt(atsScore) >= 80 ? "bg-green-100 text-green-700" :
              parseInt(atsScore) >= 60 ? "bg-yellow-100 text-yellow-700" :
              "bg-red-100 text-red-700"
            )}>
              {parseInt(atsScore) >= 80 ? "Excellent" :
               parseInt(atsScore) >= 60 ? "Good" : "Needs Work"}
            </span>
            <div className="text-gray-600 text-center">Your resume has {parseInt(atsScore) >= 80 ? "excellent" : "good"} ATS compatibility with room for improvement.</div>
          </div>
          {/* Key Strengths */}
          <div className="bg-white rounded-xl shadow p-6">
            <div className="text-lg font-semibold mb-2">Key Strengths</div>
            <ul className="list-disc pl-5 text-gray-700">
              {strengths.length > 0 ? strengths.map((s, i) => <li key={i}>{s}</li>) : (
                <>
                  {parsedSkills.map((skill: any, i: any) => <li key={i}>{skill}</li>)}
                  {parsedSkillDescriptions.map((desc: any, i: any) => <li key={i}>{desc}</li>)}
                </>
              )}
            </ul>
          </div>
          {/* Areas for Improvement */}
          <div className="bg-white rounded-xl shadow p-6">
            <div className="text-lg font-semibold mb-2">Areas for Improvement</div>
            <ul className="list-disc pl-5 text-gray-700">
              {improvements.length > 0 ? improvements.map((s, i) => <li key={i}>{s}</li>) : (
                <li>No suggestions found.</li>
              )}
            </ul>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Missing Skills */}
          <div className="bg-white rounded-xl shadow p-6">
            <div className="text-lg font-semibold mb-2">Missing Skills</div>
            <div className="flex flex-wrap gap-2">
              {missingSkills.length > 0 ? missingSkills.map((s, i) => (
                <span key={i} className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs">{s}</span>
              )) : (
                parsedSkills.map((skill: any, i: any) => (
                  <span key={i} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs">{skill}</span>
                ))
              )}
            </div>
          </div>
          {/* Role-Specific Feedback */}
          <div className="bg-white rounded-xl shadow p-6">
            <div className="text-lg font-semibold mb-2">Role-Specific Feedback</div>
            <div className="text-gray-700 whitespace-pre-line">{roleFeedback || parsedProfile.summary || "No feedback found."}</div>
          </div>
        </div>
        {/* Quick Wins & Long-term Development */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow p-6">
            <div className="text-lg font-semibold mb-2">Quick Wins</div>
            <ul className="list-disc pl-5 text-gray-700">
              {quickWins.length > 0 ? quickWins.map((s, i) => <li key={i}>{s}</li>) : <li>No quick wins suggested.</li>}
            </ul>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <div className="text-lg font-semibold mb-2">Long-term Development</div>
            <ul className="list-disc pl-5 text-gray-700">
              {longTerm.length > 0 ? longTerm.map((s, i) => <li key={i}>{s}</li>) : <li>No long-term development suggestions.</li>}
            </ul>
          </div>
        </div>
        {/* Learning Resources */}
        <div className="bg-white rounded-xl shadow p-6 mb-8">
          <div className="text-lg font-semibold mb-2">Learning Resources</div>
          <ul className="list-disc pl-5 text-gray-700">
            {learningResources.length > 0 ? learningResources.map((s, i) => <li key={i}>{s}</li>) : <li>No learning resources suggested.</li>}
          </ul>
        </div>
        {/* Experience Tab */}
        <div className="bg-white rounded-xl shadow p-6 mb-8">
          <div className="text-lg font-semibold mb-2">Experience</div>
          <ul className="list-disc pl-5 text-gray-700">
            {parsedExperiences.length > 0 ? parsedExperiences.map((exp: any, i: any) => (
              <li key={i}>
                <strong>{exp.jobTitle || ""}</strong> {exp.company ? `@ ${exp.company}` : ""}
                {exp.descriptions && exp.descriptions.length > 0 && (
                  <ul className="list-disc pl-5">
                    {exp.descriptions.map((desc: any, j: any) => <li key={j}>{desc}</li>)}
                  </ul>
                )}
              </li>
            )) : <li>No experience found.</li>}
          </ul>
        </div>
        {/* Education Tab */}
        <div className="bg-white rounded-xl shadow p-6 mb-8">
          <div className="text-lg font-semibold mb-2">Education</div>
          <ul className="list-disc pl-5 text-gray-700">
            {parsedEducations.length > 0 ? parsedEducations.map((edu: any, i: any) => (
              <li key={i}>
                <strong>{edu.degree || ""}</strong> {edu.school ? `@ ${edu.school}` : ""} {edu.gpa ? `GPA: ${edu.gpa}` : ""}
                {edu.descriptions && edu.descriptions.length > 0 && (
                  <ul className="list-disc pl-5">
                    {edu.descriptions.map((desc: any, j: any) => <li key={j}>{desc}</li>)}
                  </ul>
                )}
              </li>
            )) : <li>No education found.</li>}
          </ul>
        </div>
        {/* Projects Tab */}
        <div className="bg-white rounded-xl shadow p-6 mb-8">
          <div className="text-lg font-semibold mb-2">Projects</div>
          <ul className="list-disc pl-5 text-gray-700">
            {parsedProjects.length > 0 ? parsedProjects.map((proj: any, i: any) => (
              <li key={i}>
                <strong>{proj.project || ""}</strong> {proj.date ? `(${proj.date})` : ""}
                {proj.descriptions && proj.descriptions.length > 0 && (
                  <ul className="list-disc pl-5">
                    {proj.descriptions.map((desc: any, j: any) => <li key={j}>{desc}</li>)}
                  </ul>
                )}
              </li>
            )) : <li>No projects found.</li>}
          </ul>
        </div>
      </div>
    );
  }

  return (
    <main className={cx(
      "min-h-screen flex flex-col items-center justify-center py-10 px-2 font-sans transition-colors duration-300",
      "bg-gradient-to-br from-blue-50 via-white to-purple-100 text-gray-900"
    )}>
      <div className="w-full max-w-3xl bg-white shadow-2xl rounded-3xl overflow-hidden border border-purple-100 p-8">
        <Heading level={1} className="mb-4 text-2xl font-bold text-blue-700">Resume Analysis</Heading>
        <p className="mb-6 text-gray-700">Upload your resume, preview and edit the parsed text, select your target job role, and get actionable feedback.</p>
        <div className="flex flex-col gap-4">
          <div className="flex gap-4 mb-2">
            <button className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 transition-colors" onClick={() => setShowParsedDebug(v => !v)}>
              {showParsedDebug ? "Hide" : "Show"} Parsed Resume Debug
            </button>
            <button className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 transition-colors" onClick={() => setShowGeminiDebug(v => !v)}>
              {showGeminiDebug ? "Hide" : "Show"} Gemini Response Debug
            </button>
          </div>
          {showParsedDebug && parsedResume && (
            <pre className="bg-gray-100 rounded-lg p-4 text-xs overflow-x-auto mb-4 border border-gray-300">
              {JSON.stringify(parsedResume, null, 2)}
            </pre>
          )}
          <div className="bg-purple-50 rounded-xl p-4 mb-4 border border-purple-100">
            <span className="font-semibold text-purple-700">Step 1:</span> Upload your resume (.pdf or .txt)
            <div className="mt-4 flex flex-col gap-2">
              <input type="file" accept=".pdf,.txt" ref={fileInputRef} onChange={handleFileChange} className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-purple-50 file:text-purple-700
                hover:file:bg-purple-100"
              />
              {loading && !resumeText && (
                <div className="text-center text-purple-600 mt-2">Reading file...</div>
              )}
              {error && !resumeText && (
                <div className="text-red-600 mt-2">{error}</div>
              )}
              {resumeText && (
                <div className="mt-2">
                  <label className="font-semibold text-gray-700 mb-1 block">Parsed Resume Text (Editable):</label>
                  <textarea
                    value={resumeText}
                    onChange={e => setResumeText(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-300 focus:border-blue-300 transition-all duration-200"
                    rows={6}
                    placeholder="Resume text will appear here after upload..."
                  />
                </div>
              )}
            </div>
          </div>
          <div className="bg-blue-50 rounded-xl p-4 mb-4 border border-blue-100">
            <span className="font-semibold text-blue-700">Step 2:</span> Select target role and enter job description.
            <select
              value={targetRole}
              onChange={e => setTargetRole(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 w-full mt-2 focus:ring-2 focus:ring-blue-300 focus:border-blue-300 transition-all duration-200"
            >
              <option value="">Select Target Role</option>
              {ROLES.map(role => <option key={role} value={role}>{role}</option>)}
            </select>
            <textarea
              value={jobDescription}
              onChange={e => setJobDescription(e.target.value)}
              placeholder="Paste job description here or select a role to pre-fill..."
              className="border border-gray-300 rounded-lg px-3 py-2 w-full mt-2 focus:ring-2 focus:ring-blue-300 focus:border-blue-300 transition-all duration-200"
              rows={4}
            />
            <button
              onClick={handleAnalyze}
              className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-full font-semibold hover:bg-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading || !resumeText || !targetRole || !jobDescription}
            >
              {loading ? "Analyzing..." : "Analyze Resume"}
            </button>
          </div>
        </div>
        {/* Results Section */}
        {loading && analysisResult === null && (
          <div className="mt-8 text-center text-purple-600 flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Analyzing your resume... This might take a moment.
          </div>
        )}
        {error && analysisResult === null && (
          <div className="mt-8 text-center text-red-600 p-4 bg-red-50 rounded-lg border border-red-200">{error}</div>
        )}
        {showGeminiDebug && analysisResult && (
          <pre className="bg-gray-100 rounded-lg p-4 text-xs overflow-x-auto mb-4 border border-gray-300">
            {JSON.stringify(analysisResult, null, 2)}
          </pre>
        )}
        {analysisSection}
      </div>
    </main>
  );
}
