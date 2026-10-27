# PathMind — AI Route Planning & Algorithm Visualizer
AISC project by Pranav Shukla. A dependency-free, browser-based graph search lab.

## Run locally
From the project folder: `python3 -m http.server 8000 --directory dist`, then open http://localhost:8000. ES modules require HTTP rather than double-clicking index.html.

## Live deployed
live deployed version : https://pathmind-jade.vercel.app/#lab

## Test
Node.js 20+: `npm test`. No npm installation is required.

## Files
- `dist/index.html`: application layout and viva guide
- `dist/style.css`: responsive presentation
- `dist/engine.js`: pure search algorithms, binary min-heap, map validation and generators
- `dist/app.js`: interaction, playback, local saving, import/export and benchmarking
- `tests/engine.test.js`: correctness checks, including independent shortest-path reference

## Algorithms
A*, Dijkstra, BFS, DFS, Greedy Best-First. Four-direction motion; cells cost 1 or 5 to enter; walls cannot be entered. Start cost is excluded. A* uses consistent Manhattan heuristic. A* and Dijkstra guarantee minimum cost. BFS guarantees minimum steps, not minimum weighted cost. DFS and Greedy do not guarantee optimal paths. Searches explore finite reachable graphs; all report no route when appropriate.

Heap-based priority frontiers for A*, Dijkstra and Greedy; FIFO with head index for BFS; stack for DFS. Neighbor order is up, right, down, left. Priority ties follow insertion order. Per-search time is computed without animation. Benchmarks use 15 runs and report the median after warm-up. Microtimings are noisy, not rigorous performance claims.

## Demo
1. Choose The weighted shortcut.
2. Compare all five; BFS takes fewer steps but incurs higher cost than A*.
3. Run A* and pause or step to inspect g, h, and f.
4. Try No route challenge.
5. Paint walls or weighted cells, export map and CSV.

## Data and scope
Maps can be saved in localStorage on the current browser; JSON export/import supports portability. No accounts, database, external AI API, API keys, or real street/traffic data. Google Fonts is optional; system font fallbacks keep the lab usable if it is blocked. The app's search works without API access. This project demonstrates classical AI graph search, not a trained ANN or a genetic algorithm.

## Deploy
Serve `dist` on any static host. Vercel: framework Other, output directory `dist`, no build or install command. Sites hosting metadata is in `.openai/hosting.json`.

## Responsive grid
The entire grid fits the available width and viewport height. Expand grid opens a focused view with playback controls; Escape closes it. Playback scrolls the board into view when needed.
