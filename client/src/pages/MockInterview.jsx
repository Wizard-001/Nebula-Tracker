import { useState, useContext, useRef, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import {
  UploadCloud, Play, Send, Loader2, CheckCircle2, XCircle,
  ChevronRight, Trophy, Target, Brain, MessageSquare, RotateCcw,
  Sparkles, ArrowRight, ChevronDown, ChevronUp, AlertCircle
} from 'lucide-react';

const DIFFICULTY_COLORS = {
  easy: 'bg-green-500/15 text-green-400 border-green-500/30',
  medium: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30',
  hard: 'bg-red-500/15 text-red-400 border-red-500/30',
};

const TYPE_ICONS = {
  technical: <Brain size={14} />,
  behavioral: <MessageSquare size={14} />,
  situational: <Target size={14} />,
  'system-design': <Sparkles size={14} />,
};

const RATING_CONFIG = {
  excellent: { color: 'text-green-400', bg: 'bg-green-500/15', label: 'Excellent!' },
  good: { color: 'text-secondary', bg: 'bg-secondary/15', label: 'Good' },
  average: { color: 'text-yellow-400', bg: 'bg-yellow-500/15', label: 'Average' },
  'needs-improvement': { color: 'text-primary', bg: 'bg-primary/15', label: 'Needs Improvement' },
  poor: { color: 'text-red-400', bg: 'bg-red-500/15', label: 'Poor' },
};

// ─── Setup Phase ─────────────────────────────────────────────────────
const SetupPanel = ({ onStart, loading }) => {
  const [file, setFile] = useState(null);
  const [role, setRole] = useState('');
  const [numQuestions, setNumQuestions] = useState(5);

  const handleStart = () => {
    if (!role) return;
    onStart({ file, role, numQuestions });
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-10">
        <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl flex items-center justify-center mx-auto mb-5 border border-primary/20">
          <Brain size={36} className="text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">AI Mock Interview</h2>
        <p className="text-on-surface-variant max-w-md mx-auto">
          Practice with AI-generated questions tailored to your resume and target role. Get instant feedback on every answer.
        </p>
      </div>

      <div className="glass-panel rounded-2xl p-6 space-y-5">
        {/* Resume Upload */}
        <div>
          <label className="block text-sm font-medium text-on-surface mb-2">Resume (PDF)</label>
          <div className="border-2 border-dashed border-outline-variant hover:border-primary/50 transition-colors rounded-xl p-5 text-center bg-surface-container-low/50">
            <input
              type="file"
              id="interview-resume"
              className="hidden"
              accept=".pdf"
              onChange={(e) => e.target.files?.[0] && setFile(e.target.files[0])}
            />
            <label htmlFor="interview-resume" className="cursor-pointer flex flex-col items-center gap-2">
              <UploadCloud size={28} className="text-primary" />
              <span className="text-white text-sm font-medium">
                {file ? file.name : 'Upload resume or use previously saved one'}
              </span>
              <span className="text-xs text-on-surface-variant">
                {file ? 'Click to change' : 'Optional if you already analyzed a resume before'}
              </span>
            </label>
          </div>
        </div>

        {/* Target Role */}
        <div>
          <label className="block text-sm font-medium text-on-surface mb-2">Target Role *</label>
          <input
            type="text"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="e.g. Full Stack Developer, ML Engineer, SDE Intern"
            className="w-full bg-surface-container border border-outline-variant rounded-xl px-4 py-3 text-white focus:border-primary focus:outline-none"
          />
        </div>

        {/* Number of Questions */}
        <div>
          <label className="block text-sm font-medium text-on-surface mb-2">
            Number of Questions: <span className="text-primary">{numQuestions}</span>
          </label>
          <input
            type="range"
            min="3"
            max="10"
            value={numQuestions}
            onChange={(e) => setNumQuestions(Number(e.target.value))}
            className="w-full accent-primary"
          />
          <div className="flex justify-between text-xs text-on-surface-variant mt-1">
            <span>3 (Quick)</span>
            <span>10 (Thorough)</span>
          </div>
        </div>

        {/* Start Button */}
        <button
          onClick={handleStart}
          disabled={!role || loading}
          className="w-full bg-gradient-to-r from-primary to-secondary disabled:opacity-50 hover:opacity-90 text-white font-semibold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 text-lg"
        >
          {loading ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              Generating Questions...
            </>
          ) : (
            <>
              <Play size={20} />
              Start Mock Interview
            </>
          )}
        </button>
      </div>
    </div>
  );
};

// ─── Question Card ───────────────────────────────────────────────────
const QuestionPanel = ({ question, index, total, onSubmit, loading }) => {
  const [answer, setAnswer] = useState('');
  const textareaRef = useRef(null);

  useEffect(() => {
    setAnswer('');
    textareaRef.current?.focus();
  }, [question.id]);

  const handleSubmit = () => {
    if (!answer.trim()) return;
    onSubmit(answer);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleSubmit();
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center text-sm text-on-surface-variant mb-2">
          <span>Question {index + 1} of {total}</span>
          <span>{Math.round(((index) / total) * 100)}% complete</span>
        </div>
        <div className="w-full h-1.5 bg-surface-container-high rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-500"
            style={{ width: `${((index) / total) * 100}%` }}
          />
        </div>
      </div>

      <div className="glass-panel rounded-2xl p-6 space-y-5">
        {/* Question Meta */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full border ${DIFFICULTY_COLORS[question.difficulty]}`}>
            {question.difficulty}
          </span>
          <span className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full bg-surface-container-high text-on-surface-variant">
            {TYPE_ICONS[question.type] || <Brain size={14} />}
            {question.type}
          </span>
          {question.topic && (
            <span className="px-2.5 py-1 text-xs rounded-full bg-primary/10 text-primary border border-primary/20">
              {question.topic}
            </span>
          )}
        </div>

        {/* Question */}
        <div className="bg-surface-container-low rounded-xl p-5 border border-outline">
          <p className="text-white text-lg font-medium leading-relaxed">{question.question}</p>
        </div>

        {/* Answer Area */}
        <div>
          <label className="block text-sm font-medium text-on-surface mb-2">Your Answer</label>
          <textarea
            ref={textareaRef}
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={6}
            placeholder="Type your answer here... Be as detailed as you would in a real interview."
            className="w-full bg-surface-container border border-outline-variant rounded-xl p-4 text-white focus:border-primary focus:outline-none resize-none"
          />
          <p className="text-xs text-on-surface-variant mt-1">Press Ctrl + Enter to submit</p>
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={!answer.trim() || loading}
          className="w-full bg-primary disabled:opacity-50 hover:opacity-90 text-white font-medium py-3 rounded-xl transition-all flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Evaluating your answer...
            </>
          ) : (
            <>
              <Send size={18} />
              Submit Answer
            </>
          )}
        </button>
      </div>
    </div>
  );
};

// ─── Feedback Card ───────────────────────────────────────────────────
const FeedbackPanel = ({ question, feedback, onNext, isLast }) => {
  const [showIdeal, setShowIdeal] = useState(false);
  const ratingConfig = RATING_CONFIG[feedback.rating] || RATING_CONFIG.average;

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      {/* Question Reminder */}
      <div className="glass-panel rounded-2xl p-5">
        <p className="text-sm text-on-surface-variant mb-1">Question:</p>
        <p className="text-white font-medium">{question.question}</p>
      </div>

      {/* Score + Rating */}
      <div className="glass-panel rounded-2xl p-6">
        <div className="flex items-center gap-6 mb-5">
          {/* Score Circle */}
          <div className="relative w-24 h-24 flex-shrink-0">
            <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="6" className="text-surface-container-high" />
              <circle
                cx="50" cy="50" r="42" fill="none" strokeWidth="6"
                strokeDasharray={`${(feedback.score / 10) * 264} 264`}
                strokeLinecap="round"
                className={ratingConfig.color}
                stroke="currentColor"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-2xl font-bold ${ratingConfig.color}`}>{feedback.score}</span>
              <span className="text-xs text-on-surface-variant">/10</span>
            </div>
          </div>

          <div className="flex-1">
            <span className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${ratingConfig.bg} ${ratingConfig.color} mb-2`}>
              {ratingConfig.label}
            </span>
            <p className="text-on-surface text-sm leading-relaxed">{feedback.feedback}</p>
          </div>
        </div>

        {/* Improvements */}
        {feedback.improvements?.length > 0 && (
          <div className="mt-4 pt-4 border-t border-outline">
            <h4 className="text-sm font-semibold text-on-surface mb-3 flex items-center gap-2">
              <AlertCircle size={16} className="text-yellow-400" />
              How to Improve
            </h4>
            <ul className="space-y-2">
              {feedback.improvements.map((imp, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-on-surface-variant">
                  <ArrowRight size={14} className="text-primary mt-0.5 shrink-0" />
                  {imp}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Ideal Answer Toggle */}
        <div className="mt-4 pt-4 border-t border-outline">
          <button
            onClick={() => setShowIdeal(!showIdeal)}
            className="flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors w-full"
          >
            <Sparkles size={16} />
            {showIdeal ? 'Hide' : 'Show'} Ideal Answer
            {showIdeal ? <ChevronUp size={16} className="ml-auto" /> : <ChevronDown size={16} className="ml-auto" />}
          </button>
          {showIdeal && (
            <div className="mt-3 bg-surface-container-low rounded-xl p-4 border border-primary/10">
              <p className="text-sm text-on-surface leading-relaxed whitespace-pre-wrap">{feedback.idealAnswer}</p>
            </div>
          )}
        </div>
      </div>

      {/* Next Button */}
      <button
        onClick={onNext}
        className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white font-medium py-3 rounded-xl transition-all flex items-center justify-center gap-2"
      >
        {isLast ? (
          <>
            <Trophy size={18} />
            View Final Results
          </>
        ) : (
          <>
            Next Question
            <ChevronRight size={18} />
          </>
        )}
      </button>
    </div>
  );
};

// ─── Results Summary ─────────────────────────────────────────────────
const ResultsPanel = ({ questions, feedbacks, role, onRestart }) => {
  const avgScore = feedbacks.reduce((sum, f) => sum + f.score, 0) / feedbacks.length;
  const roundedAvg = Math.round(avgScore * 10) / 10;

  const getOverallRating = (avg) => {
    if (avg >= 8.5) return { label: 'Interview Ready! 🎉', color: 'text-green-400', message: 'You demonstrated strong knowledge. Keep practicing and you\'ll ace the real interview!' };
    if (avg >= 7) return { label: 'Good Performance', color: 'text-secondary', message: 'Solid answers overall. Focus on the improvement areas below to level up.' };
    if (avg >= 5) return { label: 'Needs More Practice', color: 'text-yellow-400', message: 'You have the basics but need deeper preparation. Review the ideal answers carefully.' };
    return { label: 'Keep Practicing', color: 'text-red-400', message: 'Don\'t get discouraged! Review each ideal answer and try again.' };
  };

  const overall = getOverallRating(avgScore);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="glass-panel rounded-2xl p-8 text-center">
        <Trophy size={48} className="text-yellow-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white mb-1">Interview Complete!</h2>
        <p className="text-on-surface-variant mb-6">Role: {role}</p>

        <div className="flex justify-center items-center gap-8 mb-4">
          <div>
            <div className={`text-5xl font-bold ${overall.color}`}>{roundedAvg}</div>
            <div className="text-sm text-on-surface-variant mt-1">Average Score</div>
          </div>
          <div className="h-16 w-px bg-white/10" />
          <div>
            <div className="text-5xl font-bold text-white">{feedbacks.length}</div>
            <div className="text-sm text-on-surface-variant mt-1">Questions</div>
          </div>
        </div>

        <span className={`inline-block text-lg font-semibold ${overall.color}`}>{overall.label}</span>
        <p className="text-sm text-on-surface-variant mt-2 max-w-md mx-auto">{overall.message}</p>
      </div>

      {/* Per-Question Breakdown */}
      <div className="glass-panel rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Question Breakdown</h3>
        <div className="space-y-3">
          {questions.map((q, i) => {
            const f = feedbacks[i];
            const ratingConfig = RATING_CONFIG[f.rating] || RATING_CONFIG.average;
            return (
              <details key={q.id} className="group bg-surface-container-low rounded-xl border border-outline overflow-hidden">
                <summary className="flex items-center gap-3 p-4 cursor-pointer list-none hover:bg-white/5 transition-colors">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold ${ratingConfig.bg} ${ratingConfig.color}`}>
                    {f.score}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white font-medium truncate">{q.question}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-xs ${DIFFICULTY_COLORS[q.difficulty]} px-1.5 py-0.5 rounded border`}>{q.difficulty}</span>
                      <span className="text-xs text-on-surface-variant">{q.topic}</span>
                    </div>
                  </div>
                  <ChevronDown size={16} className="text-on-surface-variant group-open:rotate-180 transition-transform" />
                </summary>
                <div className="px-4 pb-4 space-y-3 border-t border-outline pt-3">
                  <div>
                    <p className="text-xs font-medium text-on-surface-variant mb-1">Feedback</p>
                    <p className="text-sm text-on-surface">{f.feedback}</p>
                  </div>
                  {f.improvements?.length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-yellow-400 mb-1">Improvements</p>
                      <ul className="space-y-1">
                        {f.improvements.map((imp, j) => (
                          <li key={j} className="text-sm text-on-surface-variant flex items-start gap-1.5">
                            <ArrowRight size={12} className="text-primary mt-0.5 shrink-0" />
                            {imp}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <div>
                    <p className="text-xs font-medium text-primary mb-1">Ideal Answer</p>
                    <p className="text-sm text-on-surface-variant whitespace-pre-wrap bg-surface-container rounded-lg p-3">{f.idealAnswer}</p>
                  </div>
                </div>
              </details>
            );
          })}
        </div>
      </div>

      {/* Restart */}
      <button
        onClick={onRestart}
        className="w-full bg-surface-container-high hover:bg-white/10 text-white font-medium py-3 rounded-xl transition-all flex items-center justify-center gap-2 border border-outline"
      >
        <RotateCcw size={18} />
        Start New Interview
      </button>
    </div>
  );
};

// ─── Main Page ───────────────────────────────────────────────────────
const MockInterview = () => {
  const { user } = useContext(AuthContext);

  // Phases: setup → answering → feedback → results
  const [phase, setPhase] = useState('setup');
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [feedbacks, setFeedbacks] = useState([]);
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentFeedback, setCurrentFeedback] = useState(null);

  const config = { headers: { Authorization: `Bearer ${user.token}` } };

  // Start interview
  const handleStart = async ({ file, role: targetRole, numQuestions }) => {
    setLoading(true);
    setError(null);
    setRole(targetRole);

    try {
      const formData = new FormData();
      formData.append('role', targetRole);
      formData.append('numQuestions', numQuestions);
      if (file) formData.append('resume', file);

      const { data } = await axios.post('/api/interview/start', formData, {
        headers: {
          ...config.headers,
          'Content-Type': 'multipart/form-data',
        },
      });

      setQuestions(data.questions);
      setCurrentIndex(0);
      setFeedbacks([]);
      setPhase('answering');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate questions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Submit answer for evaluation
  const handleSubmitAnswer = async (answer) => {
    setLoading(true);
    setError(null);

    try {
      const q = questions[currentIndex];
      const { data } = await axios.post('/api/interview/evaluate', {
        question: q.question,
        answer,
        questionType: q.type,
        role,
      }, config);

      setCurrentFeedback(data);
      setPhase('feedback');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to evaluate answer. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Move to next question or results
  const handleNext = () => {
    setFeedbacks(prev => [...prev, currentFeedback]);
    setCurrentFeedback(null);

    if (currentIndex + 1 >= questions.length) {
      setPhase('results');
    } else {
      setCurrentIndex(prev => prev + 1);
      setPhase('answering');
    }
  };

  // Restart
  const handleRestart = () => {
    setPhase('setup');
    setQuestions([]);
    setCurrentIndex(0);
    setFeedbacks([]);
    setCurrentFeedback(null);
    setRole('');
    setError(null);
  };

  return (
    <div className="max-w-6xl mx-auto h-full flex flex-col">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gradient mb-1">Mock Interview</h1>
        <p className="text-on-surface-variant">Practice with AI-powered interview questions based on your resume</p>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="mb-6 bg-error/10 border border-error/20 text-error p-4 rounded-xl flex items-center gap-3">
          <XCircle size={20} />
          <span className="text-sm">{error}</span>
          <button onClick={() => setError(null)} className="ml-auto text-error/60 hover:text-error">
            <XCircle size={16} />
          </button>
        </div>
      )}

      {/* Phases */}
      <div className="flex-1 overflow-y-auto pb-8">
        {phase === 'setup' && (
          <SetupPanel onStart={handleStart} loading={loading} />
        )}

        {phase === 'answering' && questions[currentIndex] && (
          <QuestionPanel
            question={questions[currentIndex]}
            index={currentIndex}
            total={questions.length}
            onSubmit={handleSubmitAnswer}
            loading={loading}
          />
        )}

        {phase === 'feedback' && currentFeedback && (
          <FeedbackPanel
            question={questions[currentIndex]}
            feedback={currentFeedback}
            onNext={handleNext}
            isLast={currentIndex + 1 >= questions.length}
          />
        )}

        {phase === 'results' && (
          <ResultsPanel
            questions={questions}
            feedbacks={feedbacks}
            role={role}
            onRestart={handleRestart}
          />
        )}
      </div>
    </div>
  );
};

export default MockInterview;
