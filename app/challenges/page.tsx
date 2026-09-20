import Link from "next/link";
import { ArrowLeft, BrainCircuit } from "lucide-react";
import ChallengeQuiz from "@/components/ChallengeQuiz";

export default function ChallengesPage() {
  return (
    <main className="challenge-page">
      <header className="atlas-hero challenge-hero">
        <Link href="/" className="atlas-back"><ArrowLeft size={15} /> 返回首页</Link>
        <span className="eyebrow"><BrainCircuit size={15} /> BioScope Challenge</span>
        <h1>别只看懂，<br />试着自己解释</h1>
        <p>题目覆盖人体、细胞、遗传、代谢、微生物、植物、进化和生态。每题都会给出机制解释。</p>
      </header>
      <ChallengeQuiz />
    </main>
  );
}
