"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, RotateCcw, XCircle } from "lucide-react";
import { challengeQuestions } from "@/data/challenges";

export default function ChallengeQuiz() {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const current = challengeQuestions[index];
  const progress = useMemo(
    () => Math.round(((finished ? challengeQuestions.length : index) / challengeQuestions.length) * 100),
    [finished, index],
  );

  function choose(optionIndex: number) {
    if (selected !== null) return;
    setSelected(optionIndex);
    if (optionIndex === current.answer) setScore((value) => value + 1);
  }

  function next() {
    if (index >= challengeQuestions.length - 1) {
      setFinished(true);
      return;
    }
    setIndex((value) => value + 1);
    setSelected(null);
  }

  function reset() {
    setIndex(0);
    setSelected(null);
    setScore(0);
    setFinished(false);
  }

  if (finished) {
    return (
      <section className="challenge-finish">
        <span>挑战完成</span>
        <strong>{score} / {challengeQuestions.length}</strong>
        <p>重点不是分数，而是能不能解释“为什么”。错题可以重新做一遍。</p>
        <button onClick={reset}><RotateCcw size={16} /> 再挑战一次</button>
      </section>
    );
  }

  return (
    <section className="challenge-card">
      <div className="challenge-progress"><span style={{ width: progress + "%" }} /></div>
      <div className="challenge-meta">
        <span>{current.domain}</span>
        <span>{index + 1} / {challengeQuestions.length}</span>
      </div>
      <h2>{current.question}</h2>

      <div className="challenge-options">
        {current.options.map((option, optionIndex) => {
          const chosen = selected === optionIndex;
          const correct = selected !== null && optionIndex === current.answer;
          const wrong = chosen && optionIndex !== current.answer;
          return (
            <button
              key={option}
              className={correct ? "correct" : wrong ? "wrong" : ""}
              onClick={() => choose(optionIndex)}
            >
              <span>{String.fromCharCode(65 + optionIndex)}</span>
              {option}
              {correct && <CheckCircle2 size={17} />}
              {wrong && <XCircle size={17} />}
            </button>
          );
        })}
      </div>

      {selected !== null && (
        <div className="challenge-explanation">
          <strong>{selected === current.answer ? "答对了" : "这里需要再想一下"}</strong>
          <p>{current.explanation}</p>
          <button onClick={next}>{index === challengeQuestions.length - 1 ? "查看结果" : "下一题 →"}</button>
        </div>
      )}
    </section>
  );
}
