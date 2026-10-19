export type RequirementLevel = 'stakeholder' | 'system' | 'subsystem';
export type RequirementStatus = 'draft' | 'approved' | 'implemented' | 'verified';
export type VerificationMethod = 'Test' | 'Demonstration' | 'Analysis' | 'Inspection';

export type PriorityLevel = 'critical' | 'high' | 'medium' | 'low';

export interface StakeholderProfile {
  id: string;
  name: string;
  role: string;
  organization: string;
  influenceLevel: 'critical' | 'high' | 'medium';
  concerns: string[];
  contact?: string;
  linkedRequirementIds: string[];
}

export interface RequirementStatusHistoryEntry {
  id?: string;
  status: RequirementStatus;
  timestamp: string;
  author: string;
  comment?: string;
  version?: string;
}

export interface Requirement {
  id: string; // e.g. REQ-AUTO-001
  title: string;
  description: string;
  level: RequirementLevel;
  parentId?: string;
  priority: PriorityLevel;
  safetyLevel?: string; // e.g. ASIL-D, SIL-4, ECSS-Cat-A, Critical
  status: RequirementStatus;
  verificationMethod: VerificationMethod;
  allocatedBlockIds: string[];
  version: string;
  stakeholderId?: string;
  statusHistory?: RequirementStatusHistoryEntry[];
}

export type PortDirection = 'in' | 'out' | 'inout';
export interface Port {
  id: string;
  name: string;
  direction: PortDirection;
  protocol: string; // e.g. CAN-FD, Ethernet-TSN, SPI, RS-422, Modbus
  rate?: string; // e.g. 100 Mbps, 500 kbps
  type: string; // Data type or ItemFlow payload
}

export interface Block {
  id: string; // e.g. BLK-01
  name: string;
  stereotype: 'subsystem' | 'controller' | 'sensor' | 'actuator' | 'gateway' | 'compute';
  description: string;
  ports: Port[];
  subBlockIds?: string[];
  allocatedReqIds: string[];
  allocatedFunctions: string[];
  parameters?: Record<string, string | number>;
  status?: 'normal' | 'warning' | 'fault';
}

export interface Connector {
  id: string;
  name: string;
  sourceBlockId: string;
  sourcePortId: string;
  targetBlockId: string;
  targetPortId: string;
  protocol: string;
  flowItem: string;
  latencyConstraint?: string; // e.g. <= 5ms
  bandwidth?: string;
}

export interface StateMachineState {
  id: string;
  name: string;
  type: 'initial' | 'normal' | 'composite' | 'final';
  entryAction?: string;
  doActivity?: string;
  exitAction?: string;
  isCurrent?: boolean;
}

export interface StateMachineTransition {
  id: string;
  source: string;
  target: string;
  trigger: string;
  guard?: string;
  action?: string;
}

export interface CaseStudy {
  id: string;
  code: string;
  title: string;
  subtitle: string;
  domain: string;
  description: string;
  standards: string[]; // e.g. ISO 26262, AUTOSAR, ARP4754A
  requirements: Requirement[];
  blocks: Block[];
  connectors: Connector[];
  states: StateMachineState[];
  transitions: StateMachineTransition[];
  activities: {
    id: string;
    name: string;
    allocatedBlockId: string;
    inputs: string[];
    outputs: string[];
  }[];
  keyHighlights: string[];
  stakeholders?: StakeholderProfile[];
}
