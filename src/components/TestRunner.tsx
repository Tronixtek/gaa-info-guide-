import { AlertTriangle, ArrowLeft, ArrowRight, CheckCircle2, Clock, RotateCcw, XCircle } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import type { Question, TestType } from "../content/types";
import { formatDuration, scoreAttempt, type AttemptAnswer } from "../lib/scoring";

interface TestRunnerProps {
  testType: TestType;
  questions: Question[];
}

export function TestRunner({ testType, questions }: TestRunnerProps) {
  const [started, setStarted] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<AttemptAnswer[]>(() =>
    questions.map(() => ({ choice: null, secondsSpent: 0 }))
  );
  const [elapsed, setElapsed] = useState(0);

  // Time is attributed to whichever question is on screen, so the pacing report
  // can distinguish a rushed wrong answer from a considered one.
  const questionEnteredAt = useRef<number>(Date.now());
  const headingRef = useRef<HTMLHeadingElement>(null);

  const totalTargetSeconds = useMemo(
    () => questions.reduce((sum, question) => sum + question.targetSeconds, 0),
    [questions]
  );

  useEffect(() => {
    if (!started || submitted) return;
    const timer = window.setInterval(() => setElapsed((value) => value + 1), 1000);
    return () => window.clearInterval(timer);
  }, [started, submitted]);

  // Move focus to the question heading on change so screen-reader and
  // keyboard users are not left at the top of the document after paging.
  useEffect(() => {
    if (started && !submitted) headingRef.current?.focus();
  }, [index, started, submitted]);

  const commitTimeOnCurrent = () => {
    const spent = Math.round((Date.now() - questionEnteredAt.current) / 1000);
    questionEnteredAt.current = Date.now();
    setAnswers((current) =>
      current.map((answer, position) =>
        position === index ? { ...answer, secondsSpent: answer.secondsSpent + spent } : answer
      )
    );
  };

  const goTo = (next: number) => {
    commitTimeOnCurrent();
    setIndex(next);
  };

  const select = (choice: number) => {
    setAnswers((current) =>
      current.map((answer, position) => (position === index ? { ...answer, choice } : answer))
    );
  };

  const submit = () => {
    commitTimeOnCurrent();
    setSubmitted(true);
  };

  const restart = () => {
    setAnswers(questions.map(() => ({ choice: null, secondsSpent: 0 })));
    setIndex(0);
    setElapsed(0);
    setSubmitted(false);
    setStarted(false);
  };

  const start = () => {
    questionEnteredAt.current = Date.now();
    setStarted(true);
  };

  if (questions.length === 0) {
    return (
      <div className="runner-panel">
        <h2>Practice set in development</h2>
        <p>
          The question bank for {testType.name.toLowerCase()} is being written. In the meantime the
          test-type page covers the format, timing, scoring and the mistakes that cost the most marks.
        </p>
        <Link className="button button-secondary" to={`/test-types/${testType.slug}`}>
          Read the {testType.shortName.toLowerCase()} guide
        </Link>
      </div>
    );
  }

  if (!started) {
    return (
      <div className="runner-panel runner-intro">
        <h2>{testType.name} — practice test</h2>
        <dl className="runner-brief">
          <div>
            <dt>Questions</dt>
            <dd>{questions.length}</dd>
          </div>
          <div>
            <dt>Suggested time</dt>
            <dd>{formatDuration(totalTargetSeconds)}</dd>
          </div>
          <div>
            <dt>Marking</dt>
            <dd>No negative marking</dd>
          </div>
        </dl>
        <ul className="runner-rules">
          <li>The timer counts up and is there for pacing — it will not cut you off.</li>
          <li>You can move freely between questions and change any answer before submitting.</li>
          <li>Every question carries a full worked solution, shown after you submit.</li>
          <li>Unanswered questions score zero, so always make an eliminated-down guess.</li>
        </ul>
        <button type="button" className="button button-primary" onClick={start}>
          Start test <ArrowRight size={18} aria-hidden="true" />
        </button>
      </div>
    );
  }

  if (submitted) {
    return <ResultReport testType={testType} questions={questions} answers={answers} onRestart={restart} />;
  }

  const question = questions[index];
  const answered = answers.filter((answer) => answer.choice !== null).length;
  const progress = Math.round(((index + 1) / questions.length) * 100);

  return (
    <div className="runner-panel">
      <div className="runner-bar">
        <p>
          Question <strong>{index + 1}</strong> of {questions.length}
        </p>
        <p className="runner-clock">
          <Clock size={16} aria-hidden="true" />
          <span>{formatDuration(elapsed)}</span>
          <span className="runner-clock-target">of {formatDuration(totalTargetSeconds)} suggested</span>
        </p>
      </div>

      <div
        className="progress-track"
        role="progressbar"
        aria-valuenow={progress}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Test progress"
      >
        <div className="progress-fill" style={{ width: `${progress}%` }} />
      </div>

      {question.stimulus && <pre className="stimulus">{question.stimulus}</pre>}

      <h2 className="runner-stem" ref={headingRef} tabIndex={-1}>
        {question.stem}
      </h2>

      <fieldset className="option-set">
        <legend className="visually-hidden">Select one answer</legend>
        {question.options.map((option, optionIndex) => (
          <label key={option} className={answers[index].choice === optionIndex ? "option is-selected" : "option"}>
            <input
              type="radio"
              name={`question-${question.id}`}
              checked={answers[index].choice === optionIndex}
              onChange={() => select(optionIndex)}
            />
            <span className="option-key" aria-hidden="true">
              {String.fromCharCode(65 + optionIndex)}
            </span>
            <span>{option}</span>
          </label>
        ))}
      </fieldset>

      <div className="runner-actions">
        <button
          type="button"
          className="button button-secondary"
          onClick={() => goTo(index - 1)}
          disabled={index === 0}
        >
          <ArrowLeft size={18} aria-hidden="true" /> Previous
        </button>

        {index < questions.length - 1 ? (
          <button type="button" className="button button-primary" onClick={() => goTo(index + 1)}>
            Next <ArrowRight size={18} aria-hidden="true" />
          </button>
        ) : (
          <button type="button" className="button button-primary" onClick={submit}>
            Submit test
          </button>
        )}
      </div>

      <p className="runner-status" role="status">
        {answered} of {questions.length} answered.
        {answered < questions.length && " Unanswered questions score zero — guess rather than skip."}
      </p>

      {index < questions.length - 1 && (
        <button type="button" className="link-button" onClick={submit}>
          Submit now and see worked solutions
        </button>
      )}
    </div>
  );
}

function ResultReport({
  testType,
  questions,
  answers,
  onRestart
}: {
  testType: TestType;
  questions: Question[];
  answers: AttemptAnswer[];
  onRestart: () => void;
}) {
  const result = useMemo(() => scoreAttempt(questions, answers), [questions, answers]);

  return (
    <div className="result-report">
      <div className="result-headline">
        <p className="eyebrow">{testType.name} — result</p>
        <p className="result-score">
          <strong>{result.correct}</strong>
          <span>/ {result.total}</span>
        </p>
        <p className="result-band">
          {result.percentage}% · indicative band: <strong>{result.percentileBand}</strong>
        </p>
        <p className="result-narrative">{result.bandNarrative}</p>
      </div>

      <div className="result-grid">
        <section className="result-card">
          <h2>Topic breakdown</h2>
          <ul className="topic-list">
            {result.topics.map((topic) => (
              <li key={topic.topic}>
                <span>{topic.topic}</span>
                <strong className={topic.correct === topic.total ? "is-good" : undefined}>
                  {topic.correct}/{topic.total}
                </strong>
              </li>
            ))}
          </ul>
        </section>

        <section className="result-card">
          <h2>Pacing</h2>
          <ul className="topic-list">
            <li>
              <span>Total time</span>
              <strong>{formatDuration(result.totalSeconds)}</strong>
            </li>
            <li>
              <span>Suggested time</span>
              <strong>{formatDuration(result.targetSeconds)}</strong>
            </li>
            <li>
              <span>Average per question</span>
              <strong>{result.averageSeconds}s</strong>
            </li>
            <li>
              <span>Questions attempted</span>
              <strong>
                {result.attempted}/{result.total}
              </strong>
            </li>
          </ul>
          <p className="result-diagnosis">{diagnose(result)}</p>
        </section>
      </div>

      <section className="solutions">
        <h2>Worked solutions</h2>
        <p className="lede">
          The solution matters more than the score. Read every one, including the questions you answered
          correctly — a right answer reached by the wrong route will not survive the next test.
        </p>

        {questions.map((question, questionIndex) => {
          const answer = answers[questionIndex];
          const isCorrect = answer.choice === question.answerIndex;
          return (
            <article key={question.id} className={isCorrect ? "solution is-correct" : "solution is-wrong"}>
              <header>
                {isCorrect ? (
                  <CheckCircle2 size={20} aria-hidden="true" />
                ) : (
                  <XCircle size={20} aria-hidden="true" />
                )}
                <div>
                  <p className="solution-meta">
                    Question {questionIndex + 1} · {question.topic} · {question.difficulty} ·{" "}
                    {answer.secondsSpent}s of {question.targetSeconds}s target
                  </p>
                  <h3>{question.stem}</h3>
                </div>
              </header>

              {question.stimulus && <pre className="stimulus">{question.stimulus}</pre>}

              <p className="solution-answers">
                <span>
                  Your answer:{" "}
                  <strong>{answer.choice === null ? "Not answered" : question.options[answer.choice]}</strong>
                </span>
                <span>
                  Correct answer: <strong>{question.options[question.answerIndex]}</strong>
                </span>
              </p>

              <ol className="solution-steps">
                {question.workedSolution.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
            </article>
          );
        })}
      </section>

      <div className="result-actions">
        <button type="button" className="button button-primary" onClick={onRestart}>
          <RotateCcw size={18} aria-hidden="true" /> Retake this test
        </button>
        <Link className="button button-secondary" to={`/test-types/${testType.slug}`}>
          Read the {testType.shortName.toLowerCase()} guide
        </Link>
        <Link className="button button-secondary" to="/practice">
          Try another test type
        </Link>
      </div>

      <p className="result-footnote">
        <AlertTriangle size={15} aria-hidden="true" /> The band shown is indicative, derived from the
        difficulty weighting of this question set. It is not a norm-referenced score against a live
        candidate pool.
      </p>
    </div>
  );
}

function diagnose(result: ReturnType<typeof scoreAttempt>) {
  if (result.attempted < result.total) {
    return "You left questions unanswered. There is no negative marking here or on most commercial tests, so eliminate down and guess rather than skip.";
  }
  if (result.rushedErrors >= 2) {
    return "Several wrong answers came in well under the target time. That pattern points at misreading the question rather than a knowledge gap — read the question before the data, and read it twice.";
  }
  if (result.overrunCount >= 2 && result.percentage >= 70) {
    return "Accuracy is solid but several questions ran well over target. Work on elimination and estimation so the time is there for the questions you would otherwise not reach.";
  }
  if (result.percentage < 50) {
    return "Start with the worked solutions below rather than more questions. Rebuilding the method untimed is worth far more at this stage than additional volume.";
  }
  return "Pacing and accuracy are broadly in balance. Keep logging errors by cause rather than by topic — that is what makes further practice compound.";
}
