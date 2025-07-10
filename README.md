# BlazeRoute (Grid based routing algorithm for file spreading)

BlazeRoute is a grid based routing algorithm for file spreading. It is designed to spread files across a network of nodes in a way that minimizes the number of hops required to reach a target node. The algorithm is based on the concept of a grid, where each node is assigned a unique coordinate in the grid. The algorithm then calculates the shortest path between the source and target nodes using a modified version of Dijkstra's algorithm. The algorithm is designed to be efficient and scalable, and can be used in a variety of applications, such as peer-to-peer file sharing networks, content delivery networks, and distributed storage systems.

## 基本数据大小
- 3000 * 2000 grid (5m * 5m)

## Tech 或许有用的技术
- 等时圈 https://valhalla.github.io/valhalla/
- 火灾模拟 https://github.com/fire2a/C2F-W https://github.com/cell2fire/Cell2Fire

火灾模拟可以考虑自行实现（最好能够结合 WebGPU 的计算优势）。路径规划及等时圈可以考虑借助接口，但是需要结合火灾模拟的结果进行计算，例如某一时刻某些道路就无法通行。这一块的道路切割计算也需要自行实现。

## 基本思路
1. 获取香港土地利用类型分布并对其降采样以优化执行速度（demo阶段）
2. 封装火灾模拟器，提供API接口；封装等时圈计算器，提供API接口
3. 设计BlazeRoute算法，火灾蔓延空间分布->制约条件->等时圈计算->路径规划 每一个时间步或每几个时间步执行一次
4. 设计BlazeRoute算法的可视化界面，提供时间进度条，展示火灾蔓延、等时圈计算、路径规划等过程

## 创新点
1. 可以将其封装为 MCP 供大模型调用
2. 将其包装为基于大模型的智慧城市火灾应急响应系统（参考 EarthGPT，将若干简单的功能模块封装为一个大模型的 API 接口）

## 加速计算思路
1. 使用 WebGPU 提供的通用计算能力，使用 GPU 进行并行计算
2. 或提前渲染好每一时间步骤的数据，仅前端演示