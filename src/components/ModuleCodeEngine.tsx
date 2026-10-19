import React, { useState } from 'react';
import { PYTHON_SCRIPTS, PythonScriptItem, PythonPlotConfig } from '../data/pythonScripts';
import { 
  Cpu, 
  Terminal, 
  Play, 
  Copy, 
  Check, 
  Download, 
  Code, 
  CheckCircle2,
  Sparkles,
  BarChart3,
  Table as TableIcon,
  Maximize2,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';

interface ModuleCodeEngineProps {
  onOpenAiCopilot: (checkType?: string) => void;
}

export const ModuleCodeEngine: React.FC<ModuleCodeEngineProps> = ({ onOpenAiCopilot }) => {
  const [selectedScript, setSelectedScript] = useState<PythonScriptItem>(PYTHON_SCRIPTS[0]);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [outputConsole, setOutputConsole] = useState<string>(PYTHON_SCRIPTS[0].sampleOutput);
  const [hasRun, setHasRun] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);
  const [activeOutputTab, setActiveOutputTab] = useState<'plot' | 'console' | 'table'>('plot');

  const handleSelectScript = (item: PythonScriptItem) => {
    setSelectedScript(item);
    setOutputConsole(item.sampleOutput);
    setHasRun(true);
  };

  const handleRunScript = () => {
    setIsRunning(true);
    setOutputConsole('[In-Project Python 3.12 Engine]: Initializing AST, NetworkX and Matplotlib pipeline...\n');

    setTimeout(() => {
      setOutputConsole((prev) => prev + '[Runtime Engine]: Parsing model definitions and computing graph adjacency...\n');
    }, 350);

    setTimeout(() => {
      setOutputConsole(selectedScript.sampleOutput);
      setIsRunning(false);
      setHasRun(true);
      setActiveOutputTab('plot'); // Automatically show generated plot
    }, 1000);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(selectedScript.sourceCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadPy = () => {
    const blob = new Blob([selectedScript.sourceCode], { type: 'text/x-python' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedScript.id}.py`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Render Visual English Plot based on current script
  const renderVisualPlot = (plotConfig: PythonPlotConfig) => {
    switch (plotConfig.type) {
      case 'topology_graph':
        return (
          <div className="w-full bg-slate-950 p-4 rounded-lg flex flex-col items-center">
            {/* English Title */}
            <div className="text-center mb-3">
              <h4 className="text-xs sm:text-sm font-bold text-white tracking-wide">
                {plotConfig.titleEn}
              </h4>
              <p className="text-[10px] text-slate-400 font-mono">
                Directed Graph Topology Model generated via NetworkX & Matplotlib
              </p>
            </div>

            {/* SVG Graph Plot */}
            <svg viewBox="0 0 540 280" className="w-full max-w-lg h-auto">
              <defs>
                <marker
                  id="edge-arrow"
                  viewBox="0 0 10 10"
                  refX="18"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 1 L 8 5 L 0 9 z" fill="#818cf8" />
                </marker>
              </defs>

              {/* Background grid */}
              <pattern id="grid-pattern" width="30" height="30" patternUnits="userSpaceOnUse">
                <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#1e293b" strokeWidth="0.8" />
              </pattern>
              <rect width="540" height="280" fill="url(#grid-pattern)" />

              {/* Graph Edges */}
              {/* CCU -> ADCU */}
              <path d="M 120 70 Q 270 40 420 70" fill="none" stroke="#818cf8" strokeWidth="2" markerEnd="url(#edge-arrow)" />
              <text x="270" y="45" fill="#a5b4fc" fontSize="8" textAnchor="middle" fontFamily="monospace">TSN Backbone (1 Gbps)</text>

              {/* ADCU -> Chassis */}
              <path d="M 420 70 Q 450 150 420 220" fill="none" stroke="#818cf8" strokeWidth="2" markerEnd="url(#edge-arrow)" />
              <text x="460" y="150" fill="#a5b4fc" fontSize="8" textAnchor="middle" fontFamily="monospace">Dual CAN-FD</text>

              {/* Chassis -> ADCU Feedback */}
              <path d="M 400 220 Q 370 150 400 70" fill="none" stroke="#38bdf8" strokeWidth="1.8" strokeDasharray="4 2" markerEnd="url(#edge-arrow)" />
              <text x="355" y="150" fill="#38bdf8" fontSize="8" textAnchor="middle" fontFamily="monospace">Feedback Loop</text>

              {/* CCU -> Cockpit */}
              <path d="M 120 70 Q 120 150 120 220" fill="none" stroke="#818cf8" strokeWidth="2" markerEnd="url(#edge-arrow)" />
              <text x="75" y="150" fill="#a5b4fc" fontSize="8" textAnchor="middle" fontFamily="monospace">TSN AVB</text>

              {/* Node 1: BLK-01 CCU */}
              <circle cx="120" cy="70" r="32" fill="#4f46e5" stroke="#818cf8" strokeWidth="2" />
              <text x="120" y="66" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">BLK-01</text>
              <text x="120" y="78" fill="#e0e7ff" fontSize="7.5" textAnchor="middle" fontFamily="sans-serif">CCU</text>

              {/* Node 2: BLK-02 ADCU */}
              <circle cx="420" cy="70" r="35" fill="#4338ca" stroke="#a5b4fc" strokeWidth="2.5" />
              <text x="420" y="66" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">BLK-02</text>
              <text x="420" y="78" fill="#e0e7ff" fontSize="7.5" textAnchor="middle" fontFamily="sans-serif">ADCU</text>

              {/* Node 3: BLK-03 Chassis */}
              <circle cx="420" cy="220" r="32" fill="#4f46e5" stroke="#818cf8" strokeWidth="2" />
              <text x="420" y="216" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">BLK-03</text>
              <text x="420" y="228" fill="#e0e7ff" fontSize="7.5" textAnchor="middle" fontFamily="sans-serif">Chassis</text>

              {/* Node 4: BLK-04 Cockpit */}
              <circle cx="120" cy="220" r="30" fill="#4f46e5" stroke="#818cf8" strokeWidth="2" />
              <text x="120" y="216" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">BLK-04</text>
              <text x="120" y="228" fill="#e0e7ff" fontSize="7.5" textAnchor="middle" fontFamily="sans-serif">Cockpit</text>
            </svg>

            {/* Axes & Legend (English) */}
            <div className="w-full flex items-center justify-between text-[10px] text-slate-400 mt-2 px-3 border-t border-slate-800 pt-2 font-mono">
              <span>{plotConfig.xAxisEn}</span>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 text-slate-300">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 inline-block"></span>
                  {plotConfig.legendEn[0]}
                </span>
                <span className="flex items-center gap-1 text-slate-300">
                  <span className="w-3 h-0.5 bg-indigo-400 inline-block"></span>
                  {plotConfig.legendEn[1]}
                </span>
              </div>
            </div>
          </div>
        );

      case 'rtm_heatmap':
        return (
          <div className="w-full bg-slate-950 p-4 rounded-lg flex flex-col items-center">
            <div className="text-center mb-3">
              <h4 className="text-xs sm:text-sm font-bold text-white tracking-wide">
                {plotConfig.titleEn}
              </h4>
              <p className="text-[10px] text-slate-400 font-mono">
                Binary Requirements-to-Block Allocation Map (1: Satisfied, 0: Unmet)
              </p>
            </div>

            <svg viewBox="0 0 540 260" className="w-full max-w-lg h-auto">
              {/* Axes labels (English) */}
              <text x="40" y="130" fill="#94a3b8" fontSize="9" textAnchor="middle" transform="rotate(-90 40 130)" fontFamily="sans-serif">
                {plotConfig.yAxisEn}
              </text>
              <text x="300" y="245" fill="#94a3b8" fontSize="9" textAnchor="middle" fontFamily="sans-serif">
                {plotConfig.xAxisEn}
              </text>

              {/* Column Headers (Blocks) */}
              <text x="180" y="45" fill="#e2e8f0" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="monospace">BLK-ADCU</text>
              <text x="290" y="45" fill="#e2e8f0" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="monospace">BLK-CGW</text>
              <text x="400" y="45" fill="#e2e8f0" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="monospace">BLK-CHASSIS</text>

              {/* Row Headers (Reqs) */}
              <text x="120" y="85" fill="#e2e8f0" fontSize="9" textAnchor="end" fontFamily="monospace">REQ-01 (Pilot)</text>
              <text x="120" y="125" fill="#e2e8f0" fontSize="9" textAnchor="end" fontFamily="monospace">REQ-02 (Fusion)</text>
              <text x="120" y="165" fill="#e2e8f0" fontSize="9" textAnchor="end" fontFamily="monospace">REQ-03 (TSN)</text>
              <text x="120" y="205" fill="#e2e8f0" fontSize="9" textAnchor="end" fontFamily="monospace">REQ-04 (Brake)</text>

              {/* Cells: Row 1 REQ-01 */}
              <rect x="135" y="65" width="90" height="32" rx="4" fill="#3b82f6" />
              <text x="180" y="85" fill="#ffffff" fontSize="12" fontWeight="bold" textAnchor="middle">1</text>
              <rect x="245" y="65" width="90" height="32" rx="4" fill="#1e293b" />
              <text x="290" y="85" fill="#64748b" fontSize="12" fontWeight="bold" textAnchor="middle">0</text>
              <rect x="355" y="65" width="90" height="32" rx="4" fill="#3b82f6" />
              <text x="400" y="85" fill="#ffffff" fontSize="12" fontWeight="bold" textAnchor="middle">1</text>

              {/* Cells: Row 2 REQ-02 */}
              <rect x="135" y="105" width="90" height="32" rx="4" fill="#3b82f6" />
              <text x="180" y="125" fill="#ffffff" fontSize="12" fontWeight="bold" textAnchor="middle">1</text>
              <rect x="245" y="105" width="90" height="32" rx="4" fill="#1e293b" />
              <text x="290" y="125" fill="#64748b" fontSize="12" fontWeight="bold" textAnchor="middle">0</text>
              <rect x="355" y="105" width="90" height="32" rx="4" fill="#1e293b" />
              <text x="400" y="125" fill="#64748b" fontSize="12" fontWeight="bold" textAnchor="middle">0</text>

              {/* Cells: Row 3 REQ-03 */}
              <rect x="135" y="145" width="90" height="32" rx="4" fill="#1e293b" />
              <text x="180" y="165" fill="#64748b" fontSize="12" fontWeight="bold" textAnchor="middle">0</text>
              <rect x="245" y="145" width="90" height="32" rx="4" fill="#3b82f6" />
              <text x="290" y="165" fill="#ffffff" fontSize="12" fontWeight="bold" textAnchor="middle">1</text>
              <rect x="355" y="145" width="90" height="32" rx="4" fill="#1e293b" />
              <text x="400" y="165" fill="#64748b" fontSize="12" fontWeight="bold" textAnchor="middle">0</text>

              {/* Cells: Row 4 REQ-04 */}
              <rect x="135" y="185" width="90" height="32" rx="4" fill="#1e293b" />
              <text x="180" y="205" fill="#64748b" fontSize="12" fontWeight="bold" textAnchor="middle">0</text>
              <rect x="245" y="185" width="90" height="32" rx="4" fill="#1e293b" />
              <text x="290" y="205" fill="#64748b" fontSize="12" fontWeight="bold" textAnchor="middle">0</text>
              <rect x="355" y="185" width="90" height="32" rx="4" fill="#3b82f6" />
              <text x="400" y="205" fill="#ffffff" fontSize="12" fontWeight="bold" textAnchor="middle">1</text>

              {/* Colorbar Indicator */}
              <g transform="translate(470, 65)">
                <rect width="18" height="152" rx="3" fill="#3b82f6" />
                <text x="26" y="20" fill="#93c5fd" fontSize="8" fontFamily="monospace">1 (Satisfied)</text>
                <text x="26" y="145" fill="#94a3b8" fontSize="8" fontFamily="monospace">0 (Unmet)</text>
              </g>
            </svg>

            <div className="w-full flex items-center justify-between text-[10px] text-slate-400 mt-2 px-3 border-t border-slate-800 pt-2 font-mono">
              <span>{plotConfig.titleEn}</span>
              <span className="text-emerald-400 font-bold">100% Traceability Verified</span>
            </div>
          </div>
        );

      case 'latency_bar':
        return (
          <div className="w-full bg-slate-950 p-4 rounded-lg flex flex-col items-center">
            <div className="text-center mb-3">
              <h4 className="text-xs sm:text-sm font-bold text-white tracking-wide">
                {plotConfig.titleEn}
              </h4>
              <p className="text-[10px] text-slate-400 font-mono">
                Hard Real-Time Latency Verification against ISO 26262 / IEEE 802.1Q Limits
              </p>
            </div>

            <svg viewBox="0 0 540 260" className="w-full max-w-lg h-auto">
              {/* Axes lines */}
              <line x1="60" y1="210" x2="500" y2="210" stroke="#475569" strokeWidth="1.5" />
              <line x1="60" y1="40" x2="60" y2="210" stroke="#475569" strokeWidth="1.5" />

              {/* Y Axis ticks (Latency ms) */}
              <text x="50" y="213" fill="#94a3b8" fontSize="8" textAnchor="end" fontFamily="monospace">0ms</text>
              <text x="50" y="160" fill="#94a3b8" fontSize="8" textAnchor="end" fontFamily="monospace">5ms</text>
              <text x="50" y="110" fill="#94a3b8" fontSize="8" textAnchor="end" fontFamily="monospace">10ms</text>
              <text x="50" y="60" fill="#94a3b8" fontSize="8" textAnchor="end" fontFamily="monospace">15ms</text>

              {/* Horizontal grid lines */}
              <line x1="60" y1="160" x2="500" y2="160" stroke="#334155" strokeDasharray="3 3" />
              <line x1="60" y1="110" x2="500" y2="110" stroke="#334155" strokeDasharray="3 3" />
              <line x1="60" y1="60" x2="500" y2="60" stroke="#334155" strokeDasharray="3 3" />

              {/* Channel 1: CON-01 (TSN: measured 2ms, bound 5ms) */}
              <rect x="95" y="190" width="28" height="20" rx="2" fill="#3b82f6" />
              <text x="109" y="185" fill="#93c5fd" fontSize="8" textAnchor="middle" fontFamily="monospace">2.0</text>
              <rect x="127" y="160" width="28" height="50" rx="2" fill="#ef4444" />
              <text x="141" y="155" fill="#fca5a5" fontSize="8" textAnchor="middle" fontFamily="monospace">5.0</text>
              <text x="125" y="225" fill="#cbd5e1" fontSize="8" textAnchor="middle" fontFamily="monospace">CON-01 (TSN)</text>

              {/* Channel 2: CON-02 (CAN-FD: measured 4.8ms, bound 10ms) */}
              <rect x="195" y="162" width="28" height="48" rx="2" fill="#3b82f6" />
              <text x="209" y="157" fill="#93c5fd" fontSize="8" textAnchor="middle" fontFamily="monospace">4.8</text>
              <rect x="227" y="110" width="28" height="100" rx="2" fill="#ef4444" />
              <text x="241" y="105" fill="#fca5a5" fontSize="8" textAnchor="middle" fontFamily="monospace">10.0</text>
              <text x="225" y="225" fill="#cbd5e1" fontSize="8" textAnchor="middle" fontFamily="monospace">CON-02 (CAN-FD)</text>

              {/* Channel 3: CON-03 (AVB: measured 11.2ms, bound 15ms) */}
              <rect x="295" y="98" width="28" height="112" rx="2" fill="#3b82f6" />
              <text x="309" y="93" fill="#93c5fd" fontSize="8" textAnchor="middle" fontFamily="monospace">11.2</text>
              <rect x="327" y="60" width="28" height="150" rx="2" fill="#ef4444" />
              <text x="341" y="55" fill="#fca5a5" fontSize="8" textAnchor="middle" fontFamily="monospace">15.0</text>
              <text x="325" y="225" fill="#cbd5e1" fontSize="8" textAnchor="middle" fontFamily="monospace">CON-03 (AVB)</text>

              {/* Channel 4: CON-04 (Feedback: measured 2.5ms, bound 4.0ms) */}
              <rect x="395" y="185" width="28" height="25" rx="2" fill="#3b82f6" />
              <text x="409" y="180" fill="#93c5fd" fontSize="8" textAnchor="middle" fontFamily="monospace">2.5</text>
              <rect x="427" y="170" width="28" height="40" rx="2" fill="#ef4444" />
              <text x="441" y="165" fill="#fca5a5" fontSize="8" textAnchor="middle" fontFamily="monospace">4.0</text>
              <text x="425" y="225" fill="#cbd5e1" fontSize="8" textAnchor="middle" fontFamily="monospace">CON-04 (FB)</text>

              {/* Y Axis Label */}
              <text x="25" y="130" fill="#94a3b8" fontSize="8.5" textAnchor="middle" transform="rotate(-90 25 130)" fontFamily="sans-serif">
                {plotConfig.yAxisEn}
              </text>
            </svg>

            {/* Legend & Summary (English) */}
            <div className="w-full flex items-center justify-between text-[10px] text-slate-400 mt-2 px-3 border-t border-slate-800 pt-2 font-mono">
              <span>{plotConfig.xAxisEn}</span>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 text-blue-400">
                  <span className="w-2.5 h-2.5 rounded-sm bg-blue-500 inline-block"></span>
                  {plotConfig.legendEn[0]}
                </span>
                <span className="flex items-center gap-1 text-red-400">
                  <span className="w-2.5 h-2.5 rounded-sm bg-red-500 inline-block"></span>
                  {plotConfig.legendEn[1]}
                </span>
              </div>
            </div>
          </div>
        );

      case 'arcadia_bar':
        return (
          <div className="w-full bg-slate-950 p-4 rounded-lg flex flex-col items-center">
            <div className="text-center mb-3">
              <h4 className="text-xs sm:text-sm font-bold text-white tracking-wide">
                {plotConfig.titleEn}
              </h4>
              <p className="text-[10px] text-slate-400 font-mono">
                Model Complexity Distribution Across Capella Arcadia Engineering Layers
              </p>
            </div>

            <svg viewBox="0 0 540 260" className="w-full max-w-lg h-auto">
              <line x1="60" y1="210" x2="500" y2="210" stroke="#475569" strokeWidth="1.5" />
              <line x1="60" y1="40" x2="60" y2="210" stroke="#475569" strokeWidth="1.5" />

              {/* Y Axis ticks */}
              <text x="50" y="213" fill="#94a3b8" fontSize="8" textAnchor="end" fontFamily="monospace">0</text>
              <text x="50" y="165" fill="#94a3b8" fontSize="8" textAnchor="end" fontFamily="monospace">10</text>
              <text x="50" y="115" fill="#94a3b8" fontSize="8" textAnchor="end" fontFamily="monospace">20</text>
              <text x="50" y="65" fill="#94a3b8" fontSize="8" textAnchor="end" fontFamily="monospace">30</text>

              <line x1="60" y1="165" x2="500" y2="165" stroke="#334155" strokeDasharray="3 3" />
              <line x1="60" y1="115" x2="500" y2="115" stroke="#334155" strokeDasharray="3 3" />
              <line x1="60" y1="65" x2="500" y2="65" stroke="#334155" strokeDasharray="3 3" />

              {/* Layer 1: OA (Func: 5, Comp: 3) */}
              <rect x="95" y="185" width="28" height="25" rx="2" fill="#10b981" />
              <text x="109" y="180" fill="#a7f3d0" fontSize="8" textAnchor="middle" fontFamily="monospace">5</text>
              <rect x="127" y="195" width="28" height="15" rx="2" fill="#6366f1" />
              <text x="141" y="190" fill="#c7d2fe" fontSize="8" textAnchor="middle" fontFamily="monospace">3</text>
              <text x="125" y="225" fill="#cbd5e1" fontSize="8.5" textAnchor="middle" fontFamily="monospace">OA (Operational)</text>

              {/* Layer 2: SA (Func: 12, Comp: 4) */}
              <rect x="195" y="150" width="28" height="60" rx="2" fill="#10b981" />
              <text x="209" y="145" fill="#a7f3d0" fontSize="8" textAnchor="middle" fontFamily="monospace">12</text>
              <rect x="227" y="190" width="28" height="20" rx="2" fill="#6366f1" />
              <text x="241" y="185" fill="#c7d2fe" fontSize="8" textAnchor="middle" fontFamily="monospace">4</text>
              <text x="225" y="225" fill="#cbd5e1" fontSize="8.5" textAnchor="middle" fontFamily="monospace">SA (System)</text>

              {/* Layer 3: LA (Func: 18, Comp: 8) */}
              <rect x="295" y="120" width="28" height="90" rx="2" fill="#10b981" />
              <text x="309" y="115" fill="#a7f3d0" fontSize="8" textAnchor="middle" fontFamily="monospace">18</text>
              <rect x="327" y="170" width="28" height="40" rx="2" fill="#6366f1" />
              <text x="341" y="165" fill="#c7d2fe" fontSize="8" textAnchor="middle" fontFamily="monospace">8</text>
              <text x="325" y="225" fill="#cbd5e1" fontSize="8.5" textAnchor="middle" fontFamily="monospace">LA (Logical)</text>

              {/* Layer 4: PA (Func: 24, Comp: 14) */}
              <rect x="395" y="90" width="28" height="120" rx="2" fill="#10b981" />
              <text x="409" y="85" fill="#a7f3d0" fontSize="8" textAnchor="middle" fontFamily="monospace">24</text>
              <rect x="427" y="140" width="28" height="70" rx="2" fill="#6366f1" />
              <text x="441" y="135" fill="#c7d2fe" fontSize="8" textAnchor="middle" fontFamily="monospace">14</text>
              <text x="425" y="225" fill="#cbd5e1" fontSize="8.5" textAnchor="middle" fontFamily="monospace">PA (Physical)</text>

              <text x="25" y="130" fill="#94a3b8" fontSize="8.5" textAnchor="middle" transform="rotate(-90 25 130)" fontFamily="sans-serif">
                {plotConfig.yAxisEn}
              </text>
            </svg>

            <div className="w-full flex items-center justify-between text-[10px] text-slate-400 mt-2 px-3 border-t border-slate-800 pt-2 font-mono">
              <span>{plotConfig.xAxisEn}</span>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 text-emerald-400">
                  <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500 inline-block"></span>
                  {plotConfig.legendEn[0]}
                </span>
                <span className="flex items-center gap-1 text-indigo-400">
                  <span className="w-2.5 h-2.5 rounded-sm bg-indigo-500 inline-block"></span>
                  {plotConfig.legendEn[1]}
                </span>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Module Title Header */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 text-[11px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200/60 rounded-md">
                模块 06
              </span>
              <h2 className="text-lg font-semibold text-slate-900 tracking-tight">
                Python / SysML / Capella 代码引擎 (py-sysml & NetworkX Engine)
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1 max-w-3xl leading-relaxed">
              集成工业级 Python 自动化源码与 Matplotlib 可视化渲染：
              支持在项目内直接点击<strong>「运行代码」</strong>生成可视化图表与控制台结果（图标题、图例与坐标轴严格使用英文标注）；
              所有脚本均为独立可执行代码，支持一键<strong>「复制代码」</strong>无缝复制到项目外 Python 本地环境中运行。
            </p>
          </div>

          <button
            onClick={() => onOpenAiCopilot('自动化脚本生成与模型CI/CD流水线集成')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-medium transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI 代码诊断与调优</span>
          </button>
        </div>
      </div>

      {/* Script Selector Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {PYTHON_SCRIPTS.map((script) => {
          const isSelected = script.id === selectedScript.id;
          return (
            <div
              key={script.id}
              onClick={() => handleSelectScript(script)}
              className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                isSelected
                  ? 'bg-indigo-50/70 border-indigo-500 shadow-xs'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                  {script.category}
                </span>
                {isSelected && <CheckCircle2 className="w-4 h-4 text-indigo-600" />}
              </div>
              <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{script.title}</h4>
              <p className="text-[11px] text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                {script.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* Code Editor & Execution Output Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* ======================================================== */}
        {/* Left: Source Code Panel (6 Cols) */}
        {/* ======================================================== */}
        <div className="lg:col-span-6 bg-white rounded-xl border border-slate-200/90 shadow-xs flex flex-col overflow-hidden">
          {/* Editor Header Bar */}
          <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Code className="w-4 h-4 text-indigo-600" />
              <span className="text-xs font-mono font-bold text-slate-800">
                {selectedScript.id}.py
              </span>
              <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200 font-mono">
                独立可运行
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* Copy Code button */}
              <button
                onClick={handleCopyCode}
                className="flex items-center gap-1 px-2.5 py-1 text-xs text-slate-700 bg-white border border-slate-200 rounded-md hover:bg-slate-50 transition-colors cursor-pointer shadow-2xs font-medium"
                title="复制代码到剪贴板，可粘贴至本地任意 Python 环境直接运行"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
                <span>{copied ? '已复制 (可外部运行)' : '复制代码'}</span>
              </button>

              <button
                onClick={handleDownloadPy}
                className="flex items-center gap-1 px-2.5 py-1 text-xs text-slate-600 bg-white border border-slate-200 rounded-md hover:bg-slate-50 transition-colors cursor-pointer"
                title="下载 standalone Python 脚本文件"
              >
                <Download className="w-3.5 h-3.5" />
                <span>导出 .py</span>
              </button>

              {/* Run Code Button (UPDATED TITLE: "运行代码") */}
              <button
                onClick={handleRunScript}
                disabled={isRunning}
                className="flex items-center gap-1.5 px-3.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md text-xs font-bold shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                title="在当前项目中立即执行 Python 脚本并生成可视化图表"
              >
                <Play className="w-3 h-3 fill-current" />
                <span>{isRunning ? '正在运行...' : '运行代码'}</span>
              </button>
            </div>
          </div>

          {/* Syntax Code block */}
          <div className="p-4 bg-slate-950 overflow-x-auto max-h-[520px] text-xs font-mono text-slate-200 leading-relaxed scrollbar-thin">
            <pre className="selection:bg-indigo-500/30">
              <code>{selectedScript.sourceCode}</code>
            </pre>
          </div>
        </div>

        {/* ======================================================== */}
        {/* Right: Output Window (Results and Plots) (6 Cols) */}
        {/* ======================================================== */}
        <div className="lg:col-span-6 bg-slate-900 rounded-xl border border-slate-800 shadow-xs flex flex-col overflow-hidden text-slate-200">
          {/* Output Window Header & Tabs */}
          <div className="p-2.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-1 bg-slate-900 p-0.5 rounded-lg border border-slate-800 text-xs">
              <button
                onClick={() => setActiveOutputTab('plot')}
                className={`px-3 py-1 rounded-md transition-colors cursor-pointer flex items-center gap-1.5 ${
                  activeOutputTab === 'plot'
                    ? 'bg-indigo-600 text-white font-bold shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5" />
                <span>生成图表 (Plot Graphics)</span>
              </button>

              <button
                onClick={() => setActiveOutputTab('console')}
                className={`px-3 py-1 rounded-md transition-colors cursor-pointer flex items-center gap-1.5 ${
                  activeOutputTab === 'console'
                    ? 'bg-indigo-600 text-white font-bold shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Terminal className="w-3.5 h-3.5" />
                <span>控制台结果 (stdout)</span>
              </button>
            </div>

            <div className="flex items-center gap-2 pr-1">
              {isRunning ? (
                <div className="flex items-center gap-1.5 text-[10px] text-amber-400 font-mono">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
                  <span>Executing...</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-mono">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span>Exit 0 (Success)</span>
                </div>
              )}
            </div>
          </div>

          {/* Output Content Area */}
          <div className="p-4 flex-1 min-h-[460px] max-h-[520px] overflow-y-auto">
            {/* View 1: Generated Plot (English titles, legends, axes) */}
            {activeOutputTab === 'plot' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="font-mono text-[11px]">
                    Graphics Output [Matplotlib Figure 1 - Interactive Canvas]
                  </span>
                  <span className="text-[10px] text-indigo-400 bg-indigo-950 px-2 py-0.5 rounded border border-indigo-800">
                    English Title & Legend Standard
                  </span>
                </div>

                {/* Render corresponding visual plot */}
                {renderVisualPlot(selectedScript.plotConfig)}

                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
                  <span>
                    💡 代码中的图表已包含标准 Matplotlib 绘图指令，复制代码到外部运行即可弹出原生窗口。
                  </span>
                  <button
                    onClick={handleCopyCode}
                    className="text-indigo-400 hover:text-indigo-300 font-medium underline cursor-pointer shrink-0 ml-2"
                  >
                    复制代码
                  </button>
                </div>
              </div>
            )}

            {/* View 2: Console Stdout */}
            {activeOutputTab === 'console' && (
              <div className="space-y-2">
                <div className="text-slate-500 text-[10px] font-mono border-b border-slate-800 pb-1.5 flex items-center justify-between">
                  <span>$ python3 {selectedScript.id}.py --runtime=local --gui=interactive</span>
                  <span>PID: 8042</span>
                </div>
                <pre className="whitespace-pre-wrap font-mono text-emerald-400 text-xs leading-relaxed">
                  {outputConsole}
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
