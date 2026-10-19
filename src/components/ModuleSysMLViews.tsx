import React, { useState } from 'react';
import { CaseStudy, StateMachineState } from '../types/mbse';
import { 
  Activity, 
  Layers, 
  Box, 
  Workflow, 
  Play, 
  RotateCcw, 
  AlertOctagon, 
  CheckCircle2, 
  Cpu, 
  Maximize2,
  Sparkles
} from 'lucide-react';

interface ModuleSysMLViewsProps {
  currentCase: CaseStudy;
  onOpenAiCopilot: (checkType?: string) => void;
}

export const ModuleSysMLViews: React.FC<ModuleSysMLViewsProps> = ({
  currentCase,
  onOpenAiCopilot,
}) => {
  const [activeSysmlView, setActiveSysmlView] = useState<'req' | 'bdd' | 'ibd' | 'stm'>('bdd');

  // Interactive State Machine Simulator state
  const states = currentCase.states || [];
  const transitions = currentCase.transitions || [];
  const [currentStateId, setCurrentStateId] = useState<string>(states[0]?.id || '');
  const [transitionLogs, setTransitionLogs] = useState<string[]>([
    `[系统启动] 初始状态激活: ${states[0]?.name || 'INIT'}`,
  ]);

  const currentState = states.find((s) => s.id === currentStateId) || states[0];

  // Simulator step
  const handleTriggerTransition = (triggerText: string, targetStateId: string, actionText?: string) => {
    const targetState = states.find((s) => s.id === targetStateId);
    if (!targetState) return;

    setCurrentStateId(targetStateId);
    const newLog = `[触发转移] 触发器: ${triggerText} ⟶ 进入状态: [${targetState.name}] ${actionText ? `(执行: ${actionText})` : ''}`;
    setTransitionLogs((prev) => [newLog, ...prev.slice(0, 7)]);
  };

  const handleResetFsm = () => {
    if (states.length > 0) {
      setCurrentStateId(states[0].id);
      setTransitionLogs([`[重置] 状态机已复位至初始态: ${states[0].name}`]);
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
                模块 04
              </span>
              <h2 className="text-lg font-semibold text-slate-900 tracking-tight">
                SysML 风格多视角视图演播 (SysML Multi-View Theater)
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1 max-w-3xl leading-relaxed">
              严格遵循 OMG SysML 规范标准，实现需求图 (Req)、块定义图 (BDD)、内部块图 (IBD) 与行为状态机图 (STM) 的多重视图联动演播，
              并支持安全关键工况状态机交互式实时动态注入与转移仿真。
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenAiCopilot('SysML多图语义一致性与行为死锁诊断')}
              className="px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-medium transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 inline mr-1" />
              AI 视图诊断
            </button>

            {/* View Tabs */}
            <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs font-medium">
              <button
                onClick={() => setActiveSysmlView('bdd')}
                className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                  activeSysmlView === 'bdd' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                块定义图 (BDD)
              </button>
              <button
                onClick={() => setActiveSysmlView('ibd')}
                className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                  activeSysmlView === 'ibd' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                内部块图 (IBD)
              </button>
              <button
                onClick={() => setActiveSysmlView('stm')}
                className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                  activeSysmlView === 'stm' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                状态机行为图 (STM)
              </button>
              <button
                onClick={() => setActiveSysmlView('req')}
                className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                  activeSysmlView === 'req' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                需求图 (Req)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* View 1: BDD (Block Definition Diagram) */}
      {activeSysmlView === 'bdd' && (
        <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div>
              <span className="font-mono text-xs text-indigo-700 font-semibold">
                bdd [{currentCase.domain}] - {currentCase.title}
              </span>
              <p className="text-xs text-slate-500 mt-0.5">
                呈现系统的组合聚合关系 (Composition - 实心菱形)、泛化继承与值属性 (Value Properties)
              </p>
            </div>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600">
              OMG SysML 1.6 BDD Standard
            </span>
          </div>

          <div className="w-full bg-slate-50/70 border border-slate-200 rounded-lg p-4 overflow-x-auto">
            <svg viewBox="0 0 760 380" className="w-full h-auto min-w-[700px]">
              <defs>
                {/* Composition Black Diamond */}
                <marker
                  id="diamond-comp"
                  viewBox="0 0 16 16"
                  refX="0"
                  refY="8"
                  markerWidth="8"
                  markerHeight="8"
                  orient="auto"
                >
                  <polygon points="0,8 8,0 16,8 8,16" fill="#1e293b" />
                </marker>
              </defs>

              {/* Root System Block (Top Center) */}
              <g>
                <rect x="250" y="20" width="260" height="85" rx="4" fill="#ffffff" stroke="#1e293b" strokeWidth="1.5" />
                <path d="M 250 20 h 260 v 24 h -260 z" fill="#f8fafc" />
                <text x="380" y="36" textAnchor="middle" className="text-[10px] font-mono fill-slate-500">
                  «block, system»
                </text>
                <text x="380" y="58" textAnchor="middle" className="text-xs font-bold fill-slate-900">
                  {currentCase.title.slice(0, 18)}
                </text>
                <line x1="250" y1="65" x2="510" y2="65" stroke="#e2e8f0" strokeWidth="1" />
                <text x="260" y="78" className="text-[9px] fill-slate-600 font-mono">
                  parts: {currentCase.blocks?.length} sub-blocks
                </text>
                <text x="260" y="93" className="text-[9px] fill-slate-600 font-mono">
                  standards: {currentCase.standards?.[0]}
                </text>
              </g>

              {/* Composition Connector Lines branching out */}
              {currentCase.blocks?.map((b, idx) => {
                const childX = 30 + idx * 180;
                const childY = 170;
                return (
                  <g key={`bdd-edge-${b.id}`}>
                    <path
                      d={`M 380 105 L 380 135 L ${childX + 80} 135 L ${childX + 80} 170`}
                      fill="none"
                      stroke="#1e293b"
                      strokeWidth="1.2"
                      markerStart="url(#diamond-comp)"
                    />
                    <text x={childX + 85} y="155" className="text-[8px] font-mono fill-slate-500">
                      1..1
                    </text>
                  </g>
                );
              })}

              {/* Sub-Blocks Row */}
              {currentCase.blocks?.map((b, idx) => {
                const x = 30 + idx * 180;
                const y = 170;
                return (
                  <g key={`bdd-blk-${b.id}`}>
                    <rect x={x} y={y} width="165" height="180" rx="4" fill="#ffffff" stroke="#334155" strokeWidth="1.2" />
                    {/* Header */}
                    <path d={`M ${x} ${y} h 165 v 24 h -165 z`} fill="#f1f5f9" />
                    <text x={x + 82} y={y + 15} textAnchor="middle" className="text-[9px] font-mono fill-slate-500">
                      «{b.stereotype}»
                    </text>
                    <text x={x + 82} y={y + 35} textAnchor="middle" className="text-[10px] font-bold fill-slate-800">
                      {b.name.slice(0, 11)}
                    </text>
                    <line x1={x} y1={y + 44} x2={x + 165} y2={y + 44} stroke="#cbd5e1" strokeWidth="1" />

                    {/* Compartment 1: Value Properties */}
                    <text x={x + 8} y={y + 56} className="text-[8px] font-bold fill-slate-600">values</text>
                    {b.parameters && Object.entries(b.parameters).slice(0, 3).map(([k, v], pIdx) => (
                      <text key={k} x={x + 8} y={y + 68 + pIdx * 12} className="text-[8px] font-mono fill-slate-700">
                        • {k}: {String(v).slice(0, 12)}
                      </text>
                    ))}
                    <line x1={x} y1={y + 105} x2={x + 165} y2={y + 105} stroke="#e2e8f0" strokeWidth="1" />

                    {/* Compartment 2: Operations / Allocated Functions */}
                    <text x={x + 8} y={y + 117} className="text-[8px] font-bold fill-slate-600">operations</text>
                    {(b.allocatedFunctions || []).slice(0, 3).map((fn, fIdx) => (
                      <text key={fn} x={x + 8} y={y + 129 + fIdx * 12} className="text-[8px] font-mono fill-indigo-700">
                        + {fn.slice(0, 14)}()
                      </text>
                    ))}
                    <line x1={x} y1={y + 155} x2={x + 165} y2={y + 155} stroke="#e2e8f0" strokeWidth="1" />

                    {/* Compartment 3: Ports Count */}
                    <text x={x + 8} y={y + 168} className="text-[8px] fill-slate-400 font-mono">
                      ports: {b.ports?.length || 0} standard ports
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>
      )}

      {/* View 2: IBD (Internal Block Diagram) */}
      {activeSysmlView === 'ibd' && (
        <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div>
              <span className="font-mono text-xs text-indigo-700 font-semibold">
                ibd [System] - {currentCase.title}
              </span>
              <p className="text-xs text-slate-500 mt-0.5">
                内部块图：刻画部件属性 (Parts)、流端口 (Flow Ports) 与带时延约束的项目流连接器 (Connectors)
              </p>
            </div>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600">
              OMG SysML 1.6 IBD Standard
            </span>
          </div>

          <div className="w-full bg-slate-50/70 border border-slate-200 rounded-lg p-4 overflow-x-auto">
            <svg viewBox="0 0 760 360" className="w-full h-auto min-w-[700px]">
              <defs>
                <marker
                  id="arrow-ibd"
                  viewBox="0 0 10 10"
                  refX="6"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 1 L 8 5 L 0 9 z" fill="#3b82f6" />
                </marker>
              </defs>

              {/* Boundary Frame */}
              <rect x="10" y="10" width="740" height="340" rx="8" fill="#ffffff" stroke="#64748b" strokeWidth="1.5" />
              <path d="M 10 10 h 240 v 22 h -240 z" fill="#f8fafc" />
              <text x="20" y="24" className="text-[9px] font-mono fill-slate-600 font-bold">
                ibd [System Context] {currentCase.code}
              </text>

              {/* Connectors between parts */}
              {currentCase.connectors?.map((con, idx) => {
                const srcIdx = currentCase.blocks.findIndex((b) => b.id === con.sourceBlockId);
                const tgtIdx = currentCase.blocks.findIndex((b) => b.id === con.targetBlockId);
                if (srcIdx === -1 || tgtIdx === -1) return null;

                const srcX = 50 + (srcIdx % 2) * 380 + 170;
                const srcY = 60 + Math.floor(srcIdx / 2) * 140 + 45;
                const tgtX = 50 + (tgtIdx % 2) * 380;
                const tgtY = 60 + Math.floor(tgtIdx / 2) * 140 + 45;

                return (
                  <g key={`con-ibd-${con.id}`}>
                    <path
                      d={`M ${srcX} ${srcY} C ${(srcX + tgtX) / 2} ${srcY}, ${(srcX + tgtX) / 2} ${tgtY}, ${tgtX} ${tgtY}`}
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth="1.8"
                      markerEnd="url(#arrow-ibd)"
                    />
                    <rect
                      x={(srcX + tgtX) / 2 - 50}
                      y={(srcY + tgtY) / 2 - 10}
                      width="100"
                      height="18"
                      rx="3"
                      fill="#ffffff"
                      stroke="#cbd5e1"
                      strokeWidth="1"
                    />
                    <text
                      x={(srcX + tgtX) / 2}
                      y={(srcY + tgtY) / 2 + 2}
                      textAnchor="middle"
                      className="text-[8px] font-mono fill-slate-700 font-medium"
                    >
                      «itemFlow» {con.protocol}
                    </text>
                  </g>
                );
              })}

              {/* Nested Parts */}
              {currentCase.blocks?.map((b, idx) => {
                const x = 50 + (idx % 2) * 380;
                const y = 60 + Math.floor(idx / 2) * 140;

                return (
                  <g key={`part-ibd-${b.id}`}>
                    <rect x={x} y={y} width="220" height="90" rx="4" fill="#f8fafc" stroke="#334155" strokeWidth="1.2" />
                    <text x={x + 10} y={y + 18} className="text-[9px] font-mono fill-slate-500">
                      part : {b.name.slice(0, 14)}
                    </text>
                    <text x={x + 10} y={y + 35} className="text-[10px] font-bold fill-slate-800">
                      [{b.id}]
                    </text>
                    <line x1={x} y1={y + 45} x2={x + 220} y2={y + 45} stroke="#e2e8f0" strokeWidth="1" />

                    {/* Ports on Left/Right Edges */}
                    {(b.ports || []).map((p, pIdx) => {
                      const isLeft = p.direction === 'in';
                      const portX = isLeft ? x - 6 : x + 214;
                      const portY = y + 55 + pIdx * 16;
                      return (
                        <g key={p.id}>
                          <rect x={portX} y={portY - 5} width="12" height="10" fill="#ffffff" stroke="#3b82f6" strokeWidth="1.2" />
                          <text
                            x={isLeft ? x + 12 : x + 205}
                            y={portY + 3}
                            textAnchor={isLeft ? 'start' : 'end'}
                            className="text-[8px] font-mono fill-slate-600"
                          >
                            {p.name}
                          </text>
                        </g>
                      );
                    })}
                  </g>
                );
              })}
            </svg>
          </div>
        </div>
      )}

      {/* View 3: STM (StateMachine Diagram) with LIVE Interactive Simulator */}
      {activeSysmlView === 'stm' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left Diagram (7 Cols) */}
          <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div>
                <span className="font-mono text-xs text-indigo-700 font-semibold">
                  stm [StateMachine] - 安全关键行为状态机
                </span>
                <p className="text-xs text-slate-500 mt-0.5">
                  刻画进入动作 (entry)、内部活动 (doActivity) 与触发器/防护守卫 [triggers / guards]
                </p>
              </div>
              <button
                onClick={handleResetFsm}
                className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>复位状态机</span>
              </button>
            </div>

            {/* State Machine SVG */}
            <div className="w-full bg-slate-50/70 border border-slate-200 rounded-lg p-3 overflow-x-auto">
              <svg viewBox="0 0 560 300" className="w-full h-auto min-w-[500px]">
                <defs>
                  <marker
                    id="arrow-stm"
                    viewBox="0 0 10 10"
                    refX="6"
                    refY="5"
                    markerWidth="6"
                    markerHeight="6"
                    orient="auto-start-reverse"
                  >
                    <path d="M 0 1 L 8 5 L 0 9 z" fill="#0f172a" />
                  </marker>
                </defs>

                {/* Draw Transitions between states */}
                {transitions.map((tr) => {
                  const srcIdx = states.findIndex((s) => s.id === tr.source);
                  const tgtIdx = states.findIndex((s) => s.id === tr.target);
                  if (srcIdx === -1 || tgtIdx === -1) return null;

                  const srcX = 40 + (srcIdx % 3) * 170 + 70;
                  const srcY = 40 + Math.floor(srcIdx / 3) * 130 + 35;
                  const tgtX = 40 + (tgtIdx % 3) * 170 + 70;
                  const tgtY = 40 + Math.floor(tgtIdx / 3) * 130 + 35;

                  const isCurrentSource = currentStateId === tr.source;

                  return (
                    <g key={tr.id}>
                      <path
                        d={`M ${srcX} ${srcY} Q ${(srcX + tgtX) / 2} ${(srcY + tgtY) / 2 - 15} ${tgtX} ${tgtY}`}
                        fill="none"
                        stroke={isCurrentSource ? '#6366f1' : '#94a3b8'}
                        strokeWidth={isCurrentSource ? '2' : '1.2'}
                        markerEnd="url(#arrow-stm)"
                      />
                      <text
                        x={(srcX + tgtX) / 2}
                        y={(srcY + tgtY) / 2 - 5}
                        textAnchor="middle"
                        className="text-[7px] font-mono fill-slate-600 bg-white"
                      >
                        {tr.trigger.slice(0, 14)}
                      </text>
                    </g>
                  );
                })}

                {/* Draw State Rounded Rectangles */}
                {states.map((st, idx) => {
                  const x = 40 + (idx % 3) * 170;
                  const y = 40 + Math.floor(idx / 3) * 130;
                  const isActive = currentStateId === st.id;

                  return (
                    <g
                      key={st.id}
                      onClick={() => setCurrentStateId(st.id)}
                      className="cursor-pointer"
                    >
                      <rect
                        x={x}
                        y={y}
                        width="140"
                        height="70"
                        rx="12"
                        fill={isActive ? '#e0e7ff' : '#ffffff'}
                        stroke={isActive ? '#4338ca' : '#64748b'}
                        strokeWidth={isActive ? '2.5' : '1.2'}
                        className="transition-all"
                      />
                      {/* Active glowing indicator */}
                      {isActive && (
                        <circle cx={x + 125} cy={y + 15} r="4" fill="#4338ca" className="animate-ping" />
                      )}

                      <text x={x + 70} y={y + 18} textAnchor="middle" className="text-[10px] font-bold fill-slate-800">
                        {st.name.slice(0, 14)}
                      </text>
                      <line x1={x} y1={y + 26} x2={x + 140} y2={y + 26} stroke={isActive ? '#c7d2fe' : '#e2e8f0'} strokeWidth="1" />

                      {/* Entry action */}
                      {st.entryAction && (
                        <text x={x + 8} y={y + 38} className="text-[7.5px] font-mono fill-indigo-700 truncate">
                          entry / {st.entryAction.slice(0, 16)}
                        </text>
                      )}
                      {/* Do activity */}
                      {st.doActivity && (
                        <text x={x + 8} y={y + 50} className="text-[7.5px] font-mono fill-slate-600 truncate">
                          do / {st.doActivity.slice(0, 18)}
                        </text>
                      )}
                      <text x={x + 8} y={y + 62} className="text-[7px] font-mono fill-slate-400">
                        type: {st.type}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>

          {/* Right Live State Simulator Controls (5 Cols) */}
          <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs space-y-4">
            <div>
              <div className="flex items-center gap-2">
                <Play className="w-4 h-4 text-emerald-600" />
                <h3 className="text-sm font-semibold text-slate-900">
                  动态工况转移与故障注入机 (Fault Injector)
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                实时向状态机派发离散事件，验证故障导向安全 (Fail-Safe)
              </p>
            </div>

            {/* Current State Info Banner */}
            <div className="p-3 rounded-lg bg-indigo-50 border border-indigo-200/80 space-y-1">
              <span className="text-[10px] font-mono text-indigo-600 uppercase font-bold">
                当前活跃状态 (Active State)
              </span>
              <div className="text-sm font-bold text-indigo-950 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 animate-pulse"></span>
                {currentState.name}
              </div>
              <div className="text-xs text-indigo-800 font-mono pt-1">
                执行动作: {currentState.doActivity || 'None'}
              </div>
            </div>

            {/* Available Triggers from Current State */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-800">
                可派发事件触发器 (Outgoing Triggers):
              </span>
              <div className="space-y-1.5">
                {transitions
                  .filter((t) => t.source === currentStateId)
                  .map((tr) => (
                    <button
                      key={tr.id}
                      onClick={() => handleTriggerTransition(tr.trigger, tr.target, tr.action)}
                      className="w-full text-left p-2.5 rounded-lg border border-slate-200 hover:border-indigo-500 hover:bg-indigo-50/50 text-xs transition-all flex items-center justify-between cursor-pointer group"
                    >
                      <div>
                        <div className="font-medium text-slate-800 group-hover:text-indigo-900">
                          {tr.trigger}
                        </div>
                        {tr.guard && (
                          <div className="text-[10px] text-slate-400 font-mono">
                            守卫条件: {tr.guard}
                          </div>
                        )}
                      </div>
                      <span className="text-[11px] font-mono text-indigo-600 font-semibold">
                        ⟶ {states.find((s) => s.id === tr.target)?.name.split(' ')[0]}
                      </span>
                    </button>
                  ))}

                {transitions.filter((t) => t.source === currentStateId).length === 0 && (
                  <div className="p-3 rounded-lg bg-slate-50 text-center text-slate-400 text-xs">
                    当前状态为终止态 (Final State)，无后继迁移。可点击上方复位按钮。
                  </div>
                )}
              </div>
            </div>

            {/* Transition Event Log */}
            <div className="space-y-1 pt-2 border-t border-slate-100">
              <span className="text-[11px] font-medium text-slate-500">
                实时仿真日志跟踪 (Audit Log)
              </span>
              <div className="bg-slate-900 text-slate-200 p-2.5 rounded-lg font-mono text-[10px] space-y-1 max-h-[140px] overflow-y-auto">
                {transitionLogs.map((log, idx) => (
                  <div key={idx} className={idx === 0 ? 'text-emerald-400 font-semibold' : 'text-slate-400'}>
                    {log}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View 4: Req Diagram (Requirement Diagram) */}
      {activeSysmlView === 'req' && (
        <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div>
              <span className="font-mono text-xs text-indigo-700 font-semibold">
                req [Requirements] - {currentCase.title}
              </span>
              <p className="text-xs text-slate-500 mt-0.5">
                呈现带有 «requirement» 构造型的需求方框，包含 ID、文本与分级派生 «deriveReqt» 层次结构
              </p>
            </div>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600">
              OMG SysML 1.6 Req Diagram
            </span>
          </div>

          <div className="w-full bg-slate-50/70 border border-slate-200 rounded-lg p-4 overflow-x-auto">
            <svg viewBox="0 0 760 360" className="w-full h-auto min-w-[700px]">
              <defs>
                <marker
                  id="arrow-derive"
                  viewBox="0 0 10 10"
                  refX="6"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 1 L 8 5 L 0 9 z" fill="#6366f1" />
                </marker>
              </defs>

              {/* Requirement boxes arranged hierarchically */}
              {currentCase.requirements?.map((r, idx) => {
                const col = idx % 3;
                const row = Math.floor(idx / 3);
                const x = 30 + col * 240;
                const y = 30 + row * 160;

                return (
                  <g key={`req-box-${r.id}`}>
                    <rect x={x} y={y} width="210" height="120" rx="4" fill="#ffffff" stroke="#4f46e5" strokeWidth="1.2" />
                    {/* Header */}
                    <path d={`M ${x} ${y} h 210 v 24 h -210 z`} fill="#eef2ff" />
                    <text x={x + 105} y={y + 16} textAnchor="middle" className="text-[9px] font-mono fill-indigo-700 font-bold">
                      «requirement»
                    </text>
                    <text x={x + 8} y={y + 36} className="text-[10px] font-mono font-bold fill-slate-800">
                      ID: {r.id}
                    </text>
                    <text x={x + 8} y={y + 48} className="text-[9px] font-semibold fill-slate-700 truncate">
                      {r.title.slice(0, 16)}
                    </text>
                    <line x1={x} y1={y + 54} x2={x + 210} y2={y + 54} stroke="#e2e8f0" strokeWidth="1" />
                    <text x={x + 8} y={y + 68} className="text-[8px] fill-slate-500">
                      Text: {r.description.slice(0, 36)}...
                    </text>
                    <text x={x + 8} y={y + 92} className="text-[8px] font-mono fill-slate-400">
                      Safety: {r.safetyLevel || 'QM'} | Verif: {r.verificationMethod}
                    </text>
                    <text x={x + 8} y={y + 106} className="text-[8px] font-mono fill-emerald-600">
                      Satisfied by: {r.allocatedBlockIds.length} blocks
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>
      )}
    </div>
  );
};
