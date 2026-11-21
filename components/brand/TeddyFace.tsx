type TeddyFaceProps = {
  className?: string;
  /** full = basket coords (300×240) · head = tight crop for hero peek */
  crop?: "full" | "head";
};

/**
 * Same head art as the footer basket buddy — shared so hero peek
 * and footer stay visually identical.
 */
export function TeddyFace({ className, crop = "full" }: TeddyFaceProps) {
  const viewBox = crop === "head" ? "158 38 108 108" : "0 0 300 240";

  return (
    <svg
      viewBox={viewBox}
      className={className}
      aria-hidden
      focusable="false"
      overflow="visible"
    >
      <g className="teddy-face__head footer-buddy__head">
        {/* collar */}
        <path
          d="M178 146 Q212 162 246 146 L246 154 Q212 170 178 154 Z"
          fill="#a24a1a"
          stroke="#2a170e"
          strokeWidth="3"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        <path
          d="M212 160 C212 156 206 155 206 159.4 C206 163 212 166.6 212 168.4 C212 166.6 218 163 218 159.4 C218 155 212 156 212 160 Z"
          fill="#fbe3b4"
          stroke="#2a170e"
          strokeWidth="2.4"
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {/* ears */}
        <path
          d="M177.1 78.7Q186.9 70.8 186.6 87.4Q196.0 89.9 189.9 105.5Q195.2 117.3 185.5 126.0Q184.7 142.8 175.2 141.2Q168.7 156.5 162.9 145.3Q153.1 153.2 153.4 136.6Q144.0 134.1 150.1 118.5Q144.8 106.7 154.5 98.0Q155.3 81.2 164.8 82.8Q171.3 67.5 177.1 78.7Z"
          fill="#e4a352"
          stroke="#2a170e"
          strokeWidth="3.4"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        <path
          d="M246.9 78.7Q252.7 67.5 259.2 82.8Q268.7 81.2 269.5 98.0Q279.2 106.7 273.9 118.5Q280.0 134.1 270.6 136.6Q270.9 153.2 261.1 145.3Q255.3 156.5 248.8 141.2Q239.3 142.8 238.5 126.0Q228.8 117.3 234.1 105.5Q228.0 89.9 237.4 87.4Q237.1 70.8 246.9 78.7Z"
          fill="#e4a352"
          stroke="#2a170e"
          strokeWidth="3.4"
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {/* fluffy head */}
        <path
          d="M212.0 54.0Q223.4 48.2 231.5 57.5Q244.5 56.1 248.1 67.5Q260.7 70.7 259.1 82.4Q269.4 89.7 263.0 100.0Q269.4 110.3 259.1 117.6Q260.7 129.3 248.1 132.5Q244.5 143.9 231.5 142.5Q223.4 151.8 212.0 146.0Q200.6 151.8 192.5 142.5Q179.5 143.9 175.9 132.5Q163.3 129.3 164.9 117.6Q154.6 110.3 161.0 100.0Q154.6 89.7 164.9 82.4Q163.3 70.7 175.9 67.5Q179.5 56.1 192.5 57.5Q200.6 48.2 212.0 54.0Z"
          fill="#f2be6b"
          stroke="#2a170e"
          strokeWidth="3.4"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        <path
          d="M195.0 52.0Q190.7 45.8 200.0 43.5Q203.2 36.9 212.0 40.0Q220.8 36.9 224.0 43.5Q233.3 45.8 229.0 52.0Q233.3 58.2 224.0 60.5Q220.8 67.1 212.0 64.0Q203.2 67.1 200.0 60.5Q190.7 58.2 195.0 52.0Z"
          fill="#f2be6b"
          stroke="#2a170e"
          strokeWidth="3"
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {/* muzzle + blush */}
        <path
          d="M188 120 C188 106 200 100 212 100 C224 100 236 106 236 120 C236 133 225 140 212 140 C199 140 188 133 188 120 Z"
          fill="#fbe3b4"
        />
        <circle cx="181" cy="116" r="7" fill="#f9b9a6" opacity="0.85" />
        <circle cx="243" cy="116" r="7" fill="#f9b9a6" opacity="0.85" />

        {/* open shiny eyes (footer hover swaps to shut) */}
        <g className="teddy-face__eyes-open footer-buddy__eyes-open">
          <ellipse cx="194" cy="98" rx="7.4" ry="8.6" fill="#2a170e" />
          <ellipse cx="230" cy="98" rx="7.4" ry="8.6" fill="#2a170e" />
          <circle cx="196.6" cy="94.6" r="2.7" fill="#fff" />
          <circle cx="232.6" cy="94.6" r="2.7" fill="#fff" />
          <circle cx="192" cy="101.2" r="1.2" fill="#fff" />
          <circle cx="228" cy="101.2" r="1.2" fill="#fff" />
        </g>
        <g className="teddy-face__eyes-shut footer-buddy__eyes-shut">
          <path
            d="M186.5 97 Q194 103.5 201.5 97 M222.5 97 Q230 103.5 237.5 97"
            stroke="#2a170e"
            strokeWidth="3.4"
            strokeLinejoin="round"
            strokeLinecap="round"
            fill="none"
          />
        </g>

        {/* nose + smile */}
        <path
          d="M204.5 111.5 Q212 107.2 219.5 111.5 Q218.2 118.4 212 120 Q205.8 118.4 204.5 111.5 Z"
          fill="#2a170e"
        />
        <path
          d="M212 120 V124.5 M212 124.5 Q207.2 129.6 202.8 125.2 M212 124.5 Q216.8 129.6 221.2 125.2"
          stroke="#2a170e"
          strokeWidth="3"
          strokeLinejoin="round"
          strokeLinecap="round"
          fill="none"
        />
      </g>
    </svg>
  );
}
