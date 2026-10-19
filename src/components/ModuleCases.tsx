import React from 'react';
import { CaseStudy } from '../types/mbse';
import { 
  BookOpen, 
  Car, 
  Rocket, 
  Train, 
  Plane, 
  Activity, 
  Cpu, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck,
  Sparkles
} from 'lucide-react';

interface ModuleCasesProps {
  caseStudies: CaseStudy[];
  currentCase: CaseStudy;
  onSelectCase: (caseId: string) => void;
  onOpenAiCopilot: (checkType?: string) => void;
}

export const ModuleCases: React.FC<ModuleCasesProps> = ({
  caseStudies,
  currentCase,
  onSelectCase,
  onOpenAiCopilot,
}) => {
  const getCaseIcon = (idx: number) => {
    switch (idx) {
      case 0:
        return <Car className="w-5 h-5 text-blue-600" />;
      case 1:
        return <Rocket className="w-5 h-5 text-indigo-600" />;
      case 2:
        return <Train className="w-5 h-5 text-emerald-600" />;
      case 3:
        return <Plane className="w-5 h-5 text-amber-600" />;
      case 4:
        return <Activity className="w-5 h-5 text-purple-600" />;
      case 5:
        return <Cpu className="w-5 h-5 text-rose-600" />;
      default:
        return <BookOpen className="w-5 h-5 text-slate-600" />;
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
                模块 05
              </span>
              <h2 className="text-lg font-semibold text-slate-900 tracking-tight">
                六大 MBSE 系统建模实战案例库 (Six Engineering Case Studies)
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1 max-w-3xl leading-relaxed">
              汇集横跨智能汽车、航天测控、高铁网络控制、无人机蜂群、大型医疗影像与柔性制造单元的六大顶级复杂工程系统。
              每个案例均具备全套形式化需求树、BDD/IBD 架构拓扑、安全状态机与全链路追踪矩阵，点击即可全局热切换。
            </p>
          </div>

          <button
            onClick={() => onOpenAiCopilot('六大案例跨学科建模方法论横向对比')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-medium transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI 跨案例对比咨询</span>
          </button>
        </div>
      </div>

      {/* 6 Cases Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {caseStudies.map((cs, idx) => {
          const isSelected = cs.id === currentCase.id;

          return (
            <div
              key={cs.id}
              className={`bg-white rounded-xl border transition-all shadow-xs flex flex-col justify-between overflow-hidden ${
                isSelected
                  ? 'border-indigo-600 ring-2 ring-indigo-500/20'
                  : 'border-slate-200 hover:border-slate-300 hover:shadow-md'
              }`}
            >
              <div className="p-5 space-y-3">
                {/* Header tag and icon */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center">
                      {getCaseIcon(idx)}
                    </div>
                    <div>
                      <span className="text-[10px] font-mono font-bold text-indigo-600 uppercase">
                        {cs.code}
                      </span>
                      <h3 className="text-sm font-bold text-slate-900">
                        {cs.title}
                      </h3>
                    </div>
                  </div>

                  {isSelected && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200">
                      当前载入
                    </span>
                  )}
                </div>

                {/* Subtitle / Mapping Focus */}
                <p className="text-xs text-indigo-800 font-medium bg-indigo-50/60 p-2 rounded-lg border border-indigo-100/70">
                  {cs.subtitle}
                </p>

                {/* Description */}
                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                  {cs.description}
                </p>

                {/* Standards */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {cs.standards.map((std) => (
                    <span
                      key={std}
                      className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200/80"
                    >
                      {std}
                    </span>
                  ))}
                </div>

                {/* Key Highlights list */}
                <div className="space-y-1 pt-2 border-t border-slate-100 text-xs">
                  <span className="text-[11px] font-semibold text-slate-700">MBSE 映射要点:</span>
                  <ul className="space-y-1">
                    {cs.keyHighlights.slice(0, 3).map((hl, hIdx) => (
                      <li key={hIdx} className="text-[11px] text-slate-500 flex items-start gap-1.5">
                        <span className="text-indigo-500 font-bold">•</span>
                        <span>{hl}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Footer */}
              <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                <div className="text-[11px] font-mono text-slate-500">
                  {cs.requirements.length} Reqs | {cs.blocks.length} Blocks
                </div>

                <button
                  onClick={() => onSelectCase(cs.id)}
                  disabled={isSelected}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                      : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs'
                  }`}
                >
                  <span>{isSelected ? '已在工作台' : '一键载入工程'}</span>
                  {!isSelected && <ArrowRight className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
