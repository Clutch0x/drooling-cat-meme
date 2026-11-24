(function(){
  const canvas = document.getElementById('pfp');
  const ctx = canvas.getContext('2d');
  const catImg = new Image();
  let catReady = false;
  const state = {
    bg: 'drool',
    color: '#2b4dff',
    hat: 'halo',
    held: 'candle',
    acc: 'chain',
    doodles: ['roses'],
    frame: 'polaroid',
    name: ''
  };
  const BGS = [
    ['none','none'],['paper','paper zine'],['glass','stained glass'],['altar','candle altar'],
    ['drool','blue drool drip'],['sky','scribbled sky'],['hell','hell fire'],['matrix','matrix'],
    ['toilet','toilet'],['counter','job counter'],['moon','the moon'],['stars','starry night'],
    ['sewer','sewer'],['plain','plain color']
  ];
  const HATS = [
    ['none','none'],['halo','halo'],['mitre','bishop mitre'],['roses','crown of roses'],
    ['prop','propeller cap'],['cone','traffic cone'],['foil','tinfoil hat'],['chef','chef hat'],
    ['crown','crown'],['cowboy','cowboy hat'],['beanie','beanie'],['viking','viking helmet'],
    ['durag','durag'],['fish','fish on head'],['party','party hat'],['sombrero','sombrero']
  ];
  const HELD = [
    ['none','none'],['candle','candle'],['roses','rose bunch'],['bucket','drool bucket'],
    ['sword','sword'],['fish','spare fish'],['chicken','chicken leg'],['balloon','balloon'],
    ['mop','mop'],['trophy','trophy'],['spray','spray can'],['phone','flip phone']
  ];
  const ACC = [
    ['none','none'],['chain','chain'],['bandana','bandana'],['bowtie','bowtie'],['rosary','rosary'],
    ['bib','bib'],['scarf','scarf'],['pearls','pearls'],['medal','medal'],['collar','collar'],['tie','necktie']
  ];
  const DOODLES = [
    ['candles','candles'],['roses','roses'],['drool','drool droplets'],['guh','guh scribbles'],
    ['stars','stars'],['tag','ransom name tag'],['hearts','hearts'],['flies','flies']
  ];
  const FRAMES = [
    ['none','none'],['polaroid','taped polaroid'],['gold','gold relic frame'],
    ['stamp','original relic stamp'],['crayon','crayon border']
  ];

  function cleanName(value){
    return String(value || '').replace(/#/g, '').replace(/[^a-zA-Z0-9 ']/g, '').replace(/\s+/g, ' ').trim().slice(0, 14);
  }
  function ink(g, lw){
    g.lineJoin = 'round';
    g.lineCap = 'round';
    g.strokeStyle = '#111';
    g.lineWidth = lw || 11;
    g.stroke();
  }
  function rough(pts, amp){
    return pts.map((p, i) => [
      p[0] + Math.sin(i * 2.17 + p[1] * 0.03) * amp + ((i % 3) - 1) * amp * 0.35,
      p[1] + Math.cos(i * 1.71 + p[0] * 0.02) * amp
    ]);
  }
  function poly(g, pts, fill, lw){
    const j = rough(pts, 4.5);
    g.beginPath();
    g.moveTo(j[0][0], j[0][1]);
    for(let i = 1; i < j.length; i++) g.lineTo(j[i][0], j[i][1]);
    g.closePath();
    g.fillStyle = fill;
    g.fill();
    ink(g, Math.max(lw || 12, 11));
  }
  function wob(pts, amp){
    return rough(pts, amp);
  }
  function ellipse(g, x, y, rx, ry, fill, lw){
    const pts = [];
    const n = 11;
    for(let i = 0; i < n; i++){
      const a = (i / n) * Math.PI * 2 - 0.2;
      const jx = 1 + Math.sin(i * 2.4 + x * 0.01) * 0.09;
      const jy = 1 + Math.cos(i * 1.8 + y * 0.01) * 0.09;
      pts.push([x + Math.cos(a) * rx * jx, y + Math.sin(a) * ry * jy]);
    }
    poly(g, pts, fill, lw || 10);
  }
  function rose(g, x, y, r){
    g.save();
    g.translate(x, y);
    g.fillStyle = '#1f7a32';
    g.beginPath();
    g.ellipse(-r * 0.2, r * 0.55, r * 0.55, r * 0.22, -0.8, 0, Math.PI * 2);
    g.fill();
    ink(g, 5);
    const cols = ['#ff2d2d', '#ff5a36', '#c40000'];
    for(let i = 0; i < 5; i++){
      g.fillStyle = cols[i % 3];
      g.beginPath();
      g.ellipse(Math.cos(i * 1.3) * r * 0.2, Math.sin(i) * r * 0.15, r * 0.42, r * 0.5, i, 0, Math.PI * 2);
      g.fill();
      ink(g, 5);
    }
    ellipse(g, 0, 0, r * 0.22, r * 0.22, '#ffe14a', 5);
    g.restore();
  }
  function candle(g, x, y, h){
    poly(g, [[x, y], [x + 28, y - 4], [x + 32, y + h], [x - 2, y + h + 6]], '#fff6e4', 7);
    g.fillStyle = '#ff8a00';
    g.beginPath();
    g.ellipse(x + 14, y - 18, 10, 20, 0, 0, Math.PI * 2);
    g.fill();
    ink(g, 6);
    g.fillStyle = '#fff3a0';
    g.beginPath();
    g.ellipse(x + 14, y - 14, 4, 9, 0, 0, Math.PI * 2);
    g.fill();
  }
  function droplet(g, x, y, s){
    poly(g, wob([[x, y - s], [x + s, y + s * 0.2], [x, y + s * 1.3], [x - s, y + s * 0.15]], 2), '#2f6bff', 6);
    g.fillStyle = '#d7e6ff';
    g.beginPath();
    g.ellipse(x - s * 0.25, y + s * 0.15, s * 0.16, s * 0.28, -0.4, 0, Math.PI * 2);
    g.fill();
  }
  function star(g, x, y, r, fill){
    const pts = [];
    for(let i = 0; i < 10; i++){
      const rad = i % 2 ? r * 0.42 : r;
      const a = -Math.PI / 2 + i * Math.PI / 5;
      pts.push([x + Math.cos(a) * rad, y + Math.sin(a) * rad]);
    }
    poly(g, pts, fill || '#ffe14a', 6);
  }
  function heart(g, x, y, s){
    poly(g, [
      [x, y + s * 0.3], [x - s, y - s * 0.2], [x - s * 0.55, y - s], [x, y - s * 0.45],
      [x + s * 0.55, y - s], [x + s, y - s * 0.2]
    ], '#ff2d55', 6);
  }

  function drawBackground(g){
    if(state.bg === 'none'){ g.fillStyle = '#f4efe4'; g.fillRect(0, 0, 1000, 1000); return; }
    if(state.bg === 'plain'){ g.fillStyle = state.color; g.fillRect(0, 0, 1000, 1000); return; }
    if(state.bg === 'paper'){
      g.fillStyle = '#efe4cf';
      g.fillRect(0, 0, 1000, 1000);
      g.strokeStyle = 'rgba(40,30,20,.2)';
      g.lineWidth = 3;
      for(let y = 40; y < 1000; y += 36){
        g.beginPath(); g.moveTo(20, y); g.lineTo(980, y + Math.sin(y) * 2); g.stroke();
      }
      return;
    }
    if(state.bg === 'glass'){
      g.fillStyle = '#120e0c';
      g.fillRect(0, 0, 1000, 1000);
      const panes = ['#2f6bff', '#8ec2ff', '#ffe14a', '#ff3b30', '#f4efe4', '#1d4ed8', '#ff8a00'];
      let n = 0;
      for(let row = 0; row < 7; row++){
        for(let col = 0; col < 7; col++){
          const x = col * 150 + (row % 2 ? 30 : 0) - 20;
          const y = row * 150 - 10;
          poly(g, wob([[x + 20, y + 10], [x + 130, y + 24], [x + 118, y + 130], [x + 8, y + 112]], 4), panes[n++ % panes.length], 10);
        }
      }
      return;
    }
    if(state.bg === 'altar'){
      g.fillStyle = '#2a160e';
      g.fillRect(0, 0, 1000, 1000);
      g.fillStyle = '#ffb020';
      g.globalAlpha = 0.35;
      g.beginPath(); g.ellipse(500, 700, 300, 160, 0, 0, Math.PI * 2); g.fill();
      g.globalAlpha = 1;
      candle(g, 60, 620, 240);
      candle(g, 120, 700, 170);
      candle(g, 880, 640, 220);
      return;
    }
    if(state.bg === 'drool'){
      g.fillStyle = '#e7f4ff';
      g.fillRect(0, 0, 1000, 1000);
      for(let i = 0; i < 8; i++){
        const x = 40 + i * 125;
        const h = 220 + (i % 3) * 160;
        poly(g, [[x, -10], [x + 46, -10], [x + 58, h * 0.55], [x + 22, h], [x - 8, h * 0.5]], i % 2 ? '#2f6bff' : '#8ec2ff', 7);
      }
      return;
    }
    if(state.bg === 'sky'){
      g.fillStyle = '#7ec8ff';
      g.fillRect(0, 0, 1000, 1000);
      ellipse(g, 180, 160, 70, 70, '#ffe14a', 8);
      for(let i = 0; i < 8; i++){
        const a = i / 8 * Math.PI * 2;
        g.strokeStyle = '#111'; g.lineWidth = 8;
        g.beginPath();
        g.moveTo(180 + Math.cos(a) * 90, 160 + Math.sin(a) * 90);
        g.lineTo(180 + Math.cos(a) * 130, 160 + Math.sin(a) * 130);
        g.stroke();
      }
      ellipse(g, 520, 180, 90, 50, '#fff', 8);
      ellipse(g, 600, 190, 70, 40, '#fff', 8);
      ellipse(g, 760, 150, 80, 46, '#fff', 8);
      return;
    }
    if(state.bg === 'hell'){
      g.fillStyle = '#4a0505';
      g.fillRect(0, 0, 1000, 1000);
      for(let i = 0; i < 9; i++){
        const x = i * 120;
        poly(g, [[x, 1000], [x + 40, 520 - (i % 3) * 80], [x + 80, 1000]], i % 2 ? '#ff5a00' : '#ffd000', 8);
        poly(g, [[x + 20, 1000], [x + 55, 680], [x + 100, 1000]], '#ff2d00', 7);
      }
      return;
    }
    if(state.bg === 'matrix'){
      g.fillStyle = '#031006';
      g.fillRect(0, 0, 1000, 1000);
      g.font = '28px "Special Elite", monospace';
      for(let col = 0; col < 18; col++){
        for(let row = 0; row < 22; row++){
          g.fillStyle = (col + row) % 4 === 0 ? '#b6ff4a' : '#147a14';
          g.fillText((col * 3 + row) % 2 ? '1' : '0', 20 + col * 56, 40 + row * 46);
        }
      }
      return;
    }
    if(state.bg === 'toilet'){
      g.fillStyle = '#d7ecff';
      g.fillRect(0, 0, 1000, 1000);
      poly(g, [[180, 80], [820, 70], [840, 360], [160, 370]], '#f7f7f7', 10);
      ellipse(g, 500, 250, 70, 40, '#9fd0ff', 8);
      poly(g, [[230, 340], [770, 330], [860, 780], [140, 800]], '#ffffff', 12);
      ellipse(g, 500, 620, 180, 90, '#7ec8ff', 8);
      ellipse(g, 860, 180, 36, 36, '#f4efe4', 7);
      return;
    }
    if(state.bg === 'counter'){
      g.fillStyle = '#c8361f';
      g.fillRect(0, 0, 1000, 420);
      g.fillStyle = '#ffd000';
      g.fillRect(0, 420, 1000, 220);
      g.fillStyle = '#5c3a1e';
      g.fillRect(0, 640, 1000, 360);
      g.strokeStyle = '#111'; g.lineWidth = 10;
      g.strokeRect(40, 80, 220, 160);
      g.fillStyle = '#fff';
      g.fillRect(80, 250, 70, 110);
      ink(g, 7);
      g.fillStyle = '#ff3b30';
      g.fillRect(200, 280, 80, 100);
      ink(g, 7);
      g.fillStyle = '#ffe14a';
      for(let i = 0; i < 5; i++) g.fillRect(214 + i * 10, 250, 6, 36);
      return;
    }
    if(state.bg === 'moon'){
      g.fillStyle = '#07080f';
      g.fillRect(0, 0, 1000, 1000);
      ellipse(g, 500, 520, 460, 460, '#c8c8c8', 10);
      ellipse(g, 380, 420, 50, 40, '#9a9a9a', 7);
      ellipse(g, 560, 600, 70, 50, '#a3a3a3', 7);
      ellipse(g, 640, 380, 30, 24, '#b0b0b0', 6);
      ellipse(g, 160, 150, 36, 36, '#3b82f6', 6);
      g.fillStyle = '#22c55e';
      g.fillRect(148, 140, 16, 12);
      return;
    }
    if(state.bg === 'stars'){
      g.fillStyle = '#0c1440';
      g.fillRect(0, 0, 1000, 1000);
      ellipse(g, 160, 150, 54, 54, '#f4e7b0', 7);
      g.fillStyle = '#0c1440';
      g.beginPath(); g.arc(184, 136, 44, 0, Math.PI * 2); g.fill();
      for(let i = 0; i < 40; i++){
        star(g, (i * 97) % 980 + 10, (i * 53) % 960 + 20, 8 + (i % 4) * 4, i % 5 === 0 ? '#ffe14a' : '#fff');
      }
      return;
    }
    g.fillStyle = '#1c3a28';
    g.fillRect(0, 0, 1000, 1000);
    g.strokeStyle = '#0e2418'; g.lineWidth = 8;
    for(let y = 0; y < 1000; y += 70){
      for(let x = 0; x < 1000; x += 120){
        g.strokeRect(x + (y % 140 ? 0 : 60), y, 110, 60);
      }
    }
    poly(g, [[0, 80], [260, 60], [280, 160], [0, 180]], '#8d8d8d', 8);
    droplet(g, 200, 160, 18);
    droplet(g, 240, 180, 12);
  }

  function drawHat(g, cat){
    if(state.hat === 'none') return;
    // y=0 is the ear line, about 11% down the cutout. Eyes sit near 22%. Nothing may cross below y=0.
    const ax = cat.x + cat.w * 0.46;
    const ay = cat.y + cat.h * 0.11;
    const s = cat.w / 580;
    g.save();
    g.translate(ax, ay);
    g.rotate(-0.05);
    g.scale(s, s);
    if(state.hat === 'halo'){
      g.beginPath();
      g.ellipse(4, -34, 132, 26, -0.08, 0, Math.PI * 2);
      g.lineWidth = 16;
      g.strokeStyle = '#ffe14a';
      g.stroke();
      ink(g, 8);
    }else if(state.hat === 'mitre'){
      poly(g, [[4, -188], [78, -2], [-86, 0]], '#f7f1e4', 10);
      g.strokeStyle = '#e1b000'; g.lineWidth = 11;
      g.beginPath(); g.moveTo(2, -140); g.lineTo(-2, -64); g.moveTo(-22, -102); g.lineTo(24, -96); g.stroke();
      poly(g, [[-70, -18], [74, -22], [70, -4], [-74, -2]], '#c8361f', 7);
    }else if(state.hat === 'roses'){
      for(let i = 0; i < 5; i++) rose(g, -88 + i * 44, -30 + (i % 2) * 6, 18);
    }else if(state.hat === 'prop'){
      poly(g, [[-92, -4], [96, 0], [84, -28], [-88, -22]], '#2f6bff', 9);
      ellipse(g, 6, -62, 58, 36, '#ff3b30', 9);
      g.strokeStyle = '#111'; g.lineWidth = 9;
      g.beginPath(); g.moveTo(4, -96); g.lineTo(-2, -132); g.stroke();
      poly(g, [[-46, -128], [50, -136], [6, -118], [-8, -146]], '#ffe14a', 8);
    }else if(state.hat === 'cone'){
      poly(g, [[6, -176], [52, -2], [-58, 0]], '#ff6a00', 10);
      poly(g, [[-36, -48], [32, -56], [24, -36], [-30, -30]], '#fff', 7);
    }else if(state.hat === 'foil'){
      poly(g, [[2, -168], [78, -8], [28, -2], [-8, -16], [-36, -4], [-84, -10]], '#d5dbe3', 9);
      g.strokeStyle = '#fff'; g.lineWidth = 4;
      g.beginPath(); g.moveTo(-30, -90); g.lineTo(18, -48); g.moveTo(8, -120); g.lineTo(36, -70); g.stroke();
    }else if(state.hat === 'chef'){
      ellipse(g, -4, -108, 70, 58, '#fff', 10);
      ellipse(g, -46, -78, 30, 24, '#fff', 8);
      ellipse(g, 42, -72, 28, 22, '#fff', 8);
      poly(g, [[-82, -22], [86, -28], [80, -2], [-78, 0]], '#fff', 9);
    }else if(state.hat === 'crown'){
      poly(g, [[-92, -2], [-70, -78], [-28, -16], [4, -112], [34, -12], [74, -84], [96, 0]], '#ffe14a', 10);
      ellipse(g, -70, -78, 9, 9, '#ff3b30', 5);
      ellipse(g, 4, -112, 9, 9, '#2f6bff', 5);
      ellipse(g, 74, -84, 9, 9, '#22c55e', 5);
    }else if(state.hat === 'cowboy'){
      ellipse(g, 0, -20, 150, 16, '#8a5a32', 9);
      poly(g, [[-62, -24], [-54, -92], [58, -98], [66, -20]], '#a56b3c', 9);
      ellipse(g, 2, -96, 54, 16, '#c48a55', 7);
    }else if(state.hat === 'beanie'){
      ellipse(g, 2, -58, 86, 48, '#2f6bff', 10);
      g.strokeStyle = '#163a8a'; g.lineWidth = 8;
      for(let i = -3; i <= 3; i++){
        g.beginPath(); g.moveTo(i * 20 - 4, -78); g.lineTo(i * 18, -16); g.stroke();
      }
      ellipse(g, 62, -96, 16, 16, '#ffe14a', 7);
      poly(g, [[-88, -16], [90, -20], [86, -2], [-84, 0]], '#f4efe4', 8);
    }else if(state.hat === 'viking'){
      ellipse(g, 2, -52, 78, 40, '#c2c2c2', 10);
      poly(g, [[-58, -40], [-138, -128], [-78, -36]], '#f4efe4', 8);
      poly(g, [[62, -44], [142, -118], [80, -30]], '#f4efe4', 8);
      poly(g, [[-84, -16], [88, -20], [82, -2], [-78, 0]], '#ff3b30', 8);
    }else if(state.hat === 'durag'){
      poly(g, [[-108, -2], [-96, -36], [104, -28], [112, 0]], '#ff3b30', 10);
      poly(g, [[-88, -20], [-168, -78], [-146, -90], [-70, -16]], '#ff3b30', 8);
      ellipse(g, -158, -84, 14, 14, '#ff3b30', 7);
    }else if(state.hat === 'fish'){
      ellipse(g, 8, -30, 96, 24, '#ff8a00', 9);
      poly(g, [[96, -30], [142, -58], [138, -8]], '#ff5a00', 8);
      ellipse(g, -36, -36, 7, 7, '#111', 4);
    }else if(state.hat === 'party'){
      poly(g, [[4, -186], [64, -2], [-58, 0]], '#2f6bff', 10);
      poly(g, [[-16, -130], [28, -48], [6, -40], [-28, -112]], '#ffe14a', 7);
      ellipse(g, 2, -198, 14, 14, '#ff3b30', 7);
    }else if(state.hat === 'sombrero'){
      ellipse(g, 2, -18, 168, 16, '#ffe14a', 10);
      ellipse(g, 0, -58, 58, 36, '#ffb000', 9);
      poly(g, [[-34, -28], [36, -34], [28, -12], [-30, -8]], '#ff3b30', 7);
    }
    g.restore();
  }

  function drawHeld(g, cat){
    if(state.held === 'none') return;
    const x = cat.x - 168;
    const y = cat.y + cat.h * 0.58;
    g.save();
    g.translate(x, y);
    if(state.held === 'candle'){
      candle(g, 20, -40, 180);
    }else if(state.held === 'roses'){
      rose(g, 40, -20, 36);
      rose(g, 90, 10, 28);
      rose(g, 20, 30, 24);
      g.strokeStyle = '#1f7a32'; g.lineWidth = 8;
      g.beginPath(); g.moveTo(50, 40); g.lineTo(55, 140); g.stroke();
    }else if(state.held === 'bucket'){
      poly(g, [[10, -20], [120, -10], [100, 90], [24, 96]], '#9aa4b2', 8);
      ellipse(g, 64, 20, 28, 16, '#2f6bff', 6);
      g.strokeStyle = '#111'; g.lineWidth = 8;
      g.beginPath(); g.arc(64, -20, 40, Math.PI, 0); g.stroke();
    }else if(state.held === 'sword'){
      poly(g, [[70, -200], [86, -200], [80, 20], [64, 20]], '#d5dbe3', 7);
      poly(g, [[40, 20], [112, 20], [112, 40], [40, 40]], '#ffe14a', 7);
      poly(g, [[68, 40], [82, 40], [82, 90], [68, 90]], '#8a5a32', 6);
    }else if(state.held === 'fish'){
      ellipse(g, 70, 10, 70, 28, '#7ec8ff', 7);
      poly(g, [[130, 10], [170, -20], [170, 40]], '#2f6bff', 6);
      ellipse(g, 30, 2, 6, 6, '#111', 3);
    }else if(state.held === 'chicken'){
      ellipse(g, 70, -10, 52, 40, '#f0c48a', 8);
      poly(g, [[58, 24], [84, 24], [78, 120], [64, 120]], '#f7f1e4', 7);
      ellipse(g, 71, 124, 18, 10, '#fff', 6);
    }else if(state.held === 'balloon'){
      ellipse(g, 70, -40, 46, 60, '#ff3b30', 7);
      g.strokeStyle = '#111'; g.lineWidth = 4;
      g.beginPath(); g.moveTo(70, 20); g.lineTo(60, 120); g.stroke();
    }else if(state.held === 'mop'){
      g.strokeStyle = '#8a5a32'; g.lineWidth = 10;
      g.beginPath(); g.moveTo(70, -180); g.lineTo(70, 40); g.stroke();
      for(let i = -3; i <= 3; i++){
        g.strokeStyle = '#d7ecff'; g.lineWidth = 6;
        g.beginPath(); g.moveTo(70, 30); g.lineTo(70 + i * 14, 110); g.stroke();
      }
    }else if(state.held === 'trophy'){
      poly(g, [[30, -80], [110, -80], [96, 10], [44, 10]], '#ffe14a', 7);
      ellipse(g, 70, 40, 28, 12, '#8a5a32', 6);
      g.strokeStyle = '#ffe14a'; g.lineWidth = 8;
      g.beginPath(); g.arc(24, -40, 22, Math.PI * 0.2, Math.PI * 1.2); g.stroke();
      g.beginPath(); g.arc(116, -40, 22, -Math.PI * 0.2, Math.PI * 0.8); g.stroke();
    }else if(state.held === 'spray'){
      poly(g, [[40, -40], [100, -40], [100, 90], [40, 90]], '#c8361f', 7);
      poly(g, [[100, -20], [130, -36], [130, -8], [100, 4]], '#111', 6);
      ellipse(g, 70, -40, 30, 12, '#222', 6);
    }else if(state.held === 'phone'){
      poly(g, [[40, -70], [110, -80], [120, 70], [36, 80]], '#d5dbe3', 8);
      ellipse(g, 78, 40, 8, 8, '#2f6bff', 4);
      g.fillStyle = '#111';
      g.fillRect(58, -40, 30, 8);
    }
    g.restore();
  }

  function drawAcc(g, cat){
    if(state.acc === 'none') return;
    // Chin is just above the drool. The blue streak itself runs x 0.43-0.48, y 0.37-0.47, so pieces stay above that and off the stripe.
    const cx = cat.x + cat.w * 0.452;
    const y = cat.y + cat.h * 0.318;
    const L = cx - cat.w * 0.09;
    const R = cx + cat.w * 0.09;
    g.save();
    if(state.acc === 'chain'){
      for(let i = 0; i < 4; i++){
        ellipse(g, L - 8 - i * 15, y + 2 + (i % 2) * 3, 8, 6, '#ffe14a', 5);
        ellipse(g, R + 8 + i * 15, y + 1 + (i % 2) * 4, 8, 6, '#ffe14a', 5);
      }
    }else if(state.acc === 'bandana'){
      poly(g, [[L - 52, y - 2], [L, y + 4], [L - 6, y + 16], [L - 48, y + 10]], '#ff3b30', 8);
      poly(g, [[R, y + 2], [R + 56, y - 6], [R + 48, y + 12], [R + 4, y + 16]], '#ff3b30', 8);
      poly(g, [[L - 46, y + 8], [L - 70, y + 36], [L - 40, y + 16]], '#ff5a36', 7);
    }else if(state.acc === 'bowtie'){
      poly(g, [[L, y + 2], [L - 36, y - 12], [L - 32, y + 16]], '#2f6bff', 8);
      poly(g, [[R, y + 4], [R + 38, y - 8], [R + 30, y + 18]], '#2f6bff', 8);
      ellipse(g, L + 2, y + 2, 6, 6, '#ffe14a', 5);
    }else if(state.acc === 'rosary'){
      for(let i = 0; i < 5; i++) ellipse(g, L - 46 + i * 11, y + i * 3, 5, 5, '#f7f1e4', 4);
      poly(g, [[L - 50, y + 16], [L - 40, y + 40], [L - 28, y + 16]], '#ffe14a', 6);
    }else if(state.acc === 'bib'){
      poly(g, [[L - 8, y + 6], [L - 36, y + 2], [L - 42, y + 28], [L - 18, y + 46], [L - 4, y + 22]], '#fff6ea', 8);
      ellipse(g, L - 24, y + 22, 5, 5, '#2f6bff', 5);
      g.strokeStyle = '#111'; g.lineWidth = 6;
      g.beginPath(); g.moveTo(L - 10, y + 4); g.quadraticCurveTo(cx, y - 10, R + 8, y + 6); g.stroke();
    }else if(state.acc === 'scarf'){
      poly(g, [[L - 40, y], [L, y + 6], [L - 4, y + 16], [L - 36, y + 8]], '#ff8a00', 8);
      poly(g, [[R, y + 2], [R + 44, y - 4], [R + 36, y + 14], [R + 2, y + 16]], '#ff8a00', 8);
      poly(g, [[R + 18, y + 12], [R + 32, y + 10], [R + 26, y + 58], [R + 10, y + 54]], '#ff5a00', 7);
    }else if(state.acc === 'pearls'){
      for(let i = 0; i < 4; i++){
        ellipse(g, L - 6 - i * 12, y + (i % 2) * 3, 6, 6, '#fff', 4);
        ellipse(g, R + 6 + i * 12, y + (i % 2) * 3, 6, 6, '#fff', 4);
      }
    }else if(state.acc === 'medal'){
      g.strokeStyle = '#ff3b30'; g.lineWidth = 6;
      g.beginPath(); g.moveTo(L - 20, y); g.lineTo(L, y + 8); g.moveTo(R + 24, y - 2); g.lineTo(R, y + 8); g.stroke();
      ellipse(g, R + 28, y + 24, 12, 12, '#ffe14a', 6);
    }else if(state.acc === 'collar'){
      poly(g, [[L - 46, y + 2], [L, y + 8], [L - 4, y + 16], [L - 42, y + 8]], '#c8361f', 8);
      poly(g, [[R, y + 6], [R + 48, y], [R + 40, y + 14], [R + 2, y + 16]], '#c8361f', 8);
      ellipse(g, R + 8, y + 6, 5, 5, '#ffe14a', 4);
    }else if(state.acc === 'tie'){
      poly(g, [[R, y], [R + 16, y - 2], [R + 18, y + 14], [R + 2, y + 12]], '#111', 6);
      poly(g, [[R + 2, y + 12], [R + 20, y + 10], [R + 14, y + 58], [R, y + 52]], '#2f6bff', 8);
    }
    g.restore();
  }

  function drawDoodles(g, cat){
    if(state.doodles.indexOf('candles') >= 0){
      candle(g, 48, cat.y + cat.h * 0.55, 160);
      candle(g, 900, cat.y + cat.h * 0.5, 180);
    }
    if(state.doodles.indexOf('roses') >= 0){
      rose(g, 90, cat.y + 80, 26);
      rose(g, 920, cat.y + 120, 30);
    }
    if(state.doodles.indexOf('drool') >= 0){
      droplet(g, 70, 180, 26);
      droplet(g, 130, 240, 16);
      droplet(g, 930, 200, 28);
    }
    if(state.doodles.indexOf('guh') >= 0){
      g.save();
      g.fillStyle = '#c8361f';
      g.font = '64px "Permanent Marker", cursive';
      g.translate(40, cat.y + 40);
      g.rotate(-0.4);
      g.fillText('guh', 0, 0);
      g.restore();
    }
    if(state.doodles.indexOf('stars') >= 0){
      star(g, 80, 120, 22, '#ffe14a');
      star(g, 150, 80, 14, '#2f6bff');
      star(g, 900, 100, 26, '#ffe14a');
    }
    if(state.doodles.indexOf('tag') >= 0){
      const tagName = cleanName(state.name) || 'guh';
      g.save();
      g.translate(36, cat.y + cat.h * 0.62);
      g.rotate(-0.08);
      g.fillStyle = 'rgba(240,220,140,.95)';
      g.fillRect(20, -16, 90, 16);
      poly(g, [[0, 0], [160, 6], [154, 70], [6, 64]], '#fffdf6', 6);
      g.fillStyle = '#111';
      g.font = '28px "Permanent Marker", cursive';
      g.fillText(tagName.slice(0, 8), 16, 44);
      g.restore();
    }
    if(state.doodles.indexOf('hearts') >= 0){
      heart(g, 100, cat.y + 200, 22);
      heart(g, 900, cat.y + 240, 18);
    }
    if(state.doodles.indexOf('flies') >= 0){
      [[120, cat.y + 300], [900, cat.y + 280], [160, cat.y + 160]].forEach((p) => {
        ellipse(g, p[0], p[1], 8, 5, '#111', 3);
        g.strokeStyle = '#111'; g.lineWidth = 2;
        g.beginPath(); g.ellipse(p[0] - 10, p[1] - 4, 8, 4, -0.6, 0, Math.PI * 2); g.stroke();
        g.beginPath(); g.ellipse(p[0] + 10, p[1] - 4, 8, 4, 0.6, 0, Math.PI * 2); g.stroke();
      });
    }
  }

  function drawFrame(g, cat){
    if(state.frame === 'none') return;
    if(state.frame === 'polaroid'){
      const t = 28;
      const lip = 78;
      g.fillStyle = '#fbf8f1';
      g.fillRect(cat.x - t, cat.y - t, cat.w + t * 2, t);
      g.fillRect(cat.x - t, cat.y + cat.h, cat.w + t * 2, lip);
      g.fillRect(cat.x - t, cat.y, t, cat.h);
      g.fillRect(cat.x + cat.w, cat.y, t, cat.h);
      g.strokeStyle = '#111'; g.lineWidth = 6;
      g.strokeRect(cat.x - t, cat.y - t, cat.w + t * 2, cat.h + t + lip);
      g.fillStyle = 'rgba(236, 214, 120, .92)';
      g.save();
      g.translate(cat.x + cat.w * 0.28, cat.y - t);
      g.rotate(-0.12);
      g.fillRect(-50, -12, 110, 26);
      g.restore();
      g.save();
      g.translate(cat.x + cat.w * 0.72, cat.y - t + 4);
      g.rotate(0.1);
      g.fillRect(-40, -12, 96, 24);
      g.restore();
      return;
    }
    if(state.frame === 'gold'){
      g.lineWidth = 22;
      g.strokeStyle = '#ffe14a';
      g.strokeRect(28, 28, 944, 944);
      g.lineWidth = 6;
      g.strokeStyle = '#8a6a12';
      g.strokeRect(48, 48, 904, 904);
      [[48, 48], [952, 48], [48, 952], [952, 952]].forEach((p) => star(g, p[0], p[1], 20, '#ffe14a'));
      return;
    }
    if(state.frame === 'stamp'){
      g.save();
      g.translate(860, 150);
      g.rotate(-0.2);
      g.strokeStyle = '#c8361f';
      g.lineWidth = 8;
      g.beginPath(); g.arc(0, 0, 78, 0, Math.PI * 2); g.stroke();
      g.lineWidth = 3;
      g.beginPath(); g.arc(0, 0, 64, 0, Math.PI * 2); g.stroke();
      g.fillStyle = '#c8361f';
      g.font = '15px "Bowlby One", sans-serif';
      g.textAlign = 'center';
      g.fillText('ORIGINAL', 0, -6);
      g.fillText('RELIC', 0, 14);
      g.font = '12px "Special Elite", monospace';
      g.fillText('feb 20 · 2026', 0, 36);
      g.restore();
      return;
    }
    const colors = ['#ff3b30', '#2f6bff', '#ffe14a', '#22c55e', '#ff8a00'];
    g.lineWidth = 16;
    g.lineCap = 'round';
    for(let i = 0; i < 4; i++){
      g.strokeStyle = colors[i % colors.length];
      g.beginPath();
      if(i === 0){ g.moveTo(30, 40); g.quadraticCurveTo(400, 10, 970, 36); }
      if(i === 1){ g.moveTo(40, 30); g.quadraticCurveTo(16, 500, 36, 970); }
      if(i === 2){ g.moveTo(30, 960); g.quadraticCurveTo(500, 990, 970, 950); }
      if(i === 3){ g.moveTo(960, 40); g.quadraticCurveTo(990, 400, 950, 970); }
      g.stroke();
    }
  }

  function cutoutWord(g, text){
    const letters = text.toUpperCase().split('');
    const gap = 8;
    const size = Math.min(52, Math.floor((820 - gap * letters.length) / Math.max(letters.length, 1)));
    const colors = ['#111', '#2f6bff', '#ffe14a', '#ff3b30', '#fff'];
    let width = 0;
    letters.forEach((ch) => { width += (ch === ' ' ? size * 0.4 : size) + gap; });
    let x = (1000 - width) / 2;
    letters.forEach((ch, i) => {
      if(ch === ' '){ x += size * 0.4 + gap; return; }
      g.save();
      g.translate(x + size / 2, 952);
      g.rotate((i % 2 ? 1 : -1) * 0.08);
      g.fillStyle = colors[i % colors.length];
      g.fillRect(-size / 2, -size * 0.46, size, size * 0.9);
      ink(g, 4);
      g.fillStyle = (colors[i % colors.length] === '#ffe14a' || colors[i % colors.length] === '#fff') ? '#111' : '#fff';
      g.font = Math.floor(size * 0.58) + 'px "Bowlby One", sans-serif';
      g.textAlign = 'center';
      g.textBaseline = 'middle';
      g.fillText(ch, 0, 2);
      g.restore();
      x += size + gap;
    });
  }

  function layoutCat(){
    const iw = catImg.naturalWidth || 379;
    const ih = catImg.naturalHeight || 495;
    const h = 760;
    const w = Math.round(h * iw / ih);
    const bottom = 900;
    return { x: Math.round((1000 - w) / 2), y: bottom - h, w: w, h: h };
  }

  function render(){
    const cat = layoutCat();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.filter = 'none';
    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;
    ctx.clearRect(0, 0, 1000, 1000);
    drawBackground(ctx);
    if(state.frame === 'polaroid' || state.frame === 'gold' || state.frame === 'crayon') drawFrame(ctx, cat);
    drawDoodles(ctx, cat);
    drawHeld(ctx, cat);
    if(catReady){
      ctx.save();
      ctx.filter = 'none';
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(catImg, cat.x, cat.y, cat.w, cat.h);
      ctx.restore();
    }
    drawHat(ctx, cat);
    drawAcc(ctx, cat);
    if(state.frame === 'stamp') drawFrame(ctx, cat);
    const name = cleanName(state.name);
    if(name) cutoutWord(ctx, name);
  }

  function chip(label, pressed){
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'chip';
    b.textContent = label;
    b.setAttribute('aria-pressed', pressed ? 'true' : 'false');
    return b;
  }
  function fillChoice(box, list, current, set){
    box.textContent = '';
    list.forEach((item) => {
      const b = chip(item[1], current === item[0]);
      b.addEventListener('click', () => set(item[0]));
      box.appendChild(b);
    });
  }
  function paintChips(){
    fillChoice(document.getElementById('bgChips'), BGS, state.bg, (id) => { state.bg = id; sync(); });
    fillChoice(document.getElementById('hatChips'), HATS, state.hat, (id) => { state.hat = id; sync(); });
    fillChoice(document.getElementById('heldChips'), HELD, state.held, (id) => { state.held = id; sync(); });
    fillChoice(document.getElementById('accChips'), ACC, state.acc, (id) => { state.acc = id; sync(); });
    fillChoice(document.getElementById('frameChips'), FRAMES, state.frame, (id) => { state.frame = id; sync(); });
    const doodleBox = document.getElementById('doodleChips');
    doodleBox.textContent = '';
    const none = chip('none', state.doodles.length === 0);
    none.addEventListener('click', () => { state.doodles = []; sync(); });
    doodleBox.appendChild(none);
    DOODLES.forEach((item) => {
      const b = chip(item[1], state.doodles.indexOf(item[0]) >= 0);
      b.addEventListener('click', () => {
        const i = state.doodles.indexOf(item[0]);
        if(i >= 0) state.doodles.splice(i, 1);
        else state.doodles.push(item[0]);
        sync();
      });
      doodleBox.appendChild(b);
    });
    document.getElementById('colorRow').hidden = state.bg !== 'plain';
    const pick = document.getElementById('colorPick');
    if(/^#[0-9a-fA-F]{6}$/.test(state.color)) pick.value = state.color;
    document.getElementById('nameInput').value = state.name;
  }
  function sync(){ paintChips(); render(); }

  document.getElementById('colorPick').addEventListener('input', (event) => {
    state.bg = 'plain';
    state.color = event.target.value;
    sync();
  });
  document.querySelectorAll('.swatch').forEach((btn) => {
    btn.addEventListener('click', () => {
      state.bg = 'plain';
      state.color = btn.getAttribute('data-color');
      sync();
    });
  });
  document.getElementById('nameInput').addEventListener('input', (event) => {
    state.name = cleanName(event.target.value);
    render();
  });
  document.getElementById('shuffle').addEventListener('click', () => {
    const pick = (list) => list[Math.floor(Math.random() * list.length)][0];
    state.bg = pick(BGS);
    state.hat = pick(HATS);
    state.held = pick(HELD);
    state.acc = pick(ACC);
    state.frame = pick(FRAMES);
    state.doodles = DOODLES.map((item) => item[0]).filter(() => Math.random() < 0.35);
    const swatches = ['#efe4cf', '#2b4dff', '#c8361f', '#f4c430', '#1d1a16', '#7ec8ff'];
    if(state.bg === 'plain') state.color = swatches[Math.floor(Math.random() * swatches.length)];
    state.name = ['', 'guh', 'blessed', 'relic', 'drool'][Math.floor(Math.random() * 5)];
    sync();
  });

  function pngBlob(){
    return new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
  }
  document.getElementById('download').addEventListener('click', async () => {
    const blob = await pngBlob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'baptism-pfp.png';
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1500);
  });
  document.getElementById('share').addEventListener('click', async () => {
    const note = document.getElementById('shareNote');
    const blob = await pngBlob();
    const file = new File([blob], 'baptism-pfp.png', { type: 'image/png' });
    const site = 'https://droolingcatmeme.com/baptism';
    try{
      if(navigator.share && navigator.canShare && navigator.canShare({ files: [file] })){
        await navigator.share({ files: [file], title: 'baptism', text: 'fresh from the church of the drool' });
        note.textContent = 'shared.';
        return;
      }
    }catch(err){
      if(err && err.name === 'AbortError') return;
    }
    const intent = 'https://twitter.com/intent/tweet?text=' + encodeURIComponent('fresh from the church of the drool') + '&url=' + encodeURIComponent(site);
    window.open(intent, '_blank', 'noopener');
    note.textContent = 'opened x. the portrait stays on this phone until you download it.';
  });

  window.__setPfp = function(partial){
    ['bg', 'color', 'hat', 'held', 'acc', 'frame', 'name'].forEach((key) => {
      if(partial[key] !== undefined) state[key] = partial[key];
    });
    if(partial.doodles) state.doodles = partial.doodles.slice();
    sync();
  };

  catImg.onload = () => { catReady = true; render(); };
  catImg.onerror = () => { catReady = false; render(); };
  catImg.src = '../assets/drooling-cat-cutout.png';
  document.fonts.ready.then(() => render());
  sync();
})();
