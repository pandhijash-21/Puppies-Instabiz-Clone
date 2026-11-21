"use client";

import { TeddyFace } from "@/components/brand/TeddyFace";

/**
 * Layered like puppy.instabizweb.com:
 * back rim → puppy head → front basket → paws on the rim.
 * Head sways gently; eyes close while hovered / focused.
 */
export function FooterBasketBuddy() {
  return (
    <div
      className="tp-basket footer-buddy"
      role="img"
      aria-label="Teddy sitting in a basket — hover to close eyes"
      tabIndex={0}
    >
      {/* —— Basket back (hollow + rear rim) —— */}
      <svg aria-hidden viewBox="0 0 300 240" className="tp-basket__back">
        <ellipse cx="212" cy="145" rx="96" ry="12" className="tp-basket__hollow" />
        <path d="M116 145 A96 12 0 0 1 308 145" className="tp-basket__rim-line" />
        <path d="M116 145 A96 12 0 0 1 308 145" className="tp-basket__rim" />
      </svg>

      {/* —— Puppy head (between back and front) —— */}
      <div
        id="footer-basket-stop"
        className="tp-basket__pup pup-stop"
        data-pup-stop="true"
        data-pose="sit"
        data-facing="right"
        aria-hidden
      >
        <TeddyFace className="footer-buddy__svg" crop="full" />
      </div>

      {/* —— Basket front (covers lower head/collar, under paws) —— */}
      <svg aria-hidden viewBox="0 0 300 240" className="tp-basket__front">
        <path
          d="M116 145 C118 180 126 214 138 232 L286 232 C298 214 306 180 308 145 A96 12 0 0 1 116 145 Z"
          className="tp-basket__body"
        />
        <path
          d="M121 178 Q212 197 303 178 M127 206 Q212 223 297 206"
          className="tp-basket__weave"
        />
        <path
          d="M150 164 L158 230 M182 168 L185 232 M212 169 V232 M242 168 L239 232 M274 164 L266 230"
          className="tp-basket__weave tp-basket__weave--stakes"
        />
        <path d="M116 145 A96 12 0 0 0 308 145" className="tp-basket__rim-line" />
        <path d="M116 145 A96 12 0 0 0 308 145" className="tp-basket__rim" />
      </svg>

      {/* —— Paws on top of the rim —— */}
      <svg aria-hidden viewBox="0 0 300 240" className="tp-basket__paws">
        <path
          d="M175 159 C175 148 181 142 190 142 C199 142 205 148 205 159 Z M219 159 C219 148 225 142 234 142 C243 142 249 148 249 159 Z"
          fill="#f2be6b"
          stroke="#2a170e"
          strokeWidth="3.4"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        <path
          d="M186 153 v-4.5 M194 153 v-4.5 M230 153 v-4.5 M238 153 v-4.5"
          stroke="#2a170e"
          strokeWidth="2.4"
          strokeLinejoin="round"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
    </div>
  );
}
