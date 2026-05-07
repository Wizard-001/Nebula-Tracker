import { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { UploadCloud, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

const ResumeAnalyzer = () => {
  const { user } = useContext(AuthContext);
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleAnalyze = async () => {
    if (!file || !jobDescription) {
      setError('Please provide both a resume PDF and a job description.');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append('resume', file);
    formData.append('jobDescription', jobDescription);

    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.post('/api/ai/analyze', formData, config);
      setResult(data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to analyze resume. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto h-full flex flex-col">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-1">AI Resume Analyzer</h1>
        <p className="text-on-surface-variant">Match your resume against job descriptions using Gemini AI</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1 min-h-0">
        {/* Input Section */}
        <div className="glass-panel rounded-2xl p-6 flex flex-col gap-6">
          
          {/* Upload Area */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">1. Upload Resume (PDF)</h3>
            <div className="border-2 border-dashed border-outline-variant hover:border-primary/50 transition-colors rounded-xl p-8 text-center bg-surface-container-low/50">
              <input
                type="file"
                id="resume-upload"
                className="hidden"
                accept=".pdf"
                onChange={handleFileChange}
              />
              <label htmlFor="resume-upload" className="cursor-pointer flex flex-col items-center">
                <UploadCloud size={40} className="text-primary mb-3" />
                <span className="text-white font-medium mb-1">
                  {file ? file.name : 'Click to upload or drag and drop'}
                </span>
                <span className="text-sm text-on-surface-variant">PDF up to 5MB</span>
              </label>
            </div>
          </div>

          {/* Job Description Area */}
          <div className="flex-1 flex flex-col">
            <h3 className="text-lg font-semibold text-white mb-3">2. Job Description</h3>
            <textarea
              className="w-full flex-1 bg-surface-container border border-outline-variant rounded-xl p-4 text-white focus:border-primary focus:outline-none resize-none"
              placeholder="Paste the job description here..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
            />
          </div>

          {error && (
            <div className="bg-error-container text-on-error-container p-3 rounded-lg text-sm flex items-center gap-2">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          <button
            onClick={handleAnalyze}
            disabled={loading || !file || !jobDescription}
            className="w-full bg-gradient-to-r from-primary to-secondary disabled:opacity-50 hover:opacity-90 text-white font-medium py-3 rounded-xl transition-all flex items-center justify-center gap-2"
          >
            {loading ? <><Loader2 size={18} className="animate-spin" /> Analyzing...</> : 'Analyze Resume Match'}
          </button>
        </div>

        {/* Results Section */}
        <div className="glass-panel rounded-2xl p-6 overflow-y-auto">
          <h3 className="text-lg font-semibold text-white mb-6">Analysis Results</h3>
          
          {!result && !loading && !error && (
            <div className="h-[80%] flex flex-col items-center justify-center text-on-surface-variant text-center">
              <div className="w-24 h-24 bg-surface-container rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 size={40} className="text-outline" />
              </div>
              <p>Upload a resume and job description to see how well you match the role.</p>
            </div>
          )}

          {error && !loading && (
            <div className="h-[80%] flex flex-col items-center justify-center text-error text-center p-4">
              <div className="w-24 h-24 bg-error/10 rounded-full flex items-center justify-center mb-4 border border-error/20">
                <AlertCircle size={40} className="text-error" />
              </div>
              <h4 className="font-bold mb-2">Analysis Failed</h4>
              <p className="text-sm opacity-80">{error}</p>
              <button 
                onClick={handleAnalyze}
                className="mt-6 text-primary hover:underline text-sm font-medium"
              >
                Try Again
              </button>
            </div>
          )}

          {loading && (
            <div className="h-[80%] flex flex-col items-center justify-center text-primary text-center">
              <Loader2 size={40} className="animate-spin mb-4" />
              <p>AI is analyzing the documents...</p>
            </div>
          )}

          {result && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Score */}
              <div className="text-center p-6 bg-surface-container-low rounded-xl border border-outline">
                <div className="text-5xl font-bold text-gradient mb-2">{result.score}%</div>
                <div className="text-on-surface-variant font-medium uppercase tracking-wider text-sm">Match Score</div>
              </div>

              {/* Missing Skills */}
              <div>
                <h4 className="text-error font-medium mb-3 flex items-center gap-2">
                  <AlertCircle size={18} /> Missing Skills
                </h4>
                <div className="flex flex-wrap gap-2">
                  {result.missingSkills?.map((skill, i) => (
                    <span key={i} className="bg-error/10 border border-error/20 text-error px-3 py-1 rounded-full text-sm">
                      {skill}
                    </span>
                  ))}
                  {result.missingSkills?.length === 0 && <span className="text-on-surface-variant text-sm">None found!</span>}
                </div>
              </div>

              {/* Matching Skills */}
              <div>
                <h4 className="text-green-400 font-medium mb-3 flex items-center gap-2">
                  <CheckCircle2 size={18} /> Matching Skills
                </h4>
                <div className="flex flex-wrap gap-2">
                  {result.matchingSkills?.map((skill, i) => (
                    <span key={i} className="bg-green-500/10 border border-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Suggestions */}
              <div>
                <h4 className="text-primary font-medium mb-3">Actionable Suggestions</h4>
                <ul className="space-y-3">
                  {result.suggestions?.map((sug, i) => (
                    <li key={i} className="bg-surface-container-high p-4 rounded-lg text-sm text-on-surface flex items-start gap-3 border border-outline">
                      <div className="min-w-6 text-primary font-bold">{i + 1}.</div>
                      {sug}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResumeAnalyzer;
