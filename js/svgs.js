// 示意大樣圖（Claude 繪製的參考示意，非官方解答）
const SVGS = {
floor: `<svg viewBox="0 0 640 300" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="12">
<defs>
<pattern id="conc" width="14" height="14" patternUnits="userSpaceOnUse"><rect width="14" height="14" fill="#e7e5e4"/><path d="M3 4l3-2 1 3z M9 10l2-3 2 3z" fill="#a8a29e"/></pattern>
<pattern id="ply" width="20" height="6" patternUnits="userSpaceOnUse"><rect width="20" height="6" fill="#fde68a"/><path d="M0 3h20" stroke="#d97706" stroke-width=".6"/></pattern>
<pattern id="wood" width="30" height="8" patternUnits="userSpaceOnUse"><rect width="30" height="8" fill="#d6a46a"/><path d="M0 2q15 3 30 0M0 6q15-3 30 0" stroke="#92400e" stroke-width=".6" fill="none"/></pattern>
</defs>
<rect x="20" y="230" width="430" height="50" fill="url(#conc)" stroke="#57534e"/>
<rect x="20" y="226" width="430" height="4" fill="#60a5fa"/>
<g fill="#c08a4a" stroke="#78350f">
<rect x="45" y="182" width="36" height="44"/><rect x="185" y="182" width="36" height="44"/><rect x="325" y="182" width="36" height="44"/>
<path d="M45 182l36 44M81 182l-36 44M185 182l36 44M221 182l-36 44M325 182l36 44M361 182l-36 44" stroke-width=".7"/>
</g>
<rect x="20" y="170" width="430" height="12" fill="url(#ply)" stroke="#92400e"/>
<rect x="20" y="152" width="430" height="18" fill="url(#wood)" stroke="#78350f"/>
<path d="M140 152v18M260 152v18M380 152v18" stroke="#78350f"/>
<path d="M136 160l8 6M256 160l8 6M376 160l8 6" stroke="#111" stroke-width="2"/>
<path d="M63 170v14M203 170v14M343 170v14" stroke="#111" stroke-width="2"/>
<path d="M63 226v12M203 226v12M343 226v12" stroke="#111" stroke-width="2.4"/>
<rect x="20" y="110" width="10" height="42" fill="#d6a46a" stroke="#78350f"/>
<rect x="0" y="40" width="20" height="240" fill="url(#conc)" stroke="#57534e"/>
<g stroke="#334155" fill="none"><path d="M230 158H470M260 176H470M100 200H470M400 228H470M300 260H470M140 163V95H470M70 177v-60H40M40 117h-4M350 233v30"/></g>
<g fill="#0f172a">
<text x="476" y="162">企口實木地板 12×1.8cm</text>
<text x="476" y="180">12mm 夾板底板</text>
<text x="476" y="204">角材 4.5×3.6cm @45cm</text>
<text x="476" y="232">PE 防潮布（重疊 15～30cm）</text>
<text x="476" y="264">RC 樓板</text>
<text x="476" y="99">公榫斜打 F 型暗釘＋白膠</text>
</g>
<text x="12" y="30" fill="#0f172a">牆邊留 8～10mm 伸縮縫，以踢腳板收邊</text>
<text x="100" y="296" fill="#475569" font-size="11">底板以 T 型釘釘接角材；角材以鋼釘／擊釘固定於樓板（示意，比例不拘）</text>
</svg>`,
terrazzo: `<svg viewBox="0 0 640 280" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="12">
<defs>
<pattern id="c2" width="14" height="14" patternUnits="userSpaceOnUse"><rect width="14" height="14" fill="#e7e5e4"/><path d="M3 4l3-2 1 3z M9 10l2-3 2 3z" fill="#a8a29e"/></pattern>
<pattern id="mort" width="6" height="6" patternUnits="userSpaceOnUse"><rect width="6" height="6" fill="#d6d3d1"/><circle cx="2" cy="2" r=".7" fill="#78716c"/></pattern>
<pattern id="stone" width="12" height="12" patternUnits="userSpaceOnUse"><rect width="12" height="12" fill="#cbd5e1"/><circle cx="3" cy="3" r="2.4" fill="#64748b"/><circle cx="9" cy="8" r="2" fill="#94a3b8"/></pattern>
</defs>
<rect x="40" y="20" width="90" height="240" fill="url(#c2)" stroke="#57534e"/>
<rect x="130" y="20" width="36" height="240" fill="url(#mort)" stroke="#57534e"/>
<rect x="166" y="20" width="6" height="240" fill="#a8a29e"/>
<rect x="172" y="20" width="22" height="240" fill="url(#stone)" stroke="#334155"/>
<rect x="194" y="20" width="3" height="240" fill="#fbbf24"/>
<rect x="172" y="132" width="18" height="10" fill="#f97316" stroke="#9a3412"/>
<path d="M150 137h28" stroke="#111" stroke-width="2"/>
<g stroke="#334155" fill="none"><path d="M85 60H360M148 90H360M169 115H360M184 180H360M196 210H360M182 137H360M160 140v20h200"/></g>
<g fill="#0f172a">
<text x="366" y="64">RC 牆</text>
<text x="366" y="94">1:3 水泥砂漿粉刷（15～20mm）</text>
<text x="366" y="119">純水泥／益膠泥黏結層（2～3mm）</text>
<text x="366" y="141">塑膠壓條 9×6×0.8mm（分割縫）</text>
<text x="366" y="184">抿石子面層：2 分天然石＋抿石粉（8～10mm）</text>
<text x="366" y="164">小鋼釘固定壓條</text>
<text x="366" y="214">凡立水保護層（2 道）</text>
</g>
<text x="40" y="276" fill="#475569" font-size="11">牆面剖面示意（左＝結構，右＝完成面）</text>
</svg>`,
mosaic: `<svg viewBox="0 0 640 280" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="12">
<defs>
<pattern id="c3" width="14" height="14" patternUnits="userSpaceOnUse"><rect width="14" height="14" fill="#e7e5e4"/><path d="M3 4l3-2 1 3z M9 10l2-3 2 3z" fill="#a8a29e"/></pattern>
<pattern id="m3" width="6" height="6" patternUnits="userSpaceOnUse"><rect width="6" height="6" fill="#d6d3d1"/><circle cx="2" cy="2" r=".7" fill="#78716c"/></pattern>
</defs>
<rect x="40" y="20" width="90" height="240" fill="url(#c3)" stroke="#57534e"/>
<rect x="130" y="20" width="36" height="240" fill="url(#m3)" stroke="#57534e"/>
<rect x="166" y="20" width="8" height="240" fill="#a8a29e"/>
<g fill="#38bdf8" stroke="#0369a1">
<rect x="174" y="22" width="10" height="46"/><rect x="174" y="71" width="10" height="46"/>
<rect x="174" y="146" width="10" height="46"/><rect x="174" y="195" width="10" height="46"/>
</g>
<g fill="#e2e8f0"><rect x="174" y="68" width="10" height="3"/><rect x="174" y="192" width="10" height="3"/></g>
<rect x="166" y="117" width="18" height="29" fill="#fff" stroke="#334155"/>
<circle cx="172" cy="131" r="5" fill="#fde047" stroke="#a16207"/>
<rect x="178" y="119" width="6" height="25" fill="#94a3b8"/>
<g stroke="#334155" fill="none"><path d="M85 50H360M148 80H360M170 100H360M180 45H360M180 69H360M172 131H360M181 160V170H360"/></g>
<g fill="#0f172a">
<text x="366" y="54">RC 牆</text>
<text x="366" y="84">1:3 水泥砂漿粉刷（15～20mm）</text>
<text x="366" y="104">益膠泥黏著層（3～5mm，鋸齒鏝）</text>
<text x="366" y="40">5×5cm 馬賽克（厚約 4～6mm）</text>
<text x="366" y="73">間縫填縫劑（約 2～3mm）</text>
<text x="366" y="135">伸縮縫：背襯材（PE 棒）</text>
<text x="366" y="174">彈性填縫膠（矽利康／PU），縫寬 6～10mm</text>
</g>
<text x="40" y="276" fill="#475569" font-size="11">牆面剖面示意，伸縮縫須切穿黏著層至粉刷面</text>
</svg>`
};
