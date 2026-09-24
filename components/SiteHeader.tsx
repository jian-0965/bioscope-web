"use client";

import { Beaker, BookOpen, BrainCircuit, Compass, Languages, LogIn, Microscope, Route, UserRound, ScanSearch, Bot } from "lucide-react";

export default function SiteHeader({ signedIn }: { signedIn: boolean }) {
  return (
    <header className="site-header">
      <a className="brand" href="/"><span className="brand-mark"><Microscope size={19} /></span><span><b>BioScope</b><small>生命尺度探索器</small></span></a>
      <nav className="site-nav" aria-label="主导航">
        <a href="/atlas"><Compass size={14} /> 生物全景</a><a href="#explorer">尺度探索</a><a href="/labs"><Beaker size={14} /> 实验室</a>
        <a href="/ai"><Bot size={14} /> 学习计划</a><a href="/cells"><ScanSearch size={14} /> 细胞结构</a><a href="/challenges"><BrainCircuit size={14} /> 挑战</a>
        <a href="/glossary"><Languages size={14} /> 词典</a><a href="/paths"><Route size={14} /> 路线</a><a href="#discoveries">发现史</a><a href="#papers"><BookOpen size={14} /> 论文</a>
      </nav>
      <a className="account-link" href={signedIn ? "/dashboard" : "/auth"}>{signedIn ? <UserRound size={16} /> : <LogIn size={16} />}{signedIn ? "我的探索" : "登录"}</a>
    </header>
  );
}
