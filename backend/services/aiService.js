import axios from "axios";

const GEMINI_ENDPOINT =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

export async function generateSummariesForFiles(files) {
  const maxPreview = 2000;
  const context = files
    .map(
      (f) => `FILE: ${f.path}\n${f.content.slice(0, maxPreview)}`
    )
    .join("\n\n---\n");

  const prompt = `
You are a senior test engineer assisting in building a GitHub-integrated Test Case Generator application.

You will be given a group of related source code files (from various frameworks such as React for frontend, Java JUnit tests, or Python Selenium automation scripts).

Your task:
1. Review the provided files together as a group.
2. Propose exactly 6 concise **test case summaries** for this group of files.
3. Each summary should include:
   - **id**: a short unique string id.
   - **title**: a clear name for the test case.
   - **description**: 1–2 line description of what the test will validate.
   - **targetFiles**: an array of file paths relevant to this test.
4. Keep descriptions short and focused on the main intent of the test.
5. Choose an appropriate test framework based on the given files, but do not write any test code here — only summaries.

Return ONLY a valid JSON array in the format:
[
  { "id": "tc1", "title": "...", "description": "...", "targetFiles": ["file1.js", "file2.js"] },
  ...
]
No explanations, no markdown — only valid JSON.
  
Source Files:
${context}
`;

  const resp = await axios.post(
    `${GEMINI_ENDPOINT}?key=${GEMINI_API_KEY}`,
    {
      contents: [{ parts: [{ text: prompt }] }],
    }
  );

  const raw =
    resp.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
    JSON.stringify(resp.data);

  try {
    return JSON.parse(raw);
  } catch (e) {
    return [
      {
        id: "raw-1",
        title: "AI-output",
        description: raw.slice(0, 500),
        targetFiles: files.map((f) => f.path),
      },
    ];
  }
}

export async function generateCodeForSummary(files, summaryText) {
  const maxPreview = 3000;
  const context = files
    .map(
      (f) => `// FILE: ${f.path}\n${f.content.slice(0, maxPreview)}`
    )
    .join("\n\n");

  const prompt = `
You are an expert test engineer.
Write a complete test file (Jest + React Testing Library where applicable) 
for the following test description:

${summaryText}

Context (source files for reference):
${context}

Return ONLY the complete test code with no explanations, no markdown, no JSON — 
just the ready-to-paste code for test.spec.js.
`;

  const resp = await axios.post(
    `${GEMINI_ENDPOINT}?key=${GEMINI_API_KEY}`,
    {
      contents: [{ parts: [{ text: prompt }] }],
    }
  );

  const raw =
    resp.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
    resp.data;
  console.log("Line 78................",raw);
  return raw.trim();
}

