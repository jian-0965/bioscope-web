"use client";

export default function ActionPotentialChart({
  stimulus,
  sodiumOpen,
  potassiumOpen,
}: {
  stimulus: number;
  sodiumOpen: boolean;
  potassiumOpen: boolean;
}) {
  const fires = stimulus >= 50 && sodiumOpen;
  const path = fires
    ? potassiumOpen
      ? "M15 142 C85 142 112 138 142 130 C164 124 172 94 184 48 C192 20 202 18 210 54 C220 100 234 151 260 166 C292 178 326 145 372 142 C410 140 444 142 485 142"
      : "M15 142 C95 142 130 138 158 128 C176 110 183 58 197 28 C211 3 224 18 236 49 C254 91 284 98 322 95 C380 91 430 105 485 112"
    : "M15 142 C90 142 140 141 185 137 C235 133 285 139 335 141 C385 143 435 142 485 142";

  return (
    <div className="ap-chart">
      <div className="chart-header">
        <div>
          <span>膜电位曲线</span>
          <strong>{fires ? "动作电位" : "静息 / 亚阈值"}</strong>
        </div>
        <span className={fires ? "status-chip firing" : "status-chip"}>{fires ? "FIRING" : "RESTING"}</span>
      </div>
      <svg viewBox="0 0 500 190" role="img" aria-label="动作电位曲线示意图">
        <line x1="15" y1="142" x2="485" y2="142" className="axis-line" />
        <line x1="15" y1="106" x2="485" y2="106" className="threshold-line" />
        <text x="20" y="101" className="chart-text">阈值</text>
        <text x="20" y="158" className="chart-text">-70 mV</text>
        <path d={path} className={fires ? "voltage-path active" : "voltage-path"} />
      </svg>
      <div className="chart-legend">
        <span>0 ms</span>
        <span>时间 →</span>
        <span>~5 ms</span>
      </div>
    </div>
  );
}
