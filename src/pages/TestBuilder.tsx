import React, { useState } from 'react';
import './TestBuilder.css';

// Types
interface DraggableOption {
  id: string;
  label: string;
  value: string;
}

interface Question {
  id: string;
  type: 'true-false-ng' | 'gap-fill' | 'multiple-choice' | 'drag-drop' | 'matching-headings';
  questionNumber: number;
  text: string;
  options?: string[];
  correctAnswer?: string | string[];
  draggableOptions?: DraggableOption[];
  slotMapping?: Record<string, string>;
}

interface Passage {
  id: number;
  title: string;
  content: string;
  questions: Question[];
}

interface TestData {
  passages: Passage[];
}

const TestBuilder: React.FC = () => {
  // Initialize with default passages to avoid undefined errors
  const getInitialData = (): TestData => {
    const saved = localStorage.getItem('ielts-test-builder');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved data:', e);
      }
    }
    return {
      passages: [
        { id: 1, title: 'Passage 1', content: '', questions: [] },
        { id: 2, title: 'Passage 2', content: '', questions: [] },
        { id: 3, title: 'Passage 3', content: '', questions: [] },
      ],
    };
  };

  const [testData, setTestData] = useState<TestData>(getInitialData);
  const [currentPassage, setCurrentPassage] = useState<number>(1);
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  // Save to localStorage
  const saveToLocalStorage = (data: TestData) => {
    localStorage.setItem('ielts-test-builder', JSON.stringify(data));
    setTestData(data);
  };

  const getCurrentPassage = (): Passage => {
    const found = testData.passages.find((p) => p.id === currentPassage);
    if (!found) {
      // Return first passage as fallback
      return testData.passages[0] || {
        id: 1,
        title: 'Passage 1',
        content: '',
        questions: [],
      };
    }
    return found;
  };

  const updatePassageContent = (content: string) => {
    const updated = {
      ...testData,
      passages: testData.passages.map((p) =>
        p.id === currentPassage ? { ...p, content } : p
      ),
    };
    saveToLocalStorage(updated);
  };

  const updatePassageTitle = (title: string) => {
    const updated = {
      ...testData,
      passages: testData.passages.map((p) =>
        p.id === currentPassage ? { ...p, title } : p
      ),
    };
    saveToLocalStorage(updated);
  };

  const addQuestion = (question: Question) => {
    const updated = {
      ...testData,
      passages: testData.passages.map((p) =>
        p.id === currentPassage
          ? { ...p, questions: [...p.questions, question] }
          : p
      ),
    };
    saveToLocalStorage(updated);
    setShowQuestionModal(false);
    setEditingQuestion(null);
  };

  const updateQuestion = (question: Question) => {
    const updated = {
      ...testData,
      passages: testData.passages.map((p) =>
        p.id === currentPassage
          ? {
              ...p,
              questions: p.questions.map((q) => (q.id === question.id ? question : q)),
            }
          : p
      ),
    };
    saveToLocalStorage(updated);
    setShowQuestionModal(false);
    setEditingQuestion(null);
  };

  const deleteQuestion = (questionId: string) => {
    if (!confirm('Are you sure you want to delete this question?')) return;
    const updated = {
      ...testData,
      passages: testData.passages.map((p) =>
        p.id === currentPassage
          ? { ...p, questions: p.questions.filter((q) => q.id !== questionId) }
          : p
      ),
    };
    saveToLocalStorage(updated);
  };

  const exportTest = () => {
    const dataStr = JSON.stringify(testData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'ielts-reading-test.json';
    link.click();
  };

  const importTest = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target?.result as string);
        saveToLocalStorage(imported);
        alert('Test imported successfully!');
      } catch {
        alert('Error importing test. Please check the file format.');
      }
    };
    reader.readAsText(file);
  };

  const passage = getCurrentPassage();

  // If no passage found, show error
  if (!passage) {
    return (
      <div className="test-builder">
        <div style={{ padding: '40px', textAlign: 'center' }}>
          <h2>Error: Passage not found</h2>
          <p>Please refresh the page or clear local storage.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="test-builder">
      {/* Header */}
      <header className="builder-header">
        <div className="header-left">
          <i className="fas fa-edit"></i>
          <h1>IELTS Reading Test Builder</h1>
        </div>
        <div className="header-right">
          <button className="btn-secondary" onClick={() => setShowPreview(true)}>
            <i className="fas fa-eye"></i>
            Preview Test
          </button>
          <button className="btn-secondary" onClick={exportTest}>
            <i className="fas fa-download"></i>
            Export
          </button>
          <label className="btn-secondary" style={{ cursor: 'pointer' }}>
            <i className="fas fa-upload"></i>
            Import
            <input
              type="file"
              accept=".json"
              onChange={importTest}
              style={{ display: 'none' }}
            />
          </label>
          <button
            className="btn-danger"
            onClick={() => {
              if (confirm('Clear all data?')) {
                localStorage.removeItem('ielts-test-builder');
                window.location.reload();
              }
            }}
          >
            <i className="fas fa-trash"></i>
            Clear All
          </button>
        </div>
      </header>

      <div className="builder-container">
        {/* Sidebar */}
        <aside className="builder-sidebar">
          <h3>Passages</h3>
          <div className="passage-tabs">
            {testData.passages.map((p) => (
              <button
                key={p.id}
                className={`passage-tab ${currentPassage === p.id ? 'active' : ''}`}
                onClick={() => setCurrentPassage(p.id)}
              >
                <i className="fas fa-file-alt"></i>
                <span>{p.title}</span>
                <span className="question-count">{p.questions.length}</span>
              </button>
            ))}
          </div>

          <div className="sidebar-stats">
            <h4>Statistics</h4>
            <div className="stat-item">
              <span>Total Questions:</span>
              <strong>{testData.passages.reduce((sum, p) => sum + p.questions.length, 0)}</strong>
            </div>
            <div className="stat-item">
              <span>Passage {currentPassage}:</span>
              <strong>{passage.questions.length} questions</strong>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="builder-main">
          {/* Passage Editor */}
          <section className="passage-editor">
            <div className="section-header">
              <input
                type="text"
                className="passage-title-input"
                value={passage.title}
                onChange={(e) => updatePassageTitle(e.target.value)}
                placeholder="Passage Title"
              />
            </div>
            <textarea
              className="passage-content-textarea"
              value={passage.content}
              onChange={(e) => updatePassageContent(e.target.value)}
              placeholder="Enter passage content here..."
            />
          </section>

          {/* Questions Manager */}
          <section className="questions-manager">
            <div className="section-header">
              <h3>Questions ({passage.questions.length})</h3>
              <button
                className="btn-primary"
                onClick={() => {
                  setEditingQuestion(null);
                  setShowQuestionModal(true);
                }}
              >
                <i className="fas fa-plus"></i>
                Add Question
              </button>
            </div>

            <div className="questions-list">
              {passage.questions.length === 0 ? (
                <div className="empty-state">
                  <i className="fas fa-question-circle"></i>
                  <p>No questions added yet</p>
                  <button
                    className="btn-primary"
                    onClick={() => setShowQuestionModal(true)}
                  >
                    Add Your First Question
                  </button>
                </div>
              ) : (
                passage.questions.map((q) => (
                  <div key={q.id} className="question-card">
                    <div className="question-card-header">
                      <span className="question-number">Q{q.questionNumber}</span>
                      <span className="question-type-badge">{q.type}</span>
                      <div className="question-actions">
                        <button
                          className="btn-icon"
                          onClick={() => {
                            setEditingQuestion(q);
                            setShowQuestionModal(true);
                          }}
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                        <button
                          className="btn-icon btn-danger"
                          onClick={() => deleteQuestion(q.id)}
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </div>
                    <div className="question-card-body">
                      <p>{q.text.substring(0, 100)}...</p>
                      {q.type === 'drag-drop' && (
                        <div className="drag-drop-preview">
                          <small>
                            <i className="fas fa-hand-pointer"></i>
                            {q.draggableOptions?.length || 0} draggable options
                          </small>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        </main>
      </div>

      {/* Question Modal */}
      {showQuestionModal && (
        <QuestionModal
          question={editingQuestion}
          existingQuestions={getCurrentPassage().questions}
          onSave={editingQuestion ? updateQuestion : addQuestion}
          onClose={() => {
            setShowQuestionModal(false);
            setEditingQuestion(null);
          }}
        />
      )}

      {/* Preview Modal */}
      {showPreview && (
        <PreviewModal testData={testData} onClose={() => setShowPreview(false)} />
      )}
    </div>
  );
};

// Question Modal Component
interface QuestionModalProps {
  question: Question | null;
  existingQuestions: Question[];
  onSave: (question: Question) => void;
  onClose: () => void;
}

const QuestionModal: React.FC<QuestionModalProps> = ({
  question,
  existingQuestions,
  onSave,
  onClose,
}) => {
  const [questionType, setQuestionType] = useState<Question['type']>(
    question?.type || 'true-false-ng'
  );
  const [questionNumber, setQuestionNumber] = useState(
    question?.questionNumber || existingQuestions.length + 1
  );
  const [text, setText] = useState(question?.text || '');
  const [options, setOptions] = useState<string[]>(question?.options || ['', '', '', '']);
  const [correctAnswer, setCorrectAnswer] = useState<string>(
    (question?.correctAnswer as string) || ''
  );
  const [draggableOptions, setDraggableOptions] = useState<DraggableOption[]>(
    question?.draggableOptions || []
  );
  const [slotMapping, setSlotMapping] = useState<Record<string, string>>(
    question?.slotMapping || {}
  );

  const handleSave = () => {
    if (!text.trim()) {
      alert('Please enter question text');
      return;
    }

    const newQuestion: Question = {
      id: question?.id || `q-${Date.now()}`,
      type: questionType,
      questionNumber,
      text,
      options: questionType === 'multiple-choice' ? options.filter((o) => o.trim()) : undefined,
      correctAnswer,
      draggableOptions:
        questionType === 'drag-drop' || questionType === 'matching-headings'
          ? draggableOptions
          : undefined,
      slotMapping:
        questionType === 'drag-drop' || questionType === 'matching-headings'
          ? slotMapping
          : undefined,
    };

    onSave(newQuestion);
  };

  const addDraggableOption = () => {
    setDraggableOptions([
      ...draggableOptions,
      { id: `opt-${Date.now()}`, label: '', value: '' },
    ]);
  };

  const updateDraggableOption = (id: string, field: 'label' | 'value', value: string) => {
    setDraggableOptions(
      draggableOptions.map((opt) => (opt.id === id ? { ...opt, [field]: value } : opt))
    );
  };

  const removeDraggableOption = (id: string) => {
    setDraggableOptions(draggableOptions.filter((opt) => opt.id !== id));
  };

  // Extract slots from text
  const extractSlots = () => {
    const regex = /\[slot:(\d+)\]/g;
    const slots: string[] = [];
    let match;
    while ((match = regex.exec(text)) !== null) {
      slots.push(match[1]);
    }
    return slots;
  };

  const slots = extractSlots();

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{question ? 'Edit Question' : 'Add New Question'}</h2>
          <button className="btn-close" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="modal-body">
          {/* Question Number */}
          <div className="form-group">
            <label>Question Number</label>
            <input
              type="number"
              className="form-input"
              value={questionNumber}
              onChange={(e) => setQuestionNumber(parseInt(e.target.value))}
              min="1"
            />
          </div>

          {/* Question Type */}
          <div className="form-group">
            <label>Question Type</label>
            <select
              className="form-select"
              value={questionType}
              onChange={(e) => setQuestionType(e.target.value as Question['type'])}
            >
              <option value="true-false-ng">True / False / Not Given</option>
              <option value="gap-fill">Gap Fill (Text Input)</option>
              <option value="multiple-choice">Multiple Choice</option>
              <option value="drag-drop">Drag & Drop (Summary)</option>
              <option value="matching-headings">Matching Headings</option>
            </select>
          </div>

          {/* Question Text */}
          <div className="form-group">
            <label>
              Question Text
              {(questionType === 'drag-drop' || questionType === 'matching-headings') && (
                <span className="help-text">
                  Use [slot:1], [slot:2], etc. for drop zones
                </span>
              )}
            </label>
            <textarea
              className="form-textarea"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter question text..."
              rows={4}
            />
          </div>

          {/* Multiple Choice Options */}
          {questionType === 'multiple-choice' && (
            <div className="form-group">
              <label>Options</label>
              {options.map((opt, index) => (
                <input
                  key={index}
                  type="text"
                  className="form-input"
                  value={opt}
                  onChange={(e) => {
                    const newOptions = [...options];
                    newOptions[index] = e.target.value;
                    setOptions(newOptions);
                  }}
                  placeholder={`Option ${String.fromCharCode(65 + index)}`}
                  style={{ marginBottom: '8px' }}
                />
              ))}
            </div>
          )}

          {/* Draggable Options */}
          {(questionType === 'drag-drop' || questionType === 'matching-headings') && (
            <div className="form-group">
              <label>
                Draggable Options
                <button
                  type="button"
                  className="btn-small"
                  onClick={addDraggableOption}
                  style={{ marginLeft: '10px' }}
                >
                  <i className="fas fa-plus"></i> Add Option
                </button>
              </label>
              <div className="draggable-options-list">
                {draggableOptions.map((opt) => (
                  <div key={opt.id} className="draggable-option-item">
                    <input
                      type="text"
                      className="form-input"
                      value={opt.label}
                      onChange={(e) =>
                        updateDraggableOption(opt.id, 'label', e.target.value)
                      }
                      placeholder="Option Label (e.g., A, I, II)"
                      style={{ width: '30%' }}
                    />
                    <input
                      type="text"
                      className="form-input"
                      value={opt.value}
                      onChange={(e) =>
                        updateDraggableOption(opt.id, 'value', e.target.value)
                      }
                      placeholder="Option Text"
                      style={{ width: '60%' }}
                    />
                    <button
                      type="button"
                      className="btn-icon btn-danger"
                      onClick={() => removeDraggableOption(opt.id)}
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Slot Mapping */}
          {(questionType === 'drag-drop' || questionType === 'matching-headings') &&
            slots.length > 0 && (
              <div className="form-group">
                <label>Correct Answers (Slot Mapping)</label>
                {slots.map((slot) => (
                  <div key={slot} className="slot-mapping-item">
                    <span>Slot {slot}:</span>
                    <select
                      className="form-select"
                      value={slotMapping[slot] || ''}
                      onChange={(e) =>
                        setSlotMapping({ ...slotMapping, [slot]: e.target.value })
                      }
                    >
                      <option value="">Select correct option</option>
                      {draggableOptions.map((opt) => (
                        <option key={opt.id} value={opt.label}>
                          {opt.label} - {opt.value}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            )}

          {/* Correct Answer (for other types) */}
          {questionType !== 'drag-drop' && questionType !== 'matching-headings' && (
            <div className="form-group">
              <label>Correct Answer</label>
              {questionType === 'true-false-ng' ? (
                <select
                  className="form-select"
                  value={correctAnswer}
                  onChange={(e) => setCorrectAnswer(e.target.value)}
                >
                  <option value="">Select answer</option>
                  <option value="TRUE">TRUE</option>
                  <option value="FALSE">FALSE</option>
                  <option value="NOT GIVEN">NOT GIVEN</option>
                </select>
              ) : questionType === 'multiple-choice' ? (
                <select
                  className="form-select"
                  value={correctAnswer}
                  onChange={(e) => setCorrectAnswer(e.target.value)}
                >
                  <option value="">Select answer</option>
                  {options
                    .filter((o) => o.trim())
                    .map((opt, index) => (
                      <option key={index} value={String.fromCharCode(65 + index)}>
                        {String.fromCharCode(65 + index)} - {opt}
                      </option>
                    ))}
                </select>
              ) : (
                <input
                  type="text"
                  className="form-input"
                  value={correctAnswer}
                  onChange={(e) => setCorrectAnswer(e.target.value)}
                  placeholder="Enter correct answer"
                />
              )}
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="btn-primary" onClick={handleSave}>
            <i className="fas fa-save"></i>
            Save Question
          </button>
        </div>
      </div>
    </div>
  );
};

// Preview Modal Component
interface PreviewModalProps {
  testData: TestData;
  onClose: () => void;
}

const PreviewModal: React.FC<PreviewModalProps> = ({ testData, onClose }) => {
  const [currentPassage, setCurrentPassage] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});

  const passage = testData.passages[currentPassage];

  const getQuestionRange = () => {
    if (currentPassage === 0) return { start: 1, end: 13 };
    if (currentPassage === 1) return { start: 14, end: 26 };
    return { start: 27, end: 40 };
  };

  const { start, end } = getQuestionRange();

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content preview-modal-full" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="preview-header">
          <div className="preview-header-left">
            <i className="fas fa-book-reader" style={{ fontSize: '1.3rem', color: '#4a90e2' }}></i>
            <h2>Test Preview</h2>
          </div>
          <button className="btn-close" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        {/* Main Content */}
        <div className="preview-main">
          {/* Left: Passage */}
          <div className="preview-passage-section">
            <h3 className="preview-section-title">
              READING PASSAGE {currentPassage + 1}
            </h3>
            <div className="preview-passage-content">
              <h4>{passage.title}</h4>
              <div className="preview-passage-text">{passage.content}</div>
            </div>
          </div>

          {/* Resizer */}
          <div className="preview-resizer"></div>

          {/* Right: Questions */}
          <div className="preview-questions-section">
            <h3 className="preview-section-title">
              Questions {start}–{end}
            </h3>
            <div className="preview-questions-list">
              {passage.questions.length === 0 ? (
                <div className="preview-empty">
                  <i className="fas fa-question-circle"></i>
                  <p>No questions added yet</p>
                </div>
              ) : (
                passage.questions.map((q) => (
                  <QuestionPreview
                    key={q.id}
                    question={q}
                    userAnswer={userAnswers[q.id]}
                    onChange={(value) =>
                      setUserAnswers({ ...userAnswers, [q.id]: value })
                    }
                  />
                ))
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="preview-footer">
          <div className="preview-tabs">
            {testData.passages.map((p, index) => (
              <button
                key={p.id}
                className={`preview-tab-btn ${currentPassage === index ? 'active' : ''}`}
                onClick={() => setCurrentPassage(index)}
              >
                Passage {index + 1}
              </button>
            ))}
          </div>

          <div className="preview-question-numbers">
            {Array.from({ length: end - start + 1 }, (_, i) => start + i).map((num) => (
              <div
                key={num}
                className={`preview-question-num ${
                  userAnswers[`q${num}`] ? 'answered' : ''
                }`}
              >
                {num}
              </div>
            ))}
          </div>

          <div className="preview-footer-buttons">
            <button
              className="btn-secondary"
              onClick={() => currentPassage > 0 && setCurrentPassage(currentPassage - 1)}
              disabled={currentPassage === 0}
            >
              Previous
            </button>
            <button
              className="btn-secondary"
              onClick={() =>
                currentPassage < 2 && setCurrentPassage(currentPassage + 1)
              }
              disabled={currentPassage === 2}
            >
              Next
            </button>
            <button className="btn-primary">Submit All</button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Question Preview Component
interface QuestionPreviewProps {
  question: Question;
  userAnswer: string;
  onChange: (value: string) => void;
}

const QuestionPreview: React.FC<QuestionPreviewProps> = ({
  question,
  userAnswer,
  onChange,
}) => {
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [slotValues, setSlotValues] = useState<Record<string, string>>({});

  const handleDragStart = (e: React.DragEvent, optionLabel: string) => {
    setDraggedItem(optionLabel);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDrop = (e: React.DragEvent, slotId: string) => {
    e.preventDefault();
    if (draggedItem) {
      setSlotValues({ ...slotValues, [slotId]: draggedItem });
      setDraggedItem(null);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const renderTextWithSlots = () => {
    if (question.type !== 'drag-drop' && question.type !== 'matching-headings') {
      return question.text;
    }

    const parts = question.text.split(/(\[slot:\d+\])/g);
    return parts.map((part, index) => {
      const match = part.match(/\[slot:(\d+)\]/);
      if (match) {
        const slotId = match[1];
        return (
          <span
            key={index}
            className="preview-drop-zone"
            onDrop={(e) => handleDrop(e, slotId)}
            onDragOver={handleDragOver}
          >
            {slotValues[slotId] || `[${slotId}]`}
          </span>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <div className="preview-question-card">
      <div className="preview-question-header">
        <span className="preview-q-badge">{question.type}</span>
        <span className="preview-q-number">Q{question.questionNumber}</span>
      </div>
      
      <div className="preview-question-text">{renderTextWithSlots()}</div>

      {/* Render based on question type */}
      {question.type === 'true-false-ng' && (
        <div className="preview-options">
          {['TRUE', 'FALSE', 'NOT GIVEN'].map((opt) => (
            <label key={opt} className="preview-option-label">
              <input
                type="radio"
                name={`q-${question.id}`}
                value={opt}
                checked={userAnswer === opt}
                onChange={(e) => onChange(e.target.value)}
              />
              <span>{opt}</span>
            </label>
          ))}
        </div>
      )}

      {question.type === 'gap-fill' && (
        <input
          type="text"
          className="preview-input"
          value={userAnswer || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Your answer"
        />
      )}

      {question.type === 'multiple-choice' && (
        <div className="preview-options">
          {question.options?.map((opt, index) => (
            <label key={index} className="preview-option-label">
              <input
                type="radio"
                name={`q-${question.id}`}
                value={String.fromCharCode(65 + index)}
                checked={userAnswer === String.fromCharCode(65 + index)}
                onChange={(e) => onChange(e.target.value)}
              />
              <span>
                {String.fromCharCode(65 + index)}. {opt}
              </span>
            </label>
          ))}
        </div>
      )}

      {(question.type === 'drag-drop' || question.type === 'matching-headings') && (
        <div className="preview-draggable-bank">
          <h4>Options:</h4>
          <div className="preview-draggable-items">
            {question.draggableOptions?.map((opt) => (
              <div
                key={opt.id}
                className="preview-draggable-item"
                draggable
                onDragStart={(e) => handleDragStart(e, opt.label)}
              >
                <strong>{opt.label}</strong> {opt.value}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TestBuilder;
