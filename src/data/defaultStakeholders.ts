import { StakeholderProfile } from '../types/mbse';

export const CASE_STAKEHOLDERS: Record<string, StakeholderProfile[]> = {
  'case-auto-eea': [
    {
      id: 'STK-AUTO-01',
      name: '终端乘员与驾驶员 (End Users)',
      role: '车辆操控与生命安全主体',
      organization: '最终消费者群体 / 用户体验研究所',
      influenceLevel: 'critical',
      concerns: [
        '高速公路 NOA 辅助驾驶在恶劣天气下的可靠性',
        '系统失效时具备 100% 可控安全停靠能力',
        '座舱大屏交互高刷新无眩晕掉帧',
      ],
      contact: 'ux-research@automotive-consortium.org',
      linkedRequirementIds: ['REQ-AUTO-STK-01', 'REQ-AUTO-SUB-02'],
    },
    {
      id: 'STK-AUTO-02',
      name: '机动车功能安全认证机构 (Safety Authority)',
      role: 'ISO 26262 / UNECE 法规监管审查官',
      organization: '国家车辆检测中心与认证委员会',
      influenceLevel: 'critical',
      concerns: [
        'ASIL-D 级线控制动冗余双回路 120ms 响应',
        '多传感器融合时间同步误差严格 ≤ 10ms',
        '故障应急状态机无未定义跳变',
      ],
      contact: 'regulatory-audit@sae-safety.org',
      linkedRequirementIds: ['REQ-AUTO-STK-01', 'REQ-AUTO-SYS-01', 'REQ-AUTO-SUB-01'],
    },
    {
      id: 'STK-AUTO-03',
      name: '车联网运营与 OTA 运维团队 (Telematics Ops)',
      role: '数字化车队云端管理与安全守护',
      organization: '智能车联网运营服务中心',
      influenceLevel: 'high',
      concerns: [
        'TSN 骨干网传输抖动控制与确定性带宽',
        'A/B 分区零宕机静默热升级与防砖恢复',
        'Ed25519 硬件安全密码学验签防篡改',
      ],
      contact: 'ota-ops@cloud-telematics.com',
      linkedRequirementIds: ['REQ-AUTO-SYS-02', 'REQ-AUTO-SUB-03'],
    },
    {
      id: 'STK-AUTO-04',
      name: '底盘与动力总成工程部 (Chassis & Powertrain)',
      role: '执行机构物理集成与机械力学保障',
      organization: '整车工程底盘集成设计所',
      influenceLevel: 'medium',
      concerns: [
        'CAN-FD 总线实时负载率低于 65%',
        'EPB 驻车机械结构响应与寿命耐久度',
      ],
      contact: 'chassis-eng@oem-auto.com',
      linkedRequirementIds: ['REQ-AUTO-SUB-01'],
    },
  ],

  'case-aero-ttc': [
    {
      id: 'STK-AERO-01',
      name: '卫星发射与测控指挥中心 (Mission Command)',
      role: '发射入轨、在轨测控与姿轨变轨总调度',
      organization: '国家空间测控通信网络指挥部',
      influenceLevel: 'critical',
      concerns: [
        'S频段星地双向链路误码率 ≤ 1e-7',
        '关键变轨上行指令 HMAC 签名防重放',
        '单粒子翻转自主对日寻优安全模式',
      ],
      contact: 'mission-ops@space-control.gov',
      linkedRequirementIds: ['REQ-AERO-STK-01', 'REQ-AERO-SYS-01', 'REQ-AERO-SUB-01'],
    },
    {
      id: 'STK-AERO-02',
      name: '高分辨率对地观测科学载荷用户 (Science PI)',
      role: '遥感影像数据产出与科学应用',
      organization: '对地观测与科学应用中心',
      influenceLevel: 'high',
      concerns: [
        'X频段高速下行链路数据率 ≥ 450 Mbps',
        '亚角秒级高精度对地姿态指向稳定度',
      ],
      contact: 'payload-user@earth-observatory.ac.cn',
      linkedRequirementIds: ['REQ-AERO-SYS-02', 'REQ-AERO-SUB-02'],
    },
    {
      id: 'STK-AERO-03',
      name: '宇航可靠性与适航质保组 (Reliability QA)',
      role: '航天元器件抗辐射与 ECSS 标准审查',
      organization: '航天器质量管理部',
      influenceLevel: 'high',
      concerns: [
        'MIL-STD-1553B 冗余总线无扰切换',
        '100krad 宇航级抗辐射单粒子闭锁防护',
      ],
      contact: 'space-qa@ecss-standards.org',
      linkedRequirementIds: ['REQ-AERO-SYS-01', 'REQ-AERO-SUB-02'],
    },
  ],

  'case-rail-tcms': [
    {
      id: 'STK-RAIL-01',
      name: '高铁运营安全监管局与总工程师室 (Chief Rail Inspector)',
      role: '高速动车组线路准入与 SIL-4 联锁合规',
      organization: '国家铁路局机务工程监管总署',
      influenceLevel: 'critical',
      concerns: [
        '350km/h 紧急制动安全制动距离 ≤ 3200m',
        '电空复合制动防滑滑差率精确调节',
        '断钩脱轨失联硬件硬线即时保护触发',
      ],
      contact: 'rail-safety@railway-gov.cn',
      linkedRequirementIds: ['REQ-RAIL-STK-01', 'REQ-RAIL-SYS-01'],
    },
    {
      id: 'STK-RAIL-02',
      name: '机车乘务司机组与客运服务部 (Train Crew)',
      role: '机车平稳驾驶操纵与旅客舒适度',
      organization: '高速铁路机务客运段',
      influenceLevel: 'high',
      concerns: [
        '工况转换加加速度 Jerk 绝对值 ≤ 0.75 m/s³',
        '牵引力矩平滑上升防止车厢冲动感',
      ],
      contact: 'crew-ops@highspeed-rail.com',
      linkedRequirementIds: ['REQ-RAIL-SYS-01'],
    },
    {
      id: 'STK-RAIL-03',
      name: '列车网络通信维护所 (TCMS Maintenance)',
      role: 'IEC 61375 WTB/MVB 列车总线运维',
      organization: '机车电控与网络维保基地',
      influenceLevel: 'medium',
      concerns: [
        'MVB 过程数据 16ms 周期保活与丢包看门狗',
        '2oo2D 双机热备架构故障静默无缝倒机',
      ],
      contact: 'tcms-support@crrc-service.cn',
      linkedRequirementIds: ['REQ-RAIL-SUB-01'],
    },
  ],

  'case-uav-swarm': [
    {
      id: 'STK-UAV-01',
      name: '战术蜂群集群指挥调度员 (Swarm Commander)',
      role: '机群协同使命指派与空域态势管控',
      organization: '无人作战与集群指挥系统联合实验室',
      influenceLevel: 'critical',
      concerns: [
        '领航机被毁时 1.5s 内自主选主并重构队形',
        '密集编队防止多机空中自相碰撞',
      ],
      contact: 'swarm-cmd@uav-tactical.org',
      linkedRequirementIds: ['REQ-UAV-STK-01'],
    },
    {
      id: 'STK-UAV-02',
      name: '宽带机间自组网无线通信专家 (MANET Engineer)',
      role: '强电子对抗环境下通信保活与自组织',
      organization: '抗干扰无线专网技术所',
      influenceLevel: 'high',
      concerns: [
        '20架规模下两跳广播时延 ≤ 30ms',
        'OMG DDS 发布/订阅主题无中心化广播',
      ],
      contact: 'rf-mesh@manet-defense.org',
      linkedRequirementIds: ['REQ-UAV-SYS-01'],
    },
  ],

  'case-med-twin': [
    {
      id: 'STK-MED-01',
      name: '三甲医院放射影像科首席专家 (Chief Radiologist)',
      role: '超高场临床精准诊断与病灶检出',
      organization: '国家医学影像临床研究中心',
      influenceLevel: 'high',
      concerns: [
        'EPI 序列回波平移误差 < 0.1 像素',
        '纳秒级脉冲序列时钟抖动消除几何伪影',
      ],
      contact: 'chief-imaging@clinical-mri.org',
      linkedRequirementIds: ['REQ-MED-SYS-01'],
    },
    {
      id: 'STK-MED-02',
      name: '医疗器械审评与患者安全保护委员会 (FDA/NMPA Reviewer)',
      role: 'IEC 60601-2-33 强标合规与人身安全底线',
      organization: '国家药品监督管理局医疗器械审评中心',
      influenceLevel: 'critical',
      concerns: [
        '患者比吸收率 (SAR) 强制上限 4W/kg',
        '超时 100ms 硬件回路物理强制截断射频功率',
      ],
      contact: 'safety-audit@medtech-regulator.gov',
      linkedRequirementIds: ['REQ-MED-STK-01'],
    },
  ],

  'case-robot-fms': [
    {
      id: 'STK-ROBOT-01',
      name: '柔性加工车间生产制造总监 (Plant Operations VP)',
      role: '订单柔性交付、混线节拍与 OEE 产效',
      organization: '高端航空机加精密数字化工厂',
      influenceLevel: 'high',
      concerns: [
        '6 种工件快换切换时间 ≤ 45s',
        '自动夹具装卡节拍合格率 ≥ 99.8%',
      ],
      contact: 'operations@precision-fms.com',
      linkedRequirementIds: ['REQ-ROBOT-STK-01'],
    },
    {
      id: 'STK-ROBOT-02',
      name: '工业 EHS 人身安全与机器人防护主管 (Safety Manager)',
      role: 'ISO 10218 工业机器人安全与人机协作认证',
      organization: '工业安全与职业健康防护协会',
      influenceLevel: 'critical',
      concerns: [
        '接触碰撞 2ms 内六维力柔顺卸载',
        '安全光幕防闯入 PL-d 等级联动急停',
      ],
      contact: 'ehs-safety@industrial-robotics.org',
      linkedRequirementIds: ['REQ-ROBOT-SYS-01'],
    },
    {
      id: 'STK-ROBOT-03',
      name: 'OT/IT 工业网络现场工程师 (Automation Engineer)',
      role: 'PLC 等时通信与 OPC UA 数据集成',
      organization: '自动化工程与系统集成部',
      influenceLevel: 'medium',
      concerns: [
        'PROFINET IRT 1ms 等时通信周期与 1μs 抖动',
        'MES/PLC 生产工单批次精准闭环追踪',
      ],
      contact: 'automation@plc-integration.net',
      linkedRequirementIds: ['REQ-ROBOT-SUB-01'],
    },
  ],
};
