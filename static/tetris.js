const COLS = 10, ROWS = 20, SIZE = 30;
const COLORS = [null, "#00f0f0", "#3050f0", "#f0a000", "#f0f000", "#00f000", "#a000f0", "#f00000"];
const SHAPES = {
  I: [[0,0,0,0],[1,1,1,1],[0,0,0,0],[0,0,0,0]],
  J: [[2,0,0],[2,2,2],[0,0,0]],
  L: [[0,0,3],[3,3,3],[0,0,0]],
  O: [[4,4],[4,4]],
  S: [[0,5,5],[5,5,0],[0,0,0]],
  T: [[0,6,0],[6,6,6],[0,0,0]],
  Z: [[7,7,0],[0,7,7],[0,0,0]]
};

const ctx = document.getElementById("board").getContext("2d");
const nctx = document.getElementById("next").getContext("2d");
let board, piece, nextPiece, score, lines, level;
let dropInterval, dropCounter, paused, over;
let lastTime = performance.now();

function emptyBoard() {
  return Array.from({ length: ROWS }, () => Array(COLS).fill(0));
}

function randomPiece() {
  const keys = Object.keys(SHAPES);
  const k = keys[Math.floor(Math.random() * keys.length)];
  const m = SHAPES[k].map(r => r.slice());
  return { m: m, x: Math.floor((COLS - m[0].length) / 2), y: 0 };
}

function collide(b, p) {
  for (let y = 0; y < p.m.length; y++) {
    for (let x = 0; x < p.m[y].length; x++) {
      if (!p.m[y][x]) continue;
      const nx = p.x + x, ny = p.y + y;
      if (nx < 0 || nx >= COLS || ny >= ROWS) return true;
      if (ny >= 0 && b[ny][nx]) return true;
    }
  }
  return false;
}

function merge() {
  piece.m.forEach((row, y) => row.forEach((v, x) => {
    if (v && piece.y + y >= 0) board[piece.y + y][piece.x + x] = v;
  }));
}

function rotateMatrix(m) {
  return m[0].map((_, i) => m.map(r => r[i]).reverse());
}

function tryRotate() {
  const old = piece.m;
  piece.m = rotateMatrix(piece.m);
  for (const dx of [0, -1, 1, -2, 2]) {
    piece.x += dx;
    if (!collide(board, piece)) return;
    piece.x -= dx;
  }
  piece.m = old;
}

function clearLines() {
  let cleared = 0;
  for (let y = ROWS - 1; y >= 0; y--) {
    if (board[y].every(v => v)) {
      board.splice(y, 1);
      board.unshift(Array(COLS).fill(0));
      cleared++;
      y++;
    }
  }
  if (cleared) {
    score += [0, 100, 300, 500, 800][cleared] * level;
    lines += cleared;
    level = Math.floor(lines / 10) + 1;
    dropInterval = Math.max(100, 800 - (level - 1) * 70);
  }
}

function spawn() {
  piece = nextPiece || randomPiece();
  nextPiece = randomPiece();
  if (collide(board, piece)) over = true;
}

function updateStats() {
  document.getElementById("score").textContent = score;
  document.getElementById("lines").textContent = lines;
  document.getElementById("level").textContent = level;
}

function lock() {
  merge();
  clearLines();
  spawn();
  updateStats();
}

function drop() {
  piece.y++;
  if (collide(board, piece)) {
    piece.y--;
    lock();
  }
  dropCounter = 0;
}

function hardDrop() {
  while (!collide(board, piece)) piece.y++;
  piece.y--;
  lock();
  dropCounter = 0;
}

function move(d) {
  piece.x += d;
  if (collide(board, piece)) piece.x -= d;
}

function drawCell(c, x, y, v) {
  c.fillStyle = COLORS[v];
  c.fillRect(x * SIZE, y * SIZE, SIZE - 1, SIZE - 1);
}

function draw() {
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, COLS * SIZE, ROWS * SIZE);
  board.forEach((r, y) => r.forEach((v, x) => { if (v) drawCell(ctx, x, y, v); }));
  piece.m.forEach((r, y) => r.forEach((v, x) => {
    if (v) drawCell(ctx, piece.x + x, piece.y + y, v);
  }));
  nctx.fillStyle = "#000";
  nctx.fillRect(0, 0, 120, 120);
  nextPiece.m.forEach((r, y) => r.forEach((v, x) => { if (v) drawCell(nctx, x, y, v); }));
  if (over || paused) {
    ctx.fillStyle = "rgba(0,0,0,0.7)";
    ctx.fillRect(0, 0, COLS * SIZE, ROWS * SIZE);
    ctx.fillStyle = "#fff";
    ctx.font = "28px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(over ? "GAME OVER" : "PAUSED", 150, 300);
  }
}

function loop(t) {
  const dt = t - lastTime;
  lastTime = t;
  if (!paused && !over) {
    dropCounter += dt;
    if (dropCounter > dropInterval) drop();
  }
  draw();
  requestAnimationFrame(loop);
}

function reset() {
  board = emptyBoard();
  score = 0; lines = 0; level = 1;
  dropInterval = 800; dropCounter = 0;
  paused = false; over = false;
  nextPiece = null;
  spawn();
  updateStats();
}

document.addEventListener("keydown", e => {
  if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", " "].includes(e.key)) e.preventDefault();
  if (e.key === "p" || e.key === "P") { if (!over) paused = !paused; return; }
  if (paused || over) return;
  if (e.key === "ArrowLeft") move(-1);
  else if (e.key === "ArrowRight") move(1);
  else if (e.key === "ArrowUp") tryRotate();
  else if (e.key === "ArrowDown") { drop(); score += 1; updateStats(); }
  else if (e.key === " ") hardDrop();
});

document.getElementById("restart").addEventListener("click", () => {
  reset();
  document.activeElement.blur();
});

reset();
requestAnimationFrame(loop);
