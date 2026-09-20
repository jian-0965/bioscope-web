import Link from "next/link";
import { ArrowLeft, BrainCircuit } from "lucide-react";
import ChallengeQuiz from "@/components/ChallengeQuiz";
import MascotGuide from "@/components/MascotGuide";

export default function ChallengesPage() {
  return (
    <main className="challenge-page">
      <header className="atlas-hero challenge-hero">
        <Link href="/" className="atlas-back"><ArrowLeft size={15} /> 返回首页</Link>
        <span className="eyebrow"><BrainCircuit size={15} /> BioScope Challenge</span>
        <h1>别只看懂，<br />试着自己解释</h1>
        <p>题目覆盖人体、细胞、遗传、代谢、微生物、植物、进化和生态。每题都会给出机制解释。</p>
      </header>
      <MascotGuide
        mentor="girl"
        message="做错不用急着看分数。先读解释，再试着用自己的话说一遍“为什么”，这才算真的学会。"
        compact
      />
      <ChallengeQuiz />
    </main>
  );
}
