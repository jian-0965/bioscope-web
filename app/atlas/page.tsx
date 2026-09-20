import Link from "next/link";
import { ArrowLeft, Microscope, Sparkles } from "lucide-react";
import BiologyAtlas from "@/components/BiologyAtlas";
import MascotGuide from "@/components/MascotGuide";

export default function AtlasPage() {
  return (
    <main className="atlas-page">
      <header className="atlas-hero">
        <Link href="/" className="atlas-back"><ArrowLeft size={15} /> 返回首页</Link>
        <span className="eyebrow"><Microscope size={15} /> BioScope Biology Atlas</span>
        <h1>把整个生物学<br />连成一张可以探索的地图</h1>
        <p>从人体、细胞、基因和代谢，一直到微生物、植物、进化与生态。先建立全景，再逐层进入微观机制。</p>
        <div className="atlas-hero-note"><Sparkles size={15} /> 每个专题都包含核心概念、如果……会怎样，以及我们如何知道。</div>
      </header>
      <MascotGuide
        mentor="girl"
        message="如果你还没有明确目标，就先选最感兴趣的领域。人体、细胞、基因、植物、进化都可以成为起点，不需要按课本顺序学习。"
        actionHref="/paths"
        actionLabel="看看推荐学习路线"
      />
      <BiologyAtlas />
    </main>
  );
}
