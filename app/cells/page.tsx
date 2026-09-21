import Link from "next/link";
import { ArrowLeft, Microscope, Sparkles } from "lucide-react";
import CellStructureExplorer from "@/components/CellStructureExplorer";

export default function CellsPage(){
  return (
    <main className="cells-page">
      <header className="cells-hero">
        <Link href="/atlas" className="atlas-back"><ArrowLeft size={15}/> 生物学全景</Link>
        <span className="topic-card-label"><Microscope size={16}/> 细胞与细胞器可视化库</span>
        <h1>点开结构，看见细胞怎么工作</h1>
        <p>动物细胞、植物细胞、细菌、神经元、免疫细胞、线粒体和叶绿体都可以直接点击结构查看名称和作用。</p>
      </header>

      <section className="cells-page-section">
        <div className="cells-section-title"><Sparkles size={18}/><div><strong>典型细胞</strong><span>从整体结构理解不同细胞的功能分工。</span></div></div>
        <CellStructureExplorer category="cell" initialId="animal-cell"/>
      </section>

      <section className="cells-page-section">
        <div className="cells-section-title"><Sparkles size={18}/><div><strong>免疫细胞</strong><span>认识免疫反应中的主要细胞角色。</span></div></div>
        <CellStructureExplorer category="immune" initialId="macrophage"/>
      </section>

      <section className="cells-page-section">
        <div className="cells-section-title"><Sparkles size={18}/><div><strong>细胞器</strong><span>继续进入线粒体和叶绿体内部。</span></div></div>
        <CellStructureExplorer category="organelle" initialId="mitochondrion"/>
      </section>
    </main>
  );
}
