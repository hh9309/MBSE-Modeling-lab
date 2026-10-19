import React, { useState, useRef, useEffect } from 'react';
import { CaseStudy } from '../types/mbse';
import { 
  Sparkles, 
  X, 
  Send, 
  Bot, 
  User, 
  AlertTriangle, 
  ShieldCheck, 
  GitFork, 
  RotateCcw, 
  Copy, 
  Check,
  Settings,
  Key,
  Eye,
  EyeOff,
  ExternalLink,
  Zap,
  Globe,
  Radio,
  Trash2,
  Activity,
  Maximize2,
  Minimize2,
  Layers,
  ChevronRight,
  BookOpen,
  Cpu
} from 'lucide-react';
import {
  SupportedModel,
  LlmConfig,
  loadLlmConfig,
  saveLlmConfig,
  getActiveKey,
  hasValidApiKey,
  testConnection,
  runModelDiagnosis,
  runModelChat,
  generateClientHeuristicDiagnosis
} from '../utils/llmService';

interface AiCopilotModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentCase: CaseStudy;
  initialCheckType?: string;
  coverageRate: number;
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  source?: string;
}

export const AiCopilotModal: React.FC<AiCopilotModalProps> = ({
  isOpen,
  onClose,
  currentCase,
  initialCheckType,
  coverageRate,
}) => {
  // LLM Configuration state
  const [config, setConfig] = useState<LlmConfig>(loadLlmConfig());
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Settings editing state
  const [editModel, setEditModel] = useState<SupportedModel>(config.selectedModel);
  const [editGeminiKey, setEditGeminiKey] = useState(config.geminiKey);
  const [editDeepseekKey, setEditDeepseekKey] = useState(config.deepseekKey);
  const [editEndpoint, setEditEndpoint] = useState(config.customEndpoint || '');
  const [showKey, setShowKey] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');
  const [warningMsg, setWarningMsg] = useState('');

  // Connection testing state
  const [testState, setTestState] = useState<{ loading: boolean; success?: boolean; msg: string } | null>(null);

  // Chat conversation state
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: `👋 您好！我是 **MBSE 工业系统建模 AI 随诊专家**。\n\n我已接入当前工程案例 **【${currentCase.title}】**。我可以为您审查系统需求分解完整度、跨域接口端口协议匹配、动态状态机死锁与互斥性、以及 ISO 26262 / ECSS 适航合规性。\n\n💡 **大模型配置提示**：\n- 本项目专为 GitHub 静态部署设计，由您的浏览器直接发起 HTTPS 请求。\n- 请点击右上角 **⚙️ 齿轮图标** 手工输入 API-Key 并选择 **Gemini 3 flash** 或 **DeepSeek-V4-Pro**。\n- 若未配置 Key，您也可以随时使用内建的「**免 Key 离线高保真规则引擎**」执行全项诊断。`,
      timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
      source: '系统助手',
    },
  ]);
  const [inputVal, setInputVal] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const hasKey = hasValidApiKey(config);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // When initial check type changes or modal opens
  useEffect(() => {
    if (isOpen && initialCheckType) {
      handleRunDiagnosis(initialCheckType);
    }
  }, [isOpen, initialCheckType]);

  // Handle Save LLM Settings (Step 3: 确认大模型选择)
  const handleConfirmModelSelection = () => {
    setWarningMsg('');
    const targetKey = editModel === 'Gemini 3 flash' ? editGeminiKey.trim() : editDeepseekKey.trim();

    if (!targetKey) {
      setWarningMsg(`⚠️ 提示：部署到 GitHub 必须输入 API-Key 才能调用大模型！请在输入框中填入 ${editModel} 的 API Key。`);
      return;
    }

    const updatedConfig: LlmConfig = {
      selectedModel: editModel,
      geminiKey: editGeminiKey.trim(),
      deepseekKey: editDeepseekKey.trim(),
      customEndpoint: editEndpoint.trim(),
    };

    saveLlmConfig(updatedConfig);
    setConfig(updatedConfig);
    setSaveSuccessMsg(`✅ 大模型选择已确认！当前启用【${editModel}】，API-Key 已保存至浏览器。`);

    // Add notification in chat
    setMessages((prev) => [
      ...prev,
      {
        role: 'assistant',
        content: `⚙️ **大模型配置已更新生效**：\n- **当前选择**: **${editModel}**\n- **API-Key**: 已成功写入本地浏览器安全存储（GitHub 纯前端直接调用模式）\n- **状态**: 随时可发起一键形式化诊断与模型 Q&A 随诊！`,
        timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
        source: editModel,
      },
    ]);

    setTimeout(() => {
      setSaveSuccessMsg('');
      setIsSettingsOpen(false);
    }, 1500);
  };

  // Handle Test Connection
  const handleTestConnection = async () => {
    const targetKey = editModel === 'Gemini 3 flash' ? editGeminiKey.trim() : editDeepseekKey.trim();
    if (!targetKey) {
      setTestState({
        loading: false,
        success: false,
        msg: `请先在下方输入 ${editModel} 的 API-Key 再测试连通性！`,
      });
      return;
    }

    setTestState({ loading: true, msg: `正在测试与 ${editModel} API 的连通性...` });
    const result = await testConnection(editModel, targetKey, editEndpoint);
    setTestState({
      loading: false,
      success: result.success,
      msg: result.message,
    });
  };

  // Clear current key
  const handleClearCurrentKey = () => {
    if (editModel === 'Gemini 3 flash') {
      setEditGeminiKey('');
    } else {
      setEditDeepseekKey('');
    }
    const updated: LlmConfig = {
      ...config,
      geminiKey: editModel === 'Gemini 3 flash' ? '' : config.geminiKey,
      deepseekKey: editModel === 'DeepSeek-V4-Pro' ? '' : config.deepseekKey,
    };
    saveLlmConfig(updated);
    setConfig(updated);
    setTestState(null);
  };

  // Run Diagnosis
  const handleRunDiagnosis = async (checkType: string) => {
    setIsLoading(true);

    const activeApiKey = getActiveKey(config);

    if (!activeApiKey) {
      setIsSettingsOpen(true);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `⚠️ **未检测到【${config.selectedModel}】的有效 API-Key**：\n\n项目部署在 GitHub 静态托管环境，必须在右上角设置面板中**手工输入您的 API-Key** 才能调用大模型。\n\n已为您自动打开大模型配置面板，请输入 Key 后点击【**确认大模型选择**】即可立即诊断。\n\n*(如需临时免 Key 快速预览，可点击下方「免 Key 离线体验」体验内置的高保真离线审查报告)*`,
          timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
          source: '系统提示',
        },
      ]);
      setIsLoading(false);
      return;
    }

    try {
      const result = await runModelDiagnosis(config, checkType, currentCase);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: result.text,
          timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
          source: result.source,
        },
      ]);
    } catch (err: any) {
      console.warn('Direct LLM call error, attempting fallback:', err);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `⚠️ **大模型调用提示**: ${err.message || 'API 请求异常'}。\n\n已为您自动切换至内建离线高保真审查报告：\n\n${generateClientHeuristicDiagnosis(
            currentCase,
            checkType
          )}`,
          timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
          source: `${config.selectedModel} (离线兜底)`,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Run offline heuristic directly
  const handleRunOfflineDemo = (checkType: string = '全维一致性与需求悬空审查') => {
    setIsLoading(true);
    setTimeout(() => {
      const heuristicReport = generateClientHeuristicDiagnosis(currentCase, checkType);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: heuristicReport,
          timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
          source: '内建离线规则引擎',
        },
      ]);
      setIsLoading(false);
    }, 400);
  };

  // Handle Send Message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim() || isLoading) return;

    const userText = inputVal.trim();
    setInputVal('');

    const newMsg: ChatMessage = {
      role: 'user',
      content: userText,
      timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
    };

    const nextHistory = [...messages, newMsg];
    setMessages(nextHistory);

    const activeApiKey = getActiveKey(config);

    if (!activeApiKey) {
      setIsSettingsOpen(true);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `⚠️ **未配置【${config.selectedModel}】API-Key**：\n\n本项目需在浏览器端直接调用大模型，请在右上角设置面板中输入 API-Key 并确认。或点击下方的「免 Key 离线体验」测试内置专家规则库。`,
          timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
          source: '系统提示',
        },
      ]);
      return;
    }

    setIsLoading(true);
    try {
      const promptMessages = nextHistory.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const reply = await runModelChat(config, promptMessages, currentCase.title, currentCase);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: reply.text,
          timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
          source: reply.source,
        },
      ]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `⚠️ 对话调用异常: ${err.message || '网络连接或 API Key 校验失败'}\n\n建议检查网络代理端点设置，或重新在设置中确认 API-Key。`,
          timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
          source: `${config.selectedModel} (异常处理)`,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyContent = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  const renderInlineText = (text: string): React.ReactNode => {
    const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`|\$[^$]+\$)/g);
    return parts.map((part, pIdx) => {
      if (!part) return null;
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={pIdx} className="font-bold text-slate-900">
            {part.slice(2, -2)}
          </strong>
        );
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <code
            key={pIdx}
            className="font-mono text-[11px] bg-slate-100 text-indigo-700 px-1.5 py-0.5 rounded border border-slate-200 mx-0.5"
          >
            {part.slice(1, -1)}
          </code>
        );
      }
      if (part.startsWith('$') && part.endsWith('$')) {
        return (
          <span
            key={pIdx}
            className="font-mono text-[11px] text-indigo-900 bg-indigo-50/70 px-1.5 py-0.5 rounded border border-indigo-200/50 mx-0.5"
          >
            {part.slice(1, -1)}
          </span>
        );
      }
      return <span key={pIdx}>{part}</span>;
    });
  };

  const renderChatMarkdown = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, idx) => {
      const trimmed = line.trim();
      if (!trimmed) {
        return <div key={idx} className="h-1.5" />;
      }

      if (trimmed.startsWith('### ')) {
        return (
          <h4 key={idx} className="font-bold text-slate-900 text-xs mt-2.5 mb-1 flex items-center gap-1.5">
            <span className="w-1.5 h-3.5 bg-indigo-600 rounded-xs"></span>
            <span>{trimmed.replace(/^###\s*/, '')}</span>
          </h4>
        );
      }
      if (trimmed.startsWith('## ')) {
        return (
          <h3 key={idx} className="font-bold text-slate-900 text-sm mt-3 mb-1.5 pb-1 border-b border-slate-200">
            {trimmed.replace(/^##\s*/, '')}
          </h3>
        );
      }

      if (trimmed.startsWith('> ')) {
        return (
          <div key={idx} className="my-1.5 p-2 rounded bg-indigo-50/60 border-l-2 border-indigo-500 text-[11px] text-indigo-900 italic">
            {renderInlineText(trimmed.replace(/^>\s*/, ''))}
          </div>
        );
      }

      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        const itemContent = trimmed.replace(/^[-*]\s*/, '');
        return (
          <div key={idx} className="ml-3 my-0.5 flex items-start gap-1.5 text-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
            <div className="flex-1">{renderInlineText(itemContent)}</div>
          </div>
        );
      }

      return (
        <div key={idx} className="my-1 text-xs leading-relaxed">
          {renderInlineText(trimmed)}
        </div>
      );
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col w-screen h-screen overflow-hidden animate-in fade-in duration-200">
      {/* ======================================================== */}
      {/* 1. FULL-WIDTH WORKSTATION HEADER                         */}
      {/* ======================================================== */}
      <header className="px-5 py-3 border-b border-slate-200 bg-slate-900 text-white flex items-center justify-between shrink-0 shadow-sm">
        {/* Brand & Module Title */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-linear-to-tr from-indigo-600 to-indigo-700 flex items-center justify-center text-white shadow-md">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-sm sm:text-base font-bold tracking-tight text-white flex items-center gap-2">
                <span>7. MBSE AI 随诊专家工作台</span>
                <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded-full bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
                  Full Viewport Mode
                </span>
              </h2>

              {/* Active Model Badge */}
              <span
                className={`text-[11px] font-mono px-2.5 py-0.5 rounded-full font-semibold border flex items-center gap-1.5 ${
                  config.selectedModel === 'Gemini 3 flash'
                    ? 'bg-indigo-950/80 text-indigo-200 border-indigo-500/50'
                    : 'bg-blue-950/80 text-blue-200 border-blue-500/50'
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    hasKey ? 'bg-emerald-400' : 'bg-amber-400 animate-pulse'
                  }`}
                />
                <span>{config.selectedModel}</span>
              </span>
            </div>

            <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-2">
              <span>当前诊断案例: <strong className="text-slate-200">{currentCase.code} - {currentCase.title}</strong></span>
              <span>•</span>
              <span>依循规范: {currentCase.standards.join(' / ')}</span>
            </p>
          </div>
        </div>

        {/* Center Quick Health Indicators */}
        <div className="hidden md:flex items-center gap-4 text-xs bg-slate-800/80 px-4 py-1.5 rounded-xl border border-slate-700">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400">需求追踪覆盖率:</span>
            <span className="font-mono font-bold text-emerald-400">{coverageRate}%</span>
          </div>
          <span className="text-slate-600">|</span>
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400">组件域:</span>
            <span className="font-mono font-bold text-indigo-300">{currentCase.blocks?.length || 0} 块</span>
          </div>
          <span className="text-slate-600">|</span>
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400">总线数:</span>
            <span className="font-mono font-bold text-indigo-300">{currentCase.connectors?.length || 0} 条</span>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* Settings Button */}
          <button
            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
              isSettingsOpen
                ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
                : hasKey
                  ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                  : 'bg-amber-500 text-slate-900 border-amber-400 hover:bg-amber-400 animate-pulse'
            }`}
            title="配置大模型与手工输入 API-Key"
          >
            <Settings className={`w-4 h-4 ${isSettingsOpen ? 'rotate-90' : ''} transition-transform`} />
            <span>{isSettingsOpen ? '收起配置' : hasKey ? '大模型设置' : '⚠️ 配置 Key'}</span>
          </button>

          {/* Reset Chat */}
          <button
            onClick={() => setMessages(messages.slice(0, 1))}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            title="清空对话历史"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Close Fullscreen Workstation */}
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-rose-900/60 transition-colors cursor-pointer ml-1"
            title="退出 AI 随诊并返回实验室"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* ======================================================== */}
      {/* 2. OVERLAY / SLIDE-DOWN SETTINGS PANEL                   */}
      {/* ======================================================== */}
      {isSettingsOpen && (
        <div className="bg-slate-50 border-b border-indigo-200 p-5 space-y-4 shadow-xl z-20 animate-in slide-in-from-top-2 duration-150">
          <div className="max-w-6xl mx-auto space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                  <Settings className="w-4 h-4 text-indigo-600" />
                  <span>大模型参数配置与密钥管理 (GitHub 纯前端静态部署模式)</span>
                </div>
                <p className="text-xs text-slate-600 mt-1 max-w-4xl leading-relaxed">
                  本项目完全适合部署在 GitHub 静态页面中，由浏览器直接向 Google Gemini 或 DeepSeek API 发起安全 HTTPS 调用。
                  在此手工输入并保存 API-Key 后即可调用大模型。密钥仅安全存放于您当前浏览器的 localStorage 中。
                </p>
              </div>

              <button
                onClick={() => setIsSettingsOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-200/80 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Notifications */}
            {saveSuccessMsg && (
              <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{saveSuccessMsg}</span>
              </div>
            )}
            {warningMsg && (
              <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-300 text-amber-800 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>{warningMsg}</span>
              </div>
            )}

            {/* Settings Columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Step 2: Choose Model */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-indigo-600 text-white text-[10px] flex items-center justify-center font-bold">2</span>
                  <span>选择大模型 (Gemini 3 flash / DeepSeek-V4-Pro)</span>
                </label>

                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setEditModel('Gemini 3 flash')}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer relative ${
                      editModel === 'Gemini 3 flash'
                        ? 'border-indigo-600 bg-indigo-50/70 shadow-xs ring-2 ring-indigo-500/20'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                        <span>Gemini 3 flash</span>
                      </span>
                      {editModel === 'Gemini 3 flash' && (
                        <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                      谷歌下一代极速推理模型，支持超长上下文与多模态形式化逻辑推导。
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setEditModel('DeepSeek-V4-Pro')}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer relative ${
                      editModel === 'DeepSeek-V4-Pro'
                        ? 'border-blue-600 bg-blue-50/70 shadow-xs ring-2 ring-blue-500/20'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 flex items-center gap-1">
                        <Cpu className="w-3.5 h-3.5 text-blue-600" />
                        <span>DeepSeek-V4-Pro</span>
                      </span>
                      {editModel === 'DeepSeek-V4-Pro' && (
                        <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                      深度求索专业工程模型，擅长代码架构综合、SysML 规则与状态机时序分析。
                    </p>
                  </button>
                </div>
              </div>

              {/* Step 1: Input API Key */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-indigo-600 text-white text-[10px] flex items-center justify-center font-bold">1</span>
                  <span>手工输入 API-Key ({editModel}) *</span>
                </label>

                <div className="relative">
                  <input
                    type={showKey ? 'text' : 'password'}
                    value={editModel === 'Gemini 3 flash' ? editGeminiKey : editDeepseekKey}
                    onChange={(e) => {
                      if (editModel === 'Gemini 3 flash') {
                        setEditGeminiKey(e.target.value);
                      } else {
                        setEditDeepseekKey(e.target.value);
                      }
                    }}
                    placeholder={
                      editModel === 'Gemini 3 flash'
                        ? '请输入 Google AI Studio API Key (AIzaSy...)'
                        : '请输入 DeepSeek API Key (sk-...)'
                    }
                    className="w-full bg-white border border-slate-300 rounded-lg pl-3 pr-20 py-2 text-xs font-mono text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  />
                  <div className="absolute right-2 top-2 flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setShowKey(!showKey)}
                      className="p-1 text-slate-400 hover:text-slate-600 rounded cursor-pointer"
                    >
                      {showKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                    {(editModel === 'Gemini 3 flash' ? editGeminiKey : editDeepseekKey) && (
                      <button
                        type="button"
                        onClick={handleClearCurrentKey}
                        className="p-1 text-slate-400 hover:text-rose-600 rounded cursor-pointer"
                        title="清空当前Key"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span className="flex items-center gap-1 text-emerald-600">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>纯浏览器本地存储，绝不外泄</span>
                  </span>
                  {editModel === 'Gemini 3 flash' ? (
                    <a
                      href="https://aistudio.google.com/app/apikey"
                      target="_blank"
                      rel="noreferrer"
                      className="text-indigo-600 hover:underline flex items-center gap-0.5"
                    >
                      <span>获取免费 Gemini Key</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : (
                    <a
                      href="https://platform.deepseek.com/api_keys"
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 hover:underline flex items-center gap-0.5"
                    >
                      <span>获取 DeepSeek Key</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Test Connection & Action Buttons */}
            <div className="pt-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleTestConnection}
                  disabled={testState?.loading}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
                >
                  <Activity className="w-3.5 h-3.5 text-indigo-600" />
                  <span>测试网络与 API 连通性</span>
                </button>

                {testState && (
                  <span
                    className={`text-xs px-2.5 py-1 rounded-md border font-medium ${
                      testState.loading
                        ? 'bg-blue-50 text-blue-700 border-blue-200'
                        : testState.success
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : 'bg-rose-50 text-rose-800 border-rose-200'
                    }`}
                  >
                    {testState.msg}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsSettingsOpen(false);
                    handleRunOfflineDemo();
                  }}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-200/80 transition-colors cursor-pointer"
                >
                  免 Key 离线体验
                </button>

                <button
                  type="button"
                  onClick={handleConfirmModelSelection}
                  className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-xs font-semibold shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>3. 确认大模型选择</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 3. EXPANSIVE FULL-SCREEN WORKSTATION BODY                */}
      {/* ======================================================== */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left Control & Diagnostic Station (w-84 to w-96) */}
        <aside className="w-full lg:w-96 border-r border-slate-200 bg-slate-50/80 flex flex-col justify-between overflow-y-auto shrink-0 p-4 space-y-4">
          <div className="space-y-4">
            {/* Model Status Card */}
            <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  推理引擎状态 (Engine)
                </span>
                <span
                  className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${
                    hasKey
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-amber-50 text-amber-700 border-amber-300'
                  }`}
                >
                  {hasKey ? '● API Key 就绪' : '▲ 待配置 API Key'}
                </span>
              </div>

              <div className="flex items-center gap-2.5 pt-1">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-700 flex items-center justify-center font-bold text-xs">
                  {config.selectedModel.startsWith('Gemini') ? 'G' : 'D'}
                </div>
                <div className="flex-1">
                  <div className="font-bold text-slate-800 text-xs">{config.selectedModel}</div>
                  <div className="text-[11px] text-slate-500 font-mono">
                    部署模式: 浏览器直发 (GitHub Ready)
                  </div>
                </div>
                <button
                  onClick={() => setIsSettingsOpen(true)}
                  className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-medium transition-colors cursor-pointer"
                >
                  切换
                </button>
              </div>
            </div>

            {/* One-Click Diagnostic Routines */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                  <span>一键形式化审查指令集 (Diagnostic Presets)</span>
                </span>
              </div>

              <div className="space-y-1.5">
                {[
                  {
                    title: '① 需求完备性与悬空闭环审查',
                    desc: '检测未分配到 Block 的悬空需求及无溯源顶层诉求',
                    type: '需求悬空与完备性闭环',
                    icon: <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />,
                  },
                  {
                    title: '② 跨域接口与总线协议匹配',
                    desc: '检验 CAN-FD / TSN 速率、Payload 强类型对齐',
                    type: '接口端口协议强类型匹配',
                    icon: <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />,
                  },
                  {
                    title: '③ 拓扑强连通分量与死锁检测',
                    desc: 'Tarjan 代数图论算法排查系统循环锁死路径',
                    type: '模型拓扑循环依赖与死锁',
                    icon: <GitFork className="w-3.5 h-3.5 text-emerald-600" />,
                  },
                  {
                    title: '④ 状态机失效应急与互斥迁移',
                    desc: '排查非确定性竞争状态与降级闭环死锁',
                    type: '状态机互斥与失效应急审查',
                    icon: <Activity className="w-3.5 h-3.5 text-rose-600" />,
                  },
                  {
                    title: '⑤ MBSE 陷阱防范与精益工程审计',
                    desc: '防范为了建模而建模、形式主义伪 MBSE 漏洞',
                    type: '过度建模与虚假建模陷阱排查',
                    icon: <BookOpen className="w-3.5 h-3.5 text-purple-600" />,
                  },
                  {
                    title: '⑥ 全链路追踪矩阵 (RTM) 闭环检验',
                    desc: '利益攸关者诉求 ⟶ 系统指标 ⟶ 子系统实现 100% 闭环',
                    type: '全维一致性与需求悬空审查',
                    icon: <Layers className="w-3.5 h-3.5 text-indigo-600" />,
                  },
                ].map((item, i) => (
                  <button
                    key={i}
                    onClick={() => handleRunDiagnosis(item.type)}
                    disabled={isLoading}
                    className="w-full text-left p-2.5 rounded-xl border border-slate-200/90 bg-white hover:border-indigo-400 hover:bg-indigo-50/40 text-xs transition-all cursor-pointer group disabled:opacity-50 shadow-2xs"
                  >
                    <div className="font-bold text-slate-800 group-hover:text-indigo-950 flex items-center gap-1.5">
                      {item.icon}
                      <span>{item.title}</span>
                    </div>
                    <div className="text-[11px] text-slate-500 pl-5 leading-snug mt-0.5">
                      {item.desc}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Offline Demo Button */}
            <button
              onClick={() => handleRunOfflineDemo()}
              disabled={isLoading}
              className="w-full py-2 px-3 rounded-xl border border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-2 shadow-2xs"
            >
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>免 API-Key 触发内建离线规则审查</span>
            </button>
          </div>

          {/* Bottom Lab Specs */}
          <div className="pt-3 border-t border-slate-200 text-[11px] text-slate-500 space-y-1">
            <div className="flex justify-between">
              <span>当前工程案例:</span>
              <strong className="text-slate-700">{currentCase.code}</strong>
            </div>
            <div className="flex justify-between">
              <span>模型实体总数:</span>
              <strong className="text-slate-700">{currentCase.blocks?.length || 0} 块 / {currentCase.requirements?.length || 0} 需求</strong>
            </div>
          </div>
        </aside>

        {/* Right Chat Dialogue Stream & Message Input Area (flex-1) */}
        <main className="flex-1 flex flex-col bg-white overflow-hidden">
          {/* Scrollable Dialogue List */}
          <div className="flex-1 p-5 overflow-y-auto space-y-4 text-xs leading-relaxed bg-slate-50/30">
            {messages.map((msg, idx) => {
              const isUser = msg.role === 'user';
              return (
                <div
                  key={idx}
                  className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
                >
                  {!isUser && (
                    <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}

                  <div
                    className={`max-w-3xl rounded-xl p-4 space-y-2 shadow-2xs ${
                      isUser
                        ? 'bg-indigo-600 text-white rounded-tr-xs'
                        : 'bg-white text-slate-800 rounded-tl-xs border border-slate-200/90'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-4 text-[10px] opacity-75 border-b pb-1.5 mb-1.5 border-current/10">
                      <div className="flex items-center gap-2">
                        <span className="font-mono">{msg.timestamp}</span>
                        {msg.source && (
                          <span className={`px-1.5 py-0.2 rounded font-mono text-[9px] ${
                            isUser ? 'bg-indigo-500 text-white' : 'bg-slate-100 text-slate-700'
                          }`}>
                            {msg.source}
                          </span>
                        )}
                      </div>
                      {!isUser && (
                        <button
                          onClick={() => handleCopyContent(msg.content, idx)}
                          className="hover:opacity-100 flex items-center gap-1 cursor-pointer font-sans"
                          title="复制 Markdown"
                        >
                          {copiedIdx === idx ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedIdx === idx ? '已复制' : '复制全文'}</span>
                        </button>
                      )}
                    </div>

                    <div className="font-sans text-xs leading-relaxed selection:bg-indigo-100 selection:text-indigo-900">
                      {isUser ? msg.content : renderChatMarkdown(msg.content)}
                    </div>
                  </div>

                  {isUser && (
                    <div className="w-8 h-8 rounded-lg bg-slate-800 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              );
            })}

            {isLoading && (
              <div className="flex gap-3 justify-start items-center text-xs text-indigo-600">
                <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0 animate-pulse">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="bg-white rounded-xl px-4 py-3 border border-indigo-200 text-slate-700 font-mono text-xs flex items-center gap-2.5 shadow-xs">
                  <span className="animate-spin inline-block w-3.5 h-3.5 border-2 border-indigo-600 border-t-transparent rounded-full"></span>
                  <span>
                    【{config.selectedModel}】正在对 {currentCase.title} 执行元模型图论代数验证与工业规范审查...
                  </span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompt Suggestion Bar */}
          <div className="px-5 py-2 bg-slate-50 border-t border-slate-200 flex items-center gap-2 overflow-x-auto text-[11px]">
            <span className="text-slate-400 font-medium whitespace-nowrap">推荐提问:</span>
            {[
              '分析以太网 TSN 确定性传输与最高 50μs 抖动约束',
              '审查 ASIL-D / SIL-4 状态机失效应急双回路降级',
              '生成当前组件域的 SysML v2 文本规范代码',
              '检查利益攸关者诉求是否存在 dangling 漏洞',
            ].map((promptText, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setInputVal(promptText)}
                className="px-2.5 py-1 rounded-lg bg-white hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 text-slate-700 whitespace-nowrap transition-colors cursor-pointer"
              >
                {promptText}
              </button>
            ))}
          </div>

          {/* Bottom Message Input Form */}
          <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-slate-200 flex items-center gap-3">
            <input
              type="text"
              placeholder={`向 MBSE AI 随诊专家提问 (当前引擎: ${config.selectedModel})，支持架构设计、SysML多视角、安全达标审查...`}
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              disabled={isLoading}
              className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white"
            />
            <button
              type="submit"
              disabled={!inputVal.trim() || isLoading}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 disabled:opacity-40 text-white text-xs font-semibold shadow-md transition-all cursor-pointer flex items-center gap-1.5 shrink-0"
            >
              <Send className="w-3.5 h-3.5" />
              <span>发送咨询</span>
            </button>
          </form>
        </main>
      </div>
    </div>
  );
};
