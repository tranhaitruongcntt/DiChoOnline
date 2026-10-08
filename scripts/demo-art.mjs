// Ảnh minh hoạ DEMO cho dữ liệu mẫu (vẽ bằng SVG). Thay bằng ảnh thật qua trang quản trị.
const S = 800;

const BG = {
  "rau-cu": ["#f1f8e9", "#c5e1a5"],
  "trai-cay": ["#fff8e1", "#ffcc80"],
  "thit-tuoi": ["#fff1f0", "#f8bbd0"],
  "hai-san": ["#e3f2fd", "#90caf9"],
  "trung-sua": ["#fffde7", "#ffe082"],
  "do-kho-gia-vi": ["#fbf3e6", "#e0c39a"],
};

const wrap = (cat, body, { board = false, plate = false } = {}) => {
  const [a, b] = BG[cat];
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${S} ${S}" width="${S}" height="${S}">
<defs>
  <radialGradient id="bg" cx="50%" cy="38%" r="75%"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></radialGradient>
  <radialGradient id="shadow" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#000" stop-opacity=".28"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>
  <linearGradient id="wood" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d7a86e"/><stop offset="1" stop-color="#b07d48"/></linearGradient>
  <radialGradient id="shine" cx="35%" cy="30%" r="60%"><stop offset="0" stop-color="#fff" stop-opacity=".75"/><stop offset=".35" stop-color="#fff" stop-opacity=".15"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
</defs>
<rect width="${S}" height="${S}" fill="url(#bg)"/>
<circle cx="680" cy="120" r="160" fill="#fff" opacity=".25"/>
<circle cx="90" cy="720" r="200" fill="#fff" opacity=".18"/>
${board ? `<ellipse cx="400" cy="640" rx="330" ry="46" fill="url(#shadow)"/>
<rect x="90" y="470" width="620" height="170" rx="34" fill="url(#wood)"/>
<rect x="90" y="470" width="620" height="22" rx="11" fill="#e8c08f" opacity=".7"/>
<path d="M140 540 h420 M180 590 h470 M120 620 h260" stroke="#a06d3a" stroke-width="4" stroke-linecap="round" opacity=".35"/>` : ""}
${plate ? `<ellipse cx="400" cy="610" rx="320" ry="60" fill="url(#shadow)"/>
<ellipse cx="400" cy="560" rx="300" ry="90" fill="#fafafa"/><ellipse cx="400" cy="552" rx="250" ry="66" fill="#eeeeee"/>` : ""}
${!board && !plate ? `<ellipse cx="400" cy="650" rx="290" ry="44" fill="url(#shadow)"/>` : ""}
${body}
</svg>`;
};

// ---------- helpers ----------
const g = (id, c1, c2, x1 = 0, y1 = 0, x2 = 0, y2 = 1) =>
  `<linearGradient id="${id}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient>`;
const rg = (id, c1, c2) => `<radialGradient id="${id}" cx="38%" cy="32%" r="70%"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></radialGradient>`;
const defs = (...x) => `<defs>${x.join("")}</defs>`;
const leaf = (x, y, rot, len = 90, w = 34, fill = "#43a047", vein = "#2e7d32") =>
  `<g transform="translate(${x} ${y}) rotate(${rot})"><path d="M0 0 C ${w} ${-len * 0.3}, ${w} ${-len * 0.75}, 0 ${-len} C ${-w} ${-len * 0.75}, ${-w} ${-len * 0.3}, 0 0Z" fill="${fill}"/><path d="M0 -4 V ${-len + 10}" stroke="${vein}" stroke-width="3" stroke-linecap="round"/></g>`;
const ball = (cx, cy, r, grad, shineOp = 1) =>
  `<circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#${grad})"/><circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#shine)" opacity="${shineOp}"/>`;
const label = (x, y, w, h, bg, text, color = "#fff", size = 30) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="10" fill="${bg}"/><text x="${x + w / 2}" y="${y + h / 2 + size * 0.36}" font-family="Arial, Helvetica, sans-serif" font-weight="700" font-size="${size}" fill="${color}" text-anchor="middle">${text}</text>`;

// ---------- art ----------
export const ART = {
  // RAU CỦ
  "rau-muong-huu-co": () => wrap("rau-cu", defs(g("stem", "#9ccc65", "#689f38")) + (() => {
    let s = "";
    for (let i = 0; i < 13; i++) {
      const x = 300 + i * 16, top = 150 + (i % 4) * 25, sway = (i - 6) * 9;
      s += `<path d="M${x} 640 C ${x} 480, ${x + sway} 330, ${x + sway * 1.6} ${top}" stroke="url(#stem)" stroke-width="12" fill="none" stroke-linecap="round"/>`;
      s += leaf(x + sway * 1.4, top + 40, -25 + sway, 110, 22, i % 2 ? "#4caf50" : "#388e3c");
      s += leaf(x + sway * 1.1, top + 150, 30 + sway, 95, 20, i % 2 ? "#66bb6a" : "#43a047");
    }
    return s + `<rect x="285" y="470" width="230" height="40" rx="12" fill="#8d6e63"/><rect x="285" y="470" width="230" height="12" rx="6" fill="#a1887f"/>`;
  })()),

  "ca-chua-bi-da-lat": () => wrap("rau-cu", defs(rg("tom", "#ff7961", "#c62828"), g("bowl", "#ffffff", "#d7ccc8")) +
    `<path d="M150 470 Q400 720 650 470 Z" fill="url(#bowl)"/>` +
    [[260, 440], [340, 410], [430, 400], [520, 420], [300, 360], [390, 340], [480, 350], [560, 470], [440, 455], [345, 470], [230, 480]]
      .map(([x, y]) => ball(x, y, 52, "tom") + `<path d="M${x - 16} ${y - 48} l16 10 l16 -10 l-6 18 l-10 -4 l-10 4z" fill="#2e7d32"/>`).join("") +
    `<ellipse cx="400" cy="472" rx="252" ry="30" fill="none" stroke="#bcaaa4" stroke-width="6"/><path d="M150 470 Q400 720 650 470" fill="none" stroke="#bcaaa4" stroke-width="6"/>`),

  "ca-rot-da-lat": () => wrap("rau-cu", defs(g("car", "#ffa726", "#ef6c00", 0, 0, 1, 0)) +
    [[-28, 360], [0, 400], [28, 440]].map(([rot, x]) => `<g transform="rotate(${rot} ${x} 420)">
      ${leaf(x - 20, 230, -25, 120, 22, "#43a047")}${leaf(x, 230, 0, 140, 22, "#388e3c")}${leaf(x + 20, 230, 25, 120, 22, "#4caf50")}
      <path d="M${x - 46} 240 Q${x} 220 ${x + 46} 240 L${x + 6} 640 Q${x} 652 ${x - 6} 640 Z" fill="url(#car)"/>
      <path d="M${x - 30} 300 h22 M${x + 10} 360 h24 M${x - 26} 420 h20 M${x + 6} 480 h18 M${x - 14} 540 h14" stroke="#e65100" stroke-width="5" stroke-linecap="round" opacity=".6"/>
    </g>`).join("")),

  "bong-cai-xanh": () => wrap("rau-cu", defs(rg("bro", "#7cb342", "#33691e"), g("brs", "#c5e1a5", "#8bc34a")) +
    `<path d="M360 640 L340 450 L460 450 L440 640 Z" fill="url(#brs)"/><path d="M380 520 L300 420 M420 520 L500 420 M400 500 L400 400" stroke="#9ccc65" stroke-width="34" stroke-linecap="round"/>` +
    [[250, 380, 85], [350, 320, 100], [470, 330, 95], [550, 400, 80], [300, 440, 70], [500, 450, 70], [400, 410, 90], [420, 250, 75]]
      .map(([x, y, r]) => ball(x, y, r, "bro", 0.5) + Array.from({ length: 6 }, (_, k) => `<circle cx="${x + Math.cos(k) * r * 0.5}" cy="${y + Math.sin(k * 1.7) * r * 0.5}" r="${r * 0.18}" fill="#558b2f" opacity=".55"/>`).join("")).join("")),

  "khoai-lang-mat": () => wrap("rau-cu", defs(rg("kl", "#ad5a6a", "#6d2c3b"), g("kli", "#ffb74d", "#f57c00")) +
    `<g transform="rotate(-18 330 470)"><ellipse cx="330" cy="470" rx="190" ry="78" fill="url(#kl)"/><ellipse cx="330" cy="470" rx="190" ry="78" fill="url(#shine)" opacity=".5"/>
      <path d="M200 450 q20 8 40 0 M300 520 q20 8 40 0 M400 440 q20 8 40 0" stroke="#4e1f2a" stroke-width="4" fill="none" stroke-linecap="round"/></g>
     <g transform="rotate(14 500 520)"><ellipse cx="500" cy="530" rx="170" ry="70" fill="url(#kl)"/><path d="M640 500 Q720 530 640 560 Z" fill="url(#kli)"/>
      <ellipse cx="640" cy="530" rx="22" ry="62" fill="url(#kli)"/><ellipse cx="640" cy="530" rx="22" ry="62" fill="url(#shine)"/></g>`),

  "dua-leo-baby": () => wrap("rau-cu", defs(g("cu", "#7cb342", "#2e7d32")) +
    [[-24, 310, 300], [-8, 400, 330], [10, 490, 300]].map(([rot, x, len]) => `<g transform="rotate(${rot} ${x} 450)">
      <rect x="${x - 42}" y="${450 - len / 2}" width="84" height="${len}" rx="42" fill="url(#cu)"/>
      <rect x="${x - 22}" y="${460 - len / 2}" width="16" height="${len - 30}" rx="8" fill="#c5e1a5" opacity=".55"/>
      ${Array.from({ length: 7 }, (_, k) => `<circle cx="${x + (k % 2 ? 18 : -2)}" cy="${450 - len / 2 + 30 + k * (len - 60) / 6}" r="4" fill="#1b5e20" opacity=".6"/>`).join("")}
      <rect x="${x - 8}" y="${430 - len / 2}" width="16" height="26" rx="6" fill="#33691e"/></g>`).join("")),

  // TRÁI CÂY
  "xoai-cat-hoa-loc": () => wrap("trai-cay", defs(rg("mg", "#ffe082", "#f9a825"), rg("mg2", "#fff176", "#fbc02d")) +
    `<g transform="rotate(-25 310 450)"><path d="M310 260 C 450 260 470 470 380 590 C 300 690 160 620 170 470 C 180 340 230 260 310 260 Z" fill="url(#mg)"/><path d="M310 260 C 450 260 470 470 380 590 C 300 690 160 620 170 470 C 180 340 230 260 310 260 Z" fill="url(#shine)"/></g>
     <g transform="rotate(30 510 470)"><path d="M510 280 C 640 290 660 480 580 590 C 510 680 380 620 390 480 C 400 360 440 280 510 280 Z" fill="url(#mg2)"/><path d="M510 280 C 640 290 660 480 580 590 C 510 680 380 620 390 480 C 400 360 440 280 510 280 Z" fill="url(#shine)"/></g>
     <path d="M395 250 q10 -40 30 -60" stroke="#6d4c41" stroke-width="10" fill="none" stroke-linecap="round"/>${leaf(425, 195, 60, 150, 42, "#388e3c")}`),

  "buoi-da-xanh": () => wrap("trai-cay", defs(rg("bu", "#aed581", "#558b2f"), rg("bup", "#ff8a80", "#e57373")) +
    `${ball(310, 410, 190, "bu", 0.8)}<path d="M300 225 q8 -30 26 -40" stroke="#5d4037" stroke-width="10" fill="none" stroke-linecap="round"/>${leaf(330, 190, 55, 110, 32, "#2e7d32")}
     <circle cx="540" cy="500" r="150" fill="#c5e1a5"/><circle cx="540" cy="500" r="130" fill="#fff8e1"/><circle cx="540" cy="500" r="118" fill="url(#bup)"/>
     ${Array.from({ length: 12 }, (_, k) => `<path d="M540 500 L${540 + Math.cos((k * Math.PI) / 6) * 118} ${500 + Math.sin((k * Math.PI) / 6) * 118}" stroke="#fff3e0" stroke-width="6"/>`).join("")}
     <circle cx="540" cy="500" r="16" fill="#fff3e0"/>`),

  "dua-hau-long-an": () => wrap("trai-cay", defs(rg("wm", "#66bb6a", "#1b5e20"), rg("wr", "#ff5252", "#d32f2f")) +
    `<ellipse cx="300" cy="460" rx="210" ry="170" fill="url(#wm)"/>${Array.from({ length: 7 }, (_, k) => `<path d="M${130 + k * 55} 330 q-20 130 0 260" stroke="#1b5e20" stroke-width="16" fill="none" opacity=".7"/>`).join("")}
     <ellipse cx="300" cy="460" rx="210" ry="170" fill="url(#shine)" opacity=".6"/>
     <path d="M420 600 L660 600 L540 300 Z" fill="#2e7d32"/><path d="M432 588 L648 588 L540 318 Z" fill="#f1f8e9"/><path d="M448 576 L632 576 L540 340 Z" fill="url(#wr)"/>
     ${[[520, 450], [560, 470], [540, 510], [500, 530], [580, 540], [540, 410]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="7" ry="11" fill="#212121"/>`).join("")}`),

  "chuoi-gia-nam": () => wrap("trai-cay", defs(g("ba", "#fff176", "#fbc02d", 0, 0, 1, 1)) +
    `<path d="M380 200 q10 30 20 60" stroke="#6d4c41" stroke-width="22" stroke-linecap="round"/>` +
    [-38, -18, 2, 22, 42].map((rot, i) => `<g transform="rotate(${rot} 400 260)"><path d="M392 262 C 330 360 330 520 420 610 C 440 625 455 615 445 595 C 385 520 395 380 418 268 Z" fill="url(#ba)" stroke="#f9a825" stroke-width="4"/>
      <path d="M420 610 l14 10" stroke="#5d4037" stroke-width="10" stroke-linecap="round"/><path d="M400 300 C 365 400 368 500 420 580" stroke="#fff9c4" stroke-width="8" fill="none" opacity=".7"/></g>`).join("")),

  "nho-xanh-ninh-thuan": () => wrap("trai-cay", defs(rg("gr", "#dcedc8", "#7cb342")) +
    `<path d="M400 170 q0 40 0 70" stroke="#6d4c41" stroke-width="14" stroke-linecap="round"/>${leaf(420, 200, 65, 140, 50, "#558b2f")}` +
    [[330, 270], [400, 260], [470, 270], [295, 340], [365, 335], [435, 335], [505, 340], [320, 410], [390, 405], [460, 410], [345, 480], [415, 478], [485, 470], [375, 550], [445, 548], [410, 615]]
      .map(([x, y]) => ball(x, y, 46, "gr")).join("")),

  "tao-envy-new-zealand": () => wrap("trai-cay", defs(rg("ap", "#ff6e6e", "#b71c1c"), rg("ap2", "#ff8a65", "#c62828")) +
    [[270, 470, 130, "ap"], [530, 470, 130, "ap2"], [400, 380, 135, "ap"]].map(([x, y, r, gid]) =>
      `<path d="M${x} ${y - r * 0.75} C ${x + r * 1.25} ${y - r * 1.15}, ${x + r * 1.15} ${y + r * 0.95}, ${x} ${y + r * 0.85} C ${x - r * 1.15} ${y + r * 0.95}, ${x - r * 1.25} ${y - r * 1.15}, ${x} ${y - r * 0.75} Z" fill="url(#${gid})"/>
       <path d="M${x} ${y - r * 0.75} C ${x + r * 1.25} ${y - r * 1.15}, ${x + r * 1.15} ${y + r * 0.95}, ${x} ${y + r * 0.85} C ${x - r * 1.15} ${y + r * 0.95}, ${x - r * 1.25} ${y - r * 1.15}, ${x} ${y - r * 0.75} Z" fill="url(#shine)"/>
       <path d="M${x} ${y - r * 0.72} q4 -40 18 -56" stroke="#5d4037" stroke-width="9" fill="none" stroke-linecap="round"/>`).join("") + leaf(420, 250, 60, 100, 30, "#43a047")),

  // THỊT
  "ba-roi-heo": () => wrap("thit-tuoi", defs(g("fat", "#fff8f0", "#f5e1d3"), g("lean", "#f06292", "#c2185b")) +
    [[150, 0], [370, 1]].map(([x, i]) => `<g transform="translate(${x} ${i ? 330 : 360})">
      <rect width="290" height="150" rx="18" fill="#ffccbc"/>
      <rect y="0" width="290" height="22" rx="10" fill="#ffe0b2"/>
      <rect y="22" width="290" height="30" fill="url(#fat)"/><rect y="52" width="290" height="34" fill="url(#lean)"/>
      <rect y="86" width="290" height="22" fill="url(#fat)"/><rect y="108" width="290" height="42" rx="0" fill="url(#lean)"/>
      <path d="M20 70 q60 -10 120 4 t130 -2 M10 125 q80 10 150 -6 t120 4" stroke="#f8bbd0" stroke-width="5" fill="none" opacity=".8"/>
      <rect width="290" height="150" rx="18" fill="none" stroke="#e57373" stroke-width="4" opacity=".4"/></g>`).join(""), { board: true }),

  "thit-bo-uc": () => wrap("thit-tuoi", defs(rg("beef", "#e53935", "#8e1b1b")) +
    `<path d="M170 420 C 170 320 330 290 420 320 C 540 280 650 340 630 440 C 620 540 500 560 400 545 C 290 560 170 520 170 420 Z" fill="#fff3e0"/>
     <path d="M190 420 C 190 335 330 310 420 338 C 535 300 630 355 612 440 C 600 525 495 540 400 528 C 295 540 190 505 190 420 Z" fill="url(#beef)"/>
     <path d="M250 380 q40 30 90 10 t110 20 M230 450 q70 -20 140 10 t160 -10 M300 500 q50 -20 110 0 M420 380 q30 40 80 30" stroke="#ffcdd2" stroke-width="7" fill="none" stroke-linecap="round" opacity=".85"/>
     <path d="M190 420 C 190 335 330 310 420 338 C 535 300 630 355 612 440" fill="none" stroke="#fff" stroke-width="10" opacity=".25"/>
     ${leaf(600, 330, 70, 70, 20, "#558b2f")}${leaf(615, 345, 100, 60, 18, "#689f38")}
     <circle cx="230" cy="545" r="9" fill="#424242"/><circle cx="255" cy="555" r="7" fill="#424242"/><circle cx="560" cy="540" r="8" fill="#424242"/>`, { board: true }),

  "ga-ta-tha-vuon": () => wrap("thit-tuoi", defs(rg("ck", "#ffe8c7", "#eab676")) +
    [[300, 470, -30], [500, 470, 30], [400, 430, 0]].map(([x, y, rot]) => `<g transform="rotate(${rot} ${x} ${y})">
      <path d="M${x} ${y - 150} C ${x + 95} ${y - 150}, ${x + 100} ${y - 20}, ${x + 30} ${y + 40} L${x + 16} ${y + 110} L${x - 16} ${y + 110} L${x - 30} ${y + 40} C ${x - 100} ${y - 20}, ${x - 95} ${y - 150}, ${x} ${y - 150} Z" fill="url(#ck)" stroke="#d99a55" stroke-width="4"/>
      <path d="M${x - 40} ${y - 100} q30 -25 70 -10" stroke="#fff" stroke-width="12" fill="none" stroke-linecap="round" opacity=".55"/>
      <rect x="${x - 13}" y="${y + 100}" width="26" height="60" rx="10" fill="#fffaf0" stroke="#e8dcc8" stroke-width="3"/>
      <circle cx="${x - 16}" cy="${y + 165}" r="18" fill="#fffaf0" stroke="#e8dcc8" stroke-width="3"/><circle cx="${x + 16}" cy="${y + 165}" r="18" fill="#fffaf0" stroke="#e8dcc8" stroke-width="3"/>
    </g>`).join("") + `${leaf(210, 560, -70, 70, 22, "#7cb342")}${leaf(600, 565, 70, 70, 22, "#689f38")}`, { plate: true }),

  "suon-non-heo": () => wrap("thit-tuoi", defs(g("rib", "#e57373", "#b71c1c")) +
    `${[230, 310, 390, 470, 550].map((x) => `<rect x="${x - 15}" y="300" width="30" height="330" rx="15" fill="#fffdf7" stroke="#e8dcc8" stroke-width="4"/>`).join("")}
     <path d="M190 370 Q400 330 610 370 L600 570 Q400 600 200 570 Z" fill="url(#rib)"/>
     <path d="M190 370 Q400 330 610 370 L606 400 Q400 362 194 400 Z" fill="#ffccbc" opacity=".9"/>
     ${[270, 350, 430, 510].map((x) => `<path d="M${x} 400 v150" stroke="#8e1b1b" stroke-width="6" stroke-linecap="round" opacity=".45"/>`).join("")}
     ${[230, 310, 390, 470, 550].map((x) => `<ellipse cx="${x}" cy="580" rx="13" ry="8" fill="#fffdf7" opacity=".9"/><ellipse cx="${x}" cy="380" rx="13" ry="8" fill="#fffdf7" opacity=".9"/>`).join("")}
     <path d="M220 420 Q400 390 590 420" stroke="#fff" stroke-width="8" fill="none" opacity=".25"/>`, { board: true }),

  // HẢI SẢN
  "tom-su-song": () => wrap("hai-san", defs(g("sh", "#ff8a65", "#d84315")) +
    [[260, 400, -10], [470, 360, 15], [380, 520, 0]].map(([x, y, rot]) => `<g transform="translate(${x} ${y}) rotate(${rot})">
      ${[0, 1, 2, 3, 4, 5].map((k) => `<ellipse cx="${Math.cos(-0.4 + k * 0.5) * 80}" cy="${Math.sin(-0.4 + k * 0.5) * 70}" rx="${44 - k * 4}" ry="${36 - k * 3}" fill="url(#sh)" stroke="#bf360c" stroke-width="3"/>`).join("")}
      <path d="M${Math.cos(2.6) * 80} ${Math.sin(2.6) * 70} l-40 30 l20 -45 z" fill="#e64a19"/>
      <ellipse cx="${Math.cos(-0.4) * 80 + 20}" cy="${Math.sin(-0.4) * 70 - 10}" rx="40" ry="30" fill="#ff7043"/>
      <circle cx="${Math.cos(-0.4) * 80 + 34}" cy="${Math.sin(-0.4) * 70 - 22}" r="7" fill="#212121"/>
      <path d="M${Math.cos(-0.4) * 80 + 50} ${Math.sin(-0.4) * 70 - 20} q90 -70 160 -40 M${Math.cos(-0.4) * 80 + 50} ${Math.sin(-0.4) * 70 - 14} q100 -40 150 10" stroke="#d84315" stroke-width="4" fill="none"/>
      <path d="M0 40 l-10 30 M30 45 l0 30 M-30 30 l-20 25" stroke="#e64a19" stroke-width="5" stroke-linecap="round"/></g>`).join("") +
    `${leaf(170, 560, -70, 70, 20, "#43a047")}<circle cx="600" cy="560" r="34" fill="#cddc39"/><circle cx="600" cy="560" r="26" fill="#f0f4c3"/>
     ${Array.from({ length: 8 }, (_, k) => `<path d="M600 560 L${600 + Math.cos((k * Math.PI) / 4) * 26} ${560 + Math.sin((k * Math.PI) / 4) * 26}" stroke="#cddc39" stroke-width="3"/>`).join("")}`),

  "ca-hoi-na-uy": () => wrap("hai-san", defs(g("sal", "#ff8a65", "#f4511e", 0, 0, 1, 1)) +
    `<path d="M160 470 C 200 380 500 360 640 420 C 660 470 650 540 620 560 C 460 590 230 580 170 550 C 150 530 150 500 160 470 Z" fill="url(#sal)"/>
     ${[230, 290, 350, 410, 470, 530, 590].map((x) => `<path d="M${x} ${400 + (x - 400) * 0.02} q-30 80 10 160" stroke="#ffe0b2" stroke-width="9" fill="none" opacity=".8"/>`).join("")}
     <path d="M170 550 C 230 580 460 590 620 560 L615 575 C 460 605 230 595 168 565 Z" fill="#78909c"/>
     <path d="M200 440 C 300 400 480 395 610 430" stroke="#fff" stroke-width="10" fill="none" opacity=".3"/>
     <circle cx="600" cy="360" r="38" fill="#fff59d"/><circle cx="600" cy="360" r="30" fill="#fffde7"/>
     ${Array.from({ length: 8 }, (_, k) => `<path d="M600 360 L${600 + Math.cos((k * Math.PI) / 4) * 30} ${360 + Math.sin((k * Math.PI) / 4) * 30}" stroke="#fff176" stroke-width="3"/>`).join("")}
     ${leaf(190, 420, -60, 70, 18, "#558b2f")}${leaf(205, 410, -30, 60, 16, "#7cb342")}`, { board: true }),

  "muc-ong-phan-thiet": () => wrap("hai-san", defs(g("sq", "#fff3e0", "#ffccbc", 0, 0, 1, 0), g("sqs", "#f8bbd0", "#e1bee7")) +
    [[300, -8], [500, 10]].map(([x, rot]) => `<g transform="rotate(${rot} ${x} 420)">
      <path d="M${x - 70} 260 L${x} 190 L${x + 70} 260 Z" fill="url(#sqs)"/>
      <path d="M${x - 62} 250 Q${x} 220 ${x + 62} 250 L${x + 55} 480 Q${x} 500 ${x - 55} 480 Z" fill="url(#sq)"/>
      ${Array.from({ length: 10 }, (_, k) => `<circle cx="${x - 40 + (k % 4) * 26}" cy="${280 + Math.floor(k / 4) * 60 + (k % 2) * 20}" r="7" fill="#ce93d8" opacity=".6"/>`).join("")}
      <circle cx="${x - 26}" cy="470" r="12" fill="#37474f"/><circle cx="${x + 26}" cy="470" r="12" fill="#37474f"/>
      ${[-45, -28, -12, 4, 20, 36].map((dx, k) => `<path d="M${x + dx} 488 q${k % 2 ? 18 : -18} 60 ${k % 2 ? -6 : 6} 130" stroke="#f8bbd0" stroke-width="12" fill="none" stroke-linecap="round"/>`).join("")}
    </g>`).join("")),

  "ngheu-lua": () => wrap("hai-san", defs(g("cl", "#efebe9", "#a1887f"), g("cl2", "#fff8e1", "#bcaaa4")) +
    [[280, 470, -15, "cl"], [420, 430, 5, "cl2"], [540, 490, 20, "cl"], [350, 560, 0, "cl2"], [480, 580, -10, "cl"], [230, 580, 10, "cl2"], [590, 600, -5, "cl2"]]
      .map(([x, y, rot, gid]) => `<g transform="translate(${x} ${y}) rotate(${rot})">
        <path d="M-80 20 C -80 -50 80 -50 80 20 Q0 40 -80 20 Z" fill="url(#${gid})" stroke="#8d6e63" stroke-width="3"/>
        ${[-50, -25, 0, 25, 50].map((dx) => `<path d="M0 26 L${dx} -26" stroke="#8d6e63" stroke-width="3" opacity=".45"/>`).join("")}
        <path d="M-60 0 Q0 -22 60 0 M-70 12 Q0 -6 70 12" stroke="#6d4c41" stroke-width="3" fill="none" opacity=".5"/></g>`).join("")),

  // TRỨNG SỮA
  "trung-ga-ta": () => wrap("trung-sua", defs(rg("egg", "#fff3e0", "#d7a86e"), g("box", "#cfd8dc", "#90a4ae")) +
    `<path d="M140 470 L660 470 L620 620 L180 620 Z" fill="url(#box)"/>
     ${[220, 310, 400, 490, 580].map((x) => `<ellipse cx="${x}" cy="470" rx="40" ry="16" fill="#78909c"/>`).join("")}` +
    [220, 310, 400, 490, 580].map((x, i) => `<ellipse cx="${x}" cy="${410 - (i % 2) * 8}" rx="48" ry="64" fill="url(#egg)"/><ellipse cx="${x - 14}" cy="${385 - (i % 2) * 8}" rx="12" ry="20" fill="#fff" opacity=".6"/>`).join("") +
    `<path d="M140 470 L660 470" stroke="#b0bec5" stroke-width="8"/><rect x="300" y="530" width="200" height="50" rx="10" fill="#fff" opacity=".85"/>
     <path d="M330 555 h140" stroke="#90a4ae" stroke-width="8" stroke-linecap="round"/>`),

  "sua-tuoi-thanh-trung": () => wrap("trung-sua", defs(g("gl", "#ffffff", "#eceff1", 0, 0, 1, 0)) +
    `<path d="M330 200 h140 v60 q60 40 60 120 v230 q0 30 -30 30 h-200 q-30 0 -30 -30 v-230 q0 -80 60 -120 z" fill="url(#gl)" stroke="#cfd8dc" stroke-width="6"/>
     <rect x="320" y="170" width="160" height="44" rx="12" fill="#1e88e5"/><rect x="320" y="170" width="160" height="14" rx="7" fill="#64b5f6"/>
     <rect x="270" y="420" width="260" height="140" rx="14" fill="#1e88e5"/>
     <text x="400" y="480" font-family="Arial, Helvetica, sans-serif" font-size="46" font-weight="700" fill="#fff" text-anchor="middle">MILK</text>
     <text x="400" y="525" font-family="Arial, Helvetica, sans-serif" font-size="26" fill="#bbdefb" text-anchor="middle">1 LÍT</text>
     <path d="M300 300 v300" stroke="#fff" stroke-width="14" stroke-linecap="round" opacity=".8"/>
     <path d="M560 560 q40 -10 70 20 q-30 30 -70 10 z" fill="#fff"/><ellipse cx="610" cy="600" rx="60" ry="14" fill="#fff" opacity=".9"/>`),

  "sua-chua-nep-cam": () => wrap("trung-sua", defs(g("jar", "#ffffff", "#e0e0e0", 0, 0, 1, 0), g("nep", "#7b1fa2", "#4a148c")) +
    [[240, 1], [400, 0], [560, 1]].map(([x, low]) => { const y = low ? 380 : 340; return `
      <path d="M${x - 75} ${y} h150 l-12 ${260 - (y - 340)} q0 14 -14 14 h-98 q-14 0 -14 -14 z" fill="url(#jar)" stroke="#bdbdbd" stroke-width="4"/>
      <path d="M${x - 70} ${y + 10} h140 l-4 60 h-132 z" fill="url(#nep)"/>
      ${Array.from({ length: 6 }, (_, k) => `<ellipse cx="${x - 50 + k * 20}" cy="${y + 30 + (k % 2) * 12}" rx="7" ry="4" fill="#ce93d8"/>`).join("")}
      <path d="M${x - 66} ${y + 70} h132 l-10 ${180 - (y - 340)} h-112 z" fill="#fffde7"/>
      <rect x="${x - 82}" y="${y - 24}" width="164" height="30" rx="8" fill="#8e24aa"/>
      <path d="M${x - 55} ${y + 100} v120" stroke="#fff" stroke-width="10" stroke-linecap="round" opacity=".8"/>`; }).join("")),

  // ĐỒ KHÔ
  "gao-st25": () => wrap("do-kho-gia-vi", defs(g("sack", "#fff8e1", "#d7ccc8", 0, 0, 1, 0), rg("rice", "#ffffff", "#eeeeee")) +
    `<path d="M200 230 q100 -30 200 0 q20 30 20 60 l30 300 q0 30 -30 30 h-240 q-30 0 -30 -30 l30 -300 q0 -30 20 -60 z" fill="url(#sack)" stroke="#bcaaa4" stroke-width="5"/>
     <path d="M215 270 q85 -24 170 0" stroke="#8d6e63" stroke-width="10" fill="none"/>
     <rect x="200" y="360" width="200" height="150" rx="14" fill="#2e7d32"/>
     <text x="300" y="430" font-family="Arial, Helvetica, sans-serif" font-size="52" font-weight="700" fill="#fff" text-anchor="middle">ST25</text>
     <text x="300" y="475" font-family="Arial, Helvetica, sans-serif" font-size="24" fill="#c8e6c9" text-anchor="middle">GẠO THƠM</text>
     <path d="M440 540 q130 120 260 0 z" fill="#5d4037"/><path d="M440 540 q130 120 260 0" fill="none" stroke="#3e2723" stroke-width="6"/>
     <ellipse cx="570" cy="530" rx="134" ry="40" fill="url(#rice)"/><path d="M450 530 q120 -90 240 0 z" fill="url(#rice)"/>
     ${Array.from({ length: 18 }, (_, k) => `<ellipse cx="${480 + (k * 37) % 180}" cy="${470 + (k * 23) % 60}" rx="8" ry="4" transform="rotate(${k * 40} ${480 + (k * 37) % 180} ${470 + (k * 23) % 60})" fill="#e0e0e0"/>`).join("")}
     ${leaf(660, 470, 40, 80, 20, "#7cb342")}`),

  "nuoc-mam-phu-quoc": () => wrap("do-kho-gia-vi", defs(g("fs", "#bf6f1d", "#6d3a0a", 0, 0, 1, 0)) +
    `<path d="M370 150 h60 v80 q70 40 70 120 v270 q0 26 -26 26 h-148 q-26 0 -26 -26 v-270 q0 -80 70 -120 z" fill="url(#fs)"/>
     <rect x="362" y="130" width="76" height="40" rx="8" fill="#c62828"/>
     <rect x="320" y="400" width="160" height="150" rx="12" fill="#fff8e1"/><rect x="320" y="400" width="160" height="34" rx="12" fill="#c62828"/>
     <text x="400" y="424" font-family="Arial, Helvetica, sans-serif" font-size="20" font-weight="700" fill="#fff" text-anchor="middle">PHÚ QUỐC</text>
     <text x="400" y="488" font-family="Arial, Helvetica, sans-serif" font-size="40" font-weight="700" fill="#6d3a0a" text-anchor="middle">40°N</text>
     <text x="400" y="526" font-family="Arial, Helvetica, sans-serif" font-size="20" fill="#8d6e63" text-anchor="middle">NƯỚC MẮM</text>
     <path d="M330 300 v260" stroke="#fff" stroke-width="12" stroke-linecap="round" opacity=".3"/>
     <path d="M520 600 q60 -60 120 0 z" fill="#fafafa"/><ellipse cx="580" cy="600" rx="62" ry="16" fill="#e0e0e0"/><ellipse cx="580" cy="598" rx="48" ry="10" fill="#a1581a"/>
     <circle cx="200" cy="590" r="20" fill="#e53935"/><path d="M200 570 q10 -20 0 -30" stroke="#43a047" stroke-width="6" fill="none"/>`),

  "dau-me-nguyen-chat": () => wrap("do-kho-gia-vi", defs(g("oil", "#ffd54f", "#e6a100", 0, 0, 1, 0)) +
    `<path d="M375 170 h50 v90 q60 30 60 100 v240 q0 26 -26 26 h-118 q-26 0 -26 -26 v-240 q0 -70 60 -100 z" fill="url(#oil)" stroke="#c79100" stroke-width="4"/>
     <rect x="366" y="140" width="68" height="44" rx="8" fill="#5d4037"/>
     <rect x="330" y="420" width="140" height="130" rx="12" fill="#3e2723"/>
     <text x="400" y="480" font-family="Arial, Helvetica, sans-serif" font-size="30" font-weight="700" fill="#ffe082" text-anchor="middle">DẦU MÈ</text>
     <text x="400" y="520" font-family="Arial, Helvetica, sans-serif" font-size="18" fill="#d7ccc8" text-anchor="middle">ÉP LẠNH</text>
     <path d="M340 320 v240" stroke="#fff" stroke-width="12" stroke-linecap="round" opacity=".45"/>
     <ellipse cx="590" cy="600" rx="90" ry="22" fill="#8d6e63"/><ellipse cx="590" cy="592" rx="78" ry="16" fill="#efebe9"/>
     ${Array.from({ length: 22 }, (_, k) => `<ellipse cx="${530 + (k * 29) % 120}" cy="${585 + (k * 7) % 16}" rx="6" ry="3.5" transform="rotate(${k * 33} ${530 + (k * 29) % 120} ${585 + (k * 7) % 16})" fill="${k % 3 ? "#f5f0e6" : "#3e2723"}"/>`).join("")}
     ${Array.from({ length: 10 }, (_, k) => `<ellipse cx="${180 + (k * 41) % 130}" cy="${600 + (k * 13) % 30}" rx="6" ry="3.5" fill="#f5f0e6" stroke="#d7ccc8"/>`).join("")}`),

  "tieu-den-phu-quoc": () => wrap("do-kho-gia-vi", defs(g("jarg", "#ffffff", "#e0e0e0", 0, 0, 1, 0)) +
    `<rect x="290" y="260" width="220" height="340" rx="30" fill="url(#jarg)" stroke="#bdbdbd" stroke-width="5" opacity=".95"/>
     <rect x="300" y="330" width="200" height="260" rx="22" fill="#3e2723"/>
     ${Array.from({ length: 60 }, (_, k) => `<circle cx="${315 + (k * 37) % 175}" cy="${345 + ((k * 53) % 235)}" r="10" fill="${k % 4 ? "#212121" : "#4e342e"}"/>`).join("")}
     <rect x="280" y="220" width="240" height="56" rx="14" fill="#6d4c41"/><rect x="280" y="220" width="240" height="16" rx="8" fill="#8d6e63"/>
     <rect x="320" y="420" width="160" height="80" rx="10" fill="#fff8e1"/>
     <text x="400" y="470" font-family="Arial, Helvetica, sans-serif" font-size="30" font-weight="700" fill="#3e2723" text-anchor="middle">TIÊU ĐEN</text>
     <path d="M305 290 v290" stroke="#fff" stroke-width="10" stroke-linecap="round" opacity=".6"/>
     ${[[180, 600], [210, 615], [240, 598], [570, 610], [600, 596], [630, 614], [200, 630], [600, 632], [560, 640]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="11" fill="#212121"/><circle cx="${x - 3}" cy="${y - 3}" r="3" fill="#757575"/>`).join("")}`),
};

export { wrap, g, rg, defs, leaf, ball, label };
