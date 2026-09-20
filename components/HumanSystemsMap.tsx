"use client";

import { useMemo, useState } from "react";
import {
  Activity,
  Bone,
  Brain,
  ChevronRight,
  Droplets,
  HeartPulse,
  ShieldPlus,
  Sparkles,
  Stethoscope,
  Utensils,
  Wind,
} from "lucide-react";

type SystemId =
  | "circulatory"
  | "respiratory"
  | "nervous"
  | "endocrine"
  | "immune"
  | "digestive"
  | "urinary"
  | "musculoskeletal";

type SystemInfo = {
  id: SystemId;
  name: string;
  en: string;
  summary: string;
  nodes: string[];
  accent: string;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number }>;
};

const systems: SystemInfo[] = [
  {
    id: "circulatory",
    name: "循环系统",
    en: "Circulatory system",
    summary: "把氧气、营养物质、激素和代谢废物运送到全身，是人体内部的运输网络。",
    nodes: ["心脏", "血液", "动脉", "静脉", "毛细血管"],
    accent: "rose",
    icon: HeartPulse,
  },
  {
    id: "respiratory",
    name: "呼吸系统",
    en: "Respiratory system",
    summary: "让氧气进入体内并排出二氧化碳，同时与循环系统紧密合作完成气体运输。",
    nodes: ["鼻腔", "气管", "支气管", "肺", "肺泡"],
    accent: "sky",
    icon: Wind,
  },
  {
    id: "nervous",
    name: "神经系统",
    en: "Nervous system",
    summary: "感知环境、处理信息并快速发出指令，是人体的高速信息网络。",
    nodes: ["大脑", "脊髓", "周围神经", "神经元", "突触"],
    accent: "violet",
    icon: Brain,
  },
  {
    id: "endocrine",
    name: "内分泌系统",
    en: "Endocrine system",
    summary: "通过激素进行较慢但持久的调控，参与生长、代谢、应激和体内稳态。",
    nodes: ["下丘脑", "垂体", "甲状腺", "肾上腺", "胰岛"],
    accent: "amber",
    icon: Activity,
  },
  {
    id: "immune",
    name: "免疫系统",
    en: "Immune system",
    summary: "识别并清除病原体和异常细胞，同时形成免疫记忆，保护机体内部环境。",
    nodes: ["淋巴结", "脾脏", "巨噬细胞", "T 细胞", "B 细胞"],
    accent: "emerald",
    icon: ShieldPlus,
  },
  {
    id: "digestive",
    name: "消化系统",
    en: "Digestive system",
    summary: "把食物分解成可吸收的营养物质，并把它们送入血液供全身利用。",
    nodes: ["口腔", "胃", "小肠", "大肠", "肝脏"],
    accent: "orange",
    icon: Utensils,
  },
  {
    id: "urinary",
    name: "泌尿系统",
    en: "Urinary system",
    summary: "过滤血液、排出代谢废物，并参与调节水分、电解质和酸碱平衡。",
    nodes: ["肾脏", "肾单位", "输尿管", "膀胱", "尿道"],
    accent: "blue",
    icon: Droplets,
  },
  {
    id: "musculoskeletal",
    name: "运动系统",
    en: "Musculoskeletal system",
    summary: "骨骼、关节和肌肉共同提供支撑、保护与运动能力。",
    nodes: ["骨骼", "骨骼肌", "关节", "肌腱", "韧带"],
    accent: "lime",
    icon: Bone,
  },
];

export default function HumanSystemsMap({ onOpenNervous }: { onOpenNervous?: () => void }) {
  const [selected, setSelected] = useState<SystemId>("nervous");
  const current = useMemo(
    () => systems.find((system) => system.id === selected) ?? systems[0],
    [selected],
  );
  const Icon = current.icon;

  return (
    <div className="human-systems-shell">
      <div className="human-map-heading">
        <span><Sparkles size={15} /> 人体系统思维导图</span>
        <strong>点击任意系统，查看它由什么组成、负责什么。</strong>
      </div>

      <div className="human-mindmap">
        <div className="mindmap-lines" aria-hidden="true">
          <span className="line l1" />
          <span className="line l2" />
          <span className="line l3" />
          <span className="line l4" />
          <span className="line l5" />
          <span className="line l6" />
          <span className="line l7" />
          <span className="line l8" />
        </div>

        <div className="human-center">
          <div className="human-center-icon"><Stethoscope size={28} /></div>
          <strong>人体系统</strong>
          <span>Human body</span>
        </div>

        {systems.map((system, index) => {
          const SystemIcon = system.icon;
          return (
            <button
              key={system.id}
              className={
                "system-node system-node-" + (index + 1) +
                " accent-" + system.accent +
                (selected === system.id ? " active" : "")
              }
              onClick={() => setSelected(system.id)}
            >
              <span className="system-node-icon"><SystemIcon size={19} /></span>
              <span>
                <b>{system.name}</b>
                <small>{system.en}</small>
              </span>
            </button>
          );
        })}
      </div>

      <div className={"system-detail accent-" + current.accent}>
        <div className="system-detail-icon"><Icon size={28} strokeWidth={1.8} /></div>
        <div className="system-detail-copy">
          <span className="system-detail-kicker">当前系统</span>
          <h3>{current.name}</h3>
          <p>{current.summary}</p>
          <div className="system-subnodes">
            {current.nodes.map((node) => <span key={node}>{node}</span>)}
          </div>
        </div>

        {current.id === "nervous" ? (
          <button className="system-open-button" onClick={onOpenNervous}>
            进入神经系统 <ChevronRight size={16} />
          </button>
        ) : (
          <div className="system-coming-soon">可继续扩展到器官层级</div>
        )}
      </div>
    </div>
  );
}
