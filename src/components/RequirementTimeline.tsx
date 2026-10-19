import React, { useState } from 'react';
import { Requirement, RequirementStatus, RequirementStatusHistoryEntry } from '../types/mbse';
import { 
  History, 
  CheckCircle2, 
  Clock, 
  User, 
  FileEdit, 
  Layers, 
  ShieldCheck, 
  ArrowRight, 
  Plus, 
  Calendar,
  Sparkles,
  GitCommit,
  Check,
  X,
  FileText
} from 'lucide-react';

interface RequirementTimelineProps {
  requirement: Requirement;
  onUpdateRequirement?: (updatedReq: Requirement) => void;
}

export const RequirementTimeline: React.FC<RequirementTimelineProps> = ({
  requirement,
  onUpdateRequirement,
}) => {
  const [isAddingHistory, setIsAddingHistory] = useState(false);
  const [newStatus, setNewStatus] = useState<RequirementStatus>('approved');
  const [newAuthor, setNewAuthor] = useState('李工 (系统主任架构师)');
  const [newComment, setNewComment] = useState('');
  const [newVersion, setNewVersion] = useState(requirement.version || 'v2.0');

  // Status configuration definitions
  const statusConfig: Record<
    RequirementStatus,
    { label: string; enLabel: string; bg: string; text: string; border: string; step: number; icon: React.ReactNode }
  > = {
    draft: {
      label: '草稿编制',
      enLabel: 'Draft',
      bg: 'bg-slate-100',
      text: 'text-slate-700',
      border: 'border-slate-300',
      step: 1,
      icon: <FileEdit className="w-3.5 h-3.5 text-slate-600" />,
    },
    approved: {
      label: '基线评审',
      enLabel: 'Approved',
      bg: 'bg-blue-50',
      text: 'text-blue-700',
      border: 'border-blue-300',
      step: 2,
      icon: <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />,
    },
    implemented: {
      label: '架构实现',
      enLabel: 'Implemented',
      bg: 'bg-amber-50',
      text: 'text-amber-800',
      border: 'border-amber-300',
      step: 3,
      icon: <Layers className="w-3.5 h-3.5 text-amber-600" />,
    },
    verified: {
      label: '验证闭环',
      enLabel: 'Verified',
      bg: 'bg-emerald-50',
      text: 'text-emerald-800',
      border: 'border-emerald-300',
      step: 4,
      icon: <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />,
    },
  };

  // Helper to get or synthesize history
  const getResolvedHistory = (): RequirementStatusHistoryEntry[] => {
    if (requirement.statusHistory && requirement.statusHistory.length > 0) {
      return requirement.statusHistory;
    }

    // Synthesize realistic history based on current status and version
    const synthesized: RequirementStatusHistoryEntry[] = [
      {
        id: `${requirement.id}-hist-1`,
        status: 'draft',
        timestamp: '2025-11-10 09:30',
        author: '张工 (需求系统分析师)',
        comment: `初始定义利益攸关者关切并形成规范草案。`,
        version: 'v1.0',
      },
    ];

    if (requirement.status === 'approved' || requirement.status === 'implemented' || requirement.status === 'verified') {
      synthesized.push({
        id: `${requirement.id}-hist-2`,
        status: 'approved',
        timestamp: '2025-12-05 14:15',
        author: '王总师 (系统工程评审委员会)',
        comment: `通过系统需求基线审查 (SRR)，形式化合规性与安全性评级评定为 ${requirement.safetyLevel || 'QM'}。`,
        version: 'v1.1',
      });
    }

    if (requirement.status === 'implemented' || requirement.status === 'verified') {
      synthesized.push({
        id: `${requirement.id}-hist-3`,
        status: 'implemented',
        timestamp: '2026-01-20 16:40',
        author: '赵工 (物理架构与接口团队)',
        comment: `完成逻辑与物理架构满足关系映射，已分配至 [${(requirement.allocatedBlockIds || []).join(', ') || '核心计算组件'}]。`,
        version: 'v1.3',
      });
    }

    if (requirement.status === 'verified') {
      synthesized.push({
        id: `${requirement.id}-hist-4`,
        status: 'verified',
        timestamp: '2026-03-02 11:00',
        author: '刘工 (适航与功能安全验证部)',
        comment: `通过 ${requirement.verificationMethod || 'Test'} 形式化验证与硬件在环 (HIL) 注入测试，满足安全完整性闭环准则。`,
        version: requirement.version || 'v2.0',
      });
    }

    return synthesized;
  };

  const historyEntries = getResolvedHistory();
  const currentStep = statusConfig[requirement.status]?.step || 1;
  const progressPercent = Math.round((currentStep / 4) * 100);

  // Quick next status target
  const getNextStatus = (current: RequirementStatus): RequirementStatus | null => {
    switch (current) {
      case 'draft':
        return 'approved';
      case 'approved':
        return 'implemented';
      case 'implemented':
        return 'verified';
      case 'verified':
        return null;
    }
  };

  const nextStatus = getNextStatus(requirement.status);

  // Advance status or add manual history log
  const handleAddHistorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!onUpdateRequirement) return;

    const newEntry: RequirementStatusHistoryEntry = {
      id: `${requirement.id}-hist-${Date.now().toString().slice(-4)}`,
      status: newStatus,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
      author: newAuthor.trim() || '系统工程师',
      comment: newComment.trim() || `状态由 ${statusConfig[requirement.status].label} 推进至 ${statusConfig[newStatus].label}`,
      version: newVersion.trim() || requirement.version,
    };

    const updatedHistory = [...historyEntries, newEntry];
    const updatedReq: Requirement = {
      ...requirement,
      status: newStatus,
      version: newVersion.trim() || requirement.version,
      statusHistory: updatedHistory,
    };

    onUpdateRequirement(updatedReq);
    setIsAddingHistory(false);
    setNewComment('');
  };

  // Quick advance handler
  const handleQuickAdvance = () => {
    if (!nextStatus || !onUpdateRequirement) return;

    const defaultComments: Record<RequirementStatus, string> = {
      draft: '复核需求文本并进入草案阶段',
      approved: '通过工程评审委员会联合评审，冻结为研制基线',
      implemented: `已完成与物理 Block 架构满足映射 «satisfy»`,
      verified: `根据验证手段 (${requirement.verificationMethod}) 完成全流程覆盖验收闭环`,
    };

    const newEntry: RequirementStatusHistoryEntry = {
      id: `${requirement.id}-hist-${Date.now().toString().slice(-4)}`,
      status: nextStatus,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
      author: '系统工程评审组',
      comment: defaultComments[nextStatus],
      version: requirement.version,
    };

    const updatedHistory = [...historyEntries, newEntry];
    const updatedReq: Requirement = {
      ...requirement,
      status: nextStatus,
      statusHistory: updatedHistory,
    };

    onUpdateRequirement(updatedReq);
  };

  return (
    <div className="space-y-4 pt-1">
      {/* Header & Lifecycle Maturity Banner */}
      <div className="bg-slate-50/80 rounded-xl p-3 border border-slate-200/80 space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-indigo-600" />
            <h4 className="text-xs font-bold text-slate-800">
              需求状态演进生命周期 (Status Evolution Timeline)
            </h4>
          </div>
          <span className="text-[11px] font-mono text-slate-500">
            成熟度: <strong className="text-indigo-700">{progressPercent}%</strong>
          </span>
        </div>

        {/* 4-Stage Stepper Progress Bar */}
        <div className="space-y-1.5">
          <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-linear-to-r from-blue-500 via-indigo-500 to-emerald-500 transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="grid grid-cols-4 gap-1 text-[10px] text-center font-medium">
            {(['draft', 'approved', 'implemented', 'verified'] as RequirementStatus[]).map((st) => {
              const cfg = statusConfig[st];
              const isPassed = cfg.step <= currentStep;
              const isCurrent = requirement.status === st;

              return (
                <div
                  key={st}
                  className={`py-1 px-1 rounded-md transition-colors ${
                    isCurrent
                      ? 'bg-white shadow-2xs font-bold text-indigo-800 border border-indigo-200'
                      : isPassed
                      ? 'text-slate-700 font-medium'
                      : 'text-slate-400'
                  }`}
                >
                  <div className="flex items-center justify-center gap-1">
                    {cfg.icon}
                    <span>{cfg.label}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Toolbar */}
        <div className="flex items-center justify-between pt-1 border-t border-slate-200/60">
          <span className="text-[11px] text-slate-500">
            共计 <strong className="text-slate-800 font-mono">{historyEntries.length}</strong> 次状态变更与审计
          </span>

          <div className="flex items-center gap-1.5">
            {nextStatus && onUpdateRequirement && (
              <button
                onClick={handleQuickAdvance}
                className="px-2.5 py-1 rounded-md bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-[11px] font-medium transition-colors cursor-pointer flex items-center gap-1"
                title={`一键推进至 ${statusConfig[nextStatus].label}`}
              >
                <ArrowRight className="w-3 h-3" />
                <span>推进至: {statusConfig[nextStatus].label}</span>
              </button>
            )}

            {onUpdateRequirement && (
              <button
                onClick={() => {
                  setNewStatus(nextStatus || requirement.status);
                  setIsAddingHistory(!isAddingHistory);
                }}
                className="px-2.5 py-1 rounded-md bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-medium transition-colors cursor-pointer flex items-center gap-1"
              >
                <Plus className="w-3 h-3" />
                <span>记录演进</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Add New Status History Modal / Inline Drawer */}
      {isAddingHistory && onUpdateRequirement && (
        <form
          onSubmit={handleAddHistorySubmit}
          className="p-3.5 rounded-xl bg-indigo-50/50 border border-indigo-200 space-y-2.5 text-xs animate-in fade-in duration-150"
        >
          <div className="flex items-center justify-between">
            <span className="font-bold text-indigo-900 flex items-center gap-1.5">
              <GitCommit className="w-3.5 h-3.5 text-indigo-600" />
              新增需求状态变更记录 (Record Status Transition)
            </span>
            <button
              type="button"
              onClick={() => setIsAddingHistory(false)}
              className="text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[11px] font-medium text-slate-700 mb-1">目标状态 (Target Status)</label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value as RequirementStatus)}
                className="w-full bg-white border border-slate-300 rounded-md px-2 py-1 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-hidden"
              >
                <option value="draft">草稿编制 (Draft)</option>
                <option value="approved">基线评审 (Approved)</option>
                <option value="implemented">架构实现 (Implemented)</option>
                <option value="verified">验证闭环 (Verified)</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-700 mb-1">规格版本 (Version)</label>
              <input
                type="text"
                value={newVersion}
                onChange={(e) => setNewVersion(e.target.value)}
                placeholder="例如: v2.1"
                className="w-full bg-white border border-slate-300 rounded-md px-2 py-1 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-hidden font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-700 mb-1">评审人 / 责任部门 (Author / Role)</label>
            <input
              type="text"
              required
              value={newAuthor}
              onChange={(e) => setNewAuthor(e.target.value)}
              placeholder="例如: 李工 (主任系统架构师)"
              className="w-full bg-white border border-slate-300 rounded-md px-2 py-1 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-700 mb-1">审计说明 / 变更依据 (Audit Notes)</label>
            <textarea
              rows={2}
              required
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="说明状态演进的评审结论、接口覆盖或测试通过证据..."
              className="w-full bg-white border border-slate-300 rounded-md p-1.5 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-hidden leading-relaxed"
            />
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setIsAddingHistory(false)}
              className="px-2.5 py-1 rounded-md text-slate-600 hover:bg-slate-200 text-xs transition-colors cursor-pointer"
            >
              取消
            </button>
            <button
              type="submit"
              className="px-3 py-1 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs transition-colors cursor-pointer flex items-center gap-1 shadow-xs"
            >
              <Check className="w-3.5 h-3.5" />
              <span>确认追加记录并更新状态</span>
            </button>
          </div>
        </form>
      )}

      {/* Vertical Interactive Timeline Visualization */}
      <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
        {historyEntries.map((entry, idx) => {
          const cfg = statusConfig[entry.status] || statusConfig.draft;
          const isLatest = idx === historyEntries.length - 1;

          return (
            <div key={entry.id || idx} className="relative group">
              {/* Timeline Node Marker */}
              <div
                className={`absolute -left-6 top-1 w-5 h-5 rounded-full flex items-center justify-center border-2 transition-transform group-hover:scale-110 shadow-2xs ${
                  isLatest
                    ? 'bg-indigo-600 border-indigo-200 text-white ring-2 ring-indigo-300'
                    : 'bg-white border-slate-300 text-slate-600'
                }`}
              >
                {cfg.icon}
              </div>

              {/* Timeline Card */}
              <div
                className={`p-3 rounded-lg border text-xs transition-all ${
                  isLatest
                    ? 'bg-white border-indigo-200 shadow-xs ring-1 ring-indigo-50/50'
                    : 'bg-slate-50/50 border-slate-200 hover:bg-white'
                }`}
              >
                {/* Status + Version + Timestamp Line */}
                <div className="flex flex-wrap items-center justify-between gap-1.5 mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold border ${cfg.bg} ${cfg.text} ${cfg.border}`}
                    >
                      {cfg.icon}
                      <span>{cfg.label}</span>
                      <span className="font-mono text-[9px] opacity-75">({cfg.enLabel})</span>
                    </span>

                    {entry.version && (
                      <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 font-semibold">
                        {entry.version}
                      </span>
                    )}

                    {isLatest && (
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                        当前基线
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1 text-[10px] text-slate-400 font-mono">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span>{entry.timestamp}</span>
                  </div>
                </div>

                {/* Author Info */}
                <div className="flex items-center gap-1.5 text-[11px] text-slate-600 mb-1">
                  <User className="w-3 h-3 text-slate-400" />
                  <span className="font-medium text-slate-700">{entry.author}</span>
                </div>

                {/* Audit Comments */}
                {entry.comment && (
                  <p className="text-[11px] text-slate-600 bg-slate-50 rounded-md p-2 border border-slate-100 leading-relaxed font-sans">
                    {entry.comment}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
