"use client";

type NeuronPart = "dendrite" | "soma" | "axon" | "synapse";

export default function NeuronScene({
  selected,
  onSelect,
}: {
  selected: NeuronPart;
  onSelect: (part: NeuronPart) => void;
}) {
  return (
    <div className="neuron-stage">
      <div className="neuron-stage-label">可点击神经元 · Neuron</div>
      <svg className="neuron-svg" viewBox="0 0 760 410" role="img" aria-label="可点击的神经元结构示意图">
        <defs>
          <radialGradient id="somaFill" cx="40%" cy="35%">
            <stop offset="0%" stopColor="#f9ffcc" />
            <stop offset="56%" stopColor="#a9dc75" />
            <stop offset="100%" stopColor="#4f9f69" />
          </radialGradient>
          <linearGradient id="axonFill" x1="0" x2="1">
            <stop offset="0%" stopColor="#4f9f69" />
            <stop offset="100%" stopColor="#76c9a4" />
          </linearGradient>
          <filter id="softGlow">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <g
          className={selected === "dendrite" ? "neuron-part selected" : "neuron-part"}
          onClick={() => onSelect("dendrite")}
          role="button"
          tabIndex={0}
        >
          <path d="M240 195 C190 168 168 112 128 82" />
          <path d="M188 150 C145 142 120 116 88 95" />
          <path d="M150 124 C124 85 112 64 86 44" />
          <path d="M162 140 C125 160 98 165 62 157" />
          <path d="M219 179 C180 205 151 234 123 278" />
          <path d="M165 237 C123 247 97 269 68 302" />
          <path d="M187 217 C164 264 158 292 164 329" />
          <circle cx="85" cy="44" r="7" className="tip" />
          <circle cx="62" cy="157" r="6" className="tip" />
          <circle cx="68" cy="302" r="6" className="tip" />
        </g>

        <g
          className={selected === "soma" ? "neuron-part soma selected" : "neuron-part soma"}
          onClick={() => onSelect("soma")}
          role="button"
          tabIndex={0}
        >
          <path
            d="M208 147 C245 113 302 118 331 151 C357 181 352 236 320 266 C285 299 228 286 202 252 C178 220 178 174 208 147Z"
            fill="url(#somaFill)"
          />
          <ellipse cx="270" cy="204" rx="43" ry="39" className="nucleus" />
          <circle cx="280" cy="193" r="11" className="nucleolus" />
        </g>

        <g
          className={selected === "axon" ? "neuron-part axon selected" : "neuron-part axon"}
          onClick={() => onSelect("axon")}
          role="button"
          tabIndex={0}
        >
          <path d="M326 208 C388 216 433 211 486 215 C532 218 576 214 627 220" className="axon-line" />
          <g className="myelin">
            <rect x="365" y="193" width="58" height="43" rx="22" />
            <rect x="439" y="194" width="58" height="43" rx="22" />
            <rect x="514" y="198" width="58" height="43" rx="22" />
          </g>
          <circle cx="354" cy="211" r="7" className="signal signal-1" />
          <circle cx="430" cy="214" r="6" className="signal signal-2" />
          <circle cx="505" cy="216" r="5" className="signal signal-3" />
        </g>

        <g
          className={selected === "synapse" ? "neuron-part synapse selected" : "neuron-part synapse"}
          onClick={() => onSelect("synapse")}
          role="button"
          tabIndex={0}
        >
          <path d="M627 220 C658 209 678 188 694 164" />
          <path d="M626 220 C661 225 685 240 707 263" />
          <path d="M627 220 C660 217 687 216 719 219" />
          <circle cx="698" cy="160" r="13" className="terminal" />
          <circle cx="712" cy="268" r="13" className="terminal" />
          <circle cx="724" cy="219" r="13" className="terminal" />
          <circle cx="704" cy="158" r="3" className="vesicle" />
          <circle cx="716" cy="264" r="3" className="vesicle" />
          <circle cx="728" cy="216" r="3" className="vesicle" />
        </g>

        <g className="neuron-labels">
          <text x="64" y="352">树突</text>
          <text x="243" y="336">胞体</text>
          <text x="466" y="174">轴突</text>
          <text x="651" y="326">突触末梢</text>
        </g>
      </svg>
      <div className="neuron-hint">点一下结构，右侧知识卡会跟着变化。</div>
    </div>
  );
}
