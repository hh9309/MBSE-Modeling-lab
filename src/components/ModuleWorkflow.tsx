import React, { useState } from 'react';
import { CaseStudy } from '../types/mbse';
import { 
  Workflow, 
  CheckCircle2, 
  ArrowRight, 
  Layers, 
  Box, 
  FileSpreadsheet, 
  ShieldCheck, 
  FileCheck,
  Sparkles
} from 'lucide-react';
import { ModuleKey } from './Navbar';

interface ModuleWorkflowProps {
  currentCase: CaseStudy;
  onNavigateToModule: (module: ModuleKey) => void;
  onOpenAiCopilot: (checkType?: string) => void;
  coverageRate: number;
}

export const ModuleWorkflow: React.FC<ModuleWorkflowProps> = ({
  currentCase,
  onNavigateToModule,
  onOpenAiCopilot,
  coverageRate,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);

  const workflowSteps = [
    {
      stepNumber: '01',
      title: '需求录入与多级分解 (Requirement Capture & Breakdown)',
      description: '定义原始 Stakeholder 诉求，自顶向下派生 (deriveReqt) 为系统级定量指标与子系统规范，标记 ASIL/SIL 安全完整性要求。',
      targetModule: 'requirements' as ModuleKey,
      icon: <Layers className="w-5 h-5 text-purple-600" />,
      checklist: [
        'Stakeholder 顶层使命剖面清晰量化',
        '系统与子系统二级需求建立 deriveReqt 树状派生',
        '指定验收测试手段 (Test, Demonstration, Analysis, Inspection)',
      ],
      status: 'completed',
    },
    {
      stepNumber: '02',
      title: '系统组件与端口架构建模 (Architecture & Interfaces)',
      description: '在 BDD 与 IBD 中建立物理块 (Blocks)、流/标准端口 (Ports) 与通信总线 (Connectors)，确立黑盒与白盒架构边界。',
      targetModule: 'architecture' as ModuleKey,
      icon: <Box className="w-5 h-5 text-blue-600" />,
      checklist: [
        '组件 Stereotype 构造型与物理/逻辑责任划分清晰',
        '端口协议强类型契约与波特率速率对称匹配',
        '通信连接器端到端时延硬约束 (Latency Bound) 已标注',
      ],
      status: 'completed',
    },
    {
      stepNumber: '03',
      title: '全链路双向追踪矩阵生成 (RTM Mapping)',
      description: '打通“为什么做”到“谁来做”的映射闭环，消除悬空需求与过度设计组件，保障任何上游变更具备精确影响分析。',
      targetModule: 'matrix' as ModuleKey,
      icon: <FileSpreadsheet className="w-5 h-5 text-emerald-600" />,
      checklist: [
        '双向追踪矩阵 (RTM) 覆盖率达到 100%',
        '无任何孤立无满足实体的悬空需求 (Dangling Reqs)',
        '所有安全关键需求 (ASIL-D / SIL-4) 均有冗余架构支撑',
      ],
      status: coverageRate >= 100 ? 'completed' : 'in-progress',
    },
    {
      stepNumber: '04',
      title: '形式化一致性验证与一键审查 (Formal Verification)',
      description: '运行代数图论算法，排查通信死锁、端口失配与行为状态机漂移，一键导出符合审查标准的 MBSE 评审报告。',
      targetModule: 'export' as ModuleKey,
      icon: <ShieldCheck className="w-5 h-5 text-indigo-600" />,
      checklist: [
        '拓扑拉普拉斯谱半径与循环依赖校验通过',
        '状态机 FDIR 降级安全路径完备无死锁',
        '生成 SysML XMI 与模型质量审查报告',
      ],
      status: 'ready',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Module Title Header */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 text-[11px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200/60 rounded-md">
                模块 08
              </span>
              <h2 className="text-lg font-semibold text-slate-900 tracking-tight">
                MBSE 研制全流程导引：需求定义 ⟶ 架构设计 ⟶ 追踪矩阵 ⟶ 一致性验证
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1 max-w-3xl leading-relaxed">
              严格贯彻标准系统工程 V 模型左侧与数字线程 (Digital Thread) 闭环：
              引导工程师按部就班完成需求录入、架构分配、追踪矩阵闭环与形式化审查，实现一键式研制成果验收。
            </p>
          </div>

          <button
            onClick={() => onOpenAiCopilot('全流程系统工程研制规范合规度审查')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-medium transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI 研制流程审查</span>
          </button>
        </div>

        {/* 4-Step Flow Progress Bar */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-3 relative">
          {workflowSteps.map((step, idx) => {
            const isCurrent = idx === currentStepIndex;
            return (
              <div
                key={step.stepNumber}
                onClick={() => setCurrentStepIndex(idx)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer relative ${
                  isCurrent
                    ? 'bg-indigo-50/70 border-indigo-500 ring-2 ring-indigo-500/10'
                    : 'bg-slate-50/70 border-slate-200 hover:bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs font-bold text-slate-400">
                    STEP {step.stepNumber}
                  </span>
                  {step.status === 'completed' ? (
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </span>
                  ) : (
                    <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span>
                  )}
                </div>
                <h4 className="text-xs font-bold text-slate-800 line-clamp-1">{step.title.split(' ')[0]}</h4>
                <p className="text-[11px] text-slate-500 line-clamp-2 mt-1">{step.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Step Detail Card */}
      {workflowSteps[currentStepIndex] && (
        <div className="bg-white rounded-xl border border-slate-200/90 p-6 shadow-xs">
          <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center">
                {workflowSteps[currentStepIndex].icon}
              </div>
              <div>
                <span className="text-[11px] font-mono text-indigo-600 font-bold">
                  PHASE {workflowSteps[currentStepIndex].stepNumber} / 04
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-0.5">
                  {workflowSteps[currentStepIndex].title}
                </h3>
              </div>
            </div>

            <button
              onClick={() => onNavigateToModule(workflowSteps[currentStepIndex].targetModule)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium shadow-xs transition-colors cursor-pointer"
            >
              <span>前往执行该环节</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-5 text-xs">
            {/* Left: Engineering Guidelines */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-slate-800">
                本阶段工程实施要则 (Engineering Guidelines):
              </span>
              <p className="text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-lg border border-slate-200/80">
                {workflowSteps[currentStepIndex].description}
              </p>
              <div className="p-3 rounded-lg bg-indigo-50/50 border border-indigo-100 text-indigo-900">
                <strong>关联行业规范:</strong> {currentCase.standards.join(' • ')}
              </div>
            </div>

            {/* Right: Actionable Quality Checklist */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-slate-800">
                质量放行审查清单 (Gate Review Checklist):
              </span>
              <div className="space-y-2">
                {workflowSteps[currentStepIndex].checklist.map((item, cIdx) => (
                  <div
                    key={cIdx}
                    className="flex items-start gap-2.5 p-2.5 rounded-lg border border-slate-200/80 bg-slate-50/50 text-slate-700"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
