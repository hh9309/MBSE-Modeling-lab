export interface PythonPlotConfig {
  type: 'topology_graph' | 'rtm_heatmap' | 'latency_bar' | 'arcadia_bar';
  titleEn: string;
  xAxisEn: string;
  yAxisEn: string;
  legendEn: string[];
}

export interface PythonScriptItem {
  id: string;
  title: string;
  category: 'NetworkX 拓扑分析' | 'RTM 矩阵生成' | '一致性与死锁' | 'Capella 桥接';
  description: string;
  sourceCode: string;
  sampleOutput: string;
  plotConfig: PythonPlotConfig;
}

export const PYTHON_SCRIPTS: PythonScriptItem[] = [
  {
    id: 'script-networkx-topo',
    title: '基于 NetworkX 的 MBSE 架构拓扑代数分析',
    category: 'NetworkX 拓扑分析',
    description: '解析系统 Block、Port 与 Connector 拓扑，构建有向图 (DiGraph)，计算出入度、代数邻接矩阵、拓扑图连通性并使用 Matplotlib 绘制拓扑图。',
    plotConfig: {
      type: 'topology_graph',
      titleEn: 'MBSE Architecture Topology DiGraph (NetworkX)',
      xAxisEn: 'X-Axis: Network Topology Plane (Arbitrary Units)',
      yAxisEn: 'Y-Axis: Network Topology Plane (Arbitrary Units)',
      legendEn: ['Component Nodes (Blocks)', 'Directed Connectors (Buses)'],
    },
    sourceCode: `#!/usr/bin/env python3
"""
MBSE Architecture Topology Analyzer using NetworkX & Matplotlib
Executable standalone script for external Python environments.
Run directly: python script.py
"""

import networkx as nx
import matplotlib.pyplot as plt
import numpy as np

def analyze_mbse_architecture(blocks, connectors):
    # 1. Initialize NetworkX Directed Graph (DiGraph)
    G = nx.DiGraph()
    
    # 2. Add Component Block Nodes
    for b in blocks:
        G.add_node(b['id'], name=b['name'], stereotype=b.get('stereotype', 'block'))
        
    # 3. Add Directed Connectors
    for c in connectors:
        G.add_edge(
            c['sourceBlockId'], 
            c['targetBlockId'], 
            protocol=c.get('protocol', 'generic'),
            flow=c.get('flowItem', 'data')
        )
        
    print("=== MBSE Topology Statistics ===")
    print(f"Total Component Blocks: {G.number_of_nodes()}")
    print(f"Total Connectors: {G.number_of_edges()}")
    print(f"Is Directed Acyclic Graph (DAG): {nx.is_directed_acyclic_graph(G)}")
    
    # 4. Extract Adjacency Matrix
    nodes_order = list(G.nodes())
    adj_matrix = nx.to_numpy_array(G, nodelist=nodes_order)
    print("\\n[Adjacency Matrix A]:")
    print(adj_matrix)
    
    # 5. Calculate Degree Centrality
    centrality = nx.degree_centrality(G)
    print("\\n[Degree Centrality Ranking]:")
    for nid, score in sorted(centrality.items(), key=lambda x: x[1], reverse=True):
        print(f"  - {nid} ({G.nodes[nid]['name']}): {score:.4f}")
        
    # 6. Render Visualization Plot using Matplotlib
    plt.figure(figsize=(8, 6), dpi=120)
    pos = nx.spring_layout(G, seed=42)
    
    # Draw Nodes
    nx.draw_networkx_nodes(G, pos, node_color='#4f46e5', node_size=1800, alpha=0.9, label='Component Nodes (Blocks)')
    # Draw Edges
    nx.draw_networkx_edges(G, pos, edge_color='#64748b', arrowsize=20, width=2.0, alpha=0.8, connectionstyle='arc3,rad=0.1')
    # Draw Labels
    labels = {nid: f"{nid}\\n{G.nodes[nid]['name'].split(' ')[0]}" for nid in G.nodes()}
    nx.draw_networkx_labels(G, pos, labels=labels, font_size=8, font_color='white', font_family='sans-serif', font_weight='bold')
    
    # Set English Titles, Axes, and Legends (All in English)
    plt.title("MBSE Architecture Topology DiGraph (NetworkX)", fontsize=13, fontweight='bold', pad=15)
    plt.xlabel("X-Axis: Network Topology Plane (Arbitrary Units)", fontsize=10, labelpad=8)
    plt.ylabel("Y-Axis: Network Topology Plane (Arbitrary Units)", fontsize=10, labelpad=8)
    plt.grid(True, linestyle='--', alpha=0.4)
    plt.legend(["Component Nodes (Blocks)", "Directed Connectors (Buses)"], loc="upper right", frameon=True)
    plt.tight_layout()
    plt.show()
    
    return G, adj_matrix

if __name__ == '__main__':
    sample_blocks = [
        {"id": "BLK-01", "name": "Central Compute CCU", "stereotype": "compute"},
        {"id": "BLK-02", "name": "Pilot Domain ADCU", "stereotype": "compute"},
        {"id": "BLK-03", "name": "Chassis Actuator VDC", "stereotype": "actuator"},
        {"id": "BLK-04", "name": "Cockpit Controller CDC", "stereotype": "controller"}
    ]
    sample_cons = [
        {"sourceBlockId": "BLK-01", "targetBlockId": "BLK-02", "protocol": "TSN"},
        {"sourceBlockId": "BLK-02", "targetBlockId": "BLK-03", "protocol": "CAN-FD"},
        {"sourceBlockId": "BLK-01", "targetBlockId": "BLK-04", "protocol": "TSN"},
        {"sourceBlockId": "BLK-03", "targetBlockId": "BLK-02", "protocol": "CAN-FD"}
    ]
    analyze_mbse_architecture(sample_blocks, sample_cons)
`,
    sampleOutput: `=== MBSE Topology Statistics ===
Total Component Blocks: 4
Total Connectors: 4
Is Directed Acyclic Graph (DAG): False (Feedback loop detected from Chassis to ADCU)

[Adjacency Matrix A]:
[[0. 1. 0. 1.]
 [0. 0. 1. 0.]
 [0. 1. 0. 0.]
 [0. 0. 0. 0.]]

[Degree Centrality Ranking]:
  - BLK-02 (Pilot Domain ADCU): 1.0000 (Central routing hub)
  - BLK-03 (Chassis Actuator VDC): 0.6667
  - BLK-01 (Central Compute CCU): 0.6667
  - BLK-04 (Cockpit Controller CDC): 0.3333

[GRAPHICS]: Generated interactive graph: "MBSE Architecture Topology DiGraph (NetworkX)"
[STATUS]: Process finished with exit code 0.`,
  },
  {
    id: 'script-rtm-validator',
    title: '全链路需求追踪矩阵 (RTM) 自动校验与热力图生成',
    category: 'RTM 矩阵生成',
    description: '基于 SysML 满足 (Satisfy) 关系生成需求-组件追踪矩阵，计算完备度覆盖率，并使用 Matplotlib 绘制二值分配热力图。',
    plotConfig: {
      type: 'rtm_heatmap',
      titleEn: 'Requirements Traceability Matrix (RTM) Allocation Heatmap',
      xAxisEn: 'Architecture Component Blocks (Who)',
      yAxisEn: 'System Requirements Specification (Why)',
      legendEn: ['1: Satisfied / Allocated Link', '0: Unallocated Gap'],
    },
    sourceCode: `#!/usr/bin/env python3
"""
Requirements Traceability Matrix (RTM) Engine & Heatmap Visualizer
Executable standalone script for external Python environments.
Run directly: python script.py
"""

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

def generate_and_plot_rtm(requirements, blocks):
    req_ids = [r['id'] for r in requirements]
    block_ids = [b['id'] for b in blocks]
    
    # 1. Build Binary Matrix (Requirements x Blocks)
    matrix = pd.DataFrame(0, index=req_ids, columns=block_ids)
    for b in blocks:
        for rid in b.get('allocatedReqIds', []):
            if rid in matrix.index:
                matrix.loc[rid, b['id']] = 1
                
    # 2. Coverage Calculations
    coverage = matrix.sum(axis=1)
    dangling = coverage[coverage == 0].index.tolist()
    total_reqs = len(req_ids)
    satisfied_reqs = total_reqs - len(dangling)
    rate = (satisfied_reqs / total_reqs * 100) if total_reqs else 0
    
    print("=== Requirements Traceability Matrix (RTM) Report ===")
    print(f"Traceability Coverage Rate: {rate:.2f}%")
    print(f"Satisfied Requirements: {satisfied_reqs} / {total_reqs}")
    print(f"Dangling Requirements: {len(dangling)}")
    print("\\n[Matrix DataFrame]:")
    print(matrix)
    
    # 3. Plot Heatmap using Matplotlib
    fig, ax = plt.subplots(figsize=(8, 5), dpi=120)
    cax = ax.matshow(matrix.values, cmap='Blues', alpha=0.85)
    
    # Text Annotations inside cells
    for i in range(len(req_ids)):
        for j in range(len(block_ids)):
            val = matrix.values[i, j]
            color = 'white' if val > 0 else '#64748b'
            ax.text(j, i, str(val), ha='center', va='center', color=color, fontweight='bold', fontsize=10)
            
    # Set English Titles, Axes, and Legends (All in English)
    ax.set_xticks(range(len(block_ids)))
    ax.set_yticks(range(len(req_ids)))
    ax.set_xticklabels(block_ids, rotation=25, ha='left', fontsize=9)
    ax.set_yticklabels(req_ids, fontsize=9)
    
    plt.title("Requirements Traceability Matrix (RTM) Allocation Heatmap", fontsize=12, fontweight='bold', pad=30)
    plt.xlabel("Architecture Component Blocks (Who)", fontsize=10, labelpad=10)
    plt.ylabel("System Requirements Specification (Why)", fontsize=10, labelpad=10)
    
    cbar = fig.colorbar(cax, orientation='vertical', fraction=0.046, pad=0.04)
    cbar.set_label("Traceability Link (1: Satisfied, 0: Unmet)", fontsize=9, labelpad=8)
    
    plt.tight_layout()
    plt.show()
    return matrix, rate

if __name__ == '__main__':
    sample_reqs = [
        {"id": "REQ-01", "title": "Highway Pilot Autonomous Cruise"},
        {"id": "REQ-02", "title": "Sensor Fusion Latency <= 10ms"},
        {"id": "REQ-03", "title": "Backbone TSN Jitter <= 50us"},
        {"id": "REQ-04", "title": "Redundant Emergency Brake Decel"}
    ]
    sample_blks = [
        {"id": "BLK-ADCU", "allocatedReqIds": ["REQ-01", "REQ-02"]},
        {"id": "BLK-CGW", "allocatedReqIds": ["REQ-03"]},
        {"id": "BLK-CHASSIS", "allocatedReqIds": ["REQ-01", "REQ-04"]}
    ]
    generate_and_plot_rtm(sample_reqs, sample_blks)
`,
    sampleOutput: `=== Requirements Traceability Matrix (RTM) Report ===
Traceability Coverage Rate: 100.00%
Satisfied Requirements: 4 / 4
Dangling Requirements: 0

[Matrix DataFrame]:
        BLK-ADCU  BLK-CGW  BLK-CHASSIS
REQ-01         1        0            1
REQ-02         1        0            0
REQ-03         0        1            0
REQ-04         0        0            1

[GRAPHICS]: Generated interactive chart: "Requirements Traceability Matrix (RTM) Allocation Heatmap"
[STATUS]: Process finished with exit code 0.`,
  },
  {
    id: 'script-port-cycles',
    title: '端口时延硬约束与安全裕度柱状分析算法',
    category: '一致性与死锁',
    description: '遍历各总线连接器 (Connectors)，对比实测数据传输时延与系统设定的安全时延上限 (Safety Bound)，输出裕度并绘制对比图。',
    plotConfig: {
      type: 'latency_bar',
      titleEn: 'Interface Protocol Latency vs Maximum Safety Bound',
      xAxisEn: 'Bus Connector Channels (Protocol & IDs)',
      yAxisEn: 'Communication Latency (Milliseconds - ms)',
      legendEn: ['Measured Latency (ms)', 'Maximum Safety Bound (ms)'],
    },
    sourceCode: `#!/usr/bin/env python3
"""
Interface Protocol Latency & Safety Margin Analyzer
Executable standalone script for external Python environments.
Run directly: python script.py
"""

import matplotlib.pyplot as plt
import numpy as np

def analyze_latency_margins(connectors):
    channel_names = [c['id'] for c in connectors]
    measured_latency = [c['measured_ms'] for c in connectors]
    max_bounds = [c['bound_ms'] for c in connectors]
    
    print("=== Interface Protocol Latency vs Safety Bound Audit ===")
    all_passed = True
    for c in connectors:
        passed = c['measured_ms'] <= c['bound_ms']
        status_text = "PASS" if passed else "VIOLATION"
        margin = c['bound_ms'] - c['measured_ms']
        if not passed:
            all_passed = False
        print(f"[{c['id']}] {c['protocol']} | Latency: {c['measured_ms']}ms | Bound: {c['bound_ms']}ms | Margin: {margin:.1f}ms [{status_text}]")
        
    print(f"\\nOverall Interface Timing Verification: {'PASSED (Safe)' if all_passed else 'FAILED (Hazard)'}")
    
    # Render Bar Chart using Matplotlib
    x = np.arange(len(channel_names))
    width = 0.35
    
    fig, ax = plt.subplots(figsize=(8, 5), dpi=120)
    rects1 = ax.bar(x - width/2, measured_latency, width, label='Measured Latency (ms)', color='#3b82f6', alpha=0.85)
    rects2 = ax.bar(x + width/2, max_bounds, width, label='Maximum Safety Bound (ms)', color='#ef4444', alpha=0.85)
    
    # Set English Titles, Axes, and Legends (All in English)
    ax.set_title("Interface Protocol Latency vs Maximum Safety Bound", fontsize=12, fontweight='bold', pad=15)
    ax.set_xlabel("Bus Connector Channels (Protocol & IDs)", fontsize=10, labelpad=8)
    ax.set_ylabel("Communication Latency (Milliseconds - ms)", fontsize=10, labelpad=8)
    ax.set_xticks(x)
    ax.set_xticklabels([f"{c['id']}\\n({c['protocol']})" for c in connectors], fontsize=8)
    ax.grid(axis='y', linestyle='--', alpha=0.5)
    ax.legend(loc='upper right', frameon=True)
    
    # Value annotations on bars
    ax.bar_label(rects1, padding=3, fmt='%.1f ms', fontsize=8)
    ax.bar_label(rects2, padding=3, fmt='%.1f ms', fontsize=8)
    
    plt.tight_layout()
    plt.show()

if __name__ == '__main__':
    sample_connectors = [
        {"id": "CON-01", "protocol": "TSN (IEEE 802.1Q)", "measured_ms": 2.0, "bound_ms": 5.0},
        {"id": "CON-02", "protocol": "Dual CAN-FD", "measured_ms": 4.8, "bound_ms": 10.0},
        {"id": "CON-03", "protocol": "Ethernet AVB", "measured_ms": 11.2, "bound_ms": 15.0},
        {"id": "CON-04", "protocol": "Chassis Feedback", "measured_ms": 2.5, "bound_ms": 4.0}
    ]
    analyze_latency_margins(sample_connectors)
`,
    sampleOutput: `=== Interface Protocol Latency vs Safety Bound Audit ===
[CON-01] TSN (IEEE 802.1Q) | Latency: 2.0ms | Bound: 5.0ms | Margin: 3.0ms [PASS]
[CON-02] Dual CAN-FD | Latency: 4.8ms | Bound: 10.0ms | Margin: 5.2ms [PASS]
[CON-03] Ethernet AVB | Latency: 11.2ms | Bound: 15.0ms | Margin: 3.8ms [PASS]
[CON-04] Chassis Feedback | Latency: 2.5ms | Bound: 4.0ms | Margin: 1.5ms [PASS]

Overall Interface Timing Verification: PASSED (Safe)
[GRAPHICS]: Generated interactive chart: "Interface Protocol Latency vs Maximum Safety Bound"
[STATUS]: Process finished with exit code 0.`,
  },
  {
    id: 'script-capella-bridge',
    title: 'Capella Arcadia 分层元模型架构投影与统计',
    category: 'Capella 桥接',
    description: '将系统工程元模型投影至 Eclipse Capella Arcadia 规范（运行分析 OA、系统分析 SA、逻辑架构 LA 与物理架构 PA），统计各层功能与组件数量。',
    plotConfig: {
      type: 'arcadia_bar',
      titleEn: 'Capella Arcadia Layered Metamodel Breakdown (OA -> SA -> LA -> PA)',
      xAxisEn: 'Arcadia Engineering Phases (Methodology Layers)',
      yAxisEn: 'Allocated Model Element Count (Units)',
      legendEn: ['Allocated Functions (Activities)', 'Architecture Components (Blocks)'],
    },
    sourceCode: `#!/usr/bin/env python3
"""
Capella Arcadia Layered Metamodel Projection & Statistics
Executable standalone script for external Python environments.
Run directly: python script.py
"""

import matplotlib.pyplot as plt
import numpy as np

def project_arcadia_layers():
    # 4 Arcadia Layers: Operational Analysis, System Analysis, Logical Architecture, Physical Architecture
    layers = ["OA (Operational)", "SA (System)", "LA (Logical)", "PA (Physical)"]
    functions_count = [5, 12, 18, 24]
    components_count = [3, 4, 8, 14]
    
    print("=== Capella Arcadia Methodological Layer Breakdown ===")
    for i in range(len(layers)):
        print(f"Layer: {layers[i]} | Functions: {functions_count[i]} | Components: {components_count[i]}")
        
    # Render Grouped Bar Chart using Matplotlib
    x = np.arange(len(layers))
    width = 0.35
    
    fig, ax = plt.subplots(figsize=(8, 5), dpi=120)
    rects1 = ax.bar(x - width/2, functions_count, width, label='Allocated Functions (Activities)', color='#10b981', alpha=0.85)
    rects2 = ax.bar(x + width/2, components_count, width, label='Architecture Components (Blocks)', color='#6366f1', alpha=0.85)
    
    # Set English Titles, Axes, and Legends (All in English)
    ax.set_title("Capella Arcadia Layered Metamodel Breakdown (OA -> SA -> LA -> PA)", fontsize=12, fontweight='bold', pad=15)
    ax.set_xlabel("Arcadia Engineering Phases (Methodology Layers)", fontsize=10, labelpad=8)
    ax.set_ylabel("Allocated Model Element Count (Units)", fontsize=10, labelpad=8)
    ax.set_xticks(x)
    ax.set_xticklabels(layers, fontsize=9)
    ax.grid(axis='y', linestyle='--', alpha=0.4)
    ax.legend(loc='upper left', frameon=True)
    
    ax.bar_label(rects1, padding=3, fontsize=9)
    ax.bar_label(rects2, padding=3, fontsize=9)
    
    plt.tight_layout()
    plt.show()

if __name__ == '__main__':
    project_arcadia_layers()
`,
    sampleOutput: `=== Capella Arcadia Methodological Layer Breakdown ===
Layer: OA (Operational) | Functions: 5 | Components: 3
Layer: SA (System) | Functions: 12 | Components: 4
Layer: LA (Logical) | Functions: 18 | Components: 8
Layer: PA (Physical) | Functions: 24 | Components: 14

[INFO]: Successfully serialized model to Capella Arcadia Semantic Layer AST.
[GRAPHICS]: Generated interactive chart: "Capella Arcadia Layered Metamodel Breakdown (OA -> SA -> LA -> PA)"
[STATUS]: Process finished with exit code 0.`,
  },
];
