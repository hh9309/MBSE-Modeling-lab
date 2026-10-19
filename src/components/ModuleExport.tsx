import React, { useState } from 'react';
import { CaseStudy } from '../types/mbse';
import { CASE_STUDIES } from '../data/casesData';
import { 
  Download, 
  FileText, 
  FileSpreadsheet, 
  FileCode, 
  Printer, 
  CheckCircle2, 
  ShieldCheck, 
  Copy, 
  Check,
  Sparkles,
  Archive,
  Layers,
  Box,
  Activity,
  Workflow,
  ExternalLink,
  BookOpen,
  Car,
  Rocket,
  Train,
  Plane,
  Cpu,
  Maximize2,
  Minimize2,
  X
} from 'lucide-react';
import {
  generateWorkflowCaseReport,
  generateTraceabilityCsv,
  generateSysmlXmi,
  generateCaseJson,
  generateAllCasesBundleJson,
} from '../utils/caseReportGenerator';
import { OfficialReportDocument } from './OfficialReportDocument';

interface ModuleExportProps {
  currentCase: CaseStudy;
  coverageRate: number;
  onOpenAiCopilot: (checkType?: string) => void;
}

export const ModuleExport: React.FC<ModuleExportProps> = ({
  currentCase: initialCase,
  coverageRate: initialCoverage,
  onOpenAiCopilot,
}) => {
  // Allow user to switch case directly inside the export module
  const [selectedCaseId, setSelectedCaseId] = useState<string>(initialCase.id);
  const [exportSection, setExportSection] = useState<'official-report' | 'raw-datasets'>('official-report');
  const [exportFormat, setExportFormat] = useState<'workflow-report' | 'csv' | 'xmi' | 'json'>('workflow-report');
  const [reportLayoutMode, setReportLayoutMode] = useState<'official' | 'raw'>('official');
  const [copied, setCopied] = useState(false);
  const [downloadSuccessName, setDownloadSuccessName] = useState<string | null>(null);
  const [isReportFullscreen, setIsReportFullscreen] = useState(false);

  const selectedCase = CASE_STUDIES.find((c) => c.id === selectedCaseId) || initialCase;

  // Compute coverage for selected case
  const reqs = selectedCase.requirements || [];
  const satisfiedCount = reqs.filter((r) => (r.allocatedBlockIds || []).length > 0).length;
  const currentCoverage = reqs.length > 0 ? Math.round((satisfiedCount / reqs.length) * 100) : 100;

  // Case icons helper
  const getCaseIcon = (id: string) => {
    switch (id) {
      case 'case-auto-eea':
        return <Car className="w-4 h-4 text-indigo-600" />;
      case 'case-aero-ttc':
        return <Rocket className="w-4 h-4 text-purple-600" />;
      case 'case-rail-tcms':
        return <Train className="w-4 h-4 text-blue-600" />;
      case 'case-uav-swarm':
        return <Plane className="w-4 h-4 text-emerald-600" />;
      case 'case-med-twin':
        return <Activity className="w-4 h-4 text-rose-600" />;
      case 'case-robot-cell':
        return <Cpu className="w-4 h-4 text-amber-600" />;
      default:
        return <Box className="w-4 h-4 text-slate-600" />;
    }
  };

  // Get active export content
  const getActiveContent = (): string => {
    switch (exportFormat) {
      case 'workflow-report':
        return generateWorkflowCaseReport(selectedCase, currentCoverage);
      case 'csv':
        return generateTraceabilityCsv(selectedCase);
      case 'xmi':
        return generateSysmlXmi(selectedCase);
      case 'json':
        return generateCaseJson(selectedCase);
      default:
        return '';
    }
  };

  const activeContent = getActiveContent();
  const wordCount = activeContent.replace(/\s+/g, '').length;

  // Download helper
  const triggerDownload = (content: string, filename: string, mime: string) => {
    const blob = new Blob([content], { type: `${mime};charset=utf-8;` });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);

    setDownloadSuccessName(filename);
    setTimeout(() => setDownloadSuccessName(null), 2500);
  };

  // Download current active format
  const handleDownloadActive = () => {
    let filename = `${selectedCase.code}_workflow_report.md`;
    let mime = 'text/markdown';

    if (exportFormat === 'csv') {
      filename = `${selectedCase.code}_traceability_matrix.csv`;
      mime = 'text/csv';
    } else if (exportFormat === 'xmi') {
      filename = `${selectedCase.code}_sysml.xmi`;
      mime = 'application/xml';
    } else if (exportFormat === 'json') {
      filename = `${selectedCase.code}_model_raw.json`;
      mime = 'application/json';
    }

    triggerDownload(activeContent, filename, mime);
  };

  // Single-case specific download helpers
  const handleDownloadSingleCaseJson = (cs: CaseStudy) => {
    triggerDownload(generateCaseJson(cs), `${cs.code}_raw_metadata.json`, 'application/json');
  };

  const handleDownloadSingleCaseCsv = (cs: CaseStudy) => {
    triggerDownload(generateTraceabilityCsv(cs), `${cs.code}_rtm_matrix.csv`, 'text/csv');
  };

  const handleDownloadSingleCaseXmi = (cs: CaseStudy) => {
    triggerDownload(generateSysmlXmi(cs), `${cs.code}_sysml.xmi`, 'application/xml');
  };

  const handleDownloadSingleCaseReport = (cs: CaseStudy) => {
    triggerDownload(generateWorkflowCaseReport(cs), `${cs.code}_workflow_report.md`, 'text/markdown');
  };

  // Bundle download all 6 cases
  const handleDownloadAllBundle = () => {
    const bundleContent = generateAllCasesBundleJson(CASE_STUDIES);
    triggerDownload(bundleContent, 'MBSE_6_Cases_Complete_Bundle.json', 'application/json');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(activeContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Module Title Header */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 text-[11px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200/60 rounded-md">
                模块 09
              </span>
              <h2 className="text-lg font-semibold text-slate-900 tracking-tight">
                数据集与分析报告导出引擎 (Dataset & Report Export Engine)
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1 max-w-3xl leading-relaxed">
              严格按照 <strong>8. 全流程导引</strong> 的六大工程阶段（需求定义 ⟶ 架构分解 ⟶ 行为分配 ⟶ 追踪闭环 ⟶ 拓扑代数 ⟶ 安全审计），
              提供六大实战案例的全流程报告导出（每篇精炼 1000+ 字）及原始数据（JSON、CSV 需求追踪矩阵、SysML XMI 2.1）下载功能。
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => onOpenAiCopilot('生成适航/工安级正式评审报告摘要与合规审计')}
              className="px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI 适规深度审查</span>
            </button>

            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-medium transition-colors cursor-pointer shadow-2xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>打印 / 导出 PDF</span>
            </button>

            <button
              onClick={handleDownloadAllBundle}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-indigo-200 bg-indigo-50/70 hover:bg-indigo-100 text-indigo-700 text-xs font-medium transition-colors cursor-pointer shadow-2xs"
              title="一键打包下载全部 6 大案例的完整 JSON 元模型数据集"
            >
              <Archive className="w-3.5 h-3.5" />
              <span>打包下载六大案例全量数据 (.json)</span>
            </button>

            <button
              onClick={handleDownloadActive}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium shadow-xs transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>下载当前格式文件</span>
            </button>
          </div>
        </div>

        {/* Download Success Banner */}
        {downloadSuccessName && (
          <div className="mt-3 p-2 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs flex items-center gap-2 animate-in fade-in">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>已成功下载文件：<strong>{downloadSuccessName}</strong></span>
          </div>
        )}

        {/* 6 Cases Selector Pills */}
        <div className="mt-5 pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
              <span>选择目标案例以导出对应全流程报告与原始数据：</span>
            </span>
            <span className="text-[11px] text-slate-400">
              当前选定: <span className="font-semibold text-slate-700">{selectedCase.code} - {selectedCase.title}</span>
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {CASE_STUDIES.map((cs) => {
              const isSelected = cs.id === selectedCase.id;
              return (
                <button
                  key={cs.id}
                  onClick={() => setSelectedCaseId(cs.id)}
                  className={`p-2 rounded-lg border text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50/70 shadow-xs ring-1 ring-indigo-500'
                      : 'border-slate-200 bg-slate-50/50 hover:bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] font-bold text-slate-500">{cs.code}</span>
                    {getCaseIcon(cs.id)}
                  </div>
                  <h4 className="text-xs font-bold text-slate-800 line-clamp-1 mt-1">{cs.title}</h4>
                  <div className="text-[10px] text-slate-400 truncate mt-0.5">{cs.domain}</div>
                </button>
              );
            })}
          </div>

          {/* Section Mode Switcher Tabs */}
          <div className="flex flex-wrap items-center gap-2 mt-4 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setExportSection('official-report')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                exportSection === 'official-report'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>📑 正式发布认证审查报告 (Official Published Report)</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-semibold ${
                exportSection === 'official-report' ? 'bg-indigo-500 text-white' : 'bg-slate-200 text-slate-600'
              }`}>
                A4 研制受控标准
              </span>
            </button>

            <button
              type="button"
              onClick={() => setExportSection('raw-datasets')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                exportSection === 'raw-datasets'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              <Download className="w-4 h-4" />
              <span>💾 六大案例原始数据下载专区 (Raw Datasets 4 格式)</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-semibold ${
                exportSection === 'raw-datasets' ? 'bg-indigo-500 text-white' : 'bg-slate-200 text-slate-600'
              }`}>
                JSON • CSV • XMI • MD
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* 1. 六大案例原始数据下载专区 (Active when exportSection === 'raw-datasets') */}
      {exportSection === 'raw-datasets' && (
        <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Download className="w-4 h-4 text-indigo-600" />
                <span>六大案例原始数据下载专区 (Raw Datasets for All 6 Cases)</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                每个案例均提供独立的原始元模型 (JSON)、全链路需求追踪矩阵 (CSV)、标准模型文件 (SysML XMI 2.1) 及 6 大模块全流程报告 (MD)。
              </p>
            </div>
            <button
              onClick={() => setExportSection('official-report')}
              className="px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>切换至正式发布审查报告预览</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {CASE_STUDIES.map((cs) => {
              const isCurrent = cs.id === selectedCase.id;
              const csReqs = cs.requirements || [];
              const csBlocks = cs.blocks || [];
              const csConnectors = cs.connectors || [];

              return (
                <div
                  key={cs.id}
                  className={`p-4 rounded-xl border transition-all ${
                    isCurrent
                      ? 'border-indigo-300 bg-indigo-50/30 ring-1 ring-indigo-200 shadow-xs'
                      : 'border-slate-200/90 bg-white hover:border-slate-300'
                  }`}
                >
                  {/* Case Card Header */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center">
                        {getCaseIcon(cs.id)}
                      </div>
                      <div>
                        <span className="font-mono text-[10px] font-bold text-indigo-600 block leading-tight">
                          {cs.code}
                        </span>
                        <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{cs.title}</h4>
                      </div>
                    </div>
                    {isCurrent && (
                      <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-indigo-600 text-white shrink-0">
                        当前预览
                      </span>
                    )}
                  </div>

                  <div className="text-[11px] text-slate-500 mt-2 line-clamp-1">{cs.domain}</div>

                  {/* Metrics Pill Grid */}
                  <div className="grid grid-cols-3 gap-1 mt-2.5 pt-2.5 border-t border-slate-100 text-center font-mono text-[10px]">
                    <div className="p-1 rounded bg-slate-50 border border-slate-100">
                      <span className="text-slate-400 block text-[9px]">需求</span>
                      <strong className="text-slate-700">{csReqs.length} 项</strong>
                    </div>
                    <div className="p-1 rounded bg-slate-50 border border-slate-100">
                      <span className="text-slate-400 block text-[9px]">组件</span>
                      <strong className="text-slate-700">{csBlocks.length} 个</strong>
                    </div>
                    <div className="p-1 rounded bg-slate-50 border border-slate-100">
                      <span className="text-slate-400 block text-[9px]">总线</span>
                      <strong className="text-slate-700">{csConnectors.length} 条</strong>
                    </div>
                  </div>

                  {/* 4 Action Buttons for This Case */}
                  <div className="grid grid-cols-2 gap-1.5 mt-3 pt-2.5 border-t border-slate-100 text-[11px]">
                    <button
                      onClick={() => handleDownloadSingleCaseJson(cs)}
                      className="flex items-center justify-center gap-1 p-1.5 rounded-lg border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50 text-slate-700 font-medium transition-colors cursor-pointer"
                      title="下载该案例的完整 JSON 元模型快照"
                    >
                      <FileCode className="w-3 h-3 text-indigo-600" />
                      <span>原始 JSON</span>
                    </button>

                    <button
                      onClick={() => handleDownloadSingleCaseCsv(cs)}
                      className="flex items-center justify-center gap-1 p-1.5 rounded-lg border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/50 text-slate-700 font-medium transition-colors cursor-pointer"
                      title="下载该案例的需求追踪矩阵 CSV 格式"
                    >
                      <FileSpreadsheet className="w-3 h-3 text-emerald-600" />
                      <span>追踪矩阵 CSV</span>
                    </button>

                    <button
                      onClick={() => handleDownloadSingleCaseXmi(cs)}
                      className="flex items-center justify-center gap-1 p-1.5 rounded-lg border border-slate-200 hover:border-purple-300 hover:bg-purple-50/50 text-slate-700 font-medium transition-colors cursor-pointer"
                      title="下载 SysML XMI 2.1 工业模型规范文件"
                    >
                      <Workflow className="w-3 h-3 text-purple-600" />
                      <span>SysML XMI</span>
                    </button>

                    <button
                      onClick={() => handleDownloadSingleCaseReport(cs)}
                      className="flex items-center justify-center gap-1 p-1.5 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 text-slate-700 font-medium transition-colors cursor-pointer"
                      title="下载按照全流程导引步骤编制的 6 大模块审查报告 (Markdown)"
                    >
                      <FileText className="w-3 h-3 text-blue-600" />
                      <span>全流程报告 MD</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. Detailed Case Report Viewer & Format Switcher (Active when exportSection === 'official-report') */}
      {exportSection === 'official-report' && (
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
        {/* Header with Format Selectors and Metrics */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-slate-700">导出预览格式:</span>
            
            {/* 1. Workflow Report (6 Modules, >1000 words) */}
            <button
              onClick={() => setExportFormat('workflow-report')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                exportFormat === 'workflow-report'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>全流程导引 6 大模块案例报告 (Markdown)</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                exportFormat === 'workflow-report' ? 'bg-indigo-500 text-white' : 'bg-slate-100 text-slate-600'
              }`}>
                1000+ 字
              </span>
            </button>

            {/* 2. Traceability Matrix CSV */}
            <button
              onClick={() => setExportFormat('csv')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                exportFormat === 'csv'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>需求追踪矩阵原始数据表 (CSV)</span>
            </button>

            {/* 3. SysML XMI 2.1 */}
            <button
              onClick={() => setExportFormat('xmi')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                exportFormat === 'xmi'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Workflow className="w-3.5 h-3.5" />
              <span>SysML XMI 2.1 (OMG 工业规范)</span>
            </button>

            {/* 4. JSON Model Snapshot */}
            <button
              onClick={() => setExportFormat('json')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                exportFormat === 'json'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>JSON 全元模型快照</span>
            </button>
          </div>

          {/* Action buttons: copy & word count */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-slate-500 hidden sm:inline">
              统计字数: <strong className="text-slate-800">{wordCount}</strong> 字符
            </span>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer shadow-2xs"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? '已复制到剪贴板' : '复制内容'}</span>
            </button>
          </div>
        </div>

        {/* Sub-toolbar for Workflow Report Layout Mode */}
        {exportFormat === 'workflow-report' && (
          <div className="px-4 py-2.5 bg-slate-100/90 border-b border-slate-200 text-xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 p-0.5 bg-white rounded-lg border border-slate-200 shadow-2xs">
              <button
                type="button"
                onClick={() => setReportLayoutMode('official')}
                className={`px-3 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                  reportLayoutMode === 'official'
                    ? 'bg-indigo-600 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>📑 正式发布排版预览 (Official Report Document)</span>
              </button>
              <button
                type="button"
                onClick={() => setReportLayoutMode('raw')}
                className={`px-3 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                  reportLayoutMode === 'raw'
                    ? 'bg-indigo-600 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <FileCode className="w-3.5 h-3.5" />
                <span>📝 原始 Markdown 源码</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] text-slate-500 hidden sm:inline">
                符合 8. 全流程导引规范 (6大模块 • 1000+字精炼)
              </span>

              <button
                type="button"
                onClick={() => setIsReportFullscreen(true)}
                className="px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-medium transition-colors cursor-pointer flex items-center gap-1 shadow-2xs"
                title="开启全屏排版预览模式"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span>全屏正式排版</span>
              </button>

              <button
                onClick={() => window.print()}
                className="px-2.5 py-1 rounded-lg bg-white hover:bg-slate-50 text-indigo-700 border border-slate-200 text-xs font-medium transition-colors cursor-pointer flex items-center gap-1 shadow-2xs"
                title="调用系统打印机打印排版正式的 A4 PDF"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>打印 / PDF 导出</span>
              </button>
            </div>
          </div>
        )}

        {/* Fullscreen Preview Modal Overlay */}
        {isReportFullscreen && (
          <div className="fixed inset-0 z-50 bg-slate-900/90 backdrop-blur-md flex flex-col p-2 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
            <div className="max-w-5xl w-full mx-auto space-y-4 my-auto">
              {/* Modal Top Bar */}
              <div className="flex items-center justify-between bg-slate-950/80 text-white p-3.5 rounded-xl border border-slate-700 shadow-xl">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-indigo-400" />
                  <span className="font-bold text-xs sm:text-sm">
                    【{selectedCase.title}】正式研制审查与适航认证报告 · 全屏预览
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => window.print()}
                    className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>打印 PDF</span>
                  </button>
                  <button
                    onClick={() => setIsReportFullscreen(false)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                    title="退出全屏预览"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Document Canvas */}
              <div className="bg-slate-300/60 p-2 sm:p-6 rounded-2xl shadow-2xl">
                <OfficialReportDocument
                  caseStudy={selectedCase}
                  coverageRate={currentCoverage}
                  reportMarkdown={activeContent}
                  onPrint={() => window.print()}
                  onCopy={handleCopy}
                  isCopied={copied}
                />
              </div>
            </div>
          </div>
        )}

        {/* Content Display: Official Report vs Raw Markdown vs CSV Table vs Code */}
        {exportFormat === 'workflow-report' && reportLayoutMode === 'official' ? (
          <OfficialReportDocument
            caseStudy={selectedCase}
            coverageRate={currentCoverage}
            reportMarkdown={activeContent}
            onPrint={() => window.print()}
            onCopy={handleCopy}
            isCopied={copied}
          />
        ) : exportFormat === 'csv' ? (
          /* Structured Table View for Traceability Matrix */
          <div className="p-5 space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-600">
              <span className="font-semibold text-slate-800">
                【{selectedCase.title}】需求追踪矩阵 (Traceability Matrix) 数据明细表：
              </span>
              <span className="font-mono text-[11px] text-slate-500">{reqs.length} 条需求项</span>
            </div>
            <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-2xs">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-800 border-b border-slate-200 font-bold">
                    <th className="p-2.5">需求 ID</th>
                    <th className="p-2.5">需求名称</th>
                    <th className="p-2.5">层级</th>
                    <th className="p-2.5">优先级</th>
                    <th className="p-2.5">安全等级</th>
                    <th className="p-2.5">验证方式</th>
                    <th className="p-2.5">满足物理组件 (Blocks)</th>
                    <th className="p-2.5 text-right">闭环状态</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {reqs.map((r, i) => {
                    const isSatisfied = (r.allocatedBlockIds || []).length > 0;
                    return (
                      <tr key={r.id} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                        <td className="p-2.5 font-mono font-bold text-indigo-700">{r.id}</td>
                        <td className="p-2.5 font-medium text-slate-800">{r.title}</td>
                        <td className="p-2.5 uppercase font-mono text-[11px]">{r.level}</td>
                        <td className="p-2.5">
                          <span
                            className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                              r.priority === 'critical'
                                ? 'bg-rose-100 text-rose-800'
                                : r.priority === 'high'
                                ? 'bg-amber-100 text-amber-800'
                                : r.priority === 'medium'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {r.priority}
                          </span>
                        </td>
                        <td className="p-2.5 font-mono font-semibold">{r.safetyLevel || 'QM'}</td>
                        <td className="p-2.5 text-slate-600">{r.verificationMethod}</td>
                        <td className="p-2.5 font-mono text-[11px] text-slate-700">
                          {(r.allocatedBlockIds || []).join(', ') || '未分配 (Dangling)'}
                        </td>
                        <td className="p-2.5 text-right">
                          {isSatisfied ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              已满足
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-300">
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
        ) : (
          /* Raw Code / Text View */
          <div className="p-6 font-mono text-xs text-slate-800 bg-slate-900 text-slate-100 max-h-[620px] overflow-y-auto leading-relaxed whitespace-pre-wrap selection:bg-indigo-500">
            {activeContent}
          </div>
        )}
      </div>
      )}

      {/* Reciprocal Footer Navigation Banners */}
      {exportSection === 'official-report' ? (
        <div className="p-4 bg-white rounded-xl border border-slate-200/90 shadow-2xs flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-700">
              <Archive className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-slate-800 block">需要下载六大案例的原始数据集？</span>
              <span className="text-slate-500 text-[11px]">提供各案例独立的完整 JSON 元模型快照、CSV 需求追踪矩阵、SysML XMI 2.1 规范及全流程报告 MD。</span>
            </div>
          </div>
          <button
            onClick={() => setExportSection('raw-datasets')}
            className="px-4 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold border border-indigo-200 text-xs transition-colors cursor-pointer flex items-center gap-2 shadow-2xs"
          >
            <span>前往六大案例原始数据下载专区</span>
            <Download className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <div className="p-4 bg-white rounded-xl border border-slate-200/90 shadow-2xs flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-slate-800 block">已就绪预览正式发布审查认证报告？</span>
              <span className="text-slate-500 text-[11px]">包含红头审批签发章、三级审批责任人签名、形式化公式代数演算及 6 大核心模块审查目录。</span>
            </div>
          </div>
          <button
            onClick={() => setExportSection('official-report')}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-xs transition-colors cursor-pointer flex items-center gap-2"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>返回正式发布报告排版预览</span>
          </button>
        </div>
      )}
    </div>
  );
};
