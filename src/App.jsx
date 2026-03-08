import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft, Plus, Trash2, Edit2, Share2, Copy, Check } from 'lucide-react';

function App() {
  const [questions, setQuestions] = useState([
    {
      id: 1,
      text: "You asked me to, "add the newsletter updates to my base so I can consistently read them on time" Yes, but which newsletter is this?",
      options: ['Landmark', 'Northwest Montessori', 'Something Else', ''],
      notes: 'The link is not shared with me so I can't open it.

https://drive.google.com/drive/u/0/folders/16nBR06Wf4ymhuSR-9v6eLxg4QI7GNBcK',
      type: 'survey'
    },
    {
      id: 2,
      text: "Results from Vet",
      options: ['1', 'Thank You', '2', '3'],
      notes: 'Midnight's fecal sample was negative for parasites or parasite eggs, which is great news! Please let us know if you have any questions.',
      type: 'survey'
    },
    {
      id: 3,
      text: "What features matter most to you?",
      options: ['Speed', 'Reliability', 'Ease of Use', 'Cost'],
      notes: '',
      type: 'survey'
    }
  ]);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [answerNotes, setAnswerNotes] = useState({});
  const [showEditor, setShowEditor] = useState(false);
  const [customAnswerText, setCustomAnswerText] = useState('');
  const [editForm, setEditForm] = useState({ text: '', options: '' });
  const [editingId, setEditingId] = useState(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [surveyId, setSurveyId] = useState('');
  const [respondentName, setRespondentName] = useState('');
  const [isRespondent, setIsRespondent] = useState(false);
  const [copied, setCopied] = useState(false);
  const [responses, setResponses] = useState([]);
  const [showResponses, setShowResponses] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];
  const currentAnswer = answers[currentQuestion.id];
  const currentAnswerNotes = answerNotes[currentQuestion.id] || '';

  // Initialize survey ID and check if this is a respondent
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sid = params.get('survey');
    const respondent = params.get('respondent');
    
    if (sid) {
      setSurveyId(sid);
      setIsRespondent(!!respondent);
      if (respondent) {
        setRespondentName(decodeURIComponent(respondent));
        loadResponses(sid);
      }
    } else {
      setSurveyId(Math.random().toString(36).substring(7));
    }
  }, []);

  // Load responses from localStorage
  const loadResponses = async (sid) => {
    try {
      const stored = localStorage.getItem(`survey:${sid}:responses`);
      if (stored) {
        setResponses(JSON.parse(stored));
      }
    } catch (error) {
      console.log('No responses yet');
    }
  };

  // Save responses to localStorage
  const saveResponses = async (newResponses) => {
    try {
      localStorage.setItem(`survey:${surveyId}:responses`, JSON.stringify(newResponses));
    } catch (error) {
      console.error('Error saving responses:', error);
    }
  };

  const handleAnswerSelect = (option) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: option
    }));
  };

  const handleCustomAnswer = () => {
    if (customAnswerText.trim()) {
      setAnswers(prev => ({
        ...prev,
        [currentQuestion.id]: customAnswerText
      }));
      setCustomAnswerText('');
      setShowEditor(false);
    }
  };

  const handleAnswerNotesChange = (text) => {
    setAnswerNotes(prev => ({
      ...prev,
      [currentQuestion.id]: text
    }));
  };

  const handleSkip = () => {
    const unansweredIndex = questions.findIndex(q => !(q.id in answers));
    if (unansweredIndex !== -1) {
      setCurrentQuestionIndex(unansweredIndex);
    } else {
      setCurrentQuestionIndex((currentQuestionIndex + 1) % questions.length);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleAddQuestion = () => {
    const newId = Math.max(...questions.map(q => q.id), 0) + 1;
    setQuestions([...questions, {
      id: newId,
      text: 'New Question',
      options: ['Option 1', 'Option 2', 'Option 3'],
      notes: '',
      type: 'survey'
    }]);
  };

  const handleDeleteQuestion = (id) => {
    if (questions.length === 1) {
      alert('You must have at least one question');
      return;
    }
    const newQuestions = questions.filter(q => q.id !== id);
    setQuestions(newQuestions);
    const newIndex = Math.min(currentQuestionIndex, newQuestions.length - 1);
    setCurrentQuestionIndex(newIndex);
    setAnswers(prev => {
      const newAnswers = { ...prev };
      delete newAnswers[id];
      return newAnswers;
    });
  };

  const handleEditQuestion = (id) => {
    const question = questions.find(q => q.id === id);
    setEditingId(id);
    setEditForm({
      text: question.text,
      options: question.options.join('\n'),
      notes: question.notes || ''
    });
  };

  const handleSaveEdit = () => {
    if (editForm.text.trim()) {
      setQuestions(questions.map(q => {
        if (q.id === editingId) {
          return {
            ...q,
            text: editForm.text,
            options: editForm.options.split('\n').filter(o => o.trim()),
            notes: editForm.notes
          };
        }
        return q;
      }));
      setEditingId(null);
    }
  };

  const handleSubmitResponses = async () => {
    const newResponse = {
      respondent: respondentName,
      timestamp: new Date().toISOString(),
      answers: answers,
      answerNotes: answerNotes
    };

    const updatedResponses = [...responses, newResponse];
    setResponses(updatedResponses);
    await saveResponses(updatedResponses);

    alert(`Thank you ${respondentName}! Your responses have been submitted.`);
    setAnswers({});
    setAnswerNotes({});
    setCurrentQuestionIndex(0);
  };

  const generateShareLink = () => {
    const baseUrl = window.location.origin + window.location.pathname;
    return `${baseUrl}?survey=${surveyId}`;
  };

  const generateRespondentLink = (name) => {
    const baseUrl = window.location.origin + window.location.pathname;
    return `${baseUrl}?survey=${surveyId}&respondent=${encodeURIComponent(name)}`;
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const answeredCount = Object.keys(answers).length;

  // Respondent View
  if (isRespondent) {
    const allAnswered = answeredCount === questions.length;

    return (
      <div style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', minHeight: '100vh' }} className="p-4">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8 text-center">
            <h1 style={{ fontFamily: 'Georgia, serif' }} className="text-5xl font-bold text-white mb-2">Survey</h1>
            <p className="text-purple-100 text-lg">Responding as: <span className="font-semibold">{respondentName}</span></p>
            <p className="text-purple-100">Question {currentQuestionIndex + 1} of {questions.length}</p>
          </div>

          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden mb-6">
            <div className="h-1.5 bg-gray-200">
              <div 
                className="h-full transition-all duration-500" 
                style={{ 
                  width: `${((currentQuestionIndex + 1) / questions.length) * 100}%`,
                  background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)'
                }}
              />
            </div>

            <div className="p-8">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-6 leading-tight">
                  {currentQuestion.text}
                </h2>

                {currentQuestion.notes && (
                  <div className="mb-6 p-4 bg-blue-50 border-l-4 border-blue-400 rounded">
                    <p className="text-gray-700">{currentQuestion.notes}</p>
                  </div>
                )}

                <div className="space-y-3 mb-6">
                  {currentQuestion.options.map((option) => (
                    <button
                      key={option}
                      onClick={() => handleAnswerSelect(option)}
                      className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-200 font-medium ${
                        currentAnswer === option
                          ? 'border-purple-500 bg-purple-50 text-purple-900'
                          : 'border-gray-200 bg-white text-gray-700 hover:border-purple-300'
                      }`}
                    >
                      <div className="flex items-center">
                        <div className={`w-6 h-6 rounded-full border-2 mr-4 flex items-center justify-center transition-all ${
                          currentAnswer === option
                            ? 'border-purple-500 bg-purple-500'
                            : 'border-gray-300'
                        }`}>
                          {currentAnswer === option && <div className="w-2 h-2 bg-white rounded-full" />}
                        </div>
                        <span>{option}</span>
                      </div>
                    </button>
                  ))}
                </div>

                {!showEditor ? (
                  <button
                    onClick={() => setShowEditor(true)}
                    className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-purple-300 hover:text-purple-600 transition-all font-medium mb-6"
                  >
                    + Add custom answer
                  </button>
                ) : (
                  <div className="mb-6 space-y-3">
                    <input
                      type="text"
                      placeholder="Enter your answer..."
                      value={customAnswerText}
                      onChange={(e) => setCustomAnswerText(e.target.value)}
                      className="w-full p-4 border-2 border-purple-300 rounded-lg focus:outline-none focus:border-purple-500"
                      autoFocus
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={handleCustomAnswer}
                        className="flex-1 bg-purple-500 hover:bg-purple-600 text-white py-2 rounded-lg font-medium transition-all"
                      >
                        Save Answer
                      </button>
                      <button
                        onClick={() => {
                          setShowEditor(false);
                          setCustomAnswerText('');
                        }}
                        className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 rounded-lg font-medium transition-all"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {currentAnswer && (
                  <div className="p-4 bg-green-50 border-2 border-green-200 rounded-lg mb-6">
                    <p className="text-sm text-green-700 font-medium">Your answer:</p>
                    <p className="text-green-900 font-medium">{currentAnswer}</p>
                  </div>
                )}

                {/* Answer Notes Section */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <label className="block text-sm font-bold text-gray-700 mb-3">Notes (optional)</label>
                  <p className="text-gray-600 text-sm mb-3">Add any additional details or context for your answer:</p>
                  <textarea
                    value={currentAnswerNotes}
                    onChange={(e) => handleAnswerNotesChange(e.target.value)}
                    placeholder="Type any additional notes here..."
                    className="w-full p-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 resize-none"
                    rows="4"
                  />
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 bg-gray-50 p-8">
              <div className="flex justify-between gap-3 mb-4">
                <button
                  onClick={handlePrevious}
                  disabled={currentQuestionIndex === 0}
                  className="flex items-center gap-2 px-4 py-2 border-2 border-gray-300 rounded-lg hover:border-purple-500 hover:text-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium"
                >
                  <ChevronLeft size={20} /> Previous
                </button>

                <div className="flex gap-2">
                  <button
                    onClick={handleSkip}
                    className="px-6 py-2 border-2 border-orange-300 text-orange-600 rounded-lg hover:bg-orange-50 transition-all font-medium"
                  >
                    Skip
                  </button>
                  {currentQuestionIndex < questions.length - 1 ? (
                    <button
                      onClick={handleNext}
                      className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-all font-medium"
                    >
                      Next <ChevronRight size={20} />
                    </button>
                  ) : (
                    <button
                      onClick={handleSubmitResponses}
                      disabled={!allAnswered}
                      className="px-6 py-2 bg-green-500 hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-all font-medium"
                    >
                      Submit
                    </button>
                  )}
                </div>
              </div>

              <p className="text-center text-sm text-gray-600">
                {answeredCount} of {questions.length} answered
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Owner View
  return (
    <div style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', minHeight: '100vh' }} className="p-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8 text-center">
          <h1 style={{ fontFamily: 'Georgia, serif' }} className="text-5xl font-bold text-white mb-2">Survey</h1>
          <p className="text-purple-100 text-lg">Question {currentQuestionIndex + 1} of {questions.length}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden mb-6">
          <div className="h-1.5 bg-gray-200">
            <div 
              className="h-full transition-all duration-500" 
              style={{ 
                width: `${((currentQuestionIndex + 1) / questions.length) * 100}%`,
                background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)'
              }}
            />
          </div>

          <div className="p-8">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-6 leading-tight">
                {currentQuestion.text}
              </h2>

              {currentQuestion.notes && (
                <div className="mb-6 p-4 bg-blue-50 border-l-4 border-blue-400 rounded">
                  <p className="text-gray-700">{currentQuestion.notes}</p>
                </div>
              )}

              <div className="space-y-3 mb-6">
                {currentQuestion.options.map((option) => (
                  <button
                    key={option}
                    onClick={() => handleAnswerSelect(option)}
                    className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-200 font-medium ${
                      currentAnswer === option
                        ? 'border-purple-500 bg-purple-50 text-purple-900'
                        : 'border-gray-200 bg-white text-gray-700 hover:border-purple-300'
                    }`}
                  >
                    <div className="flex items-center">
                      <div className={`w-6 h-6 rounded-full border-2 mr-4 flex items-center justify-center transition-all ${
                        currentAnswer === option
                          ? 'border-purple-500 bg-purple-500'
                          : 'border-gray-300'
                      }`}>
                        {currentAnswer === option && <div className="w-2 h-2 bg-white rounded-full" />}
                      </div>
                      <span>{option}</span>
                    </div>
                  </button>
                ))}
              </div>

              {!showEditor ? (
                <button
                  onClick={() => setShowEditor(true)}
                  className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-purple-300 hover:text-purple-600 transition-all font-medium mb-6"
                >
                  + Add custom answer
                </button>
              ) : (
                <div className="mb-6 space-y-3">
                  <input
                    type="text"
                    placeholder="Enter your answer..."
                    value={customAnswerText}
                    onChange={(e) => setCustomAnswerText(e.target.value)}
                    className="w-full p-4 border-2 border-purple-300 rounded-lg focus:outline-none focus:border-purple-500"
                    autoFocus
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleCustomAnswer}
                      className="flex-1 bg-purple-500 hover:bg-purple-600 text-white py-2 rounded-lg font-medium transition-all"
                    >
                      Save Answer
                    </button>
                    <button
                      onClick={() => {
                        setShowEditor(false);
                        setCustomAnswerText('');
                      }}
                      className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 rounded-lg font-medium transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {currentAnswer && (
                <div className="p-4 bg-green-50 border-2 border-green-200 rounded-lg mb-6">
                  <p className="text-sm text-green-700 font-medium">Your answer:</p>
                  <p className="text-green-900 font-medium">{currentAnswer}</p>
                </div>
              )}

              {/* Answer Notes Section */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <label className="block text-sm font-bold text-gray-700 mb-3">Notes (optional)</label>
                <p className="text-gray-600 text-sm mb-3">Add any additional details or context for your answer:</p>
                <textarea
                  value={currentAnswerNotes}
                  onChange={(e) => handleAnswerNotesChange(e.target.value)}
                  placeholder="Type any additional notes here..."
                  className="w-full p-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 resize-none"
                  rows="4"
                />
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 bg-gray-50 p-8">
            <div className="flex justify-between gap-3 mb-4">
              <button
                onClick={handlePrevious}
                disabled={currentQuestionIndex === 0}
                className="flex items-center gap-2 px-4 py-2 border-2 border-gray-300 rounded-lg hover:border-purple-500 hover:text-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium"
              >
                <ChevronLeft size={20} /> Previous
              </button>

              <div className="flex gap-2">
                <button
                  onClick={handleSkip}
                  className="px-6 py-2 border-2 border-orange-300 text-orange-600 rounded-lg hover:bg-orange-50 transition-all font-medium"
                >
                  Skip
                </button>
                <button
                  onClick={handleNext}
                  disabled={currentQuestionIndex === questions.length - 1}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium"
                >
                  Next <ChevronRight size={20} />
                </button>
              </div>
            </div>

            <p className="text-center text-sm text-gray-600">
              {answeredCount} of {questions.length} answered
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="p-6 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-bold text-gray-800">Question Manager</h3>
            <button
              onClick={() => setShowShareModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all font-medium"
            >
              <Share2 size={18} /> Share Survey
            </button>
          </div>

          <div className="p-6 space-y-2 max-h-48 overflow-y-auto">
            {questions.map((q, index) => (
              <div
                key={q.id}
                className={`p-3 rounded-lg cursor-pointer transition-all flex justify-between items-center group ${
                  index === currentQuestionIndex
                    ? 'bg-purple-100 border-2 border-purple-500'
                    : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100'
                }`}
                onClick={() => setCurrentQuestionIndex(index)}
              >
                <div className="flex-1">
                  <p className="font-medium text-gray-700">{q.text.substring(0, 50)}...</p>
                  <p className="text-xs text-gray-500">{q.options.length} options</p>
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditQuestion(q.id);
                    }}
                    className="p-1.5 text-blue-600 hover:bg-blue-100 rounded transition-all"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteQuestion(q.id);
                    }}
                    className="p-1.5 text-red-600 hover:bg-red-100 rounded transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {responses.length > 0 && (
            <div className="border-t border-gray-200 p-6">
              <button
                onClick={() => setShowResponses(!showResponses)}
                className="text-blue-600 hover:text-blue-800 font-medium underline"
              >
                {showResponses ? 'Hide' : 'Show'} Responses ({responses.length})
              </button>
              
              {showResponses && (
                <div className="mt-4 space-y-4 max-h-64 overflow-y-auto">
                  {responses.map((response, idx) => (
                    <div key={idx} className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <p className="font-semibold text-blue-900">{response.respondent}</p>
                      <p className="text-xs text-blue-700 mb-2">{new Date(response.timestamp).toLocaleString()}</p>
                      <div className="space-y-2 text-sm">
                        {Object.entries(response.answers).map(([qId, answer]) => {
                          const q = questions.find(qu => qu.id === parseInt(qId));
                          return (
                            <div key={qId}>
                              <p className="font-medium text-blue-900">{q?.text}</p>
                              <p className="text-blue-800 ml-2">→ {answer}</p>
                              {response.answerNotes && response.answerNotes[qId] && (
                                <p className="text-blue-700 ml-2 italic text-xs">Note: {response.answerNotes[qId]}</p>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="border-t border-gray-200 p-6">
            <button
              onClick={handleAddQuestion}
              className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-all font-medium"
            >
              <Plus size={18} /> Add Question
            </button>
          </div>
        </div>

        {/* Share Modal */}
        {showShareModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Share Your Survey</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Survey Link</label>
                  <p className="text-xs text-gray-600 mb-2">Share this link with anyone to collect responses:</p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={generateShareLink()}
                      readOnly
                      className="flex-1 p-3 border-2 border-gray-300 rounded-lg bg-gray-50 text-sm font-mono"
                    />
                    <button
                      onClick={() => copyToClipboard(generateShareLink())}
                      className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all"
                    >
                      {copied ? <Check size={18} /> : <Copy size={18} />}
                    </button>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Generate Respondent Link</label>
                  <p className="text-xs text-gray-600 mb-2">Create a personalized link for a specific person:</p>
                  <div className="space-y-2">
                    <input
                      type="text"
                      placeholder="Enter respondent name..."
                      value={respondentName}
                      onChange={(e) => setRespondentName(e.target.value)}
                      className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                    />
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={respondentName ? generateRespondentLink(respondentName) : ''}
                        readOnly
                        placeholder="Link will appear here"
                        className="flex-1 p-3 border-2 border-gray-300 rounded-lg bg-gray-50 text-xs font-mono"
                      />
                      {respondentName && (
                        <button
                          onClick={() => copyToClipboard(generateRespondentLink(respondentName))}
                          className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all"
                        >
                          {copied ? <Check size={18} /> : <Copy size={18} />}
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    onClick={() => setShowShareModal(false)}
                    className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 rounded-lg font-medium transition-all"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {editingId && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Edit Question</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Question Text</label>
                  <input
                    type="text"
                    value={editForm.text}
                    onChange={(e) => setEditForm(prev => ({ ...prev, text: e.target.value }))}
                    className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Options (one per line)</label>
                  <textarea
                    value={editForm.options}
                    onChange={(e) => setEditForm(prev => ({ ...prev, options: e.target.value }))}
                    className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 h-32"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Notes (optional)</label>
                  <textarea
                    value={editForm.notes || ''}
                    onChange={(e) => setEditForm(prev => ({ ...prev, notes: e.target.value }))}
                    className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 h-24"
                    placeholder="Add details or context about this question..."
                  />
                </div>
                <div className="flex gap-2 pt-4">
                  <button
                    onClick={handleSaveEdit}
                    className="flex-1 bg-purple-500 hover:bg-purple-600 text-white py-2 rounded-lg font-medium transition-all"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 rounded-lg font-medium transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
