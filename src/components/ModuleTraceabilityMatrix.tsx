import React, { useState } from 'react';
import { CaseStudy, Requirement, Block } from '../types/mbse';
import { 
  FileSpreadsheet, 
  Check, 
  AlertTriangle, 
  Download, 
  HelpCircle, 
  Sparkles,
  CheckCircle2,
  Filter
} from 'lucide-react';

interface ModuleTraceabilityMatrixProps {
  currentCase: CaseStudy;
  onToggleAllocation: (reqId: string, blockId: string) => void;
  onOpenAiCopilot: (checkType?: string) => void;
}

export const ModuleTraceabilityMatrix: React.FC<ModuleTraceabilityMatrixProps> = ({
  currentCase,
  onToggleAllocation,
  onOpenAiCopilot,
}) => {
  const [filterLevel, setFilterLevel] = useState<'all' | 'stakeholder' | 'system' | 'subsystem'>('all');
  const [onlyDangling, setOnlyDangling] = useState<boolean>(false);

  const reqs = currentCase.requirements || [];
  const blocks = currentCase.blocks || [];

  const filteredReqs = reqs.filter((r) => {
    const matchLevel = filterLevel === 'all' || r.level === filterLevel;
    const isDangling = (r.allocatedBlockIds || []).length === 0;
    if (onlyDangling) return matchLevel && isDangling;
    return matchLevel;
  });

  const totalReqs = reqs.length;
  const satisfiedReqs = reqs.filter((r) => (r.allocatedBlockIds || []).length > 0).length;
  const coverageRate = totalReqs > 0 ? Math.round((satisfiedReqs / totalReqs) * 100) : 100;

  const handleExportCsv = () => {
    const headers = ['Requirement ID', 'Title', 'Level', 'Safety Level', ...blocks.map((b) => b.name)];
    const rows = reqs.map((r) => [
      r.id,
      `"${r.title.replace(/"/g, '""')}"`,
      r.level,
      r.safetyLevel || 'QM',
      ...blocks.map((b) => ((r.allocatedBlockIds || []).includes(b.id) ? '1' : '0')),
    ]);

    const csvContent = [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentCase.code}_traceability_matrix.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Module Title Header */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 text-[11px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200/60 rounded-md">
                全链路追踪
              </span>
              <h2 className="text-lg font-semibold text-slate-900 tracking-tight">
                需求-组件全链路双向追踪矩阵 (Traceability Matrix - RTM)
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1 max-w-3xl leading-relaxed">
              支持点击任意矩阵单元格动态建立/断开 «satisfy» 分配关系。
              实时推导需求悬空状态与未分配组件，确保上游工程变更时具备精确的影响爆炸半径 (Blast Radius) 分析能力。
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenAiCopilot('需求追踪矩阵漏洞与悬空风险诊断')}
              className="px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-medium transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 inline mr-1" />
              AI 矩阵审查
            </button>
            <button
              onClick={handleExportCsv}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium shadow-xs transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>导出 RTM (CSV)</span>
            </button>
          </div>
        </div>

        {/* Coverage Meter Banner */}
        <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
            <span className="text-slate-600">双向覆盖率指标:</span>
            <span className="font-mono text-base font-bold text-indigo-700">{coverageRate}%</span>
          </div>
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
            <span className="text-slate-600">已闭环满足需求:</span>
            <span className="font-mono text-base font-bold text-emerald-700">{satisfiedReqs} / {totalReqs}</span>
          </div>
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
            <span className="text-slate-600">悬空孤立需求 (Dangling):</span>
            <span className={`font-mono text-base font-bold ${totalReqs - satisfiedReqs > 0 ? 'text-amber-600' : 'text-slate-400'}`}>
              {totalReqs - satisfiedReqs} 项
            </span>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200 text-xs">
        <div className="flex items-center gap-3">
          <span className="text-slate-500 font-medium">筛选层级:</span>
          <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200">
            {(['all', 'stakeholder', 'system', 'subsystem'] as const).map((lvl) => (
              <button
                key={lvl}
                onClick={() => setFilterLevel(lvl)}
                className={`px-2.5 py-1 rounded-md capitalize transition-colors cursor-pointer ${
                  filterLevel === lvl ? 'bg-white text-slate-900 font-medium shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {lvl === 'all' ? '全部' : lvl}
              </button>
            ))}
          </div>

          <label className="flex items-center gap-1.5 text-slate-700 cursor-pointer ml-2">
            <input
              type="checkbox"
              checked={onlyDangling}
              onChange={(e) => setOnlyDangling(e.target.checked)}
              className="rounded text-indigo-600 focus:ring-0"
            />
            <span>仅显示悬空未分配项</span>
          </label>
        </div>

        <div className="text-[11px] text-slate-400">
          💡 点击单元格可切换组件分配映射
        </div>
      </div>

      {/* 2D Interactive Matrix Table */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-700">
                <th className="p-3 text-left font-semibold border-r border-slate-200 min-w-[240px]">
                  需求规范 (Requirement Item)
                </th>
                <th className="p-2 text-center font-semibold border-r border-slate-200 w-20">
                  安全等级
                </th>
                {blocks.map((b) => (
                  <th key={b.id} className="p-2.5 text-center font-mono border-r border-slate-200 min-w-[130px]">
                    <div className="text-[10px] text-slate-400 font-normal">«block»</div>
                    <div className="font-bold text-slate-800 line-clamp-1">{b.name}</div>
                    <div className="text-[9px] text-slate-400 font-mono mt-0.5">{b.id}</div>
                  </th>
                ))}
                <th className="p-2 text-center font-semibold text-slate-700 bg-slate-100/60 w-24">
                  状态
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredReqs.map((r) => {
                const isSatisfied = (r.allocatedBlockIds || []).length > 0;

                return (
                  <tr key={r.id} className="border-b border-slate-100 hover:bg-slate-50/60 transition-colors">
                    {/* Requirement Label */}
                    <td className="p-3 border-r border-slate-200">
                      <div className="flex items-center gap-1.5 font-mono text-[11px] font-bold text-indigo-700">
                        {r.id}
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 font-normal">
                          {r.level}
                        </span>
                      </div>
                      <div className="text-xs font-semibold text-slate-800 mt-0.5">{r.title}</div>
                      <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{r.description}</div>
                    </td>

                    {/* Safety Level */}
                    <td className="p-2 text-center font-mono text-[11px] border-r border-slate-200 font-semibold text-slate-700">
                      {r.safetyLevel || 'QM'}
                    </td>

                    {/* Checkbox Cells for each Block */}
                    {blocks.map((b) => {
                      const isLinked = (r.allocatedBlockIds || []).includes(b.id);

                      return (
                        <td
                          key={`cell-${r.id}-${b.id}`}
                          onClick={() => onToggleAllocation(r.id, b.id)}
                          className={`p-2.5 text-center border-r border-slate-200 cursor-pointer select-none transition-all ${
                            isLinked
                              ? 'bg-emerald-50/70 hover:bg-emerald-100/80 text-emerald-700'
                              : 'hover:bg-slate-100 text-slate-300'
                          }`}
                          title={`点击切换分配: [${r.id}] ⟷ [${b.id}]`}
                        >
                          {isLinked ? (
                            <div className="flex items-center justify-center gap-1 font-mono font-bold text-xs">
                              <Check className="w-4 h-4 text-emerald-600" />
                              <span className="text-[10px]">1</span>
                            </div>
                          ) : (
                            <span className="text-slate-300 font-mono text-xs">0</span>
                          )}
                        </td>
                      );
                    })}

                    {/* Status Pill */}
                    <td className="p-2 text-center">
                      {isSatisfied ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          已闭环
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                          <AlertTriangle className="w-3 h-3 text-amber-600" />
                          悬空
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
