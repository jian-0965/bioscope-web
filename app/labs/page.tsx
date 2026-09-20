import Link from "next/link";
import { ArrowLeft, Beaker } from "lucide-react";
import BiologyLabs from "@/components/BiologyLabs";
import MascotGuide from "@/components/MascotGuide";

export default function LabsPage() {
  return (
    <main className="labs-page">
      <header className="atlas-hero labs-hero">
        <Link href="/" className="atlas-back"><ArrowLeft size={15} /> 返回首页</Link>
        <span className="eyebrow"><Beaker size={15} /> BioScope Labs</span>
        <h1>不是背答案，<br />而是亲手改变变量</h1>
        <p>这里的模拟是教学模型，用于理解趋势与因果，不代替真实实验数据。</p>
      </header>
      <MascotGuide
        mentor="boy"
        message="实验前先预测结果，然后一次只改变一个变量。最后再解释你看到的变化，这比直接记结论更有用。"
        compact
      />
      <BiologyLabs />
    </main>
  );
}
