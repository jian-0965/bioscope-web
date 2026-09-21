type Mentor = "boy" | "girl";

export default function MascotAvatar({
  mentor,
  className = "",
}: {
  mentor: Mentor;
  className?: string;
}) {
  const girl = mentor === "girl";

  return (
    <svg
      className={className}
      viewBox="0 0 240 280"
      role="img"
      aria-label={girl ? "小芽，BioScope 学习向导" : "小博，BioScope 机制导师"}
    >
      <defs>
        <linearGradient id={girl ? "coat-girl" : "coat-boy"} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#eef8f1" />
        </linearGradient>
        <linearGradient id={girl ? "hoodie-girl" : "hoodie-boy"} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#bfe8b7" />
          <stop offset="1" stopColor="#79bd88" />
        </linearGradient>
        <filter id={girl ? "shadow-girl" : "shadow-boy"} x="-30%" y="-30%" width="160%" height="170%">
          <feDropShadow dx="0" dy="8" stdDeviation="8" floodColor="#35684c" floodOpacity=".16" />
        </filter>
      </defs>

      <ellipse cx="120" cy="258" rx="68" ry="13" fill="#dcefdc" opacity=".8" />

      <g filter={`url(#${girl ? "shadow-girl" : "shadow-boy"})`}>
        <path
          d="M79 151 C63 168 59 213 65 244 C83 255 102 259 120 259 C141 259 162 255 178 244 C180 211 176 172 160 151 Z"
          fill={`url(#${girl ? "coat-girl" : "coat-boy"})`}
          stroke="#70a487"
          strokeWidth="3"
        />
        <path
          d="M91 152 C96 140 105 135 120 135 C136 135 145 141 151 153 L145 217 L94 217 Z"
          fill={`url(#${girl ? "hoodie-girl" : "hoodie-boy"})`}
          stroke="#68a77a"
          strokeWidth="2.5"
        />

        <path d="M78 174 C57 182 47 204 51 224 C55 238 67 239 74 227 L85 190 Z" fill="#f7fbf8" stroke="#70a487" strokeWidth="3"/>
        <path d="M162 174 C183 181 193 203 189 223 C186 237 173 240 166 227 L154 190 Z" fill="#f7fbf8" stroke="#70a487" strokeWidth="3"/>
        <circle cx="56" cy="224" r="10" fill="#ffd9bd" stroke="#e7ad8c" strokeWidth="2"/>
        <circle cx="184" cy="224" r="10" fill="#ffd9bd" stroke="#e7ad8c" strokeWidth="2"/>

        <path d="M95 217 L91 257 L111 258 L119 217 Z" fill="#405852"/>
        <path d="M122 217 L130 258 L150 257 L145 217 Z" fill="#405852"/>
        <path d="M88 256 C88 264 101 267 113 263 L112 255 Z" fill="#ffffff" stroke="#779889" strokeWidth="2"/>
        <path d="M129 255 L128 263 C142 268 154 264 152 256 Z" fill="#ffffff" stroke="#779889" strokeWidth="2"/>

        <path d="M104 139 L105 151 C112 159 129 159 136 151 L136 139 Z" fill="#ffd8bc"/>

        <ellipse cx="120" cy="93" rx="51" ry="54" fill="#ffe2c7" stroke="#dd9b7b" strokeWidth="2.8"/>
        <ellipse cx="72" cy="99" rx="8" ry="12" fill="#ffd8bd" stroke="#dd9b7b" strokeWidth="2"/>
        <ellipse cx="168" cy="99" rx="8" ry="12" fill="#ffd8bd" stroke="#dd9b7b" strokeWidth="2"/>

        {girl ? (
          <>
            <path d="M70 85 C68 47 88 28 120 27 C153 26 176 50 170 88 C160 68 149 56 126 51 C104 56 90 71 80 92 Z" fill="#5a3b2e"/>
            <path d="M72 75 C61 91 64 119 77 136 C86 146 95 149 101 146 C90 137 88 126 91 118 C79 111 77 93 83 79 Z" fill="#684437"/>
            <path d="M168 75 C180 93 176 120 163 136 C155 146 145 150 139 146 C149 137 151 126 149 118 C161 109 163 91 157 78 Z" fill="#684437"/>
            <path d="M149 42 C137 37 126 38 116 42 C129 44 139 49 146 57 Z" fill="#8b5d47" opacity=".8"/>
            <rect x="147" y="59" width="15" height="4" rx="2" fill="#f3d88f" transform="rotate(-20 147 59)"/>
            <rect x="149" y="65" width="13" height="4" rx="2" fill="#f3d88f" transform="rotate(-20 149 65)"/>
          </>
        ) : (
          <>
            <path d="M69 88 C66 48 88 24 121 24 C155 24 177 49 171 90 C160 71 151 60 134 54 C124 49 115 48 102 53 C90 58 81 70 75 93 Z" fill="#5a3b2e"/>
            <path d="M82 55 C91 35 109 29 130 31 C112 35 104 43 98 58 Z" fill="#8b5d47" opacity=".75"/>
            <path d="M101 31 C107 22 118 20 130 22 C122 26 117 31 115 38 Z" fill="#5a3b2e"/>
          </>
        )}

        <ellipse cx="99" cy="94" rx="8.2" ry="10" fill="#513329"/>
        <ellipse cx="141" cy="94" rx="8.2" ry="10" fill="#513329"/>
        <circle cx="102" cy="91" r="2.5" fill="#ffffff"/>
        <circle cx="144" cy="91" r="2.5" fill="#ffffff"/>
        <path d="M110 114 C116 119 125 119 131 114" fill="none" stroke="#d87d70" strokeWidth="2.4" strokeLinecap="round"/>
        <ellipse cx="88" cy="111" rx="10" ry="5" fill="#f5a596" opacity=".33"/>
        <ellipse cx="152" cy="111" rx="10" ry="5" fill="#f5a596" opacity=".33"/>

        <path d="M104 164 L120 176 L136 164" fill="none" stroke="#ffffff" strokeWidth="3" strokeLinecap="round"/>
        <path d="M119 175 L119 215" stroke="#5b9a71" strokeWidth="2"/>
        <circle cx="119" cy="190" r="2" fill="#5b9a71"/>

        <rect x="143" y="176" width="22" height="20" rx="3" fill="#ffffff" stroke="#70a487" strokeWidth="2"/>
        <path d="M148 181 H160" stroke="#70a487" strokeWidth="2"/>
      </g>

      <g opacity=".9">
        <circle cx="38" cy="57" r="13" fill="#e7f7e3" stroke="#8bc58f"/>
        <path d="M31 58 C35 51 43 51 47 58 C43 65 35 65 31 58Z" fill="#94cf72"/>
        <path d="M201 49 C207 41 214 41 219 48 C214 57 207 58 201 49Z" fill="#9bd36f"/>
        <circle cx="202" cy="159" r="4" fill="#f4d66d"/>
        <circle cx="28" cy="171" r="3" fill="#85c5b0"/>
      </g>
    </svg>
  );
}
