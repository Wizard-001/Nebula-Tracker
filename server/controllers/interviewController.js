const { GoogleGenAI } = require('@google/genai');
const { PDFParse } = require('pdf-parse');
const User = require('../models/User');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Helper to extract clean JSON from Gemini response
const extractJSON = (response) => {
  let text = '';
  if (response && response.text) {
    text = response.text;
  } else if (response?.candidates?.[0]?.content?.parts?.[0]?.text) {
    text = response.candidates[0].content.parts[0].text;
  } else {
    throw new Error('Invalid response from AI model');
  }

  text = text.trim();
  if (text.startsWith('```json')) {
    text = text.replace(/^```json\n?/, '').replace(/\n?```$/, '');
  } else if (text.startsWith('```')) {
    text = text.replace(/^```\n?/, '').replace(/\n?```$/, '');
  }

  return JSON.parse(text);
};

// @desc    Generate interview questions based on resume + role
// @route   POST /api/interview/start
// @access  Private
const startInterview = async (req, res) => {
  try {
    const { role, numQuestions } = req.body;
    let resumeText = '';

    // If a PDF was uploaded, parse it
    if (req.file) {
      const pdf = new PDFParse(new Uint8Array(req.file.buffer));
      const pdfResult = await pdf.getText();
      resumeText = pdfResult.text;
      // Save to user profile
      await User.findByIdAndUpdate(req.user.id, { resumeText });
    } else {
      // Fallback to saved resume text from profile
      const user = await User.findById(req.user.id);
      resumeText = user?.resumeText || '';
    }

    if (!resumeText) {
      return res.status(400).json({ message: 'No resume found. Please upload a PDF resume.' });
    }

    if (!role) {
      return res.status(400).json({ message: 'Please provide a target role.' });
    }

    const count = Math.min(Math.max(numQuestions || 5, 3), 10);

    const prompt = `
You are a senior technical interviewer at a top tech company. You are conducting an interview for the role of "${role}".

Here is the candidate's resume:
${resumeText}

Based on the resume AND the target role, generate exactly ${count} interview questions.

IMPORTANT RULES:
- Mix question types: include 2-3 technical/coding questions specific to skills on their resume, 1-2 behavioral/situational questions, and 1-2 role-specific questions.
- Questions must be REALISTIC — the kind asked at Google, Microsoft, Amazon, etc.
- Tailor questions to the candidate's actual experience and skill level shown in the resume.
- For technical questions, ask about specific technologies/frameworks they have listed.
- Each question should have a difficulty level.

Return a JSON response with EXACTLY this structure (no markdown, just raw JSON):
{
  "questions": [
    {
      "id": 1,
      "question": "the interview question text",
      "type": "technical" | "behavioral" | "situational" | "system-design",
      "difficulty": "easy" | "medium" | "hard",
      "topic": "the specific topic this question covers, e.g. React, Python, Leadership"
    }
  ]
}
    `;

    console.log('Generating interview questions for role:', role);

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    const parsed = extractJSON(response);
    console.log(`Generated ${parsed.questions.length} interview questions`);

    res.status(200).json(parsed);
  } catch (error) {
    console.error('Interview start error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Evaluate a single answer
// @route   POST /api/interview/evaluate
// @access  Private
const evaluateAnswer = async (req, res) => {
  try {
    const { question, answer, questionType, role } = req.body;

    if (!question || !answer) {
      return res.status(400).json({ message: 'Please provide both question and answer.' });
    }

    const prompt = `
You are a senior technical interviewer evaluating a candidate's answer for a "${role || 'Software Engineer'}" position.

Question asked: "${question}"
Question type: ${questionType || 'technical'}

Candidate's answer:
"${answer}"

Evaluate the answer thoroughly and honestly. Be constructive but realistic — like a real interviewer would.

Return a JSON response with EXACTLY this structure (no markdown, just raw JSON):
{
  "score": (a number 1 to 10, where 10 is perfect),
  "rating": "excellent" | "good" | "average" | "needs-improvement" | "poor",
  "feedback": "2-3 sentences about what was good and what was lacking in their answer",
  "idealAnswer": "A concise but comprehensive model answer that would score 10/10. This should be specific and detailed enough that the candidate can learn from it.",
  "improvements": ["specific improvement suggestion 1", "specific improvement suggestion 2", "specific improvement suggestion 3"]
}
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    const parsed = extractJSON(response);
    console.log(`Evaluated answer — score: ${parsed.score}/10`);

    res.status(200).json(parsed);
  } catch (error) {
    console.error('Answer evaluation error:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  startInterview,
  evaluateAnswer,
};
