const { GoogleGenAI } = require('@google/genai');
const { PDFParse } = require('pdf-parse');
const User = require('../models/User');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// @desc    Analyze resume against job description
// @route   POST /api/ai/analyze
// @access  Private
const analyzeResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a PDF resume' });
    }

    const { jobDescription } = req.body;
    if (!jobDescription) {
      return res.status(400).json({ message: 'Please provide a job description' });
    }

    // Parse PDF
    const pdf = new PDFParse(new Uint8Array(req.file.buffer));
    const pdfResult = await pdf.getText();
    const resumeText = pdfResult.text;

    // Save resume text to user profile for future use
    await User.findByIdAndUpdate(req.user.id, { resumeText });

    // Call Gemini API
    const prompt = `
      You are an expert ATS (Applicant Tracking System) and technical recruiter. 
      Analyze the following resume against the provided job description.
      
      Job Description:
      ${jobDescription}
      
      Resume:
      ${resumeText}
      
      Provide a JSON response with the following structure exactly (no markdown formatting, just raw JSON):
      {
        "score": (a number between 0 and 100 representing the match percentage),
        "missingSkills": [(array of strings of key skills mentioned in JD but missing in resume)],
        "matchingSkills": [(array of strings of key skills found in both)],
        "suggestions": [(array of strings with actionable advice to improve the resume for this role)]
      }
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    console.log("Gemini Response received");
    
    let resultText = '';
    if (response && response.text) {
      resultText = response.text;
    } else if (response && response.candidates && response.candidates[0]?.content?.parts?.[0]?.text) {
      resultText = response.candidates[0].content.parts[0].text;
    } else {
      console.error("Unexpected Gemini response structure:", JSON.stringify(response));
      throw new Error("Invalid response from AI model");
    }
    
    // Clean up potential markdown formatting from Gemini
    resultText = resultText.trim();
    if (resultText.startsWith('```json')) {
      resultText = resultText.replace(/^```json\n?/, '').replace(/\n?```$/, '');
    } else if (resultText.startsWith('```')) {
      resultText = resultText.replace(/^```\n?/, '').replace(/\n?```$/, '');
    }
    
    try {
      const parsedResult = JSON.parse(resultText);
      console.log("Successfully parsed AI response");
      res.status(200).json(parsedResult);
    } catch (parseError) {
      console.error("JSON Parse error from Gemini response. Raw text:", resultText);
      res.status(500).json({ 
        message: 'Failed to parse AI response',
        rawResponse: resultText.substring(0, 500) // Send a snippet for debugging if needed (optional)
      });
    }

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  analyzeResume
};
