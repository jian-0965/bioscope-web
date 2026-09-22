import { useId } from "react";

type Mentor = "boy" | "girl";

/** Shared vector artwork stays crisp in both guide cards and small chat portraits. */
export default function MascotAvatar({
  mentor,
  className = "",
  portrait = false,
}: {
  mentor: Mentor;
  className?: string;
  portrait?: boolean;
}) {
  const girl = mentor === "girl";
  const id = useId().replace(/:/g, "");
  const ref = (name: string) => `url(#${id}-${name})`;
  const ink = girl ? "#49372f" : "#253d40";
  const accent = girl ? "#67ad51" : "#36a5a3";

  return (
    <svg
      className={`bioscope-mascot ${className}`}
      viewBox={portrait ? "42 18 156 156" : "0 0 240 280"}
      role="img"
      aria-label={girl ? "小芽，戴嫩芽发饰的学习向导" : "小博，拿着烧瓶的机制导师"}
      focusable="false"
    >
      <defs>
        <linearGradient id={`${id}-skin`} x1="0" y1="0" x2="0.7" y2="1">
          <stop stopColor="#fff0d9" /><stop offset="1" stopColor="#ffd3b7" />
        </linearGradient>
        <linearGradient id={`${id}-hair`} x1="0" y1="0" x2="1" y2="1">
          <stop stopColor={girl ? "#805344" : "#496367"} />
          <stop offset="1" stopColor={ink} />
        </linearGradient>
        <linearGradient id={`${id}-coat`} x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#ffffff" /><stop offset="1" stopColor="#dceee8" />
        </linearGradient>
        <linearGradient id={`${id}-accent`} x1="0" y1="0" x2="1" y2="1">
          <stop stopColor={girl ? "#bce57e" : "#9ce2d7"} /><stop offset="1" stopColor={accent} />
        </linearGradient>
      </defs>

      {!portrait && <ellipse cx="120" cy="265" rx="49" ry="7" fill="#245843" opacity=".10" />}
      <g strokeLinecap="round" strokeLinejoin="round">
        {/* Compact two-and-a-half-head silhouette, with distinct hair shapes. */}
        {girl && <path d="M61 87Q48 134 64 164Q79 177 97 158H154Q180 173 182 141L178 79Z" fill={ref("hair")} />}
        <path d="M94 224L91 249Q101 256 113 249L120 224M122 224L129 249Q140 256 150 249L146 224" fill={girl ? "#547c5c" : "#355a60"} stroke={ink} strokeWidth="2.5" />
        <path d="M91 247Q78 253 83 261Q95 267 114 260L113 249M130 249L128 260Q148 267 159 260Q161 252 148 247" fill="#fffefa" stroke={ink} strokeWidth="2.5" />
        <path d="M88 258H108M134 258H153" stroke="#b8cec4" strokeWidth="3" />
        <path d="M92 153Q120 145 148 153L157 230Q120 246 82 229Z" fill={ref("accent")} stroke={ink} strokeWidth="2.5" />
        <path d="M100 151L83 159Q71 183 77 234L108 238L116 174ZM140 151L157 159Q169 184 162 234L131 238L123 174Z" fill={ref("coat")} stroke={ink} strokeWidth="2.5" />
        <path d="M99 153L94 172L105 178L99 188L113 180M141 153L147 172L136 178L141 188L127 180" fill="#f8fffc" stroke="#afcec0" strokeWidth="2" />
        <path d="M108 145V157Q120 169 132 157V145" fill={ref("skin")} stroke="#d5a186" strokeWidth="2" />
        <path d="M122 178V228" stroke={accent} strokeWidth="2" />
        <circle cx="122" cy="194" r="2" fill="#fff" /><circle cx="122" cy="207" r="2" fill="#fff" />
        <path d="M140 200H155V213Q148 220 140 213Z" fill="#eef8f0" stroke="#93b9a7" strokeWidth="2" />
        <path d="M146 198V189" stroke={accent} strokeWidth="3" />

        {/* One friendly wave for Xiaoya; Xiaobo holds a small lab flask. */}
        <path d={girl ? "M84 163Q65 163 57 145L44 153Q47 186 77 195" : "M83 164Q63 163 51 185L63 199Q71 185 80 187"} fill={ref("coat")} stroke={ink} strokeWidth="2.5" />
        {girl ? (
          <path d="M45 155Q36 149 37 140L34 131Q34 125 39 128L43 136L41 120Q43 114 47 120L50 133L52 118Q55 113 58 119L57 135L62 127Q67 124 68 130L63 145Q60 154 55 157Z" fill={ref("skin")} stroke="#bd8c70" strokeWidth="2" />
        ) : (
          <>
            <path d="M42 174V155H57V174L69 194Q73 204 63 207H36Q26 204 30 195Z" fill="#e5faf2" stroke="#3c817a" strokeWidth="2.5" />
            <path d="M38 184H61L66 195Q70 202 61 202H38Q31 202 35 195Z" fill={ref("accent")} />
            <path d="M40 155H59" stroke="#3c817a" strokeWidth="4" />
            <circle cx="48" cy="193" r="3" fill="#e7fff4" /><circle cx="53" cy="179" r="2" fill={accent} />
            <path d="M62 187Q70 185 69 193L65 201Q59 205 55 201Q53 197 57 194Z" fill={ref("skin")} stroke="#bd8c70" strokeWidth="2" />
          </>
        )}
        <path d="M155 163Q178 170 179 201L166 205L155 185" fill={ref("coat")} stroke={ink} strokeWidth="2.5" />
        {girl && <g transform="rotate(12 168 215)"><rect x="150" y="194" width="32" height="43" rx="5" fill="#648d52" stroke={ink} strokeWidth="2" /><path d="M157 197V232" stroke="#cce5ab" strokeWidth="2" /><path d="M163 209Q178 203 175 217Q165 220 163 209Z" fill="#d3edaa" /><path d="M166 219L173 212" stroke="#648d52" strokeWidth="1.5" /></g>}
        <path d="M168 200Q183 197 183 206Q182 216 173 216Q163 214 168 200Z" fill={ref("skin")} stroke="#bd8c70" strokeWidth="2" />

        {/* Larger face and lower eyes read clearly at chat-button size. */}
        <ellipse cx="65" cy="107" rx="9" ry="12" fill={ref("skin")} stroke="#bd8c70" strokeWidth="2" />
        <ellipse cx="175" cy="107" rx="9" ry="12" fill={ref("skin")} stroke="#bd8c70" strokeWidth="2" />
        <path d="M64 80Q65 36 119 35Q175 35 177 80L175 114Q173 151 120 158Q68 153 65 117Z" fill={ref("skin")} stroke={ink} strokeWidth="2.5" />
        {girl ? (
          <>
            <path d="M62 106Q48 67 68 43Q91 17 128 27Q170 23 182 64Q187 86 177 111L165 99L159 65Q141 84 119 83L128 63Q110 83 89 89L97 70Q82 90 73 92L73 112Z" fill={ref("hair")} stroke={ink} strokeWidth="2.5" />
            <path d="M73 60Q85 39 111 38M140 39Q158 41 169 58" fill="none" stroke="#a8755d" strokeWidth="5" opacity=".55" />
            <path d="M158 52Q139 44 146 28Q165 30 165 46Q173 26 190 33Q189 51 168 52" fill={ref("accent")} stroke="#427943" strokeWidth="2" />
            <circle cx="164" cy="53" r="5" fill="#f5d47c" stroke="#9f8142" strokeWidth="1.5" />
          </>
        ) : (
          <>
            <path d="M62 104Q49 71 68 44L64 35L83 36Q96 19 126 23L142 17L140 28Q172 31 182 62Q189 83 178 110L168 99L163 69Q145 82 121 79L132 60Q109 82 87 80L95 64L75 88L73 109Z" fill={ref("hair")} stroke={ink} strokeWidth="2.5" />
            <path d="M76 55Q92 34 118 35M145 40Q161 46 166 58" fill="none" stroke="#769493" strokeWidth="5" opacity=".5" />
          </>
        )}
        <path d="M88 98Q96 94 102 98M137 98Q145 94 152 98" fill="none" stroke={ink} strokeWidth="2.5" />
        <g className="mascot-eyes">
          <ellipse cx="97" cy="113" rx="6.5" ry="9" fill={ink} /><ellipse cx="144" cy="113" rx="6.5" ry="9" fill={ink} />
          <circle cx="99" cy="110" r="2.3" fill="#fff" /><circle cx="146" cy="110" r="2.3" fill="#fff" />
          {girl && <path d="M89 107L86 104M151 107L154 104" stroke={ink} strokeWidth="2" />}
        </g>
        <ellipse cx="81" cy="127" rx="10" ry="5.5" fill="#ed9c8c" opacity=".5" /><ellipse cx="159" cy="127" rx="10" ry="5.5" fill="#ed9c8c" opacity=".5" />
        <path d="M112 130Q120 134 129 130Q127 140 121 140Q114 140 112 130Z" fill="#a75c52" stroke="#a75c52" strokeWidth="1.5" />
        <path d="M116 138Q121 134 126 138" fill="#f3a59c" />
        <path d="M119 121Q116 125 122 125" fill="none" stroke="#dbab8b" strokeWidth="1.5" />
      </g>
    </svg>
  );
}
