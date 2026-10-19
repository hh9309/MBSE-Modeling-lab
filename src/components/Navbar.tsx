import React from 'react';
import { 
  Layers, 
  Sparkles, 
  Download, 
  PlayCircle, 
  CheckCircle2, 
  BookOpen, 
  Cpu, 
  Workflow, 
  FileSpreadsheet, 
  GitFork,
  Activity,
  Box
} from 'lucide-react';
import { CaseStudy } from '../types/mbse';

export type ModuleKey = 
  | 'algebra' 
  | 'requirements' 
  | 'architecture' 
  | 'sysml' 
  | 'cases' 
  | 'code' 
  | 'copilot'
  | 'workflow' 
  | 'matrix' 
  | 'export' 
  | 'slices';

interface NavbarProps {
  activeModule: ModuleKey;
  setActiveModule: (module: ModuleKey) => void;
  caseStudies: CaseStudy[];
  currentCase: CaseStudy;
  setCurrentCaseId: (id: string) => void;
  onOpenAiCopilot: (checkType?: string) => void;
  coverageRate: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeModule,
  setActiveModule,
  caseStudies,
  currentCase,
  setCurrentCaseId,
  onOpenAiCopilot,
  coverageRate,
}) => {
  const navItems: { key: ModuleKey; label: string; icon: React.ReactNode; badge?: string }[] = [
    { key: 'algebra', label: '1. 建模代数', icon: <GitFork className="w-3.5 h-3.5" /> },
    { key: 'requirements', label: '2. 需求与追踪矩阵', icon: <Layers className="w-3.5 h-3.5" /> },
    { key: 'architecture', label: '3. 架构建模', icon: <Box className="w-3.5 h-3.5" /> },
    { key: 'sysml', label: '4. SysML多视角', icon: <Activity className="w-3.5 h-3.5" /> },
    { key: 'cases', label: '5. 六大案例', icon: <BookOpen className="w-3.5 h-3.5" /> },
    { key: 'code', label: '6. 代码引擎', icon: <Cpu className="w-3.5 h-3.5" /> },
    { key: 'copilot', label: '7. AI 随诊', icon: <Sparkles className="w-3.5 h-3.5 text-indigo-500" /> },
    { key: 'workflow', label: '8. 全流程导引', icon: <Workflow className="w-3.5 h-3.5" /> },
    { key: 'export', label: '9. 报告导出', icon: <Download className="w-3.5 h-3.5" /> },
    { key: 'slices', label: '10. 模型要素', icon: <BookOpen className="w-3.5 h-3.5" /> },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      {/* Top Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3">
        {/* Brand & Lab Identity */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-linear-to-tr from-slate-900 via-indigo-950 to-slate-800 flex items-center justify-center shadow-xs text-white">
            <span className="font-mono font-bold text-sm tracking-tighter">M</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-semibold text-slate-900 text-sm sm:text-base tracking-tight">
                MBSE 系统建模实验室
              </h1>
              <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                v2.6 Formal Engine
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block">
              需求多级追踪 • SysML 多视角演播 • 代数拓扑映射 • 形式化验证
            </p>
          </div>
        </div>

        {/* Case Switcher & Status Pill */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs">
            <span className="text-slate-500 font-medium">当前案例:</span>
            <select
              value={currentCase.id}
              onChange={(e) => setCurrentCaseId(e.target.value)}
              className="bg-transparent font-medium text-slate-800 focus:outline-hidden cursor-pointer max-w-[210px] sm:max-w-[260px] truncate"
            >
              {caseStudies.map((cs) => (
                <option key={cs.id} value={cs.id}>
                  {cs.code} - {cs.title}
                </option>
              ))}
            </select>
          </div>

          {/* Traceability health pill */}
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-medium">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>需求覆盖率: {coverageRate}%</span>
          </div>

          {/* AI Copilot Button (Module 7) */}
          <button
            onClick={() => onOpenAiCopilot()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-linear-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white text-xs font-medium shadow-xs transition-all cursor-pointer active:scale-95"
            title="打开 7. AI 诊断与大模型 Q&A 随诊"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-200 animate-pulse" />
            <span>7. AI 随诊</span>
          </button>
        </div>
      </div>

      {/* Module Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <nav className="flex items-center space-x-1 overflow-x-auto py-1 scrollbar-none border-t border-slate-100">
          {navItems.map((item) => {
            const isActive = activeModule === item.key;
            return (
              <button
                key={item.key}
                onClick={() => setActiveModule(item.key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
                {item.badge && (
                  <span
                    className={`ml-1 text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                      isActive ? 'bg-indigo-500 text-white' : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
