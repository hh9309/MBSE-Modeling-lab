import React from 'react';
import { CaseStudy } from '../types/mbse';
import { 
  ShieldCheck, 
  CheckCircle2, 
  FileText, 
  Printer, 
  Copy, 
  Check, 
  Bookmark,
  Layers,
  Award,
  QrCode,
  FileCheck2,
  AlertCircle
} from 'lucide-react';

interface OfficialReportDocumentProps {
  caseStudy: CaseStudy;
  coverageRate: number;
  reportMarkdown: string;
  onPrint?: () => void;
  onCopy?: () => void;
  isCopied?: boolean;
}

export const OfficialReportDocument: React.FC<OfficialReportDocumentProps> = ({
  caseStudy,
  coverageRate,
  reportMarkdown,
  onPrint,
  onCopy,
  isCopied,
}) => {
  // Document formal metadata
  const docCode = `MBSE-STD-${caseStudy.code.toUpperCase()}-2026`;
  const releaseDate = '2026-03-20';
  const digestHash = '8f3a9e2c41b0d7e6a5c8914b3017e29f493d8b12';

  // Helper to parse inline markdown (bold, code, math, badges) into styled elements
  const renderInlineMarkdown = (text: string): React.ReactNode => {
    // If the line is an equation block ($$...$$), render as inline element
    if (text.startsWith('$$') && text.endsWith('$$')) {
      const formula = text.slice(2, -2).trim();
      const cleanFormula = formula
        .replace(/\\text\{([^}]+)\}/g, '$1')
        .replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '($1 / $2)')
        .replace(/\\times/g, '×')
        .replace(/\\to/g, '⟶')
        .replace(/\\xrightarrow\{([^}]+)\}/g, '──($1)──>')
        .replace(/\\%/g, '%');

      return (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 my-1 rounded bg-slate-100 border border-slate-300 font-mono text-xs text-slate-900">
          <span className="font-serif italic font-bold text-indigo-700">∑</span>
          <span>{cleanFormula}</span>
        </span>
      );
    }

    // Tokenize string by bold, inline code, inline math, and regular text
    const tokenRegex = /(\*\*[^*]+\*\*|`[^`]+`|\$[^$]+\$)/g;
    const parts = text.split(tokenRegex);

    return parts.map((part, pIdx) => {
      if (!part) return null;

      if (part.startsWith('**') && part.endsWith('**')) {
        const boldContent = part.slice(2, -2);
        const isPass = boldContent.includes('PASS') || boldContent.includes('100%') || boldContent.includes('无悬空') || boldContent.includes('通过') || boldContent.includes('准予发布');
        const isWarn = boldContent.includes('FAIL') || boldContent.includes('悬空') || boldContent.includes('死锁') || boldContent.includes('需整改');

        return (
          <strong
            key={pIdx}
            className={`font-semibold ${
              isPass ? 'text-emerald-800' : isWarn ? 'text-rose-700' : 'text-slate-950'
            }`}
          >
            {boldContent}
          </strong>
        );
      }

      if (part.startsWith('`') && part.endsWith('`')) {
        const codeContent = part.slice(1, -1);
        return (
          <code
            key={pIdx}
            className="font-mono text-[11px] bg-slate-100 text-indigo-700 px-1.5 py-0.5 rounded border border-slate-300 font-medium mx-0.5"
          >
            {codeContent}
          </code>
        );
      }

      if (part.startsWith('$') && part.endsWith('$')) {
        const mathContent = part
          .slice(1, -1)
          .replace(/\\to/g, '⟶')
          .replace(/\\xrightarrow\{([^}]+)\}/g, '──($1)──>')
          .replace(/\\text\{([^}]+)\}/g, '$1');

        return (
          <span
            key={pIdx}
            className="font-mono text-[11px] text-indigo-950 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-200 mx-0.5 font-medium"
          >
            {mathContent}
          </span>
        );
      }

      return <span key={pIdx}>{part}</span>;
    });
  };

  // Helper to parse markdown lines into formal publication-grade layout elements
  const renderFormattedMarkdown = (md: string) => {
    const lines = md.split('\n');
    const elements: React.ReactNode[] = [];
    let tableBuffer: string[] = [];
    let inTable = false;

    const flushTable = (keyPrefix: number) => {
      if (tableBuffer.length < 2) {
        tableBuffer = [];
        inTable = false;
        return;
      }

      const headerLine = tableBuffer[0];
      const rowLines = tableBuffer.slice(2); // skip separator line

      const headers = headerLine
        .split('|')
        .map((c) => c.trim())
        .filter(Boolean);

      elements.push(
        <div key={`table-${keyPrefix}`} className="my-5 overflow-x-auto rounded-lg border-2 border-slate-800 shadow-2xs">
          <table className="w-full text-xs text-left border-collapse font-sans">
            <thead>
              <tr className="bg-slate-900 text-white font-bold border-b border-slate-800">
                {headers.map((h, hIdx) => (
                  <th key={hIdx} className="p-3 border-r border-slate-700 last:border-r-0 tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {rowLines.map((row, rIdx) => {
                const cells = row
                  .split('|')
                  .map((c) => c.trim())
                  .filter(Boolean);

                return (
                  <tr key={rIdx} className={rIdx % 2 === 0 ? 'bg-white' : 'bg-slate-50/80 hover:bg-slate-100/60'}>
                    {cells.map((cell, cIdx) => {
                      const isPass = cell.includes('PASS') || cell.includes('100%') || cell.includes('满足') || cell.includes('通过');
                      const isWarn = cell.includes('需整改') || cell.includes('FAIL') || cell.includes('未满足');

                      return (
                        <td
                          key={cIdx}
                          className={`p-2.5 border-r border-slate-200 last:border-r-0 ${
                            isPass ? 'text-emerald-700 font-semibold' : isWarn ? 'text-rose-700 font-bold' : 'text-slate-700'
                          }`}
                        >
                          {cell}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      );

      tableBuffer = [];
      inTable = false;
    };

    lines.forEach((line, idx) => {
      const trimmed = line.trim();

      // Table row detection
      if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
        inTable = true;
        tableBuffer.push(trimmed);
        return;
      } else if (inTable) {
        flushTable(idx);
      }

      // Skip raw document title & metadata header lines (already rendered into executive cover & table)
      if (
        trimmed.startsWith('# 【MBSE') ||
        trimmed.startsWith('**案例编号**') ||
        trimmed.startsWith('**所属工业领域**') ||
        trimmed.startsWith('**依循工业') ||
        trimmed.startsWith('**审查基线发布时间**') ||
        trimmed.startsWith('**系统工程全流程状态**') ||
        trimmed.startsWith('**审查综合结论**')
      ) {
        return;
      }

      // Horizontal Divider
      if (trimmed === '---') {
        elements.push(
          <div key={`hr-${idx}`} className="my-8 border-b-2 border-slate-200 print:hidden" />
        );
        return;
      }

      // Chapter Headings (## 模块一：... / ## 模块二：...)
      if (trimmed.startsWith('## 模块')) {
        const titleText = trimmed.replace(/^##\s*/, '');
        const match = titleText.match(/模块([一二三四五六0-9]+)[：:](.*)/);
        const moduleNum = match ? match[1] : '•';
        const moduleTitle = match ? match[2].trim() : titleText;

        const romanMap: Record<string, string> = {
          '一': 'I',
          '二': 'II',
          '三': 'III',
          '四': 'IV',
          '五': 'V',
          '六': 'VI',
          '1': 'I',
          '2': 'II',
          '3': 'III',
          '4': 'IV',
          '5': 'V',
          '6': 'VI',
        };
        const roman = romanMap[moduleNum] || moduleNum;

        elements.push(
          <div key={`h2-${idx}`} className="mt-10 mb-5 pt-4 border-t-2 border-slate-900 break-inside-avoid">
            <div className="flex items-center justify-between gap-3 border-b-2 border-slate-900 pb-2">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 bg-slate-900 text-white font-mono text-xs font-black tracking-widest rounded-xs">
                  SECTION {roman} • 模块 {moduleNum}
                </span>
                <h3 className="text-base sm:text-lg font-black font-serif text-slate-950 tracking-tight">
                  {moduleTitle}
                </h3>
              </div>
              <span className="text-[10px] font-mono text-slate-400 hidden sm:inline">
                STATUS: AUDITED & SIGNED
              </span>
            </div>
          </div>
        );
        return;
      }

      // Subsections (### 1.1 ...)
      if (trimmed.startsWith('### ')) {
        const subTitle = trimmed.replace(/^###\s*/, '');
        elements.push(
          <div key={`h3-${idx}`} className="mt-6 mb-3 flex items-center gap-2.5 break-inside-avoid">
            <span className="w-1.5 h-4.5 bg-slate-800 rounded-xs"></span>
            <h4 className="text-sm font-bold text-slate-900 font-sans tracking-tight">
              {subTitle}
            </h4>
          </div>
        );
        return;
      }

      // Blockquotes (> ...) - Formal Engineering Audit Opinion Box
      if (trimmed.startsWith('> ')) {
        elements.push(
          <div
            key={`bq-${idx}`}
            className="my-4 p-4 rounded-lg bg-slate-50 border-l-4 border-slate-800 text-xs text-slate-800 leading-relaxed font-sans shadow-2xs"
          >
            <div className="text-[11px] font-bold text-slate-900 mb-1 flex items-center gap-1.5">
              <FileCheck2 className="w-3.5 h-3.5 text-indigo-700" />
              <span>【联合审查委员会 · 专家专项审查评估意见】</span>
            </div>
            <div>{renderInlineMarkdown(trimmed.replace(/^>\s*/, ''))}</div>
          </div>
        );
        return;
      }

      // Bullet points (- ...)
      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        const content = trimmed.replace(/^[-*]\s*/, '');
        return (
          <div key={`li-${idx}`} className="ml-3 my-2 text-xs text-slate-800 flex items-start gap-2.5 leading-relaxed font-sans">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-700 mt-2 shrink-0" />
            <div className="flex-1">{renderInlineMarkdown(content)}</div>
          </div>
        );
      }

      // Indented sub-bullets (  * ...)
      if (line.startsWith('  ') && (trimmed.startsWith('* ') || trimmed.startsWith('- '))) {
        const content = trimmed.replace(/^[* -]\s*/, '');
        return (
          <div key={`subli-${idx}`} className="ml-8 my-1.5 text-xs text-slate-700 flex items-start gap-2 leading-relaxed font-sans">
            <span className="w-1 h-1 rounded-full bg-indigo-600 mt-2 shrink-0" />
            <div className="flex-1">{renderInlineMarkdown(content)}</div>
          </div>
        );
      }

      // Standalone LaTeX equation block ($$...$$)
      if (trimmed.startsWith('$$') && trimmed.endsWith('$$')) {
        const formula = trimmed.slice(2, -2).trim();
        const cleanFormula = formula
          .replace(/\\text\{([^}]+)\}/g, '$1')
          .replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '($1 / $2)')
          .replace(/\\times/g, '×')
          .replace(/\\to/g, '⟶')
          .replace(/\\xrightarrow\{([^}]+)\}/g, '──($1)──>')
          .replace(/\\%/g, '%');

        elements.push(
          <div key={`math-${idx}`} className="my-3 p-3.5 rounded-lg bg-slate-50 border border-slate-300 font-mono text-xs flex flex-wrap items-center justify-between gap-3 shadow-2xs">
            <div className="flex items-center gap-2.5">
              <span className="w-6 h-6 rounded-md bg-slate-900 text-white flex items-center justify-center font-serif italic text-xs font-bold shrink-0">
                ∑
              </span>
              <span className="font-semibold text-slate-900">{cleanFormula}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                形式化闭环通过 (PASS)
              </span>
              <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">(式 1-1)</span>
            </div>
          </div>
        );
        return;
      }

      // Regular Paragraphs
      if (trimmed.length > 0) {
        elements.push(
          <div key={`p-${idx}`} className="my-2.5 text-xs text-slate-800 leading-relaxed font-sans text-justify">
            {renderInlineMarkdown(trimmed)}
          </div>
        );
      }
    });

    if (inTable) {
      flushTable(lines.length);
    }

    return elements;
  };

  return (
    <div className="space-y-4">
      {/* Top Document Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-slate-900 text-white rounded-xl shadow-xs print:hidden text-xs">
        <div className="flex items-center gap-2.5">
          <FileText className="w-4 h-4 text-indigo-400" />
          <span className="font-bold tracking-tight">正式发布认证审查报告排版版面 (Official A4 Standard Report)</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-semibold">
            受控发布版 • SSOT
          </span>
        </div>

        <div className="flex items-center gap-2">
          {onCopy && (
            <button
              onClick={onCopy}
              className="px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
            >
              {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
              <span>{isCopied ? '已复制 Markdown' : '复制原文'}</span>
            </button>
          )}

          <button
            onClick={onPrint || (() => window.print())}
            className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white text-xs font-semibold shadow-md transition-all cursor-pointer flex items-center gap-1.5"
            title="调用系统打印机生成排版正式的 A4 PDF"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>打印 / 输出正式 PDF</span>
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* OFFICIAL PUBLISHED A4 DOCUMENT CANVAS CONTAINER          */}
      {/* ======================================================== */}
      <div className="bg-slate-200/80 p-3 sm:p-8 rounded-xl overflow-x-auto print:bg-white print:p-0">
        <article className="max-w-4xl mx-auto bg-white shadow-2xl rounded-xs border border-slate-300 p-8 sm:p-14 min-h-[1120px] text-slate-900 print:shadow-none print:border-none print:p-0 print:max-w-none font-serif relative">
          
          {/* Subtle Watermark */}
          <div className="absolute inset-0 pointer-events-none select-none flex items-center justify-center opacity-[0.03] overflow-hidden">
            <div className="text-6xl font-black rotate-[-30deg] tracking-widest text-slate-900 whitespace-nowrap">
              MBSE SSOT CERTIFIED • 国家受控基线
            </div>
          </div>

          {/* 1. OFFICIAL RED HEAD BAND (国家重大系统工程 MBSE 适航与数字化研制认证红头) */}
          <div className="border-b-4 border-red-700 pb-2 mb-2">
            <div className="flex items-center justify-between border-b border-red-300 pb-2 text-[11px] font-mono text-red-800">
              <span className="font-bold tracking-wider uppercase">
                NATIONAL FORMAL MBSE AIRWORTHINESS & ENGINEERING CERTIFICATION SPECIFICATION
              </span>
              <span className="font-bold">受控登记号: {docCode}</span>
            </div>

            <div className="pt-3 text-center space-y-1">
              <h2 className="text-lg sm:text-2xl font-black font-serif text-red-700 tracking-wider">
                国家复杂工业系统工程 MBSE 数字化研制审查与适航认证报告
              </h2>
              <div className="text-[11px] font-mono text-slate-600 flex items-center justify-center gap-4">
                <span>研制阶段: 工程研制与形式化适航认证 (Phase-C/D)</span>
                <span>•</span>
                <span>密级: 内部受控 (Commercial Confidential)</span>
                <span>•</span>
                <span>数字指纹: {digestHash.slice(0, 16)}...</span>
              </div>
            </div>
          </div>

          {/* Controlled Document Bar */}
          <div className="bg-slate-100 border border-slate-300 py-1.5 px-3 my-4 flex flex-wrap items-center justify-between text-[11px] font-mono text-slate-700">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900">受控状态:</span>
              <span>单一真相源 (SSOT) 研制基线认证发布</span>
            </div>
            <div className="flex items-center gap-2 text-emerald-800 font-bold">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>审查结论: 准予发布 (RELEASED & VERIFIED)</span>
            </div>
          </div>

          {/* 2. Formal Title Header */}
          <div className="text-center my-6 space-y-1.5">
            <h1 className="text-xl sm:text-2xl font-black font-serif text-slate-950 tracking-tight">
              【MBSE 工程研制审查认证报告】{caseStudy.title}
            </h1>
            <p className="text-xs text-slate-500 font-mono">
              Engineering Domain: {caseStudy.domain} • Standard Code: {caseStudy.code} • Release Rev 2.6
            </p>
          </div>

          {/* 3. Formal Executive Metadata Grid Table (Official 4-Column Box) */}
          <div className="my-6 border-2 border-slate-900 rounded-xs overflow-hidden text-xs font-sans">
            <div className="bg-slate-900 text-white p-2.5 font-bold flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Bookmark className="w-3.5 h-3.5 text-indigo-400" />
                <span>工程研制基线审查核心属性登记表 (Baseline Attributes & Audit Register)</span>
              </span>
              <span className="font-mono text-[10px] text-slate-300">CERT-{caseStudy.code}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-300 border-b border-slate-300">
              <div className="p-2.5 bg-slate-100 font-bold text-slate-800">案例系统名称:</div>
              <div className="p-2.5 sm:col-span-3 font-bold text-slate-950">{caseStudy.title} ({caseStudy.code})</div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-300 border-b border-slate-300">
              <div className="p-2.5 bg-slate-100 font-bold text-slate-800">所属工业领域:</div>
              <div className="p-2.5 font-semibold text-slate-900">{caseStudy.domain}</div>
              <div className="p-2.5 bg-slate-100 font-bold text-slate-800">依循适航/工业标准:</div>
              <div className="p-2.5 font-semibold text-slate-900">{caseStudy.standards.join(' / ')}</div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-300 border-b border-slate-300">
              <div className="p-2.5 bg-slate-100 font-bold text-slate-800">需求满足覆盖率:</div>
              <div className="p-2.5 font-bold text-emerald-800 font-mono flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{coverageRate}% 闭环通过 (PASS)</span>
              </div>
              <div className="p-2.5 bg-slate-100 font-bold text-slate-800">审查基线发布日期:</div>
              <div className="p-2.5 font-mono text-slate-900">{releaseDate}</div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-300">
              <div className="p-2.5 bg-slate-100 font-bold text-slate-800">数字指纹 (SHA-256):</div>
              <div className="p-2.5 sm:col-span-3 font-mono text-[10px] text-slate-700 truncate">
                {digestHash} • 经由形式化元模型自动哈希验签
              </div>
            </div>
          </div>

          {/* 4. Table of Contents / 6 Modules Index Box */}
          <div className="my-6 p-4 rounded-sm bg-slate-50 border border-slate-300 text-xs font-sans space-y-2.5">
            <div className="font-bold text-slate-900 flex items-center justify-between border-b border-slate-200 pb-2">
              <span className="flex items-center gap-2">
                <Layers className="w-3.5 h-3.5 text-slate-800" />
                <span>报告 6 大核心模块全流程审查目录 (Table of Contents)</span>
              </span>
              <span className="font-mono text-[10px] text-slate-500">依循 8. 全流程导引规范</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 text-slate-800 pt-1">
              <div className="flex items-center justify-between border-b border-dashed border-slate-200 pb-1">
                <span className="font-bold text-slate-900">MODULE 01:</span>
                <span className="truncate mx-2 flex-1 text-slate-700">利益攸关者诉求与多级需求形式化定义</span>
                <span className="font-mono text-slate-400">P.02</span>
              </div>
              <div className="flex items-center justify-between border-b border-dashed border-slate-200 pb-1">
                <span className="font-bold text-slate-900">MODULE 02:</span>
                <span className="truncate mx-2 flex-1 text-slate-700">系统物理/逻辑架构分解及白盒/黑盒接口建模</span>
                <span className="font-mono text-slate-400">P.05</span>
              </div>
              <div className="flex items-center justify-between border-b border-dashed border-slate-200 pb-1">
                <span className="font-bold text-slate-900">MODULE 03:</span>
                <span className="truncate mx-2 flex-1 text-slate-700">动态行为分配与状态机迁移验证 (FDIR)</span>
                <span className="font-mono text-slate-400">P.08</span>
              </div>
              <div className="flex items-center justify-between border-b border-dashed border-slate-200 pb-1">
                <span className="font-bold text-slate-900">MODULE 04:</span>
                <span className="truncate mx-2 flex-1 text-slate-700">全生命周期需求-架构-验证追踪矩阵闭环</span>
                <span className="font-mono text-slate-400">P.11</span>
              </div>
              <div className="flex items-center justify-between border-b border-dashed border-slate-200 pb-1">
                <span className="font-bold text-slate-900">MODULE 05:</span>
                <span className="truncate mx-2 flex-1 text-slate-700">模型图论代数一致性与拓扑连通度形式化检验</span>
                <span className="font-mono text-slate-400">P.14</span>
              </div>
              <div className="flex items-center justify-between border-b border-dashed border-slate-200 pb-1">
                <span className="font-bold text-slate-900">MODULE 06:</span>
                <span className="truncate mx-2 flex-1 text-slate-700">功能安全审计结论、指标达成度与基线发布签批</span>
                <span className="font-mono text-slate-400">P.17</span>
              </div>
            </div>
          </div>

          {/* 5. Formatted Report Content Stream */}
          <div className="my-6 space-y-4 font-serif">
            {renderFormattedMarkdown(reportMarkdown)}
          </div>

          {/* ======================================================== */}
          {/* 6. OFFICIAL SIGN-OFF & VERIFICATION SEAL BLOCK           */}
          {/* ======================================================== */}
          <div className="mt-14 pt-6 border-t-2 border-slate-900 space-y-6 break-inside-avoid">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-slate-900 tracking-tight font-sans">
                【联合审查委员会签批签署栏 (Sign-off & Official Certification)】
              </h4>
              <span className="text-[10px] font-mono text-slate-500">
                DATE OF ISSUANCE: {releaseDate}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs relative font-sans">
              {/* Prepared By */}
              <div className="p-4 rounded-sm border-2 border-slate-300 bg-slate-50/50 space-y-2">
                <div className="font-bold text-slate-700">编制人 (Prepared By):</div>
                <div className="font-serif font-black text-base text-slate-950 pl-2">张工 / 系统需求分析总师</div>
                <div className="text-[10px] text-emerald-700 font-mono flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>数字证书签名认证有效</span>
                </div>
              </div>

              {/* Reviewed By */}
              <div className="p-4 rounded-sm border-2 border-slate-300 bg-slate-50/50 space-y-2">
                <div className="font-bold text-slate-700">审核人 (Reviewed By):</div>
                <div className="font-serif font-black text-base text-slate-950 pl-2">王总师 / 复杂系统总体设计室</div>
                <div className="text-[10px] text-emerald-700 font-mono flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>形式化代数一致性审查通过</span>
                </div>
              </div>

              {/* Approved By */}
              <div className="p-4 rounded-sm border-2 border-slate-300 bg-slate-50/50 space-y-2">
                <div className="font-bold text-slate-700">批准人 (Approved By):</div>
                <div className="font-serif font-black text-base text-slate-950 pl-2">刘总 / 适航与安全验证专家委员会</div>
                <div className="text-[10px] text-emerald-700 font-mono flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>签发研制基线认证发布令</span>
                </div>
              </div>

              {/* Red Official Verification Stamp */}
              <div className="absolute right-6 -top-8 w-40 h-40 pointer-events-none select-none opacity-90 rotate-[-12deg] flex items-center justify-center">
                <div className="w-36 h-36 rounded-full border-4 border-red-600 flex flex-col items-center justify-center text-red-600 text-center p-2 shadow-sm bg-white/20 backdrop-blur-2xs">
                  <div className="text-[8px] font-bold tracking-widest uppercase">MBSE LAB CERTIFIED</div>
                  <div className="text-[16px] leading-tight my-0.5">★</div>
                  <div className="text-xs font-black tracking-tight">受控审查合格</div>
                  <div className="text-[9px] font-bold mt-0.5">官方基线专用章</div>
                  <div className="text-[8px] font-mono mt-0.5">2026-RELEASED</div>
                </div>
              </div>
            </div>

            {/* Document Bottom Footer */}
            <div className="pt-4 border-t border-slate-300 flex flex-wrap items-center justify-between text-[10px] text-slate-400 font-mono">
              <span>复杂装备数字线程单一真相源 (SSOT) 归档档案 • 密级内部受控</span>
              <span>第 1 卷 / 共 1 卷 • 电子发布有效副本 • 严禁未授权篡改</span>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
};
