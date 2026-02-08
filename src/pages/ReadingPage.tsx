import React, { useState, useEffect } from 'react';
import './ReadingPage.css';

// Types from TestBuilder
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

// Correct answers for all 40 questions (fallback/default)
const CORRECT_ANSWERS: Record<string, string> = {
  q1: 'TRUE', q2: 'FALSE', q3: 'NOT GIVEN', q4: 'FALSE', q5: 'TRUE', q6: 'TRUE',
  q7: 'COPPER', q8: 'WEIGHT', q9: 'INSULATION', q10: 'FUNDS', q11: 'GOVERNMENT',
  q12: 'TRADE', q13: 'IMMIGRANTS', q14: 'V', q15: 'III', q16: 'IX', q17: 'IV',
  q18: 'VII', q19: 'II', q20: 'IDENTICAL', q21: 'ALGORITHMS', q22: 'STATISTICS',
  q23: 'SPEECH', q24: 'B', q25: 'A', q26: 'A', q27: 'YES', q28: 'NO',
  q29: 'NOT GIVEN', q30: 'YES', q31: 'NO', q32: 'C', q33: 'E', q34: 'A',
  q35: 'F', q36: 'D', q37: 'C', q38: 'D', q39: 'A', q40: 'B',
};

type UserAnswers = Record<string, string>;

const ReadingPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [showStart, setShowStart] = useState(false);
  const [testStarted, setTestStarted] = useState(false);
  const [currentPassage, setCurrentPassage] = useState(1);
  const [userAnswers, setUserAnswers] = useState<UserAnswers>({});
  const [seconds, setSeconds] = useState(60 * 60); // 60 minutes
  const [showResults, setShowResults] = useState(false);
  const [testData, setTestData] = useState<TestData | null>(null);
  const [useCustomTest, setUseCustomTest] = useState(false);

  // Load test from Test Builder (local storage)
  useEffect(() => {
    const savedTest = localStorage.getItem('ielts-test-builder');
    if (savedTest) {
      try {
        const parsed: TestData = JSON.parse(savedTest);
        // Check if test has content
        const hasContent = parsed.passages.some(p => p.content || p.questions.length > 0);
        if (hasContent) {
          setTestData(parsed);
          setUseCustomTest(true);
        }
      } catch (error) {
        console.error('Error loading custom test:', error);
      }
    }
  }, []);

  // Loading effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      setShowStart(true);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  // Timer countdown
  useEffect(() => {
    if (!testStarted || showResults) return;
    const interval = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [testStarted, showResults]);

  const startTest = () => {
    setShowStart(false);
    setTestStarted(true);
  };

  const handleAnswerChange = (question: string, value: string) => {
    setUserAnswers((prev) => ({ ...prev, [question]: value }));
  };

  const handleSubmit = () => {
    setShowResults(true);
  };

  const getScore = () => {
    if (useCustomTest && testData) {
      // Calculate score from custom test
      let score = 0;
      testData.passages.forEach((passage) => {
        passage.questions.forEach((q) => {
          const userAns = (userAnswers[q.id] || '').trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
          let correctAns = '';
          
          if (q.type === 'drag-drop' || q.type === 'matching-headings') {
            // For drag-drop, check slot mapping
            // This is simplified - you may need more complex logic
            correctAns = ''; // Handle slot mapping
          } else {
            correctAns = (q.correctAnswer as string || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
          }
          
          if (userAns === correctAns) score++;
        });
      });
      return score;
    } else {
      // Use default correct answers
      let score = 0;
      Object.keys(CORRECT_ANSWERS).forEach((key) => {
        const userAns = (userAnswers[key] || '').trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
        const correctAns = CORRECT_ANSWERS[key].toUpperCase().replace(/[^A-Z0-9]/g, '');
        if (userAns === correctAns) score++;
      });
      return score;
    }
  };

  const getPassageScore = (start: number, end: number) => {
    let score = 0;
    for (let i = start; i <= end; i++) {
      const key = `q${i}`;
      const userAns = (userAnswers[key] || '').trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
      const correctAns = (CORRECT_ANSWERS[key] || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
      if (userAns === correctAns) score++;
    }
    return score;
  };

  const getQuestionRange = () => {
    if (currentPassage === 1) return { start: 1, end: 13 };
    if (currentPassage === 2) return { start: 14, end: 26 };
    return { start: 27, end: 40 };
  };

  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const { start, end } = getQuestionRange();

  // Loading Screen
  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="loading-content">
          <div className="spinner"></div>
          <h2 className="loading-title">Your test will begin shortly</h2>
          <p className="loading-subtitle">Please wait...</p>
        </div>
      </div>
    );
  }

  // Start Screen
  if (showStart) {
    return (
      <div className="start-screen">
        <div className="start-content">
          <h1 style={{ fontSize: '2rem', fontWeight: '700', color: '#333', marginBottom: '12px' }}>
            IELTS Reading Test
          </h1>
          {useCustomTest && testData && (
            <div style={{ 
              background: '#e8f4fd', 
              padding: '12px 20px', 
              borderRadius: '8px', 
              marginBottom: '16px',
              border: '2px solid #4a90e2'
            }}>
              <p style={{ margin: 0, color: '#4a90e2', fontWeight: '600', fontSize: '0.95rem' }}>
                <i className="fas fa-check-circle" style={{ marginRight: '8px' }}></i>
                Custom test loaded from Test Builder
              </p>
            </div>
          )}
          <p style={{ fontSize: '1.1rem', color: '#666', marginBottom: '28px' }}>
            Are you ready to begin your reading test?
          </p>
          <button className="start-button" onClick={startTest}>
            Start Test
          </button>
          {useCustomTest && (
            <button 
              className="start-button" 
              onClick={() => {
                setUseCustomTest(false);
                setTestData(null);
              }}
              style={{ 
                background: 'white', 
                color: '#666', 
                border: '2px solid #ddd',
                marginTop: '12px'
              }}
            >
              Use Default Test Instead
            </button>
          )}
        </div>
      </div>
    );
  }

  // Main Test Interface
  return (
    <div className="reading-container">
      <div className="watermark">IELTSwithJurabek</div>

      <div className="container">
        {/* Header */}
        <header className="header">
          <div className="header-left">
            <i className="fas fa-book-reader header-logo"></i>
            <span className="header-title">IELTS Reading Test</span>
          </div>

          <div className={`timer ${seconds <= 120 ? 'warning' : ''}`}>
            <i className="fas fa-clock"></i>
            <span>{String(minutes).padStart(2, '0')}:{String(secs).padStart(2, '0')}</span>
          </div>

          <div className="header-right">
            <button
              className="telegram-btn"
              onClick={() => window.open('https://t.me/spcgroupinternational', '_blank')}
            >
              <i className="fas fa-paper-plane"></i>
              <span>More Materials</span>
            </button>
            <button
              className="icon-btn"
              onClick={() => {
                if (!document.fullscreenElement) {
                  document.documentElement.requestFullscreen().catch(() => {});
                } else {
                  document.exitFullscreen();
                }
              }}
              title="Toggle Fullscreen"
            >
              <i className="fas fa-expand"></i>
            </button>
            <button className="menu-btn" title="Options">
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </header>

        {/* Main Content */}
        <div className="main-content">
          {useCustomTest && testData ? (
            <CustomPassage 
              passage={testData.passages[currentPassage - 1]} 
              userAnswers={userAnswers} 
              onChange={handleAnswerChange} 
            />
          ) : (
            <>
              {currentPassage === 1 && <Passage1 userAnswers={userAnswers} onChange={handleAnswerChange} />}
              {currentPassage === 2 && <Passage2 userAnswers={userAnswers} onChange={handleAnswerChange} />}
              {currentPassage === 3 && <Passage3 userAnswers={userAnswers} onChange={handleAnswerChange} />}
            </>
          )}
        </div>

        {/* Footer */}
        <footer className="footer">
          <div className="footer-content">
            <div className="passage-tabs">
              {[1, 2, 3].map((p) => (
                <button
                  key={p}
                  className={`tab-btn ${currentPassage === p ? 'active' : ''}`}
                  onClick={() => setCurrentPassage(p)}
                >
                  Passage {p}
                </button>
              ))}
            </div>

            <div className="question-numbers">
              {Array.from({ length: end - start + 1 }, (_, i) => start + i).map((num) => (
                <div
                  key={num}
                  className={`question-num ${userAnswers[`q${num}`] ? 'answered' : ''}`}
                  title={`Question ${num}`}
                >
                  {num}
                </div>
              ))}
            </div>

            <div className="footer-buttons">
              <button className="nav-btn" onClick={() => currentPassage > 1 && setCurrentPassage(currentPassage - 1)}>
                Previous
              </button>
              <button className="nav-btn" onClick={() => currentPassage < 3 && setCurrentPassage(currentPassage + 1)}>
                Next
              </button>
              <button className="submit-btn" onClick={handleSubmit}>
                Submit All
              </button>
            </div>
          </div>
        </footer>
      </div>

      {/* Results Modal */}
      {showResults && (
        <div className="modal">
          <div className="modal-content">
            <div style={{ marginBottom: '16px' }}>
              <i className="fas fa-trophy" style={{ fontSize: '3rem', color: '#ffc107' }}></i>
            </div>
            <h2>Test Results</h2>
            <p style={{ color: '#666', marginBottom: '16px', fontSize: '1rem' }}>
              Your IELTS Reading Score
            </p>
            <div className="score-display">{getScore()}/40</div>
            <div className="score-breakdown">
              <div className="score-item">
                <span>Passage 1:</span>
                <span>{getPassageScore(1, 13)}/13</span>
              </div>
              <div className="score-item">
                <span>Passage 2:</span>
                <span>{getPassageScore(14, 26)}/13</span>
              </div>
              <div className="score-item">
                <span>Passage 3:</span>
                <span>{getPassageScore(27, 40)}/14</span>
              </div>
            </div>
            <div className="modal-buttons">
              <button className="btn-close" onClick={() => setShowResults(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Passage 1 Component
const Passage1: React.FC<{ userAnswers: UserAnswers; onChange: (q: string, v: string) => void }> = ({
  userAnswers,
  onChange,
}) => (
  <>
    <div className="passage-section">
      <h2 className="section-title">READING PASSAGE 1</h2>
      <div className="passage-content">
        <p>
          <strong>You should spend about 20 minutes on Questions 1-13, which are based on Reading Passage 1 below.</strong>
        </p>
        <h3>How the first trans-Atlantic telegraph cable was laid</h3>
        <p>
          On August 16, 1858, the first telegraphic message crossed the Atlantic Ocean. Travelling along a recently laid
          cable, the message from Britain's Queen Victoria to US President James Buchanan took just 16 hours. Prior to
          this, communication across the Atlantic would have been by ship - and taken around 10 days.
        </p>
        <p>
          People had been communicating via overland telegraph since 1844 and messages had been passing between Britain
          and France since 1850 when the first submarine cable was laid in the English Channel. But the attempt to span
          the Atlantic Ocean was the most daring attempt yet - and was the talk of the age, the 19th-century equivalent
          of the Apollo space mission. The idea that one could seemingly cheat time and space was inspiring and it
          changed the way people thought about the world and their place in it.
        </p>
        <p>
          The driving force behind the trans-Atlantic telegraph cable was an American businessman called Cyrus Field. In
          1856, he and Englishmen John Watkins Brett and Charles Tilson Bright formed the Atlantic Telegraph company.
          They raised 350,000 pounds mostly from businessmen in London, Liverpool, Manchester and Glasgow. They also
          secured 14,000 pounds annually from the British government plus the loan of ships and a similar amount from
          the US government.
        </p>
        <p>
          Getting the cable made proved to be difficult. The distance between the west coast of Ireland and Newfoundland
          is over 3,700km, and Field was unable to find a company that was capable of supplying the required cable in
          the desired time frame. As a result, two companies were engaged to fulfil the order. The cable had a core of
          seven copper wires down which the signal would pass. These were insulated with several layers of gutta-percha
          (a natural plastic made from tree sap) and then armoured with iron wire. When it was complete, the weight of
          the cable proved too great for any single ship. It was therefore loaded onto two: the British ship, HMS
          Agamemnon and the American ship, USS Niagara.
        </p>
        <p>
          The first attempt to lay the cable began on August 5 1857 with both ships departing from the west coast of
          Ireland, near Ballycarbery Castle. The venture did not go according to plan. The cable snapped on the first
          day, but was recovered from the bottom and repaired. A few days later, mid-Atlantic, the cable snapped again,
          this time in water 3km deep. It was lost and the expedition abandoned.
        </p>
        <p>
          The next summer in 1858 they tried again. On this expedition, the two great ships met mid-Atlantic, each
          carrying half the cable. The two ends were joined together and the ships sailed away from each other. The
          cable broke three times and each time they were forced to start again. On July 29, with little hope of
          success, the cable was joined for the fourth time and the ships sailed for home. This time they succeeded. The
          cable was landed in Newfoundland on August 4 and in Ireland the following day. And a week or so later Queen
          Victoria sent that first trans-Atlantic message to President Buchanan.
        </p>
      </div>
    </div>

    <div className="resizer"></div>

    <div className="questions-section">
      <h2 className="section-title">Questions 1–13</h2>

      <div className="question-group">
        <div className="question-group-title">Questions 1–6</div>
        <p>
          Do the following statements agree with the information given in the text?
        </p>
        <p>
          In boxes 1–6, write <strong>TRUE</strong> if the statement agrees with the information, <strong>FALSE</strong> if the statement
          contradicts the information, or <strong>NOT GIVEN</strong> if there is no information on this.
        </p>

        {[
          {
            q: 1,
            text: 'Field failed to find a company that could produce all of the cable needed by the specified date.',
          },
          { q: 2, text: 'HMS Agamemnon and USS Niagara set sail from different locations on August 5, 1857.' },
          { q: 3, text: 'On the 1858 expedition, the cable broke three times because of a manufacturing fault.' },
          {
            q: 4,
            text: 'The newspaper quoted in the passage disapproved of the enthusiasm that met the 1858 expedition.',
          },
          {
            q: 5,
            text: 'Many articles appeared in the press between 1857 and 1866 about the science behind the telegraph.',
          },
          {
            q: 6,
            text: 'Between 1857 and 1866, people talked about the problems related to the telegraph project on a regular basis.',
          },
        ].map(({ q, text }) => (
          <div key={q} className="question">
            <div className="question-text">
              {q}. {text}
            </div>
            <div className="options">
              {['TRUE', 'FALSE', 'NOT GIVEN'].map((opt) => (
                <label key={opt} className="option-label">
                  <input
                    type="radio"
                    name={`q${q}`}
                    value={opt}
                    checked={userAnswers[`q${q}`] === opt}
                    onChange={(e) => onChange(`q${q}`, e.target.value)}
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="question-group">
        <div className="question-group-title">Questions 7–13</div>
        <p>
          Complete the notes below.
        </p>
        <p>
          Choose <strong>ONE WORD ONLY</strong> from the text for each answer.
        </p>
        <p style={{ marginTop: '16px' }}>
          <strong>The history of the trans-Atlantic telegraph</strong>
        </p>
        <p style={{ marginTop: '12px' }}>
          <strong>The first attempts to lay cable:</strong>
        </p>
        <ul style={{ marginLeft: '20px', lineHeight: '1.9', marginTop: '8px' }}>
          <li>the Atlantic Telegraph company was set up by Field, Brett and Bright in 1856</li>
          <li>
            the central wires of the cable were made of{' '}
            <input
              type="text"
              className="input-field inline-input"
              placeholder="7"
              value={userAnswers.q7 || ''}
              onChange={(e) => onChange('q7', e.target.value)}
            />
          </li>
          <li>
            the cable was put onto two ships due to its{' '}
            <input
              type="text"
              className="input-field inline-input"
              placeholder="8"
              value={userAnswers.q8 || ''}
              onChange={(e) => onChange('q8', e.target.value)}
            />
          </li>
          <li>the 1857 attempt failed</li>
          <li>the cable was successfully laid in 1858</li>
        </ul>
        <p style={{ marginTop: '12px' }}>
          <strong>Events between 1858 and 1866:</strong>
        </p>
        <ul style={{ marginLeft: '20px', lineHeight: '1.9', marginTop: '8px' }}>
          <li>celebrations were brief since problems emerged</li>
          <li>
            further research led to the cable's thickness and{' '}
            <input
              type="text"
              className="input-field inline-input"
              placeholder="9"
              value={userAnswers.q9 || ''}
              onChange={(e) => onChange('q9', e.target.value)}
            />{' '}
            being improved
          </li>
          <li>
            Field set up another company to get the{' '}
            <input
              type="text"
              className="input-field inline-input"
              placeholder="10"
              value={userAnswers.q10 || ''}
              onChange={(e) => onChange('q10', e.target.value)}
            />{' '}
            for another attempt
          </li>
        </ul>
        <p style={{ marginTop: '12px' }}>
          <strong>The changes the trans-Atlantic telegraph brought about:</strong>
        </p>
        <ul style={{ marginLeft: '20px', lineHeight: '1.9', marginTop: '8px' }}>
          <li>
            members of the{' '}
            <input
              type="text"
              className="input-field inline-input"
              placeholder="11"
              value={userAnswers.q11 || ''}
              onChange={(e) => onChange('q11', e.target.value)}
            />{' '}
            could react more quickly to events
          </li>
          <li>
            news could be relayed faster, thus improving{' '}
            <input
              type="text"
              className="input-field inline-input"
              placeholder="12"
              value={userAnswers.q12 || ''}
              onChange={(e) => onChange('q12', e.target.value)}
            />
          </li>
          <li>
            it became easier for US{' '}
            <input
              type="text"
              className="input-field inline-input"
              placeholder="13"
              value={userAnswers.q13 || ''}
              onChange={(e) => onChange('q13', e.target.value)}
            />{' '}
            to maintain contact with their families
          </li>
        </ul>
      </div>
    </div>
  </>
);

// Passage 2 Component (simplified for now)
const Passage2: React.FC<{ userAnswers: UserAnswers; onChange: (q: string, v: string) => void }> = () => (
  <>
    <div className="passage-section">
      <h2 className="section-title">READING PASSAGE 2</h2>
      <div className="passage-content">
        <p>
          <strong>You should spend about 20 minutes on Questions 14-26, which are based on Reading Passage 2.</strong>
        </p>
        <h3>REMOVING UNWANTED NOISE</h3>
        <p>
          A noisy restaurant, a busy road, or a windy day are all situations that can be intensely frustrating for the
          hearing impaired when trying to understand what other people are saying. Some 10 million people in the UK suffer
          from hearing difficulties and, helpful as hearing aids are, those who wear them often complain that background
          noise continues to interfere with their understanding. But what if hearing aid wearers could choose to filter
          out all the troublesome sounds and focus just on the voices they want to hear?
        </p>
        <p style={{ fontStyle: 'italic', color: '#666', marginTop: '20px' }}>
          [Full passage content would continue here...]
        </p>
      </div>
    </div>

    <div className="resizer"></div>

    <div className="questions-section">
      <h2 className="section-title">Questions 14–26</h2>
      <div className="question-group">
        <div className="question-group-title">Questions 14–26</div>
        <p style={{ fontStyle: 'italic', color: '#666' }}>
          [Questions 14-26 would appear here - content simplified for demo]
        </p>
      </div>
    </div>
  </>
);

// Passage 3 Component (simplified for now)
const Passage3: React.FC<{ userAnswers: UserAnswers; onChange: (q: string, v: string) => void }> = () => (
  <>
    <div className="passage-section">
      <h2 className="section-title">READING PASSAGE 3</h2>
      <div className="passage-content">
        <p>
          <strong>You should spend about 20 minutes on Questions 27-40, which are based on Reading Passage 3.</strong>
        </p>
        <h3>The Bug Picture</h3>
        <p>
          <em>Lara Zanarini gives her view on insects</em>
        </p>
        <p>
          How many other species do we share our planet with? The truth is that scientists don't have the slightest
          idea. Some early guesses of 30 million or even 100 million have been replaced in the last few years with more
          reliable ones of somewhere between five to ten million species. But despite this massive uncertainty there is
          one thing which is indisputable: the vast majority of Earth's inhabitants are invertebrate - without a backbone
          - and most of those are insects.
        </p>
        <p style={{ fontStyle: 'italic', color: '#666', marginTop: '20px' }}>
          [Full passage content would continue here...]
        </p>
      </div>
    </div>

    <div className="resizer"></div>

    <div className="questions-section">
      <h2 className="section-title">Questions 27–40</h2>
      <div className="question-group">
        <div className="question-group-title">Questions 27–40</div>
        <p style={{ fontStyle: 'italic', color: '#666' }}>
          [Questions 27-40 would appear here - content simplified for demo]
        </p>
      </div>
    </div>
  </>
);

// Custom Passage Component (from Test Builder)
const CustomPassage: React.FC<{ 
  passage: Passage; 
  userAnswers: UserAnswers; 
  onChange: (q: string, v: string) => void 
}> = ({ passage, userAnswers, onChange }) => {
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [slotValues, setSlotValues] = useState<Record<string, Record<string, string>>>({});

  const handleDragStart = (e: React.DragEvent, optionLabel: string) => {
    setDraggedItem(optionLabel);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDrop = (e: React.DragEvent, questionId: string, slotId: string) => {
    e.preventDefault();
    if (draggedItem) {
      setSlotValues({
        ...slotValues,
        [questionId]: {
          ...(slotValues[questionId] || {}),
          [slotId]: draggedItem,
        },
      });
      // Save to user answers
      onChange(questionId, JSON.stringify({ ...(slotValues[questionId] || {}), [slotId]: draggedItem }));
      setDraggedItem(null);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const renderTextWithSlots = (question: Question) => {
    if (question.type !== 'drag-drop' && question.type !== 'matching-headings') {
      return question.text;
    }

    const parts = question.text.split(/(\[slot:\d+\])/g);
    return parts.map((part, index) => {
      const match = part.match(/\[slot:(\d+)\]/);
      if (match) {
        const slotId = match[1];
        const currentValue = slotValues[question.id]?.[slotId];
        return (
          <span
            key={index}
            className="drop-zone"
            onDrop={(e) => handleDrop(e, question.id, slotId)}
            onDragOver={handleDragOver}
          >
            {currentValue || `[${slotId}]`}
          </span>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <>
      <div className="passage-section">
        <h2 className="section-title">READING PASSAGE</h2>
        <div className="passage-content">
          <h3>{passage.title}</h3>
          <div style={{ whiteSpace: 'pre-wrap' }}>{passage.content}</div>
        </div>
      </div>

      <div className="resizer"></div>

      <div className="questions-section">
        <h2 className="section-title">Questions</h2>

        {passage.questions.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
            <i className="fas fa-question-circle" style={{ fontSize: '3rem', marginBottom: '16px' }}></i>
            <p>No questions available for this passage</p>
          </div>
        ) : (
          passage.questions.map((q) => (
            <div key={q.id} className="question-group">
              <div className="question">
                <div className="question-text">
                  {q.questionNumber}. {renderTextWithSlots(q)}
                </div>

                {/* True/False/Not Given */}
                {q.type === 'true-false-ng' && (
                  <div className="options">
                    {['TRUE', 'FALSE', 'NOT GIVEN'].map((opt) => (
                      <label key={opt} className="option-label">
                        <input
                          type="radio"
                          name={q.id}
                          value={opt}
                          checked={userAnswers[q.id] === opt}
                          onChange={(e) => onChange(q.id, e.target.value)}
                        />
                        <span>{opt}</span>
                      </label>
                    ))}
                  </div>
                )}

                {/* Gap Fill */}
                {q.type === 'gap-fill' && (
                  <input
                    type="text"
                    className="input-field"
                    value={userAnswers[q.id] || ''}
                    onChange={(e) => onChange(q.id, e.target.value)}
                    placeholder="Your answer"
                  />
                )}

                {/* Multiple Choice */}
                {q.type === 'multiple-choice' && (
                  <div className="options">
                    {q.options?.map((opt, index) => (
                      <label key={index} className="option-label">
                        <input
                          type="radio"
                          name={q.id}
                          value={String.fromCharCode(65 + index)}
                          checked={userAnswers[q.id] === String.fromCharCode(65 + index)}
                          onChange={(e) => onChange(q.id, e.target.value)}
                        />
                        <span>
                          {String.fromCharCode(65 + index)}. {opt}
                        </span>
                      </label>
                    ))}
                  </div>
                )}

                {/* Drag & Drop / Matching Headings */}
                {(q.type === 'drag-drop' || q.type === 'matching-headings') && (
                  <div className="draggable-bank" style={{ marginTop: '16px' }}>
                    <h4 style={{ fontSize: '0.95rem', marginBottom: '12px' }}>Options:</h4>
                    <div className="draggable-items" style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                      {q.draggableOptions?.map((opt) => (
                        <div
                          key={opt.id}
                          className="draggable-item"
                          draggable
                          onDragStart={(e) => handleDragStart(e, opt.label)}
                          style={{
                            padding: '8px 14px',
                            background: 'white',
                            border: '2px solid #4a90e2',
                            borderRadius: '8px',
                            cursor: 'grab',
                            fontSize: '0.9rem',
                          }}
                        >
                          <strong style={{ color: '#4a90e2', marginRight: '6px' }}>{opt.label}</strong>
                          {opt.value}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default ReadingPage;
