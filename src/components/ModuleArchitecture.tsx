import React, { useState } from 'react';
import { CaseStudy, Block, Connector, Port } from '../types/mbse';
import { 
  Box, 
  Layers, 
  ArrowRightLeft, 
  Play, 
  CheckCircle2, 
  AlertTriangle, 
  Radio, 
  Cpu, 
  Eye, 
  Sparkles,
  Zap,
  Globe,
  User,
  Cloud,
  Gauge,
  Activity,
  Maximize2,
  Server,
  Workflow,
  ShieldCheck,
  Check
} from 'lucide-react';

interface ModuleArchitectureProps {
  currentCase: CaseStudy;
  onOpenAiCopilot: (checkType?: string) => void;
}

export const ModuleArchitecture: React.FC<ModuleArchitectureProps> = ({
  currentCase,
  onOpenAiCopilot,
}) => {
  const [archMode, setArchMode] = useState<'whitebox' | 'blackbox'>('whitebox');
  const [selectedBlockId, setSelectedBlockId] = useState<string>(
    currentCase.blocks?.[0]?.id || ''
  );
  const [selectedContextEntity, setSelectedContextEntity] = useState<string | null>(null);
  const [isSimulatingBus, setIsSimulatingBus] = useState<boolean>(false);
  const [activeSignal, setActiveSignal] = useState<string | null>(null);

  const blocks = currentCase.blocks || [];
  const connectors = currentCase.connectors || [];
  const selectedBlock = blocks.find((b) => b.id === selectedBlockId) || blocks[0];

  // Bus simulation trigger
  const handleSimulatePulse = (con: Connector) => {
    setActiveSignal(con.id);
    setIsSimulatingBus(true);
    setTimeout(() => {
      setIsSimulatingBus(false);
      setActiveSignal(null);
    }, 2800);
  };

  // Helper for stereotype styles
  const getStereotypeBadge = (stereotype: string) => {
    switch (stereotype) {
      case 'compute':
        return { label: '算力中枢', bg: 'bg-indigo-50 text-indigo-700 border-indigo-200', stroke: '#4f46e5', fill: '#eef2ff' };
      case 'controller':
        return { label: '区域主控', bg: 'bg-blue-50 text-blue-700 border-blue-200', stroke: '#2563eb', fill: '#eff6ff' };
      case 'gateway':
        return { label: '安全网关', bg: 'bg-purple-50 text-purple-700 border-purple-200', stroke: '#7c3aed', fill: '#faf5ff' };
      case 'actuator':
        return { label: '执行机构', bg: 'bg-rose-50 text-rose-700 border-rose-200', stroke: '#e11d48', fill: '#fff1f2' };
      case 'sensor':
        return { label: '感知单元', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', stroke: '#059669', fill: '#ecfdf5' };
      default:
        return { label: stereotype, bg: 'bg-slate-50 text-slate-700 border-slate-200', stroke: '#64748b', fill: '#f8fafc' };
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
                模块 03
              </span>
              <h2 className="text-lg font-semibold text-slate-900 tracking-tight">
                系统组件、接口与功能架构建模 (Architecture Modeling: Blocks & Ports)
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1 max-w-3xl leading-relaxed">
              严格依循 SysML v1.6 / v2 内部块图 (IBD) 与上下文黑盒图 (Context Diagram) 双重视界：
              精细定义物理/逻辑组件 (Blocks)、强类型流端口 (Ports)、确定性跨域总线 (Connectors) 及功能分配。
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenAiCopilot('接口端口协议匹配与总线瓶颈审查')}
              className="px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI 端口与拓扑审查</span>
            </button>

            {/* Black-box vs White-box switcher */}
            <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200/80 text-xs font-medium shadow-2xs">
              <button
                onClick={() => {
                  setArchMode('whitebox');
                  setSelectedContextEntity(null);
                }}
                className={`px-3 py-1.5 rounded-md transition-all cursor-pointer flex items-center gap-1.5 ${
                  archMode === 'whitebox'
                    ? 'bg-white text-indigo-900 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Layers className="w-3.5 h-3.5 text-indigo-600" />
                <span>白盒架构 (White-box IBD)</span>
              </button>
              <button
                onClick={() => setArchMode('blackbox')}
                className={`px-3 py-1.5 rounded-md transition-all cursor-pointer flex items-center gap-1.5 ${
                  archMode === 'blackbox'
                    ? 'bg-white text-indigo-900 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Box className="w-3.5 h-3.5 text-indigo-600" />
                <span>黑盒边界 (Black-box Context)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Quick specs banner */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-slate-100 text-xs">
          <div className="p-2.5 rounded-lg bg-slate-50/80 border border-slate-200/70 flex items-center justify-between">
            <span className="text-slate-500">实体组件 (Blocks):</span>
            <span className="font-mono font-bold text-indigo-700">{blocks.length} 块</span>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-50/80 border border-slate-200/70 flex items-center justify-between">
            <span className="text-slate-500">定义端口 (Ports):</span>
            <span className="font-mono font-bold text-slate-800">
              {blocks.reduce((sum, b) => sum + (b.ports?.length || 0), 0)} 个
            </span>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-50/80 border border-slate-200/70 flex items-center justify-between">
            <span className="text-slate-500">拓扑总线 (Connectors):</span>
            <span className="font-mono font-bold text-slate-800">{connectors.length} 条</span>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-50/80 border border-slate-200/70 flex items-center justify-between">
            <span className="text-slate-500">架构视角:</span>
            <span className="font-semibold text-indigo-800">
              {archMode === 'whitebox' ? 'SysML 内部结构 IBD' : '系统外部上下文 Context'}
            </span>
          </div>
        </div>
      </div>

      {/* Main Architecture Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Visual Architecture Canvas (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between">
          <div>
            {/* Header info */}
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Box className="w-4 h-4 text-indigo-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  {archMode === 'whitebox'
                    ? '系统白盒内部互联架构 (White-box Internal Block Diagram)'
                    : '系统外部边界黑盒交互视图 (Black-box Context Architecture)'}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-slate-400 font-mono">
                  {archMode === 'whitebox' ? '«SysML:ibd»' : '«SysML:context»'}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-100 text-slate-600 border border-slate-200">
                  {currentCase.code}
                </span>
              </div>
            </div>

            {/* Architecture SVG diagram with Blueprint Styling */}
            <div className="w-full bg-slate-900/95 border border-slate-800 rounded-xl p-3 relative overflow-hidden shadow-inner">
              {/* Mode Watermark */}
              <div className="absolute top-3 left-4 text-[10px] font-mono text-slate-500/80 uppercase tracking-widest pointer-events-none select-none z-10">
                {archMode === 'whitebox' ? 'SYSML IBD // WHITE-BOX ARCHITECTURE' : 'SYSTEM BOUNDARY // BLACK-BOX CONTEXT'}
              </div>

              {archMode === 'whitebox' ? (
                /* ======================================================== */
                /* 1. HIGH-AESTHETIC WHITE-BOX IBD DIAGRAM                  */
                /* ======================================================== */
                <svg viewBox="0 0 620 370" className="w-full h-auto select-none">
                  <defs>
                    {/* Blueprint Tech Grid Pattern */}
                    <pattern id="arch-grid" width="20" height="20" patternUnits="userSpaceOnUse">
                      <circle cx="10" cy="10" r="0.75" fill="#334155" />
                      <line x1="0" y1="0" x2="20" y2="0" stroke="#1e293b" strokeWidth="0.4" />
                      <line x1="0" y1="0" x2="0" y2="20" stroke="#1e293b" strokeWidth="0.4" />
                    </pattern>

                    {/* Luminous Neon Filters */}
                    <filter id="glow-bus" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="3" result="blur" />
                      <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                    <filter id="glow-core" x="-30%" y="-30%" width="160%" height="160%">
                      <feGaussianBlur stdDeviation="4.5" result="blur" />
                      <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>

                    {/* Linear & Radial Gradients for Blocks and Core */}
                    <linearGradient id="whitebox-boundary-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#0f172a" stopOpacity="0.95" />
                      <stop offset="50%" stopColor="#0b1120" stopOpacity="0.9" />
                      <stop offset="100%" stopColor="#030712" stopOpacity="0.98" />
                    </linearGradient>

                    <linearGradient id="block-card-grad" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#1e293b" />
                      <stop offset="100%" stopColor="#0f172a" />
                    </linearGradient>

                    <linearGradient id="block-selected-grad" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#1e1b4b" />
                      <stop offset="100%" stopColor="#0f172a" />
                    </linearGradient>

                    {/* Arrow Markers */}
                    <marker
                      id="arrow-bus-active"
                      viewBox="0 0 10 10"
                      refX="7"
                      refY="5"
                      markerWidth="6"
                      markerHeight="6"
                      orient="auto-start-reverse"
                    >
                      <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#818cf8" />
                    </marker>
                    <marker
                      id="arrow-bus-idle"
                      viewBox="0 0 10 10"
                      refX="7"
                      refY="5"
                      markerWidth="6"
                      markerHeight="6"
                      orient="auto-start-reverse"
                    >
                      <path d="M 0 2 L 7 5 L 0 8 z" fill="#64748b" />
                    </marker>
                  </defs>

                  {/* Grid Background */}
                  <rect width="620" height="370" fill="url(#arch-grid)" rx="10" />

                  {/* Outer White-Box Boundary Capsule with Dual Borders and Tech Corner Marks */}
                  <rect
                    x="14"
                    y="14"
                    width="592"
                    height="342"
                    rx="12"
                    fill="url(#whitebox-boundary-grad)"
                    stroke="#334155"
                    strokeWidth="1.5"
                    strokeDasharray="6 4"
                  />
                  <rect
                    x="18"
                    y="18"
                    width="584"
                    height="334"
                    rx="10"
                    fill="none"
                    stroke="#1e293b"
                    strokeWidth="1"
                  />

                  {/* System Header Badge */}
                  <g transform="translate(24, 24)">
                    <rect width="360" height="22" rx="4" fill="#0f172a" stroke="#334155" strokeWidth="0.8" />
                    <circle cx="10" cy="11" r="3" fill="#6366f1" />
                    <text x="20" y="15" className="text-[10px] font-mono fill-indigo-300 font-bold">
                      «system:ibd» {currentCase.title} • 内部白盒架构协同视图
                    </text>
                  </g>
                  <text x="590" y="38" textAnchor="end" className="text-[9px] font-mono fill-slate-500">
                    SYSML V2 SSOT BASELINE
                  </text>

                  {/* Draw Interconnect Buses (Connectors) with Intelligent Edge Anchoring */}
                  {connectors.map((c) => {
                    const srcIdx = blocks.findIndex((b) => b.id === c.sourceBlockId);
                    const tgtIdx = blocks.findIndex((b) => b.id === c.targetBlockId);
                    if (srcIdx === -1 || tgtIdx === -1) return null;

                    // Compute grid coordinates: 2 cols x 2 rows
                    const srcCol = srcIdx % 2;
                    const srcRow = Math.floor(srcIdx / 2);
                    const tgtCol = tgtIdx % 2;
                    const tgtRow = Math.floor(tgtIdx / 2);

                    const blockW = 230;
                    const blockH = 92;
                    const colX0 = 36;
                    const colX1 = 354;
                    const rowY0 = 62;
                    const rowY1 = 196;

                    // Accurate port edge anchoring
                    let srcX = 0;
                    let srcY = 0;
                    let tgtX = 0;
                    let tgtY = 0;

                    if (srcCol === 0 && tgtCol === 1) {
                      // Left block to Right block (through center corridor)
                      srcX = colX0 + blockW; // 266
                      srcY = (srcRow === 0 ? rowY0 : rowY1) + 42;
                      tgtX = colX1; // 354
                      tgtY = (tgtRow === 0 ? rowY0 : rowY1) + 42;
                    } else if (srcCol === 1 && tgtCol === 0) {
                      // Right block to Left block (through center corridor)
                      srcX = colX1; // 354
                      srcY = (srcRow === 0 ? rowY0 : rowY1) + 54;
                      tgtX = colX0 + blockW; // 266
                      tgtY = (tgtRow === 0 ? rowY0 : rowY1) + 54;
                    } else if (srcCol === tgtCol) {
                      // Vertical connection within same column
                      const bx = srcCol === 0 ? colX0 : colX1;
                      srcX = bx + 115;
                      srcY = rowY0 + blockH;
                      tgtX = bx + 115;
                      tgtY = rowY1;
                    } else {
                      srcX = colX0 + blockW;
                      srcY = rowY0 + 46;
                      tgtX = colX1;
                      tgtY = rowY1 + 46;
                    }

                    const isSignaling = activeSignal === c.id;

                    // Smooth Bezier Curve Path
                    let pathD = '';
                    let midX = (srcX + tgtX) / 2;
                    let midY = (srcY + tgtY) / 2;

                    if (srcCol !== tgtCol) {
                      const offsetCurve = srcRow === tgtRow ? (srcRow === 0 ? -12 : 12) : 0;
                      midY += offsetCurve;
                      pathD = `M ${srcX} ${srcY} C ${srcX + 40} ${srcY + offsetCurve}, ${tgtX - 40} ${tgtY + offsetCurve}, ${tgtX} ${tgtY}`;
                    } else {
                      pathD = `M ${srcX} ${srcY} L ${tgtX} ${tgtY}`;
                    }

                    return (
                      <g key={c.id} className="transition-all duration-200">
                        {/* Outer Glow Halo for Active Bus */}
                        <path
                          d={pathD}
                          fill="none"
                          stroke={isSignaling ? '#6366f1' : '#1e293b'}
                          strokeWidth={isSignaling ? 8 : 4}
                          strokeOpacity={isSignaling ? 0.45 : 0.6}
                        />

                        {/* Core Bus Conduit Line */}
                        <path
                          d={pathD}
                          fill="none"
                          stroke={isSignaling ? '#a5b4fc' : '#475569'}
                          strokeWidth={isSignaling ? 2.5 : 1.5}
                          filter={isSignaling ? 'url(#glow-bus)' : undefined}
                          markerEnd={isSignaling ? 'url(#arrow-bus-active)' : 'url(#arrow-bus-idle)'}
                        />

                        {/* Animated Signal Energy Pulse Packets */}
                        {isSignaling && (
                          <>
                            <circle r="4.5" fill="#c7d2fe" filter="url(#glow-bus)">
                              <animateMotion path={pathD} dur="1.2s" repeatCount="indefinite" />
                            </circle>
                            <circle r="2.5" fill="#ffffff">
                              <animateMotion path={pathD} dur="1.2s" repeatCount="indefinite" />
                            </circle>
                          </>
                        )}

                        {/* Bus Protocol Badge */}
                        <g transform={`translate(${midX - 46}, ${midY - 10})`}>
                          <rect
                            width="92"
                            height="18"
                            rx="4"
                            fill="#0b1120"
                            stroke={isSignaling ? '#818cf8' : '#334155'}
                            strokeWidth="1"
                            className="shadow-md"
                          />
                          <text
                            x="46"
                            y="12"
                            textAnchor="middle"
                            className={`text-[8.5px] font-mono font-semibold ${
                              isSignaling ? 'fill-indigo-300' : 'fill-slate-300'
                            }`}
                          >
                            {c.protocol} ({c.latencyConstraint || '≤10ms'})
                          </text>
                        </g>
                      </g>
                    );
                  })}

                  {/* Draw Physical / Logical Blocks with Hardware Chamfer Styling */}
                  {blocks.map((b, idx) => {
                    const col = idx % 2;
                    const row = Math.floor(idx / 2);
                    const x = col === 0 ? 36 : 354;
                    const y = row === 0 ? 62 : 196;
                    const w = 230;
                    const h = 94;
                    const isSelected = selectedBlock?.id === b.id;

                    // Domain color accents
                    const getAccentColor = (st: string) => {
                      if (st.includes('ADAS') || st.includes('Controller')) return '#818cf8';
                      if (st.includes('Chassis') || st.includes('Platform')) return '#34d399';
                      if (st.includes('Gateway') || st.includes('Network')) return '#60a5fa';
                      return '#f59e0b';
                    };
                    const accentColor = getAccentColor(b.stereotype);

                    return (
                      <g
                        key={b.id}
                        onClick={() => setSelectedBlockId(b.id)}
                        className="cursor-pointer transition-all duration-200"
                      >
                        {/* Selected Luminous Halo */}
                        {isSelected && (
                          <rect
                            x={x - 3}
                            y={y - 3}
                            width={w + 6}
                            height={h + 6}
                            rx="12"
                            fill="none"
                            stroke="#818cf8"
                            strokeWidth="2.5"
                            strokeOpacity="0.8"
                            filter="url(#glow-bus)"
                          />
                        )}

                        {/* Outer Hardware Block Card */}
                        <rect
                          x={x}
                          y={y}
                          width={w}
                          height={h}
                          rx="9"
                          fill={isSelected ? 'url(#block-selected-grad)' : 'url(#block-card-grad)'}
                          stroke={isSelected ? '#a5b4fc' : '#334155'}
                          strokeWidth={isSelected ? '2' : '1.2'}
                        />

                        {/* Top Accent Header Strip */}
                        <path
                          d={`M ${x} ${y + 9} A 9 9 0 0 1 ${x + 9} ${y} h ${w - 18} a 9 9 0 0 1 9 9 v 16 h -${w} z`}
                          fill={isSelected ? '#1e1b4b' : '#090d16'}
                        />

                        {/* Stereotype Tag & Hardware ID */}
                        <text x={x + 10} y={y + 17} className="text-[9.5px] font-mono font-bold" fill={accentColor}>
                          «{b.stereotype}»
                        </text>
                        <text x={x + 120} y={y + 17} className="text-[9px] font-mono fill-slate-400">
                          {b.id}
                        </text>

                        {/* Active Status LED Beacon */}
                        <circle cx={x + w - 14} cy={y + 13} r="3.5" fill="#10b981" />
                        <circle cx={x + w - 14} cy={y + 13} r="6" fill="#10b981" fillOpacity="0.25">
                          <animate attributeName="r" values="3.5;7;3.5" dur="2s" repeatCount="indefinite" />
                          <animate attributeName="opacity" values="0.8;0.1;0.8" dur="2s" repeatCount="indefinite" />
                        </circle>

                        {/* Block Title */}
                        <text
                          x={x + 10}
                          y={y + 44}
                          className="text-xs font-bold fill-white tracking-wide font-sans"
                        >
                          {b.name.length > 17 ? `${b.name.slice(0, 17)}...` : b.name}
                        </text>

                        {/* Technical Metadata Metrics Chips */}
                        <g transform={`translate(${x + 10}, ${y + 57})`}>
                          {/* Ports Chip */}
                          <rect width="64" height="18" rx="3.5" fill="#090d16" stroke="#334155" strokeWidth="0.8" />
                          <text x="32" y="12.5" textAnchor="middle" className="text-[8.5px] font-mono fill-slate-300">
                            {b.ports?.length || 0} 端口 (Ports)
                          </text>

                          {/* Requirements Chip */}
                          <rect x="70" width="66" height="18" rx="3.5" fill="#090d16" stroke="#334155" strokeWidth="0.8" />
                          <text x="103" y="12.5" textAnchor="middle" className="text-[8.5px] font-mono fill-indigo-300 font-semibold">
                            {b.allocatedReqIds?.length || 0} 需求闭环
                          </text>

                          {/* Functions Chip */}
                          <rect x="142" width="68" height="18" rx="3.5" fill="#090d16" stroke="#334155" strokeWidth="0.8" />
                          <text x="176" y="12.5" textAnchor="middle" className="text-[8.5px] font-mono fill-emerald-300">
                            {b.allocatedFunctions?.length || 0} 动态功能
                          </text>
                        </g>

                        {/* Hardware Standard Port Pins on Left & Right Borders */}
                        {(b.ports || []).map((port, pIdx) => {
                          const isInput = port.direction === 'in';
                          const pinX = isInput ? x - 4.5 : x + w - 2.5;
                          const pinY = y + 30 + pIdx * 15;
                          const pinColor = isInput ? '#38bdf8' : port.direction === 'out' ? '#34d399' : '#a855f7';

                          return (
                            <g key={port.id}>
                              <rect
                                x={pinX}
                                y={pinY}
                                width="7"
                                height="9"
                                rx="2"
                                fill={pinColor}
                                stroke="#090d16"
                                strokeWidth="1.2"
                              />
                              <circle cx={pinX + 3.5} cy={pinY + 4.5} r="1.5" fill="#ffffff" />
                              <title>{`${port.name} [方向: ${port.direction.toUpperCase()} | 协议: ${port.protocol} | 类型: ${port.type}]`}</title>
                            </g>
                          );
                        })}
                      </g>
                    );
                  })}
                </svg>
              ) : (
                /* ======================================================== */
                /* 2. HIGH-AESTHETIC BLACK-BOX CONTEXT & HERO SUD CORE      */
                /* ======================================================== */
                <svg viewBox="0 0 620 370" className="w-full h-auto select-none">
                  <defs>
                    <pattern id="blackbox-grid" width="20" height="20" patternUnits="userSpaceOnUse">
                      <circle cx="10" cy="10" r="0.75" fill="#334155" />
                      <line x1="0" y1="0" x2="20" y2="0" stroke="#1e293b" strokeWidth="0.3" />
                      <line x1="0" y1="0" x2="0" y2="20" stroke="#1e293b" strokeWidth="0.3" />
                    </pattern>

                    {/* Multi-layered Hero Radial Glow for SUD Core */}
                    <radialGradient id="sud-core-radial" cx="50%" cy="50%" r="55%">
                      <stop offset="0%" stopColor="#4338ca" stopOpacity="0.85" />
                      <stop offset="50%" stopColor="#1e1b4b" stopOpacity="0.95" />
                      <stop offset="85%" stopColor="#0b0f19" stopOpacity="0.98" />
                      <stop offset="100%" stopColor="#030712" stopOpacity="1" />
                    </radialGradient>

                    <linearGradient id="sud-border-neon" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#818cf8" />
                      <stop offset="35%" stopColor="#38bdf8" />
                      <stop offset="70%" stopColor="#6366f1" />
                      <stop offset="100%" stopColor="#a855f7" />
                    </linearGradient>

                    <linearGradient id="card-context-grad" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#1e293b" stopOpacity="0.95" />
                      <stop offset="100%" stopColor="#0f172a" stopOpacity="0.98" />
                    </linearGradient>
                  </defs>

                  {/* Blueprint Grid Background */}
                  <rect width="620" height="370" fill="url(#blackbox-grid)" rx="10" />

                  {/* Outer Context Boundary Frame */}
                  <rect
                    x="10"
                    y="10"
                    width="600"
                    height="350"
                    rx="12"
                    fill="#030712"
                    fillOpacity="0.7"
                    stroke="#1e293b"
                    strokeWidth="1.5"
                  />

                  {/* Corner Accent Measurement Crosshairs */}
                  <path d="M 20 28 L 20 20 L 28 20" fill="none" stroke="#475569" strokeWidth="1.5" />
                  <path d="M 600 28 L 600 20 L 592 20" fill="none" stroke="#475569" strokeWidth="1.5" />
                  <path d="M 20 342 L 20 350 L 28 350" fill="none" stroke="#475569" strokeWidth="1.5" />
                  <path d="M 600 342 L 600 350 L 592 350" fill="none" stroke="#475569" strokeWidth="1.5" />

                  {/* Header Watermark */}
                  <text x="310" y="30" textAnchor="middle" className="text-[10px] font-mono fill-slate-400 font-semibold tracking-wider">
                    SYSTEM BOUNDARY INTERFACE & CONTEXT MODEL (SYSML BLACK-BOX DOMAIN)
                  </text>

                  {/* ======================================================== */}
                  {/* DUAL-LANE BOUNDARY CONDUITS WITH DIRECTIONAL FLOW        */}
                  {/* ======================================================== */}
                  {/* Top Conduit: HMI Operator (North) */}
                  <path d="M 310 70 L 310 110" stroke="#818cf8" strokeWidth="3" strokeDasharray="5 3" />
                  <circle cx="310" cy="90" r="3" fill="#a5b4fc" filter="url(#glow-bus)">
                    <animate attributeName="cy" values="70;110" dur="1.2s" repeatCount="indefinite" />
                  </circle>
                  <text x="318" y="94" className="text-[8.5px] font-mono fill-indigo-300 font-bold">
                    HMI 任务操纵与优先接管 [CAN-FD]
                  </text>

                  {/* West Conduit: Physical Environment & Sensors */}
                  <path d="M 144 185 L 180 185" stroke="#34d399" strokeWidth="3" strokeDasharray="5 3" />
                  <circle cx="162" cy="185" r="3" fill="#6ee7b7" filter="url(#glow-bus)">
                    <animate attributeName="cx" values="144;180" dur="1.2s" repeatCount="indefinite" />
                  </circle>
                  <text x="162" y="174" textAnchor="middle" className="text-[8px] font-mono fill-emerald-300 font-bold">
                    多源雷达/点云感知流
                  </text>

                  {/* East Conduit: Cloud & Infrastructure */}
                  <path d="M 440 185 L 476 185" stroke="#60a5fa" strokeWidth="3" strokeDasharray="5 3" />
                  <circle cx="458" cy="185" r="3" fill="#93c5fd" filter="url(#glow-bus)">
                    <animate attributeName="cx" values="440;476" dur="1.2s" repeatCount="indefinite" />
                  </circle>
                  <text x="458" y="174" textAnchor="middle" className="text-[8px] font-mono fill-sky-300 font-bold">
                    双向遥测/高精地图/OTA
                  </text>

                  {/* South Conduit: Actuators Dynamics */}
                  <path d="M 310 260 L 310 302" stroke="#f43f5e" strokeWidth="3" strokeDasharray="5 3" />
                  <circle cx="310" cy="281" r="3" fill="#fda4af" filter="url(#glow-bus)">
                    <animate attributeName="cy" values="260;302" dur="1.2s" repeatCount="indefinite" />
                  </circle>
                  <text x="318" y="284" className="text-[8.5px] font-mono fill-rose-300 font-bold">
                    底盘线控驱动与安全冗余制动
                  </text>

                  {/* ======================================================== */}
                  {/* CENTRAL HERO: EXQUISITE SYSTEM UNDER DESIGN (黑盒核心)     */}
                  {/* ======================================================== */}
                  <g
                    transform="translate(180, 110)"
                    onClick={() => setSelectedContextEntity('sud')}
                    className="cursor-pointer group"
                  >
                    {/* Pulsing Luminous Core Outer Aura */}
                    <rect
                      x="-8"
                      y="-8"
                      width="276"
                      height="166"
                      rx="20"
                      fill="#4f46e5"
                      fillOpacity="0.12"
                      filter="url(#glow-core)"
                    />

                    {/* Central Core Chassis Capsule */}
                    <rect
                      width="260"
                      height="150"
                      rx="16"
                      fill="url(#sud-core-radial)"
                      stroke="url(#sud-border-neon)"
                      strokeWidth="2.5"
                      className="shadow-2xl"
                    />

                    {/* Concentric Radar Scanning Energy Rings */}
                    <circle cx="130" cy="75" r="62" fill="none" stroke="#6366f1" strokeWidth="1" strokeOpacity="0.25" />
                    <circle
                      cx="130"
                      cy="75"
                      r="48"
                      fill="none"
                      stroke="#38bdf8"
                      strokeWidth="1.2"
                      strokeDasharray="8 6"
                      strokeOpacity="0.4"
                    >
                      <animateTransform
                        attributeName="transform"
                        type="rotate"
                        from="0 130 75"
                        to="360 130 75"
                        dur="16s"
                        repeatCount="indefinite"
                      />
                    </circle>
                    <circle cx="130" cy="75" r="32" fill="none" stroke="#a855f7" strokeWidth="1" strokeOpacity="0.3" />

                    {/* Core Corner Metallic Brackets */}
                    <path d="M 8 20 L 8 8 L 20 8" fill="none" stroke="#38bdf8" strokeWidth="2.5" />
                    <path d="M 252 20 L 252 8 L 240 8" fill="none" stroke="#38bdf8" strokeWidth="2.5" />
                    <path d="M 8 130 L 8 142 L 20 142" fill="none" stroke="#38bdf8" strokeWidth="2.5" />
                    <path d="M 252 130 L 252 142 L 240 142" fill="none" stroke="#38bdf8" strokeWidth="2.5" />

                    {/* Top Stereotype Badge Banner */}
                    <g transform="translate(40, 14)">
                      <rect width="180" height="20" rx="10" fill="#0b0f19" stroke="#818cf8" strokeWidth="1" />
                      <circle cx="12" cy="10" r="3.5" fill="#38bdf8" className="animate-ping" />
                      <circle cx="12" cy="10" r="3.5" fill="#38bdf8" />
                      <text x="95" y="14" textAnchor="middle" className="text-[9.5px] font-mono fill-cyan-300 font-extrabold tracking-wider">
                        «System Under Design» 黑核
                      </text>
                    </g>

                    {/* Case Main Title */}
                    <text x="130" y="58" textAnchor="middle" className="text-sm font-black fill-white tracking-wide font-sans">
                      {currentCase.title}
                    </text>

                    {/* System Code & Standard Metadata */}
                    <text x="130" y="76" textAnchor="middle" className="text-[10px] font-mono fill-indigo-200">
                      基线编号: {currentCase.code} • {currentCase.standards[0] || 'ISO 26262 ASIL-D'}
                    </text>

                    {/* Internal Encapsulation Chips */}
                    <g transform="translate(18, 92)">
                      <rect width="70" height="22" rx="5" fill="#090d16" stroke="#38bdf8" strokeWidth="0.8" />
                      <text x="35" y="15" textAnchor="middle" className="text-[9px] font-mono fill-cyan-300 font-bold">
                        {blocks.length} 物理域组件
                      </text>

                      <rect x="76" width="72" height="22" rx="5" fill="#090d16" stroke="#818cf8" strokeWidth="0.8" />
                      <text x="112" y="15" textAnchor="middle" className="text-[9px] font-mono fill-indigo-300 font-bold">
                        {connectors.length} 条确定性总线
                      </text>

                      <rect x="154" width="70" height="22" rx="5" fill="#090d16" stroke="#34d399" strokeWidth="0.8" />
                      <text x="189" y="15" textAnchor="middle" className="text-[9px] font-mono fill-emerald-300 font-bold">
                        100% 需求闭环
                      </text>
                    </g>

                    {/* Footer Prompt */}
                    <text x="130" y="136" textAnchor="middle" className="text-[8.5px] font-mono fill-slate-400 group-hover:fill-cyan-300 transition-colors">
                      [点击检视黑盒系统级边界端口契约与外部信号]
                    </text>

                    {/* 4 Boundary Docking Port Pads */}
                    {/* North Dock */}
                    <g transform="translate(118, -6)">
                      <rect width="24" height="12" rx="3" fill="#818cf8" stroke="#090d16" strokeWidth="1.5" />
                      <circle cx="12" cy="6" r="2.5" fill="#ffffff" />
                    </g>
                    {/* West Dock */}
                    <g transform="translate(-6, 64)">
                      <rect width="12" height="24" rx="3" fill="#34d399" stroke="#090d16" strokeWidth="1.5" />
                      <circle cx="6" cy="12" r="2.5" fill="#ffffff" />
                    </g>
                    {/* East Dock */}
                    <g transform="translate(254, 64)">
                      <rect width="12" height="24" rx="3" fill="#60a5fa" stroke="#090d16" strokeWidth="1.5" />
                      <circle cx="6" cy="12" r="2.5" fill="#ffffff" />
                    </g>
                    {/* South Dock */}
                    <g transform="translate(118, 144)">
                      <rect width="24" height="12" rx="3" fill="#f43f5e" stroke="#090d16" strokeWidth="1.5" />
                      <circle cx="12" cy="6" r="2.5" fill="#ffffff" />
                    </g>
                  </g>

                  {/* ======================================================== */}
                  {/* 4 SURROUNDING EXTERNAL ACTOR / CONTEXT CARDS             */}
                  {/* ======================================================== */}
                  {/* Top Card: Human Operator / Dispatcher (North) */}
                  <g
                    transform="translate(210, 16)"
                    onClick={() => setSelectedContextEntity('actor-human')}
                    className="cursor-pointer group"
                  >
                    <rect
                      width="200"
                      height="52"
                      rx="10"
                      fill="url(#card-context-grad)"
                      stroke={selectedContextEntity === 'actor-human' ? '#818cf8' : '#334155'}
                      strokeWidth={selectedContextEntity === 'actor-human' ? '2.5' : '1.2'}
                      className="group-hover:stroke-indigo-400 transition-colors"
                    />
                    <circle cx="20" cy="26" r="10" fill="#312e81" />
                    <text x="20" y="30" textAnchor="middle" className="text-xs fill-indigo-300 font-bold">👤</text>
                    <text x="38" y="24" className="text-xs font-bold fill-white">
                      «Actor» 驾驶员 / 调度员
                    </text>
                    <text x="38" y="40" className="text-[9.5px] fill-slate-300 font-mono">
                      人机交互界面 (HMI) • 端到端时延 ≤ 33ms
                    </text>
                  </g>

                  {/* West Card: Physical Operational Environment (West) */}
                  <g
                    transform="translate(16, 148)"
                    onClick={() => setSelectedContextEntity('env-physical')}
                    className="cursor-pointer group"
                  >
                    <rect
                      width="128"
                      height="74"
                      rx="10"
                      fill="url(#card-context-grad)"
                      stroke={selectedContextEntity === 'env-physical' ? '#34d399' : '#334155'}
                      strokeWidth={selectedContextEntity === 'env-physical' ? '2.5' : '1.2'}
                      className="group-hover:stroke-emerald-400 transition-colors"
                    />
                    <circle cx="20" cy="22" r="8" fill="#064e3b" />
                    <text x="20" y="26" textAnchor="middle" className="text-[10px] fill-emerald-300 font-bold">🌐</text>
                    <text x="34" y="24" className="text-[10.5px] font-bold fill-white">
                      «Environment»
                    </text>
                    <text x="14" y="44" className="text-[10px] font-bold fill-emerald-300 font-mono">
                      物理外场与气象环境
                    </text>
                    <text x="14" y="60" className="text-[8.5px] fill-slate-400 font-mono">
                      雷达/视觉/路面摩擦
                    </text>
                  </g>

                  {/* East Card: Remote Cloud / Satellite (East) */}
                  <g
                    transform="translate(476, 148)"
                    onClick={() => setSelectedContextEntity('ext-cloud')}
                    className="cursor-pointer group"
                  >
                    <rect
                      width="128"
                      height="74"
                      rx="10"
                      fill="url(#card-context-grad)"
                      stroke={selectedContextEntity === 'ext-cloud' ? '#60a5fa' : '#334155'}
                      strokeWidth={selectedContextEntity === 'ext-cloud' ? '2.5' : '1.2'}
                      className="group-hover:stroke-blue-400 transition-colors"
                    />
                    <circle cx="20" cy="22" r="8" fill="#1e3a8a" />
                    <text x="20" y="26" textAnchor="middle" className="text-[10px] fill-sky-300 font-bold">☁️</text>
                    <text x="34" y="24" className="text-[10.5px] font-bold fill-white">
                      «External System»
                    </text>
                    <text x="14" y="44" className="text-[10px] font-bold fill-sky-300 font-mono">
                      云网地面控制中心
                    </text>
                    <text x="14" y="60" className="text-[8.5px] fill-slate-400 font-mono">
                      5G-V2X / 遥测 / 双向OTA
                    </text>
                  </g>

                  {/* South Card: Physical Actuator Dynamics Plant (South) */}
                  <g
                    transform="translate(198, 304)"
                    onClick={() => setSelectedContextEntity('plant-actuator')}
                    className="cursor-pointer group"
                  >
                    <rect
                      width="224"
                      height="52"
                      rx="10"
                      fill="url(#card-context-grad)"
                      stroke={selectedContextEntity === 'plant-actuator' ? '#f43f5e' : '#334155'}
                      strokeWidth={selectedContextEntity === 'plant-actuator' ? '2.5' : '1.2'}
                      className="group-hover:stroke-rose-400 transition-colors"
                    />
                    <circle cx="20" cy="26" r="10" fill="#881337" />
                    <text x="20" y="30" textAnchor="middle" className="text-xs fill-rose-300 font-bold">⚙️</text>
                    <text x="38" y="24" className="text-xs font-bold fill-white">
                      «Plant» 动力总成与物理底盘执行机构
                    </text>
                    <text x="38" y="40" className="text-[9.5px] fill-slate-300 font-mono">
                      线控转向 / iBooster 制动 / 驱动电机闭环
                    </text>
                  </g>
                </svg>
              )}
            </div>

            {/* Canvas Legend */}
            <div className="flex flex-wrap items-center justify-between gap-2 mt-3 pt-2 text-[11px] text-slate-500 border-t border-slate-100">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-sky-400"></span>
                  <span>输入端口 (In)</span>
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                  <span>输出端口 (Out)</span>
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-4 h-0.5 bg-indigo-500"></span>
                  <span>高带宽总线 (TSN/CAN-FD)</span>
                </span>
              </div>
              <span className="font-mono text-[10px] text-slate-400">
                点击画布中的实体块查看右侧属性细节
              </span>
            </div>
          </div>

          {/* Interactive Bus Pulse Simulator Bar */}
          <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
            <span className="text-slate-600 font-medium flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>跨域总线实时通信报文模拟 (Bus Signal Pulse):</span>
            </span>
            <div className="flex items-center gap-1.5 overflow-x-auto max-w-[380px] py-0.5">
              {connectors.map((c) => (
                <button
                  key={c.id}
                  onClick={() => handleSimulatePulse(c)}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-mono border transition-all cursor-pointer whitespace-nowrap flex items-center gap-1 ${
                    activeSignal === c.id
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm animate-pulse'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-indigo-50 hover:border-indigo-200'
                  }`}
                  title={`点击注入脉冲: ${c.protocol} (${c.name})`}
                >
                  <Play className="w-2.5 h-2.5" />
                  <span>{c.protocol}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Block & Port Inspector (5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs space-y-4">
          {archMode === 'blackbox' && selectedContextEntity ? (
            /* Context Entity Inspector */
            <div className="space-y-3 animate-in fade-in duration-150">
              <div className="border-b border-slate-100 pb-2.5">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200 font-semibold">
                  外部上下文边界交互
                </span>
                <h3 className="text-sm font-bold text-slate-900 mt-1.5">
                  {selectedContextEntity === 'actor-human' && '人类操作者与驾驶调度台 (Human Operator Context)'}
                  {selectedContextEntity === 'env-physical' && '物理运行工况与气象环境 (Physical Environment)'}
                  {selectedContextEntity === 'ext-cloud' && '远端地面站与卫星遥测网络 (Infrastructure & Cloud)'}
                  {selectedContextEntity === 'plant-actuator' && '物理底盘动力总成与机械执行 (Actuator Plant Dynamics)'}
                  {selectedContextEntity === 'sud' && `核心被设计系统: ${currentCase.title}`}
                </h3>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-2 leading-relaxed">
                <div className="font-semibold text-slate-900">边界交互协议与信号流向：</div>
                {selectedContextEntity === 'actor-human' && (
                  <p>
                    主要包含方向盘/驾驶杆操纵量输入、自动驾驶/巡航模式切换、HMI 仪表鸟瞰图 (BEV) 实时态势渲染输出。端到端输入延迟要求 ≤ 33ms。
                  </p>
                )}
                {selectedContextEntity === 'env-physical' && (
                  <p>
                    包含激光雷达点云 (TSN)、高清双目视觉 (GMSL2)、毫米波雷达时空同步流。输入时空同步误差约束 ≤ 10ms，帧率 ≥ 30Hz。
                  </p>
                )}
                {selectedContextEntity === 'ext-cloud' && (
                  <p>
                    依托 5G-V2X / 星地测控专网，承载高精地图实时下发、车辆/装备全生命周期遥测健康上报及双分区安全 OTA 镜像验签。
                  </p>
                )}
                {selectedContextEntity === 'plant-actuator' && (
                  <p>
                    通过 5Mbps CAN-FD 冗余动力底盘环路与硬线驱动，下发底盘制动 (EPB/iBooster) 与转向扭矩指令，失效应急下在 120ms 内进入安全降级停车。
                  </p>
                )}
                {selectedContextEntity === 'sud' && (
                  <p>
                    黑盒系统边界内封装多核异构中央控制器、网关安全模块、区域控制器与线控底盘。外部所有能流、物料流与信息流必须通过严格定义的标准端口出入。
                  </p>
                )}
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setSelectedContextEntity(null)}
                  className="px-2.5 py-1 text-xs text-indigo-700 hover:bg-indigo-50 rounded-md transition-colors cursor-pointer"
                >
                  返回组件检视
                </button>
              </div>
            </div>
          ) : selectedBlock ? (
            /* Standard Block & Port Inspector */
            <>
              {/* Block Header */}
              <div className="flex items-start justify-between border-b border-slate-100 pb-3">
                <div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 font-semibold">
                    «{selectedBlock.stereotype}»
                  </span>
                  <h3 className="text-sm font-bold text-slate-900 mt-1">
                    {selectedBlock.name}
                  </h3>
                  <span className="text-xs text-slate-400 font-mono">{selectedBlock.id}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-medium border border-emerald-200 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>模型就绪</span>
                  </span>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1">
                <span className="text-[11px] font-semibold text-slate-500">组件工程职责 (Responsibility)</span>
                <p className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-200/80 leading-relaxed font-sans">
                  {selectedBlock.description}
                </p>
              </div>

              {/* Ports Definition List */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                    <Radio className="w-3.5 h-3.5 text-indigo-600" />
                    <span>标准与流端口定义 (Ports Specification)</span>
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {selectedBlock.ports?.length || 0} 个接口
                  </span>
                </div>

                <div className="space-y-1.5 max-h-[170px] overflow-y-auto pr-0.5">
                  {(selectedBlock.ports || []).map((port) => (
                    <div
                      key={port.id}
                      className="p-2 rounded-lg border border-slate-200 bg-slate-50/70 text-xs flex items-center justify-between hover:bg-slate-100/70 transition-colors"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              port.direction === 'in' ? 'bg-sky-500' : 'bg-emerald-500'
                            }`}
                          ></span>
                          <span className="font-semibold text-slate-800 font-mono text-[11px]">
                            {port.name}
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono pl-3.5">
                          Payload: {port.type}
                        </div>
                      </div>

                      <div className="text-right font-mono text-[10px]">
                        <span className="px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 font-semibold border border-indigo-200/60">
                          {port.protocol}
                        </span>
                        {port.rate && (
                          <div className="text-slate-400 mt-0.5">{port.rate}</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Parameters & Allocated Functions */}
              {selectedBlock.parameters && (
                <div className="space-y-1.5 pt-2 border-t border-slate-100">
                  <span className="text-xs font-semibold text-slate-800">
                    定量参数与物理约束 (Parameters & Constraints)
                  </span>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {Object.entries(selectedBlock.parameters).map(([key, val]) => (
                      <div key={key} className="p-2 rounded-lg bg-slate-50 border border-slate-200/70">
                        <span className="text-[10px] text-slate-400 font-mono">{key}</span>
                        <div className="font-semibold text-slate-800 font-mono text-[11px] truncate">{String(val)}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-400 text-xs">
              请点击左侧画布中的任一物理块以查看详细端口与属性。
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
