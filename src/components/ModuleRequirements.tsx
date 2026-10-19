import React, { useState } from 'react';
import { Requirement, CaseStudy, StakeholderProfile, PriorityLevel } from '../types/mbse';
import { 
  Layers, 
  Search, 
  Plus, 
  Filter, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  GitBranch, 
  ShieldAlert, 
  Eye,
  SlidersHorizontal,
  Users,
  Flame,
  AlertOctagon,
  AlertTriangle,
  Info,
  ChevronLeft,
  ChevronRight,
  Link as LinkIcon,
  Unlink,
  Check,
  X,
  Building2,
  Mail,
  Sparkles,
  Tag,
  History,
  Clock,
  FileSpreadsheet
} from 'lucide-react';
import { RequirementTimeline } from './RequirementTimeline';
import { ModuleTraceabilityMatrix } from './ModuleTraceabilityMatrix';

interface ModuleRequirementsProps {
  currentCase: CaseStudy;
  onUpdateRequirements: (reqs: Requirement[]) => void;
  onUpdateStakeholders?: (stakeholders: StakeholderProfile[]) => void;
  onToggleAllocation?: (reqId: string, blockId: string) => void;
  onOpenAiCopilot: (checkType?: string) => void;
  initialSubTab?: 'hierarchy' | 'matrix' | 'timeline';
}

export const ModuleRequirements: React.FC<ModuleRequirementsProps> = ({
  currentCase,
  onUpdateRequirements,
  onUpdateStakeholders,
  onToggleAllocation,
  onOpenAiCopilot,
  initialSubTab = 'hierarchy',
}) => {
  const reqs = currentCase.requirements || [];
  const blocks = currentCase.blocks || [];
  const stakeholders = currentCase.stakeholders || [];

  // Sub-tab state: Hierarchy vs Traceability Matrix (RTM) vs Status Timeline
  const [activeTab, setActiveTab] = useState<'hierarchy' | 'matrix' | 'timeline'>(initialSubTab);

  React.useEffect(() => {
    if (initialSubTab) {
      setActiveTab(initialSubTab);
    }
  }, [initialSubTab]);

  // Navigation & Search State
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState<'all' | 'stakeholder' | 'system' | 'subsystem'>('all');
  const [priorityFilter, setPriorityFilter] = useState<'all' | 'critical' | 'high' | 'medium' | 'low' | 'high-risk'>('all');
  const [selectedStakeholderId, setSelectedStakeholderId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);

  // Selected item state
  const [selectedReq, setSelectedReq] = useState<Requirement | null>(reqs[0] || null);
  const [inspectorTab, setInspectorTab] = useState<'details' | 'timeline'>('details');

  // Keep selectedReq synchronized with currentCase and reqs
  React.useEffect(() => {
    if (selectedReq) {
      const match = reqs.find((r) => r.id === selectedReq.id);
      if (match) {
        setSelectedReq(match);
      } else {
        setSelectedReq(reqs[0] || null);
      }
    } else if (reqs.length > 0) {
      setSelectedReq(reqs[0]);
    }
  }, [currentCase.id, reqs]);

  // Update a single requirement and sync with parent state
  const handleUpdateSingleRequirement = (updatedReq: Requirement) => {
    const updated = reqs.map((r) => (r.id === updatedReq.id ? updatedReq : r));
    onUpdateRequirements(updated);
    setSelectedReq(updatedReq);
  };

  // Modals state
  const [isAddingReq, setIsAddingReq] = useState(false);
  const [isAddingStakeholder, setIsAddingStakeholder] = useState(false);
  const [managingStakeholderLink, setManagingStakeholderLink] = useState<StakeholderProfile | null>(null);

  // New requirement form state
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newLevel, setNewLevel] = useState<'stakeholder' | 'system' | 'subsystem'>('system');
  const [newPriority, setNewPriority] = useState<PriorityLevel>('critical');
  const [newSafety, setNewSafety] = useState('ASIL-D');
  const [newMethod, setNewMethod] = useState<'Test' | 'Demonstration' | 'Analysis' | 'Inspection'>('Test');
  const [newStakeholderId, setNewStakeholderId] = useState<string>(stakeholders[0]?.id || '');

  // New stakeholder form state
  const [newStkName, setNewStkName] = useState('');
  const [newStkRole, setNewStkRole] = useState('');
  const [newStkOrg, setNewStkOrg] = useState('');
  const [newStkInfluence, setNewStkInfluence] = useState<'critical' | 'high' | 'medium'>('critical');
  const [newStkConcerns, setNewStkConcerns] = useState('');
  const [newStkContact, setNewStkContact] = useState('');

  // Priority count statistics
  const criticalCount = reqs.filter((r) => r.priority === 'critical').length;
  const highCount = reqs.filter((r) => r.priority === 'high').length;
  const mediumCount = reqs.filter((r) => r.priority === 'medium').length;
  const lowCount = reqs.filter((r) => r.priority === 'low').length;

  // Filter requirements based on search, level, priority, and selected stakeholder
  const filteredReqs = reqs.filter((r) => {
    const matchesSearch =
      r.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesLevel = levelFilter === 'all' || r.level === levelFilter;

    let matchesPriority = true;
    if (priorityFilter === 'high-risk') {
      matchesPriority = r.priority === 'critical' || r.priority === 'high';
    } else if (priorityFilter !== 'all') {
      matchesPriority = r.priority === priorityFilter;
    }

    let matchesStakeholder = true;
    if (selectedStakeholderId) {
      const activeStk = stakeholders.find((s) => s.id === selectedStakeholderId);
      matchesStakeholder =
        r.stakeholderId === selectedStakeholderId ||
        (activeStk ? activeStk.linkedRequirementIds.includes(r.id) : false);
    }

    return matchesSearch && matchesLevel && matchesPriority && matchesStakeholder;
  });

  // Handle Create New Requirement
  const handleCreateRequirement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newReqItem: Requirement = {
      id: `REQ-${currentCase.code.split('-')[1] || 'SYS'}-${Date.now().toString().slice(-4)}`,
      title: newTitle,
      description: newDesc || '自定义工程需求规范。',
      level: newLevel,
      priority: newPriority,
      safetyLevel: newSafety,
      status: 'draft',
      verificationMethod: newMethod,
      allocatedBlockIds: [],
      version: 'v1.0',
      stakeholderId: newStakeholderId || undefined,
      statusHistory: [
        {
          id: `HIST-${Date.now()}-1`,
          status: 'draft',
          timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
          author: '需求分析师 (Systems Analyst)',
          comment: '初始录入工程规范需求草案',
          version: 'v1.0',
        },
      ],
    };

    const updated = [...reqs, newReqItem];
    onUpdateRequirements(updated);

    // If linked to stakeholder, update stakeholder linkedRequirementIds
    if (newStakeholderId && onUpdateStakeholders) {
      const updatedStks = stakeholders.map((s) => {
        if (s.id === newStakeholderId && !s.linkedRequirementIds.includes(newReqItem.id)) {
          return { ...s, linkedRequirementIds: [...s.linkedRequirementIds, newReqItem.id] };
        }
        return s;
      });
      onUpdateStakeholders(updatedStks);
    }

    setSelectedReq(newReqItem);
    setIsAddingReq(false);
    setNewTitle('');
    setNewDesc('');
  };

  // Handle Create New Stakeholder Profile
  const handleCreateStakeholder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStkName.trim()) return;

    const newStk: StakeholderProfile = {
      id: `STK-${Date.now().toString().slice(-4)}`,
      name: newStkName,
      role: newStkRole || '业务相关方',
      organization: newStkOrg || '工程研制与验证联合体',
      influenceLevel: newStkInfluence,
      concerns: newStkConcerns
        ? newStkConcerns.split(/[,，\n]/).map((c) => c.trim()).filter(Boolean)
        : ['全生命周期功能安全与指标合规'],
      contact: newStkContact || 'engineer@mbse-lab.org',
      linkedRequirementIds: [],
    };

    const updatedStks = [...stakeholders, newStk];
    if (onUpdateStakeholders) {
      onUpdateStakeholders(updatedStks);
    }
    setIsAddingStakeholder(false);
    setNewStkName('');
    setNewStkRole('');
    setNewStkOrg('');
    setNewStkConcerns('');
    setNewStkContact('');
  };

  // Toggle requirement link to stakeholder
  const handleToggleRequirementLink = (stkId: string, reqId: string) => {
    const stk = stakeholders.find((s) => s.id === stkId);
    if (!stk || !onUpdateStakeholders) return;

    const isLinked = stk.linkedRequirementIds.includes(reqId);
    const updatedIds = isLinked
      ? stk.linkedRequirementIds.filter((id) => id !== reqId)
      : [...stk.linkedRequirementIds, reqId];

    const updatedStks = stakeholders.map((s) => (s.id === stkId ? { ...s, linkedRequirementIds: updatedIds } : s));
    onUpdateStakeholders(updatedStks);

    // Also update requirement's stakeholderId
    const updatedReqs = reqs.map((r) => {
      if (r.id === reqId) {
        return {
          ...r,
          stakeholderId: !isLinked ? stkId : r.stakeholderId === stkId ? undefined : r.stakeholderId,
        };
      }
      return r;
    });
    onUpdateRequirements(updatedReqs);
  };

  // Helper for priority badges
  const renderPriorityBadge = (priority: PriorityLevel) => {
    switch (priority) {
      case 'critical':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-300 shadow-2xs">
            <Flame className="w-3 h-3 text-rose-600 animate-pulse fill-rose-500" />
            <span>严重 (Critical)</span>
          </span>
        );
      case 'high':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-300">
            <AlertTriangle className="w-3 h-3 text-amber-600" />
            <span>高 (High)</span>
          </span>
        );
      case 'medium':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200">
            <Info className="w-3 h-3 text-blue-600" />
            <span>中 (Medium)</span>
          </span>
        );
      case 'low':
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-normal px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200">
            <span>低 (Low)</span>
          </span>
        );
    }
  };

  const getSafetyBadgeColor = (lvl?: string) => {
    if (!lvl) return 'bg-slate-100 text-slate-700 border-slate-200';
    if (lvl.includes('ASIL-D') || lvl.includes('SIL-4') || lvl.includes('Critical') || lvl.includes('Cat-A')) {
      return 'bg-red-50 text-red-700 border-red-200';
    }
    if (lvl.includes('ASIL-B') || lvl.includes('SIL-3') || lvl.includes('High')) {
      return 'bg-amber-50 text-amber-700 border-amber-200';
    }
    return 'bg-slate-100 text-slate-700 border-slate-200';
  };

  const getLevelLabel = (lvl: string) => {
    switch (lvl) {
      case 'stakeholder':
        return { label: 'Stakeholder 诉求', bg: 'bg-purple-50 text-purple-700 border-purple-200' };
      case 'system':
        return { label: 'System 系统级', bg: 'bg-blue-50 text-blue-700 border-blue-200' };
      case 'subsystem':
        return { label: 'Subsystem 子系统', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
      default:
        return { label: lvl, bg: 'bg-slate-100 text-slate-700 border-slate-200' };
    }
  };

  const selectedStakeholderObj = stakeholders.find((s) => s.id === selectedStakeholderId);
  const satisfiedCount = reqs.filter((r) => (r.allocatedBlockIds || []).length > 0).length;
  const currentCoverage = reqs.length > 0 ? Math.round((satisfiedCount / reqs.length) * 100) : 100;

  return (
    <div className="space-y-6">
      {/* Module Title Header */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 text-[11px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200/60 rounded-md">
                模块 02
              </span>
              <h2 className="text-lg font-semibold text-slate-900 tracking-tight">
                系统需求工程与全链路双向追踪矩阵 (Requirements Engineering & RTM)
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1 max-w-3xl leading-relaxed">
              严格建立从利益攸关者 (Stakeholder Profiles) 原始关切到系统级指标的三级派生链路，内嵌<strong>需求-组件全链路双向追踪矩阵 (RTM)</strong>与状态时序演进分析，支持点击单元格直接建立/解除物理组件分配并导出标准 CSV。
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenAiCopilot('利益攸关者诉求闭环与高风险需求诊断')}
              className="px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI 需求闭环诊断</span>
            </button>
            <button
              onClick={() => setIsAddingReq(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>录入新需求</span>
            </button>
          </div>
        </div>

        {/* Global Statistics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-4 pt-4 border-t border-slate-100 text-xs">
          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/70">
            <span className="text-slate-500 text-[11px]">利益攸关者画像:</span>
            <div className="text-base font-bold text-indigo-700 font-mono mt-0.5">
              {stakeholders.length} 位
            </div>
          </div>
          <div className="p-2.5 rounded-lg bg-rose-50/70 border border-rose-200/80">
            <span className="text-rose-700 font-semibold text-[11px] flex items-center gap-1">
              <Flame className="w-3 h-3 text-rose-600" />
              严重风险 (Critical):
            </span>
            <div className="text-base font-bold font-mono text-rose-800 mt-0.5">
              {criticalCount} 项
            </div>
          </div>
          <div className="p-2.5 rounded-lg bg-amber-50/70 border border-amber-200/80">
            <span className="text-amber-700 font-semibold text-[11px] flex items-center gap-1">
              <AlertTriangle className="w-3 h-3 text-amber-600" />
              高优先级 (High):
            </span>
            <div className="text-base font-bold font-mono text-amber-800 mt-0.5">
              {highCount} 项
            </div>
          </div>
          <div className="p-2.5 rounded-lg bg-blue-50/70 border border-blue-200/80">
            <span className="text-blue-700 font-semibold text-[11px]">中等 (Medium):</span>
            <div className="text-base font-bold font-mono text-blue-800 mt-0.5">
              {mediumCount} 项
            </div>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/70">
            <span className="text-slate-500 text-[11px]">低优先级 (Low):</span>
            <div className="text-base font-bold font-mono text-slate-700 mt-0.5">
              {lowCount} 项
            </div>
          </div>
        </div>

        {/* Module Sub-view Switcher: Hierarchy / Matrix / Timeline */}
        <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-3 border-t border-slate-100">
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100/90 rounded-xl border border-slate-200">
            <button
              type="button"
              onClick={() => setActiveTab('hierarchy')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'hierarchy'
                  ? 'bg-white text-slate-900 shadow-2xs ring-1 ring-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-indigo-600" />
              <span>需求分级树与属性分解</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-200/80 text-slate-700">
                {reqs.length} 项
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('matrix')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'matrix'
                  ? 'bg-white text-slate-900 shadow-2xs ring-1 ring-emerald-500/30'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
              <span>需求-组件全链路双向追踪矩阵 (RTM)</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 font-bold">
                {currentCoverage}% 闭环
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('timeline')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'timeline'
                  ? 'bg-white text-slate-900 shadow-2xs ring-1 ring-blue-500/30'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Clock className="w-3.5 h-3.5 text-blue-600" />
              <span>需求状态生命周期演进时间线</span>
            </button>
          </div>

          <div className="text-[11px] text-slate-500 font-mono hidden lg:flex items-center gap-2">
            {activeTab === 'matrix' ? (
              <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                ● 矩阵编辑模式: 点击单元格建立 / 解除 «satisfy» 分配
              </span>
            ) : activeTab === 'timeline' ? (
              <span className="text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                ● 时序演进模式: 审查各需求从 Draft 到 Verified 的流转记录
              </span>
            ) : (
              <span>三级需求派生分解 • 利益攸关者双向溯源</span>
            )}
          </div>
        </div>
      </div>

      {/* Conditional Sub-View Rendering */}
      {activeTab === 'matrix' ? (
        <ModuleTraceabilityMatrix
          currentCase={currentCase}
          onToggleAllocation={onToggleAllocation || (() => {})}
          onOpenAiCopilot={onOpenAiCopilot}
        />
      ) : activeTab === 'timeline' ? (
        <div className="bg-white rounded-xl border border-slate-200/90 p-6 shadow-xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-600" />
                <span>需求生命周期状态演变与变更历史审查</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                实时追踪需求从编制 (Draft) ⟶ 评审 (In-Review) ⟶ 批准 (Approved) ⟶ 释放 (Baseline) ⟶ 最终验证 (Verified) 的全生命周期状态闭环
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-500 font-medium">审计目标需求:</span>
              <select
                value={selectedReq?.id || ''}
                onChange={(e) => {
                  const found = reqs.find((r) => r.id === e.target.value);
                  if (found) setSelectedReq(found);
                }}
                className="bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 font-mono text-xs text-slate-800 focus:outline-hidden"
              >
                {reqs.map((r) => (
                  <option key={r.id} value={r.id}>
                    [{r.id}] {r.title}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {selectedReq ? (
            <RequirementTimeline
              requirement={selectedReq}
              onUpdateRequirement={handleUpdateSingleRequirement}
            />
          ) : (
            <div className="p-8 text-center text-slate-400 text-xs">
              当前暂无需求数据，请在需求分级树中录入需求。
            </div>
          )}
        </div>
      ) : (
        /* Main Workspace Layout with Stakeholder Sidebar */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* ======================================================== */}
        {/* 1. LEFT SIDEBAR: Stakeholder Profiles Management (4 Cols) */}
        {/* ======================================================== */}
        {isSidebarOpen ? (
          <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden flex flex-col">
            {/* Sidebar Header */}
            <div className="p-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-purple-100 text-purple-700 flex items-center justify-center">
                  <Users className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900">
                    利益攸关者画像与诉求
                  </h3>
                  <p className="text-[10px] text-slate-500">Stakeholder Profiles</p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setIsAddingStakeholder(true)}
                  className="p-1 px-2 text-[10px] bg-purple-600 hover:bg-purple-700 text-white rounded-md font-medium transition-colors cursor-pointer flex items-center gap-1 shadow-2xs"
                  title="新建利益攸关者画像"
                >
                  <Plus className="w-3 h-3" />
                  <span>新建画像</span>
                </button>
                <button
                  onClick={() => setIsSidebarOpen(false)}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded hover:bg-slate-200/60 cursor-pointer"
                  title="折叠侧栏"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Active Filter Reminder if filtered by Stakeholder */}
            {selectedStakeholderId && (
              <div className="p-2.5 bg-purple-50/80 border-b border-purple-200 flex items-center justify-between text-xs text-purple-900">
                <div className="flex items-center gap-1.5 truncate">
                  <span className="w-2 h-2 rounded-full bg-purple-600 shrink-0"></span>
                  <span className="truncate">
                    筛选: <strong>{selectedStakeholderObj?.name}</strong> 的关联需求
                  </span>
                </div>
                <button
                  onClick={() => setSelectedStakeholderId(null)}
                  className="text-[10px] text-purple-700 hover:text-purple-900 font-bold ml-2 underline cursor-pointer shrink-0"
                >
                  清除
                </button>
              </div>
            )}

            {/* Stakeholder Profiles Cards List */}
            <div className="p-3 space-y-2.5 max-h-[560px] overflow-y-auto divide-y divide-slate-100">
              {stakeholders.map((stk) => {
                const isSelected = selectedStakeholderId === stk.id;
                const linkedCount = stk.linkedRequirementIds?.length || 0;

                return (
                  <div
                    key={stk.id}
                    className={`pt-2.5 first:pt-0 transition-all rounded-lg p-2.5 ${
                      isSelected
                        ? 'bg-purple-50/60 border border-purple-300 ring-2 ring-purple-500/10'
                        : 'hover:bg-slate-50 border border-transparent'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div
                        onClick={() => setSelectedStakeholderId(isSelected ? null : stk.id)}
                        className="cursor-pointer flex-1"
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-800 text-[10px] font-bold flex items-center justify-center shrink-0">
                            {stk.name.slice(0, 1)}
                          </span>
                          <div>
                            <h4 className="text-xs font-bold text-slate-900 line-clamp-1">
                              {stk.name}
                            </h4>
                            <span className="text-[10px] text-slate-500 font-mono">
                              {stk.id} • {stk.role}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Influence badge */}
                      <span
                        className={`text-[9px] font-mono px-1.5 py-0.5 rounded-sm border shrink-0 ${
                          stk.influenceLevel === 'critical'
                            ? 'bg-rose-50 text-rose-700 border-rose-200 font-bold'
                            : stk.influenceLevel === 'high'
                            ? 'bg-amber-50 text-amber-700 border-amber-200 font-semibold'
                            : 'bg-blue-50 text-blue-700 border-blue-200'
                        }`}
                      >
                        {stk.influenceLevel === 'critical' ? '核心主导' : stk.influenceLevel === 'high' ? '高度关切' : '一般相关'}
                      </span>
                    </div>

                    {/* Organization & Contact */}
                    <div className="mt-2 text-[10px] text-slate-500 flex items-center gap-1.5 font-sans">
                      <Building2 className="w-3 h-3 text-slate-400 shrink-0" />
                      <span className="truncate">{stk.organization}</span>
                    </div>

                    {/* Concerns tags */}
                    <div className="mt-2 flex flex-wrap gap-1">
                      {stk.concerns.slice(0, 2).map((c, cIdx) => (
                        <span
                          key={cIdx}
                          className="text-[9px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 line-clamp-1"
                          title={c}
                        >
                          #{c}
                        </span>
                      ))}
                      {stk.concerns.length > 2 && (
                        <span className="text-[9px] text-slate-400">+{stk.concerns.length - 2}</span>
                      )}
                    </div>

                    {/* Action Bar: Linked High-level Reqs & Linkage Manager */}
                    <div className="mt-2.5 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
                      <button
                        onClick={() => setSelectedStakeholderId(isSelected ? null : stk.id)}
                        className={`text-[10px] font-medium transition-colors cursor-pointer flex items-center gap-1 ${
                          isSelected ? 'text-purple-700 font-bold' : 'text-slate-600 hover:text-purple-700'
                        }`}
                      >
                        <Tag className="w-3 h-3" />
                        <span>已关联 {linkedCount} 项需求</span>
                      </button>

                      <button
                        onClick={() => setManagingStakeholderLink(stk)}
                        className="text-[10px] px-2 py-0.5 rounded bg-white hover:bg-purple-50 text-purple-700 border border-purple-200 font-medium transition-colors cursor-pointer flex items-center gap-1"
                      >
                        <LinkIcon className="w-2.5 h-2.5" />
                        <span>配置映射</span>
                      </button>
                    </div>
                  </div>
                );
              })}

              {stakeholders.length === 0 && (
                <div className="p-6 text-center text-slate-400 text-xs">
                  暂无利益攸关者画像，请点击上方“新建画像”添加。
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Collapsed Sidebar Strip */
          <div className="lg:col-span-1 bg-white rounded-xl border border-slate-200 p-3 shadow-xs flex flex-col items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-1.5 text-slate-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg cursor-pointer"
              title="展开利益攸关者画像侧栏"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <div className="[writing-mode:vertical-rl] text-xs font-bold text-slate-700 tracking-wider flex items-center gap-1">
              <Users className="w-3.5 h-3.5" />
              <span>利益攸关者画像 ({stakeholders.length})</span>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* 2. MIDDLE & RIGHT: Requirements List & Filter (8 or 11 Cols) */}
        {/* ======================================================== */}
        <div className={`${isSidebarOpen ? 'lg:col-span-8' : 'lg:col-span-11'} space-y-4`}>
          {/* Priority Filter Toolbar */}
          <div className="bg-white rounded-xl border border-slate-200/90 p-3.5 shadow-xs space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2.5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Filter className="w-3.5 h-3.5 text-indigo-600" />
                  优先级过滤工具栏 (Priority Filter):
                </span>
                <span className="text-[11px] text-slate-400">突出排查高危与核心指标</span>
              </div>

              {/* Fast High-Risk Toggle Button */}
              <button
                onClick={() => setPriorityFilter(priorityFilter === 'high-risk' ? 'all' : 'high-risk')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  priorityFilter === 'high-risk'
                    ? 'bg-rose-600 text-white shadow-xs ring-2 ring-rose-500/30'
                    : 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
                }`}
              >
                <Flame className="w-3.5 h-3.5 fill-current animate-pulse" />
                <span>仅看高风险项目 ({criticalCount + highCount})</span>
              </button>
            </div>

            {/* Priority Button Tabs */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <button
                onClick={() => setPriorityFilter('all')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                  priorityFilter === 'all'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <span>全部优先级</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-white/20">
                  {reqs.length}
                </span>
              </button>

              <button
                onClick={() => setPriorityFilter('critical')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
                  priorityFilter === 'critical'
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
                }`}
              >
                <Flame className="w-3 h-3 fill-rose-500" />
                <span>严重 (Critical)</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-rose-200/80 text-rose-900">
                  {criticalCount}
                </span>
              </button>

              <button
                onClick={() => setPriorityFilter('high')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
                  priorityFilter === 'high'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100'
                }`}
              >
                <AlertTriangle className="w-3 h-3" />
                <span>高 (High)</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-amber-200/80 text-amber-900">
                  {highCount}
                </span>
              </button>

              <button
                onClick={() => setPriorityFilter('medium')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                  priorityFilter === 'medium'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100'
                }`}
              >
                <Info className="w-3 h-3" />
                <span>中 (Medium)</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-blue-200/80 text-blue-900">
                  {mediumCount}
                </span>
              </button>

              <button
                onClick={() => setPriorityFilter('low')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                  priorityFilter === 'low'
                    ? 'bg-slate-700 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200'
                }`}
              >
                <span>低 (Low)</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-slate-200 text-slate-700">
                  {lowCount}
                </span>
              </button>
            </div>
          </div>

          {/* Requirements Dual-Pane (List + Inspector) */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
            {/* Requirements List (7 Cols) */}
            <div className="md:col-span-7 bg-white rounded-xl border border-slate-200/90 shadow-xs flex flex-col">
              {/* Search & Level Filter */}
              <div className="p-3.5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2.5 bg-slate-50/50">
                <div className="relative flex-1 min-w-[170px]">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                  <input
                    type="text"
                    placeholder="搜索需求 ID、指标文本..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-white pl-8 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <div className="flex items-center gap-1.5 text-xs">
                  <span className="text-slate-500 text-[11px]">层级:</span>
                  <select
                    value={levelFilter}
                    onChange={(e: any) => setLevelFilter(e.target.value)}
                    className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs focus:outline-hidden text-slate-700"
                  >
                    <option value="all">全部层级</option>
                    <option value="stakeholder">Stakeholder 诉求</option>
                    <option value="system">System 系统需求</option>
                    <option value="subsystem">Subsystem 子系统</option>
                  </select>
                </div>
              </div>

              {/* Requirement Items */}
              <div className="divide-y divide-slate-100 overflow-y-auto max-h-[540px]">
                {filteredReqs.map((r) => {
                  const isSelected = selectedReq?.id === r.id;
                  const isAllocated = (r.allocatedBlockIds || []).length > 0;
                  const lvlInfo = getLevelLabel(r.level);
                  const isCritical = r.priority === 'critical';

                  // Linked stakeholder info
                  const stkLinked = stakeholders.find(
                    (s) => s.id === r.stakeholderId || s.linkedRequirementIds.includes(r.id)
                  );

                  return (
                    <div
                      key={r.id}
                      onClick={() => setSelectedReq(r)}
                      className={`p-3.5 transition-all cursor-pointer hover:bg-slate-50/80 ${
                        isSelected
                          ? 'bg-indigo-50/60 border-l-4 border-indigo-600'
                          : isCritical
                          ? 'border-l-4 border-rose-500 bg-rose-50/15'
                          : ''
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="space-y-1.5 flex-1">
                          {/* Badges line: ID, Priority, Safety, Level */}
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="font-mono text-xs font-bold text-slate-900">{r.id}</span>
                            {renderPriorityBadge(r.priority)}
                            <span className={`text-[10px] px-1.5 py-0.2 rounded-sm border font-medium ${lvlInfo.bg}`}>
                              {lvlInfo.label}
                            </span>
                            {r.safetyLevel && (
                              <span className={`text-[10px] px-1.5 py-0.2 rounded-sm border font-mono font-medium ${getSafetyBadgeColor(r.safetyLevel)}`}>
                                {r.safetyLevel}
                              </span>
                            )}
                          </div>

                          {/* Title */}
                          <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                            {isCritical && <Flame className="w-3.5 h-3.5 text-rose-600 shrink-0 fill-rose-500" />}
                            <span>{r.title}</span>
                          </h4>

                          {/* Text description */}
                          <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                            {r.description}
                          </p>

                          {/* Stakeholder Link badge if present */}
                          {stkLinked && (
                            <div className="pt-1 flex items-center gap-1.5 text-[10px] text-purple-700">
                              <Users className="w-3 h-3 text-purple-600" />
                              <span>来源关切: {stkLinked.name} ({stkLinked.role})</span>
                            </div>
                          )}
                        </div>

                        {/* Allocation Status & Timeline Trigger */}
                        <div className="text-right whitespace-nowrap pl-2 flex flex-col items-end gap-1.5">
                          {isAllocated ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              已实现 ({r.allocatedBlockIds.length})
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-300 animate-pulse">
                              <AlertCircle className="w-3 h-3 text-amber-600" />
                              悬空未实现
                            </span>
                          )}

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedReq(r);
                              setInspectorTab('timeline');
                            }}
                            className="inline-flex items-center gap-1 text-[10px] font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-2 py-0.5 rounded border border-indigo-200/80 transition-colors cursor-pointer"
                            title="查看与推进此需求的状态演进历史"
                          >
                            <History className="w-3 h-3 text-indigo-600" />
                            <span>演进轴</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {filteredReqs.length === 0 && (
                  <div className="p-8 text-center text-slate-400 text-xs">
                    没有找到匹配当前优先级或层级的需求条目。
                  </div>
                )}
              </div>
            </div>

            {/* Requirement Detail Inspector (5 Cols) */}
            <div className="md:col-span-5 bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs space-y-4">
              {selectedReq ? (
                <>
                  <div className="border-b border-slate-100 pb-3">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                        {selectedReq.id}
                      </span>
                      {renderPriorityBadge(selectedReq.priority)}
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 mt-1.5 leading-snug">
                      {selectedReq.title}
                    </h3>
                  </div>

                  {/* Segmented Tab: Details vs Status Evolution Timeline */}
                  <div className="flex items-center p-1 bg-slate-100 rounded-lg text-xs font-medium">
                    <button
                      type="button"
                      onClick={() => setInspectorTab('details')}
                      className={`flex-1 py-1.5 px-2 rounded-md transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                        inspectorTab === 'details'
                          ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <Layers className="w-3.5 h-3.5 text-indigo-600" />
                      <span>属性与架构映射</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setInspectorTab('timeline')}
                      className={`flex-1 py-1.5 px-2 rounded-md transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                        inspectorTab === 'timeline'
                          ? 'bg-white text-indigo-900 shadow-2xs font-semibold'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <History className="w-3.5 h-3.5 text-indigo-600" />
                      <span>状态演进时间轴</span>
                      <span className="font-mono text-[10px] px-1.5 py-0.2 rounded-full bg-indigo-100 text-indigo-800 font-bold">
                        {selectedReq.statusHistory?.length || (selectedReq.status === 'verified' ? 4 : selectedReq.status === 'implemented' ? 3 : selectedReq.status === 'approved' ? 2 : 1)}
                      </span>
                    </button>
                  </div>

                  {/* Tab Content Switching */}
                  {inspectorTab === 'timeline' ? (
                    <RequirementTimeline
                      requirement={selectedReq}
                      onUpdateRequirement={handleUpdateSingleRequirement}
                    />
                  ) : (
                    <>
                      {/* Timeline Quick Preview Banner */}
                      <div className="p-2.5 rounded-lg bg-indigo-50/60 border border-indigo-200/80 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <History className="w-4 h-4 text-indigo-600" />
                          <div>
                            <div className="font-bold text-indigo-950 flex items-center gap-1.5">
                              <span>当前状态:</span>
                              <span className="font-mono text-indigo-700 font-semibold uppercase">{selectedReq.status}</span>
                            </div>
                            <div className="text-[10px] text-slate-500">
                              已历经 {selectedReq.statusHistory?.length || (selectedReq.status === 'verified' ? 4 : selectedReq.status === 'implemented' ? 3 : selectedReq.status === 'approved' ? 2 : 1)} 次研制演进审计
                            </div>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setInspectorTab('timeline')}
                          className="px-2.5 py-1 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-[11px] transition-colors cursor-pointer flex items-center gap-1 shadow-2xs"
                        >
                          <span>查看演进轴</span>
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Priority & Risk Assessment Box */}
                      <div className={`p-2.5 rounded-lg border text-xs leading-relaxed ${
                    selectedReq.priority === 'critical'
                      ? 'bg-rose-50/70 border-rose-200 text-rose-900'
                      : selectedReq.priority === 'high'
                      ? 'bg-amber-50/70 border-amber-200 text-amber-900'
                      : 'bg-slate-50 border-slate-200 text-slate-700'
                  }`}>
                    <div className="font-bold flex items-center gap-1.5 mb-0.5">
                      {selectedReq.priority === 'critical' ? (
                        <>
                          <Flame className="w-3.5 h-3.5 text-rose-600 fill-rose-500" />
                          <span>严重风险等级 (Critical Risk)</span>
                        </>
                      ) : selectedReq.priority === 'high' ? (
                        <>
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                          <span>高风险关键项目 (High Priority)</span>
                        </>
                      ) : (
                        <span>常规指标项目 (Standard Norm)</span>
                      )}
                    </div>
                    <p className="text-[11px] opacity-90">
                      {selectedReq.priority === 'critical'
                        ? '此需求直接关联系统功能安全与生命财产核心，若失效将触发非受控危险。必须分配专用 ASIL/SIL 安全机制并执行形式化与 HIL 闭环验证。'
                        : selectedReq.priority === 'high'
                        ? '此需求属于关键核心性能指标，影响系统可用度与客户核心体验，必须在架构设计评审中重点追踪。'
                        : '标准功能与辅助性设计规范，按常规工程流程推进。'}
                    </p>
                  </div>

                  {/* Textual Specification */}
                  <div className="space-y-1">
                    <span className="text-[11px] font-semibold text-slate-500">形式化文本规范 (Text Specification)</span>
                    <div className="p-3 bg-slate-50 rounded-lg text-xs text-slate-700 border border-slate-200/80 leading-relaxed font-sans">
                      {selectedReq.description}
                    </div>
                  </div>

                  {/* Attributes Grid */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 rounded-lg border border-slate-200/80 bg-slate-50/50">
                      <span className="text-slate-500 text-[10px]">需求层级:</span>
                      <div className="font-medium text-slate-800 capitalize mt-0.5">
                        {selectedReq.level}
                      </div>
                    </div>
                    <div className="p-2.5 rounded-lg border border-slate-200/80 bg-slate-50/50">
                      <span className="text-slate-500 text-[10px]">安全完整性等级:</span>
                      <div className="font-mono font-bold text-slate-800 mt-0.5">
                        {selectedReq.safetyLevel || 'QM'}
                      </div>
                    </div>
                    <div className="p-2.5 rounded-lg border border-slate-200/80 bg-slate-50/50">
                      <span className="text-slate-500 text-[10px]">验证手段 (Method):</span>
                      <div className="font-medium text-indigo-700 mt-0.5">
                        {selectedReq.verificationMethod}
                      </div>
                    </div>
                    <div className="p-2.5 rounded-lg border border-slate-200/80 bg-slate-50/50">
                      <span className="text-slate-500 text-[10px]">上级来源 (Parent):</span>
                      <div className="font-mono text-slate-700 mt-0.5 truncate">
                        {selectedReq.parentId || '顶层诉求 (Top)'}
                      </div>
                    </div>
                  </div>

                  {/* Linked Stakeholder Section */}
                  <div className="p-3 rounded-lg bg-purple-50/60 border border-purple-200/80 text-xs space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-purple-900 flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-purple-700" />
                        关联利益攸关者 (Stakeholder Link)
                      </span>
                      {selectedReq.stakeholderId && (
                        <span className="font-mono text-[10px] text-purple-700 font-semibold">
                          {selectedReq.stakeholderId}
                        </span>
                      )}
                    </div>

                    {selectedReq.stakeholderId ? (
                      (() => {
                        const stk = stakeholders.find((s) => s.id === selectedReq.stakeholderId);
                        return stk ? (
                          <div className="space-y-1 text-[11px] text-purple-950">
                            <div className="font-semibold">{stk.name} ({stk.role})</div>
                            <div className="text-[10px] text-purple-700 font-sans">{stk.organization}</div>
                          </div>
                        ) : (
                          <div className="text-[11px] text-slate-500">已关联 ID: {selectedReq.stakeholderId}</div>
                        );
                      })()
                    ) : (
                      <div className="text-[11px] text-slate-500">
                        当前尚未指定直接诉求方。可在左侧侧栏中选择利益攸关者并关联。
                      </div>
                    )}
                  </div>

                  {/* Allocated Physical Blocks */}
                  <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                        <GitBranch className="w-3.5 h-3.5 text-indigo-600" />
                        已分配物理/逻辑组件 (Satisfied Blocks)
                      </span>
                      <span className="font-mono text-[11px] text-slate-400">
                        {selectedReq.allocatedBlockIds.length} Blocks
                      </span>
                    </div>

                    {selectedReq.allocatedBlockIds.length > 0 ? (
                      <div className="space-y-1.5">
                        {selectedReq.allocatedBlockIds.map((bid) => {
                          const bObj = blocks.find((b) => b.id === bid);
                          return (
                            <div
                              key={bid}
                              className="flex items-center justify-between p-2 rounded-lg bg-indigo-50/40 border border-indigo-200/60 text-xs"
                            >
                              <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                                <span className="font-mono font-bold text-indigo-900">{bid}</span>
                                <span className="text-slate-700">{bObj?.name || '组件'}</span>
                              </div>
                              <span className="text-[10px] text-indigo-600 font-medium">«satisfy»</span>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        <div>
                          <strong>悬空未满足警告 (Dangling Requirement)</strong>
                          <p className="text-[11px] text-amber-700 mt-0.5">
                            当前高风险需求未与任何物理 Block 建立 satisfy 映射，存在验收脱节隐患。
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="p-8 text-center text-slate-400 text-xs">
              请从左侧列表选择需求项查看属性与追溯。
            </div>
          )}
            </div>
          </div>
        </div>
      </div>
      )}

      {/* ======================================================== */}
      {/* 3. MODAL: Add New Requirement */}
      {/* ======================================================== */}
      {isAddingReq && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-slate-200 max-w-lg w-full p-5 shadow-xl animate-in fade-in duration-150">
            <h3 className="text-base font-semibold text-slate-900 mb-1">
              录入与派生新需求条目
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              向当前工程模型注入新的系统规范，建立完备的追溯与优先级标识
            </p>

            <form onSubmit={handleCreateRequirement} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 font-medium mb-1">需求简述标题 (Title) *</label>
                <input
                  type="text"
                  required
                  placeholder="例如: 车载通信总线确定性抖动控制"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-2 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">详细形式化指标说明 (Description)</label>
                <textarea
                  rows={3}
                  placeholder="详细定义验收指标阈值、响应时间、误差范围与运行环境..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-2 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">需求层级</label>
                  <select
                    value={newLevel}
                    onChange={(e: any) => setNewLevel(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg p-2 text-xs focus:outline-hidden"
                  >
                    <option value="stakeholder">Stakeholder 利益攸关者诉求</option>
                    <option value="system">System 系统级指标</option>
                    <option value="subsystem">Subsystem 子系统要求</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1 flex items-center gap-1 text-rose-700">
                    <Flame className="w-3 h-3 text-rose-600" />
                    <span>优先级 (Priority) *</span>
                  </label>
                  <select
                    value={newPriority}
                    onChange={(e: any) => setNewPriority(e.target.value)}
                    className="w-full border border-rose-300 bg-rose-50/30 rounded-lg p-2 text-xs font-semibold text-rose-900 focus:outline-hidden"
                  >
                    <option value="critical">🔴 严重 (Critical - 最高安全风险)</option>
                    <option value="high">🟠 高 (High - 核心指标)</option>
                    <option value="medium">🔵 中 (Medium - 标准设计)</option>
                    <option value="low">⚪ 低 (Low - 辅助规范)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">安全度等级 (Safety Level)</label>
                  <input
                    type="text"
                    value={newSafety}
                    onChange={(e) => setNewSafety(e.target.value)}
                    placeholder="如 ASIL-D, SIL-4, ECSS-Cat-A"
                    className="w-full border border-slate-300 rounded-lg p-2 text-xs focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-1">关联利益攸关者</label>
                  <select
                    value={newStakeholderId}
                    onChange={(e) => setNewStakeholderId(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg p-2 text-xs focus:outline-hidden"
                  >
                    <option value="">未指定诉求方</option>
                    {stakeholders.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.role})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">推荐验证方式 (Method)</label>
                <select
                  value={newMethod}
                  onChange={(e: any) => setNewMethod(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-2 text-xs focus:outline-hidden"
                >
                  <option value="Test">测试 (Test / HIL 台架)</option>
                  <option value="Demonstration">演示 (Demonstration 现场)</option>
                  <option value="Analysis">分析 (Analysis / 数值仿真)</option>
                  <option value="Inspection">审查 (Inspection 图纸审阅)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddingReq(false)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium shadow-xs transition-colors cursor-pointer"
                >
                  保存需求并注入模型
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 4. MODAL: Add New Stakeholder Profile */}
      {/* ======================================================== */}
      {isAddingStakeholder && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-slate-200 max-w-lg w-full p-5 shadow-xl animate-in fade-in duration-150">
            <h3 className="text-base font-semibold text-slate-900 mb-1 flex items-center gap-2">
              <Users className="w-4 h-4 text-purple-600" />
              <span>新建利益攸关者画像 (Stakeholder Profile)</span>
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              定义需求来源主体（客户、监管方、乘员、运维团队），确保顶层需求溯源有据
            </p>

            <form onSubmit={handleCreateStakeholder} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 font-medium mb-1">相关方主体名称 (Name) *</label>
                <input
                  type="text"
                  required
                  placeholder="例如: 飞行器试飞员大队 / 医疗器械审评专家组"
                  value={newStkName}
                  onChange={(e) => setNewStkName(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-2 text-xs focus:ring-1 focus:ring-purple-500 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">系统工程角色 (Role)</label>
                  <input
                    type="text"
                    placeholder="如: 最终操控者 / 安全法规审查官"
                    value={newStkRole}
                    onChange={(e) => setNewStkRole(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg p-2 text-xs focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-1">话语权与影响度 (Influence)</label>
                  <select
                    value={newStkInfluence}
                    onChange={(e: any) => setNewStkInfluence(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg p-2 text-xs focus:outline-hidden font-medium text-slate-800"
                  >
                    <option value="critical">🔴 核心主导权 (Critical)</option>
                    <option value="high">🟠 高度关切 (High)</option>
                    <option value="medium">🔵 一般相关 (Medium)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">所属组织或机构 (Organization)</label>
                <input
                  type="text"
                  placeholder="如: 国家铁路适航审评中心 / 乘员体验委员会"
                  value={newStkOrg}
                  onChange={(e) => setNewStkOrg(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-2 text-xs focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">核心关切点 (Key Concerns，用逗号分隔)</label>
                <textarea
                  rows={2}
                  placeholder="例如: 紧急制动安全距离, 故障导向安全联锁, 接口无未定义跳变"
                  value={newStkConcerns}
                  onChange={(e) => setNewStkConcerns(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-2 text-xs focus:ring-1 focus:ring-purple-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">联络邮箱/接口人 (Contact)</label>
                <input
                  type="email"
                  placeholder="safety-authority@regulatory.gov"
                  value={newStkContact}
                  onChange={(e) => setNewStkContact(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-2 text-xs focus:outline-hidden"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddingStakeholder(false)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-medium shadow-xs transition-colors cursor-pointer"
                >
                  保存画像并入库
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 5. MODAL: Manage Stakeholder Requirement Linkage */}
      {/* ======================================================== */}
      {managingStakeholderLink && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-slate-200 max-w-lg w-full p-5 shadow-xl animate-in fade-in duration-150 space-y-4">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-mono font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded">
                  {managingStakeholderLink.id}
                </span>
                <h3 className="text-sm font-bold text-slate-900 mt-1">
                  配置【{managingStakeholderLink.name}】的高层需求关联
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  勾选此利益攸关者直接提出或严密关切的系统高层指标
                </p>
              </div>
              <button
                onClick={() => setManagingStakeholderLink(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="max-h-[340px] overflow-y-auto space-y-2 pr-1 divide-y divide-slate-100">
              {reqs.map((r) => {
                const isLinked = managingStakeholderLink.linkedRequirementIds.includes(r.id);
                return (
                  <div
                    key={r.id}
                    onClick={() => handleToggleRequirementLink(managingStakeholderLink.id, r.id)}
                    className={`p-2.5 rounded-lg transition-all cursor-pointer flex items-start gap-2.5 ${
                      isLinked
                        ? 'bg-purple-50/70 border border-purple-300'
                        : 'hover:bg-slate-50 border border-transparent'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isLinked}
                      onChange={() => {}}
                      className="mt-0.5 rounded text-purple-600 focus:ring-0 cursor-pointer"
                    />
                    <div className="flex-1 text-xs">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-bold text-slate-800">{r.id}</span>
                        {renderPriorityBadge(r.priority)}
                        <span className="text-[10px] text-slate-400 font-mono">[{r.level}]</span>
                      </div>
                      <div className="font-semibold text-slate-900 mt-0.5">{r.title}</div>
                      <div className="text-[11px] text-slate-500 line-clamp-1">{r.description}</div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
              <span className="text-slate-500">
                已映射 <strong>{managingStakeholderLink.linkedRequirementIds.length}</strong> 项高层需求
              </span>
              <button
                onClick={() => setManagingStakeholderLink(null)}
                className="px-4 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-medium transition-colors cursor-pointer"
              >
                完成映射
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
