export const algorithms = {
 astar:{name:'A* Search',tag:'Informed · optimal',formula:'f(n) = g(n) + h(n)',description:'Balances the cost already paid with an estimate of the distance remaining. Manhattan distance is admissible and consistent on this four-direction grid because every move costs at least 1.',optimal:'Yes, with this heuristic',structure:'Priority queue',complexity:'O((V + E) log V)'},
 dijkstra:{name:'Dijkstra',tag:'Uninformed · optimal',formula:'f(n) = g(n)',description:'Always expands the node with the smallest known cost. Finds a minimum-cost route for nonnegative weights without using an estimate of the goal distance.',optimal:'Yes, for nonnegative costs',structure:'Priority queue',complexity:'O((V + E) log V)'},
 bfs:{name:'Breadth-First Search',tag:'Uninformed · fewest steps',formula:'Expand in FIFO order',description:'Explores one layer at a time. Finds the fewest steps, but ignores terrain costs when choosing a route. On a weighted map, fewest steps may be expensive.',optimal:'Only for equal move costs',structure:'FIFO queue',complexity:'O(V + E)'},
 dfs:{name:'Depth-First Search',tag:'Uninformed · exploratory',formula:'Expand in LIFO order',description:'Follows a branch deeply before backtracking. Finds a route on this finite graph if one exists, but does not guarantee the shortest or cheapest route.',optimal:'No',structure:'LIFO stack',complexity:'O(V + E)'},
 greedy:{name:'Greedy Best-First',tag:'Informed · heuristic only',formula:'f(n) = h(n)',description:'Heads toward whichever node looks closest to the goal. It ignores the cost paid so far, so it can find a route quickly while missing a cheaper alternative.',optimal:'No',structure:'Priority queue',complexity:'O((V + E) log V)'}
};
class Heap {
 constructor(){this.a=[];this.seq=0;}
 push(id,p){const a=this.a,v={id,p,s:this.seq++};a.push(v);let i=a.length-1;while(i){let j=(i-1)>>1;if(!this.less(v,a[j]))break;a[i]=a[j];i=j;}a[i]=v;}
 less(a,b){return a.p<b.p||(a.p===b.p&&a.s<b.s);}
 pop(){const a=this.a,top=a[0],last=a.pop();if(a.length){let i=0;while(i*2+1<a.length){let j=i*2+1;if(j+1<a.length&&this.less(a[j+1],a[j]))j++;if(!this.less(a[j],last))break;a[i]=a[j];i=j;}a[i]=last;}return top.id;}
 get length(){return this.a.length;}
}
export function validateMap(m){
 if(!m||!Number.isInteger(m.rows)||!Number.isInteger(m.cols)||m.rows<3||m.rows>40||m.cols<3||m.cols>60)throw Error('Map dimensions must be 3–40 rows and 3–60 columns.');
 const n=m.rows*m.cols;
 if(!Array.isArray(m.cells)||m.cells.length!==n||!m.cells.every(v=>v===-1||v===1||v===5))throw Error('Map cells must contain only -1 (wall), 1 or 5.');
 if(![m.start,m.goal].every(v=>Number.isInteger(v)&&v>=0&&v<n)||m.start===m.goal||m.cells[m.start]!==1||m.cells[m.goal]!==1)throw Error('Start and goal must be distinct, unweighted open cells.');
 return {rows:m.rows,cols:m.cols,start:m.start,goal:m.goal,cells:[...m.cells]};
}
export function solve(map,type='astar'){
 if(!algorithms[type])throw Error('Unknown algorithm');
 const m=validateMap(map),{rows,cols,start,goal,cells}=m,n=cells.length,t=performance.now();
 const g=new Float64Array(n).fill(Infinity),parent=new Int32Array(n).fill(-1),seen=new Uint8Array(n),closed=new Uint8Array(n),visited=[],trace=[];
 const h=i=>Math.abs(Math.floor(i/cols)-Math.floor(goal/cols))+Math.abs(i%cols-goal%cols);
 const heap=new Heap(),queue=[start];let head=0;g[start]=0;seen[start]=1;heap.push(start,type==='dijkstra'?0:h(start));
 const simple=type==='bfs'||type==='dfs';
 while(simple?(type==='bfs'?head<queue.length:queue.length):heap.length){
  const i=simple?(type==='bfs'?queue[head++]:queue.pop()):heap.pop();if(closed[i])continue;closed[i]=1;visited.push(i);trace.push({id:i,g:g[i],h:h(i),f:g[i]+h(i)});if(i===goal)break;
  const r=Math.floor(i/cols),c=i%cols,ns=[];if(r>0)ns.push(i-cols);if(c<cols-1)ns.push(i+1);if(r<rows-1)ns.push(i+cols);if(c>0)ns.push(i-1);
  for(const nb of ns){if(cells[nb]===-1||closed[nb])continue;const ng=g[i]+cells[nb];if(simple? !seen[nb] : ng<g[nb]){seen[nb]=1;g[nb]=ng;parent[nb]=i;if(simple)queue.push(nb);else heap.push(nb,type==='dijkstra'?ng:type==='greedy'?h(nb):ng+h(nb));}}
 }
 const path=[];if(closed[goal]){for(let i=goal;i!==-1;i=parent[i])path.push(i);path.reverse();}
 return {type,visited,trace,path,found:!!path.length,steps:path.length?path.length-1:null,cost:path.length?path.slice(1).reduce((s,i)=>s+cells[i],0):null,time:performance.now()-t};
}
export function makeMap(preset='city',seed=42){
 const rows=19,cols=35,cells=Array(rows*cols).fill(1),start=9*cols+3,goal=9*cols+31;
 let s=seed>>>0;const rand=()=>((s=(Math.imul(s,1664525)+1013904223)>>>0)/4294967296);
 if(preset==='city'){for(let r=2;r<17;r++)for(let c=7;c<29;c++)if((c%7>=0&&c%7<=2)&&r%7>=1&&r%7<=4)cells[r*cols+c]=-1;for(let c=10;c<26;c++)cells[9*cols+c]=5;}
 if(preset==='terrain')for(let c=6;c<29;c++)cells[9*cols+c]=5;
 if(preset==='maze')for(let c=6;c<31;c+=5)for(let r=0;r<rows;r++)if(r!==(c%2?3:15))cells[r*cols+c]=-1;
 if(preset==='random')for(let i=0;i<cells.length;i++){const p=rand();cells[i]=p<.23?-1:p<.34?5:1;}
 if(preset==='blocked')for(let r=0;r<rows;r++)cells[r*cols+17]=-1;
 cells[start]=cells[goal]=1;return {rows,cols,cells,start,goal};
}
