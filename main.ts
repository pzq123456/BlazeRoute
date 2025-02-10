import * as RVGeo from './src';

const mydiv = document.getElementById('map') as HTMLElement;
const canvasSize = 1024;
const canvas = createCanvas(canvasSize, canvasSize);
mydiv.appendChild( canvas );

const drawGrid2d = RVGeo.drawGrid2d;

const Grid = RVGeo.Grid; // 栅格类
const drawCountour = RVGeo.drawCountour; // 绘制等值线
const reactGrid2d = RVGeo.reactGrid2d;
const drawArrowField = RVGeo.drawArrowField;

let grid = Grid.fromFillValue(0,[1,16,16]);

// draw grid
let mySimpleColorBand = RVGeo.simpleColorBandFactory(RVGeo.stretchType.power);
let rect = {x: 0, y: 0, w: 1024, h: 1024};
// drawGrid2d(canvas, grid.data[0], rect, grid.getBandStatistics(0), mySimpleColorBand);

function createCanvas(
    width: number,
    height: number
): HTMLCanvasElement {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    return canvas;
}

let XY = [null,null] as [null,null] | [number,number];

render();
// 监听并打印鼠标点击事件
canvas.addEventListener('click', (e) => {
    const myrect = canvas.getBoundingClientRect();
    const x = e.clientX - myrect.left;
    const y = e.clientY - myrect.top;
    XY = [x,y];
    reactGrid2d(canvas, [16,16], rect, XY, myCallback);
    render();
});

function myCallback(col,row){
  if(grid.getXYZValue([col,row]) === 1){
    grid.XYZValue = [col,row,0, 0];
  }else{
    grid.XYZValue = [col,row,0,1];
  }
}

function strategy(from: number, to: number) {
  // 只要 from 或 to 含有 0 的节点，权重就是 Infinity
  if (from === 1 || to === 1) {
    return Infinity;
  }else{
    return 1;
  }
}

function render(){
  // clear canvas
  const GridGraph = RVGeo.createGridGraph(grid.data[0], strategy);
  // const GridGraph = RVGeo.createGridGraph(grid.data[0], strategy, true);

  // 1. 广度优先搜索
  // let field = RVGeo.gridBreadthFirstSearch(GridGraph, [0, 0], [10,10]);
  // 2. 迪杰斯特拉算法
  // let field = RVGeo.gridDijkstra(GridGraph, [0, 0]);
  // 3. A* 算法
  let field = RVGeo.gridAstar(GridGraph, [0, 0], [10,10]);

  let path = RVGeo.gridReconstructPath(field, [0, 0], [10,10]);
  drawGrid2d(canvas, grid.data[0], rect, grid.getBandStatistics(0), mySimpleColorBand);
  drawCountour(canvas, grid.getCoutourCode(0,1), rect ,"red");
  drawArrowField(canvas, [16,16], rect, field,"gray",path);
}

// animationEngine(100, render);

/**
 * 动画引擎 用于向浏览器请求动画帧并绘制
 * @param {Number} timeInterval - 间隔时间例如 100 表示每 100ms 请求一次动画帧
 * @param {Function} callback - 回调函数用于绘制动画
 */
export function animationEngine(
  timeInterval : number,
  callback : () => void){
  let lastTime = 0;
  function animate(time : number ){
      if (time - lastTime > timeInterval){
          lastTime = time;
          callback();
      }
      requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);
}


