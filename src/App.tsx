/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CASE_STUDIES } from './data/casesData';
import { CaseStudy, Requirement } from './types/mbse';
import { Navbar, ModuleKey } from './components/Navbar';
import { ModuleAlgebra } from './components/ModuleAlgebra';
import { ModuleRequirements } from './components/ModuleRequirements';
import { ModuleArchitecture } from './components/ModuleArchitecture';
import { ModuleSysMLViews } from './components/ModuleSysMLViews';
import { ModuleCases } from './components/ModuleCases';
import { ModuleCodeEngine } from './components/ModuleCodeEngine';
import { ModuleWorkflow } from './components/ModuleWorkflow';
import { ModuleExport } from './components/ModuleExport';
import { ModuleKnowledgeSlices } from './components/ModuleKnowledgeSlices';
import { AiCopilotModal } from './components/AiCopilotModal';
import { Sparkles, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';

export default function App() {
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>(CASE_STUDIES);
  const [currentCaseId, setCurrentCaseId] = useState<string>(CASE_STUDIES[0].id);
  const [activeModule, setActiveModule] = useState<ModuleKey>('algebra');
  const [isAiCopilotOpen, setIsAiCopilotOpen] = useState<boolean>(false);
  const [aiInitialCheck, setAiInitialCheck] = useState<string | undefined>(undefined);

  const currentCase = caseStudies.find((cs) => cs.id === currentCaseId) || caseStudies[0];

  // Calculate real-time traceability coverage rate
  const reqs = currentCase.requirements || [];
  const satisfiedCount = reqs.filter((r) => (r.allocatedBlockIds || []).length > 0).length;
  const coverageRate = reqs.length > 0 ? Math.round((satisfiedCount / reqs.length) * 100) : 100;

  // Toggle allocation between a requirement and a block
  const handleToggleAllocation = (reqId: string, blockId: string) => {
    setCaseStudies((prev) =>
      prev.map((cs) => {
        if (cs.id !== currentCaseId) return cs;

        const updatedReqs = cs.requirements.map((r) => {
          if (r.id !== reqId) return r;
          const currentAlloc = r.allocatedBlockIds || [];
          const exists = currentAlloc.includes(blockId);
          return {
            ...r,
            allocatedBlockIds: exists
              ? currentAlloc.filter((b) => b !== blockId)
              : [...currentAlloc, blockId],
          };
        });

        const updatedBlocks = cs.blocks.map((b) => {
          if (b.id !== blockId) return b;
          const currentAllocReqs = b.allocatedReqIds || [];
          const exists = currentAllocReqs.includes(reqId);
          return {
            ...b,
            allocatedReqIds: exists
              ? currentAllocReqs.filter((r) => r !== reqId)
              : [...currentAllocReqs, reqId],
          };
        });

        return {
          ...cs,
          requirements: updatedReqs,
          blocks: updatedBlocks,
        };
      })
    );
  };

  const handleUpdateRequirements = (newReqs: Requirement[]) => {
    setCaseStudies((prev) =>
      prev.map((cs) => (cs.id === currentCaseId ? { ...cs, requirements: newReqs } : cs))
    );
  };

  const handleUpdateStakeholders = (newStakeholders: any[]) => {
    setCaseStudies((prev) =>
      prev.map((cs) => (cs.id === currentCaseId ? { ...cs, stakeholders: newStakeholders } : cs))
    );
  };

  const handleOpenAiCopilot = (checkType?: string) => {
    setAiInitialCheck(checkType);
    setIsAiCopilotOpen(true);
  };

  const handleSelectModule = (mod: ModuleKey) => {
    setActiveModule(mod);
    if (mod === 'copilot') {
      setIsAiCopilotOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100/60 text-slate-800 font-sans selection:bg-indigo-500/20 selection:text-indigo-900 flex flex-col">
      {/* Navigation & Header */}
      <Navbar
        activeModule={activeModule}
        setActiveModule={handleSelectModule}
        caseStudies={caseStudies}
        currentCase={currentCase}
        setCurrentCaseId={setCurrentCaseId}
        onOpenAiCopilot={handleOpenAiCopilot}
        coverageRate={coverageRate}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Module 1: 建模代数 */}
        {activeModule === 'algebra' && (
          <ModuleAlgebra currentCase={currentCase} onOpenAiCopilot={handleOpenAiCopilot} />
        )}

        {/* Module 2: 需求分解 */}
        {activeModule === 'requirements' && (
          <ModuleRequirements
            currentCase={currentCase}
            onUpdateRequirements={handleUpdateRequirements}
            onUpdateStakeholders={handleUpdateStakeholders}
            onToggleAllocation={handleToggleAllocation}
            onOpenAiCopilot={handleOpenAiCopilot}
          />
        )}

        {/* Module 3: 架构建模 */}
        {activeModule === 'architecture' && (
          <ModuleArchitecture
            currentCase={currentCase}
            onOpenAiCopilot={handleOpenAiCopilot}
          />
        )}

        {/* Module 4: SysML多视角 */}
        {activeModule === 'sysml' && (
          <ModuleSysMLViews
            currentCase={currentCase}
            onOpenAiCopilot={handleOpenAiCopilot}
          />
        )}

        {/* Module 5: 六大案例 */}
        {activeModule === 'cases' && (
          <ModuleCases
            caseStudies={caseStudies}
            currentCase={currentCase}
            onSelectCase={(id) => setCurrentCaseId(id)}
            onOpenAiCopilot={handleOpenAiCopilot}
          />
        )}

        {/* Module 6: 代码引擎 */}
        {activeModule === 'code' && (
          <ModuleCodeEngine onOpenAiCopilot={handleOpenAiCopilot} />
        )}

        {/* Module 7: AI 随诊专家工作台 (Full Viewport) */}
        {activeModule === 'copilot' && (
          <div className="bg-slate-900 text-white rounded-2xl p-8 border border-indigo-500/30 text-center space-y-4 shadow-xl">
            <div className="w-16 h-16 rounded-2xl bg-indigo-600/30 border border-indigo-500/50 flex items-center justify-center mx-auto text-indigo-400">
              <Sparkles className="w-8 h-8 animate-pulse" />
            </div>
            <h3 className="text-xl font-bold">7. MBSE AI 随诊专家全屏工作台已激活</h3>
            <p className="text-xs text-slate-300 max-w-xl mx-auto">
              AI 随诊专家现已占满整个工作台界面。支持针对当前工程案例【{currentCase.title}】的六大形式化诊断、跨域端口时延校验与大模型实时交互。
            </p>
            <div className="pt-2 flex justify-center gap-3">
              <button
                onClick={() => setIsAiCopilotOpen(true)}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg transition-all cursor-pointer flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>进入全屏 AI 随诊工作台</span>
              </button>
              <button
                onClick={() => setActiveModule('workflow')}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs border border-slate-700 transition-all cursor-pointer"
              >
                返回全流程导引
              </button>
            </div>
          </div>
        )}

        {/* Module 8: 全流程导引 */}
        {activeModule === 'workflow' && (
          <ModuleWorkflow
            currentCase={currentCase}
            onNavigateToModule={setActiveModule}
            onOpenAiCopilot={handleOpenAiCopilot}
            coverageRate={coverageRate}
          />
        )}

        {/* Interactive Traceability Matrix: renders inside Module 2 */}
        {activeModule === 'matrix' && (
          <ModuleRequirements
            currentCase={currentCase}
            onUpdateRequirements={handleUpdateRequirements}
            onUpdateStakeholders={handleUpdateStakeholders}
            onToggleAllocation={handleToggleAllocation}
            onOpenAiCopilot={handleOpenAiCopilot}
            initialSubTab="matrix"
          />
        )}

        {/* Module 9: 报告导出 */}
        {activeModule === 'export' && (
          <ModuleExport
            currentCase={currentCase}
            coverageRate={coverageRate}
            onOpenAiCopilot={handleOpenAiCopilot}
          />
        )}

        {/* Module 10: 模型要素与多维切片 */}
        {activeModule === 'slices' && (
          <ModuleKnowledgeSlices
            onOpenAiCopilot={handleOpenAiCopilot}
            onNavigateToExport={() => setActiveModule('export')}
          />
        )}
      </main>

      {/* Floating AI Copilot Trigger Button (Bottom-Right) */}
      <div className="fixed bottom-6 right-6 z-30">
        <button
          onClick={() => handleOpenAiCopilot()}
          className="group flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-slate-900 hover:bg-indigo-600 text-white text-xs font-semibold shadow-lg hover:shadow-xl transition-all cursor-pointer active:scale-95"
        >
          <Sparkles className="w-4 h-4 text-indigo-300 group-hover:rotate-12 transition-transform animate-pulse" />
          <span>7. MBSE AI 随诊专家</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
        </button>
      </div>

      {/* AI Copilot Drawer / Modal (Module 7) */}
      <AiCopilotModal
        isOpen={isAiCopilotOpen || activeModule === 'copilot'}
        onClose={() => {
          setIsAiCopilotOpen(false);
          if (activeModule === 'copilot') {
            setActiveModule('workflow');
          }
        }}
        currentCase={currentCase}
        initialCheckType={aiInitialCheck}
        coverageRate={coverageRate}
      />

      {/* Footer */}
      <footer className="border-t border-slate-200/80 bg-white py-4 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-800">MBSE 系统建模实验室</span>
            <span>• 形式化元模型、SysML 协同演播与数字线程平台</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>规范: INCOSE / SysML v1.6 & v2 / ISO 26262</span>
            <span className="text-slate-300">|</span>
            <span>单一真相源 (SSOT) 验证环境</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
