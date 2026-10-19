export interface KnowledgeSlice {
  id: string;
  tag: string;
  title: string;
  subtitle: string;
  summary: string;
  quote: string;
  pillars?: {
    letter: string;
    name: string;
    enName: string;
    description: string;
    sysmlDiagram: string;
    color: string;
  }[];
  matrixSteps?: {
    step: string;
    question: string;
    dimension: string;
    modelArtifact: string;
    riskIfNotDone: string;
  }[];
  pitfalls?: {
    name: string;
    trapSeverity: '致命' | '高危' | '中危';
    symptom: string;
    rootCause: string;
    antidote: string;
    codePattern: string;
  }[];
  misconceptions?: {
    wrongBelief: string;
    reality: string;
    contrastAspect: string;
    verdict: string;
  }[];
}

export const KNOWLEDGE_SLICES: KnowledgeSlice[] = [
  {
    id: 'slice-1',
    tag: '切片一',
    title: 'MBSE 基本要素的元模型支撑 (R-S-B-P)',
    subtitle: '需求 (Requirements)、结构 (Structure)、行为 (Behavior) 和参数 (Parametrics) 四大支柱',
    summary: '基于模型的系统工程 (MBSE) 通过计算机可读、具严格形式化语意关联的统一元模型替代传统基于自然语言的离散文档，确立系统全生命周期单一真相源 (Single Source of Truth, SSOT)。',
    quote: '“模型不是对现实细节的无节制复制，而是对系统关切本质的形式化抽象与因果映射。” —— INCOSE Systems Engineering Handbook',
    pillars: [
      {
        letter: 'R',
        name: '需求模型 (Requirements)',
        enName: 'Requirements Domain',
        description: '刻画系统在使命剖面、法规标准与用户关切下的“为什么做”。包含分级分解、导出约束与定量性能验收准则。',
        sysmlDiagram: 'SysML Requirement Diagram (Req)',
        color: 'from-amber-500/20 to-amber-500/5 text-amber-900 border-amber-300',
      },
      {
        letter: 'S',
        name: '结构模型 (Structure)',
        enName: 'Structural Architecture',
        description: '刻画系统的物理与逻辑实现体“由谁来做”。定义块 (Block)、端口 (Port)、连接器 (Connector) 与拓扑总线。',
        sysmlDiagram: 'Block Definition (BDD) / Internal Block (IBD)',
        color: 'from-blue-500/20 to-blue-500/5 text-blue-900 border-blue-300',
      },
      {
        letter: 'B',
        name: '行为模型 (Behavior)',
        enName: 'Behavioral Dynamics',
        description: '刻画系统随时间演化与事件响应的“做什么”。涵盖状态迁移、活动功能流 (Activities) 与时序协同交互。',
        sysmlDiagram: 'State Machine (STM) / Activity (ACT) / Sequence (SEQ)',
        color: 'from-emerald-500/20 to-emerald-500/5 text-emerald-900 border-emerald-300',
      },
      {
        letter: 'P',
        name: '参数约束 (Parametrics)',
        enName: 'Parametric Constraints',
        description: '刻画系统各学科物理方程与工程约束边界。通过等式与不等式将物理定律直接绑定于结构属性，实现闭环数值校验。',
        sysmlDiagram: 'SysML Parametric Diagram (PAR)',
        color: 'from-purple-500/20 to-purple-500/5 text-purple-900 border-purple-300',
      },
    ],
  },
  {
    id: 'slice-2',
    tag: '切片二',
    title: '需求-功能-组件全链路追踪 (RTM 闭环)',
    subtitle: '打通“为什么做” $\\to$ “做什么” $\\to$ “谁来做”的不可割裂工程链条',
    summary: '追踪矩阵 (Traceability Matrix) 绝非事后应付审查的静态填表，而是贯穿研制全周期的“影响分析神经中枢”。任何上游需求变更或下游物理硬件更替，均可借助代数映射图论一键计算影响爆炸半径。',
    quote: '“没有分配到架构的需求是空中楼阁，没有追踪回需求的代码是安全隐患。”',
    matrixSteps: [
      {
        step: '01. 需求域 (Why)',
        question: '为什么做？(Purpose & Mandate)',
        dimension: '利益攸关者诉求 $\\to$ 系统级定量技术指标',
        modelArtifact: 'SysML Requirement Diagram (ID, Text, ASIL/SIL, VerifyMethod)',
        riskIfNotDone: '客户验收缺乏量化判据，后期无休止扯皮。',
      },
      {
        step: '02. 功能域 (What)',
        question: '做什么？(Functional Behavior)',
        dimension: '抽象功能流分解 $\\to$ 状态转移机制',
        modelArtifact: 'Activity Diagram 功能流 / 状态机转移图 (Triggers / Guards)',
        riskIfNotDone: '直接跳入硬件选型导致架构僵化，无法适应模式切换。',
      },
      {
        step: '03. 物理域 (Who)',
        question: '谁来做？(Physical Components)',
        dimension: '机械、电子、软件组件及通信总线',
        modelArtifact: 'Internal Block Diagram (IBD) 端口与拓扑连接',
        riskIfNotDone: '子系统接口冲突在总装集成阶段集中爆发，返工成本激增百倍。',
      },
      {
        step: '04. 验证域 (How to Prove)',
        question: '如何证明已达成？(Verification & Audit)',
        dimension: '虚拟仿真、HIL台架测试与飞行试验矩阵',
        modelArtifact: 'Test Cases & Verification Evidence Linkages',
        riskIfNotDone: '无法通过适航审查 (FAA/EASA) 或功能安全认证 (ISO 26262)。',
      },
    ],
  },
  {
    id: 'slice-3',
    tag: '切片三',
    title: '三大致命建模陷阱深度剖析',
    subtitle: '过度建模、虚假建模与接口脱节的致盲危机',
    summary: '无数 MBSE 项目失败的根本原因不在于工具难用，而在于建模工程师跌入三大认知与实践陷阱。识别并规避这些陷阱是构建健壮数字工程资产的前提。',
    quote: '“建模的艺术在于知道应该忽略什么。” —— C.A.R. Hoare',
    pitfalls: [
      {
        name: '陷阱一：过度建模 (Over-modeling)',
        trapSeverity: '高危',
        symptom: '模型过于庞大繁杂，甚至将三维 CAD 紧固件螺纹尺寸或代码单行变量名写入 SysML 属性中。',
        rootCause: '混淆了系统工程的“架构抽象层”与详细设计的“工程实施层”，妄图在系统级模型中呈现宇宙万物。',
        antidote: '坚持“关注点分离原则 (Separation of Concerns)”。系统模型只管交互界面、关键流向与端到端时序，将局部几何与算法交给专用专业工具。',
        codePattern: 'Maintain Abstraction Level: Block != Class, Flow != Pointer.',
      },
      {
        name: '陷阱二：虚假建模 (Fake Modeling / Visio 陷阱)',
        trapSeverity: '致命',
        symptom: '画了精美绝伦的 BDD 方框和彩色箭头，但需求未分配 (No Satisfy Link)，端口无数据类型，没有形式化数学语意。',
        rootCause: '将 SysML 降格为“昂贵的 Visio 画图板”，未能建立元素之间的元模型强关联，无法执行自动化一致性检查。',
        antidote: '强制执行形式化自动化审查：凡无 Allocation 映射的孤立块、无 Satisfy 的悬空需求，CI/CD 流水线直接标红报错拒绝合并！',
        codePattern: 'Enforce Formal Semantics: assert len(block.allocatedReqs) > 0',
      },
      {
        name: '陷阱三：接口协议不一致 (Interface Mismatch)',
        trapSeverity: '致命',
        symptom: '总线 A 端口发送 500kbps CAN-FD 信号，下游 B 端口配置为 100Mbps Ethernet，模型未拦截报错，总装时物理炸裂。',
        rootCause: '忽略了接口 (Interface/Port) 的形式化强类型契约规范，将连接器当成简单的“连线”。',
        antidote: '使用 SysML Interface Block 与 Flow Property 强类型对齐，执行图论两端类型包含关系 $\\tau(P_{out}) \\subseteq \\tau(P_{in})$ 自动化代数推导。',
        codePattern: 'Type Safety Invariant: Check port protocol symmetry & rate.',
      },
    ],
  },
  {
    id: 'slice-4',
    tag: '切片四',
    title: '误区警示与形式化诊断陷阱',
    subtitle: '辨析“MBSE 仅为画图工具”的严重谬误，坚守形式化验证核心',
    summary: 'MBSE 的价值 80% 体现在设计早期的形式化死锁排查、状态爆炸消解与可追溯性一致性证明；仅有 20% 是直观的图形化沟通呈现。缺乏形式化代数逻辑的“模型”，只是一张易腐烂的图纸。',
    quote: '“如果模型不能在投入生产前证明系统不存在逻辑死锁，那么它不过是一幅昂贵的艺术插画。”',
    misconceptions: [
      {
        wrongBelief: '“MBSE 就是用 SysML 画好看的系统图表代替 Word 文档”',
        reality: 'SysML 是基于 XMI/元模型树状语法糖，真正核心在于背后的模型图论数据库、形式化约束代数与自动化测试验证链。',
        contrastAspect: '认知定位',
        verdict: '严重认知偏差',
      },
      {
        wrongBelief: '“只要模型建完了，系统工程任务就算完成了”',
        reality: '模型必须具备“可执行性 (Executability)”与“可仿真性”。静态模型无法发现竞争冲突与时钟抖动，需配合状态机运行与数字孪生闭环演进。',
        contrastAspect: '生命周期',
        verdict: '动态演化要求',
      },
      {
        wrongBelief: '“MBSE 增加了额外工作量，不如直接写代码或画电气原理图来得快”',
        reality: '前期在模型形式化检查中发现一个架构接口冲突耗时 10 分钟，若遗漏至物理系统试飞/路测现场，修复周期以月计，返工成本呈指数上升。',
        contrastAspect: 'ROI 投资回报率',
        verdict: '前期防差错防灾难',
      },
    ],
  },
];
