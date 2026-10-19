import React, { useState } from 'react';
import { KNOWLEDGE_SLICES, KnowledgeSlice } from '../data/knowledgeSlices';
import { 
  BookOpen, 
  Layers, 
  GitFork, 
  AlertTriangle, 
  ShieldAlert, 
  CheckCircle2, 
  Sparkles,
  ArrowRight,
  HelpCircle
} from 'lucide-react';

interface ModuleKnowledgeSlicesProps {
  onOpenAiCopilot: (checkType?: string) => void;
  onNavigateToExport?: () => void;
}

export const ModuleKnowledgeSlices: React.FC<ModuleKnowledgeSlicesProps> = ({ 
  onOpenAiCopilot,
  onNavigateToExport,
}) => {
  const [activeSliceId, setActiveSliceId] = useState<string>(KNOWLEDGE_SLICES[0].id);
  const activeSlice = KNOWLEDGE_SLICES.find((s) => s.id === activeSliceId) || KNOWLEDGE_SLICES[0];

  return (
    <div className="space-y-6">
      {/* Module Title Header */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 text-[11px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200/60 rounded-md">
                模块 10
              </span>
              <h2 className="text-lg font-semibold text-slate-900 tracking-tight">
                MBSE 基本要素与多维切片知识导引 (Four Deep Knowledge Slices)
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1 max-w-3xl leading-relaxed">
              针对 MBSE 落地中的元模型支撑、全链路追踪、致命陷阱规避与方法论误区进行多维切片解构，
              帮助系统工程师建立形式化严谨思维，杜绝“画图式建模”假象。
            </p>
          </div>

          <button
            onClick={() => onOpenAiCopilot('MBSE四大切片方法论与企业落地方案深度探讨')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-medium transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI 方法论随诊</span>
          </button>
        </div>

        {/* 4 Slice Horizontal Selector */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-5 pt-4 border-t border-slate-100">
          {KNOWLEDGE_SLICES.map((slice) => {
            const isSelected = slice.id === activeSlice.id;
            return (
              <div
                key={slice.id}
                onClick={() => setActiveSliceId(slice.id)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-50/70 border-indigo-500 ring-2 ring-indigo-500/10'
                    : 'bg-slate-50/70 border-slate-200 hover:bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-indigo-100/70 text-indigo-800">
                    {slice.tag}
                  </span>
                  {isSelected && <CheckCircle2 className="w-4 h-4 text-indigo-600" />}
                </div>
                <h4 className="text-xs font-bold text-slate-800 line-clamp-1">{slice.title}</h4>
                <p className="text-[11px] text-slate-500 line-clamp-2 mt-1">{slice.subtitle}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Slice Content Body */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-6 shadow-xs space-y-6">
        {/* Slice Header Quote */}
        <div className="border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-indigo-700 uppercase bg-indigo-50 px-2 py-0.5 rounded">
              {activeSlice.tag}
            </span>
            <h3 className="text-base font-bold text-slate-900">
              {activeSlice.title}
            </h3>
          </div>
          <p className="text-xs text-indigo-900/80 mt-1 font-medium">{activeSlice.subtitle}</p>
          <div className="mt-3 p-3 rounded-lg bg-slate-50 border border-slate-200/80 text-xs text-slate-600 italic">
            {activeSlice.quote}
          </div>
          <p className="text-xs text-slate-600 mt-3 leading-relaxed">
            {activeSlice.summary}
          </p>
        </div>

        {/* Slice 1: R-S-B-P 4 Pillars */}
        {activeSlice.pillars && (
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              MBSE 四大基本要素支柱形式化解析:
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {activeSlice.pillars.map((pillar) => (
                <div
                  key={pillar.letter}
                  className={`p-4 rounded-xl border bg-linear-to-b ${pillar.color} space-y-2`}
                >
                  <div className="w-9 h-9 rounded-lg bg-white/80 border border-black/10 flex items-center justify-center font-mono font-bold text-base text-slate-900 shadow-xs">
                    {pillar.letter}
                  </div>
                  <div className="font-bold text-xs text-slate-900">{pillar.name}</div>
                  <div className="text-[10px] font-mono text-slate-500">{pillar.enName}</div>
                  <p className="text-[11px] text-slate-700 leading-relaxed">{pillar.description}</p>
                  <div className="pt-2 border-t border-black/10 text-[10px] font-mono text-slate-600">
                    对应图: {pillar.sysmlDiagram}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Slice 2: Why-What-Who Matrix Steps */}
        {activeSlice.matrixSteps && (
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              全链路追踪工程链条 (Why ⟶ What ⟶ Who ⟶ How to Prove):
            </h4>
            <div className="space-y-3">
              {activeSlice.matrixSteps.map((step) => (
                <div
                  key={step.step}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 grid grid-cols-1 md:grid-cols-12 gap-3 items-center text-xs"
                >
                  <div className="md:col-span-3">
                    <span className="font-mono text-xs font-bold text-indigo-700">{step.step}</span>
                    <div className="font-bold text-slate-800 mt-0.5">{step.question}</div>
                  </div>
                  <div className="md:col-span-3 text-slate-600">
                    <span className="text-[10px] text-slate-400 block font-mono">工程维度</span>
                    {step.dimension}
                  </div>
                  <div className="md:col-span-3 font-mono text-[11px] text-indigo-900">
                    <span className="text-[10px] text-slate-400 block font-mono">模型实体载体</span>
                    {step.modelArtifact}
                  </div>
                  <div className="md:col-span-3 text-amber-800 bg-amber-50 p-2 rounded-lg border border-amber-200 text-[11px]">
                    <span className="text-[9px] text-amber-600 font-bold block uppercase">若割裂之风险</span>
                    {step.riskIfNotDone}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Slice 3: 3 Fatal Pitfalls */}
        {activeSlice.pitfalls && (
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              三大致命建模陷阱深度解剖与解药 (Anti-patterns & Antidotes):
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {activeSlice.pitfalls.map((pitfall) => (
                <div
                  key={pitfall.name}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2.5 text-xs flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-50 text-red-700 font-bold border border-red-200">
                        危害等级: {pitfall.trapSeverity}
                      </span>
                    </div>
                    <h5 className="font-bold text-sm text-slate-900">{pitfall.name}</h5>
                    <div className="p-2 rounded bg-red-50/50 border border-red-100 text-[11px] text-red-900">
                      <strong>典型症状:</strong> {pitfall.symptom}
                    </div>
                    <div className="text-[11px] text-slate-600 leading-relaxed">
                      <strong>根本成因:</strong> {pitfall.rootCause}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-200/80 space-y-1.5">
                    <div className="text-[11px] text-emerald-800 font-medium">
                      💡 <strong>工程解药:</strong> {pitfall.antidote}
                    </div>
                    <div className="bg-slate-900 text-slate-300 p-2 rounded font-mono text-[10px]">
                      {pitfall.codePattern}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Slice 4: Misconceptions Comparative Table */}
        {activeSlice.misconceptions && (
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              行业严重认知误区辨析 (Myth vs Reality):
            </h4>
            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-700">
                    <th className="p-3 font-semibold w-24">切入视角</th>
                    <th className="p-3 font-semibold text-rose-700 w-1/3">常见误区认知 (Myth)</th>
                    <th className="p-3 font-semibold text-emerald-700 w-1/2">工程真相与规范 (Reality)</th>
                    <th className="p-3 font-semibold text-center w-28">定性结论</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {activeSlice.misconceptions.map((m, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/60">
                      <td className="p-3 font-mono font-bold text-slate-600">{m.contrastAspect}</td>
                      <td className="p-3 text-rose-900 bg-rose-50/30 leading-relaxed">{m.wrongBelief}</td>
                      <td className="p-3 text-slate-700 leading-relaxed">{m.reality}</td>
                      <td className="p-3 text-center">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                          {m.verdict}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Quick Link to Module 9: Case Reports & Raw Data Download */}
        {onNavigateToExport && (
          <div className="mt-6 p-4 rounded-xl bg-linear-to-r from-indigo-50/80 via-slate-50 to-indigo-50/50 border border-indigo-200/80 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <BookOpen className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">
                  六大案例全流程审查报告与原始数据已就绪 (6大模块 • 1000+字/篇)
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  严格遵循全流程导引 6 大阶段，提供 6 大案例原始 JSON 元模型、需求追踪矩阵 CSV 及 SysML XMI 文件下载。
                </p>
              </div>
            </div>

            <button
              onClick={onNavigateToExport}
              className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <span>前往 9. 报告与数据导出</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
