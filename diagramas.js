const chartColors = {
  vectores: {ink:'#2b2154', soft:'#e7dcff', ground:'#d6edb3', grid:'#315a4032', path:'#4932a0', second:'#8a3a1b'},
  dinamica: {ink:'#173c37', soft:'#d6f2de', ground:'#ead7ae', grid:'#6d552934', path:'#17614c', second:'#963b22'},
  colisiones: {ink:'#30254f', soft:'#eadffc', ground:'#c5e9ec', grid:'#155e6830', path:'#453391', second:'#a34826'}
};

function drawIslandGraph(canvas, drawing, chapter) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const colors = chartColors[chapter];
  const w = 640;
  const h = 360;
  const scale = Math.min(2, window.devicePixelRatio || 1);
  canvas.width = w * scale;
  canvas.height = h * scale;
  ctx.scale(scale, scale);
  ctx.fillStyle = colors.ground;
  ctx.fillRect(0,0,w,h);

  function line(x1, y1, x2, y2, stroke, width = 3, dash = []) {
    ctx.strokeStyle = stroke;
    ctx.lineWidth = width;
    ctx.lineCap = 'round';
    ctx.setLineDash(dash);
    ctx.beginPath();
    ctx.moveTo(x1,y1);
    ctx.lineTo(x2,y2);
    ctx.stroke();
    ctx.setLineDash([]);
  }
  function tile(x, y, width, height, fill, border = null) {
    ctx.fillStyle = fill;
    ctx.beginPath();
    ctx.roundRect(x,y,width,height,9);
    ctx.fill();
    if (border) {
      ctx.strokeStyle = border;
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  }
  function text(value, x, y, fill = colors.ink, size = 21, align = 'center') {
    ctx.fillStyle = fill;
    ctx.font = '750 ' + size + 'px Inter, system-ui, sans-serif';
    ctx.textAlign = align;
    ctx.textBaseline = 'middle';
    ctx.fillText(value,x,y);
  }
  function label(value, x, y, color = colors.ink) {
    ctx.font = '750 21px Inter, system-ui, sans-serif';
    const width = Math.max(30,ctx.measureText(value).width + 18);
    x = Math.max(width/2 + 5,Math.min(w-width/2-5,x));
    y = Math.max(18,Math.min(h-18,y));
    tile(x-width/2,y-15,width,30,'#fff9e9');
    text(value,x,y,color);
  }
  function arrow(x1, y1, x2, y2, color, dash = []) {
    const angle = Math.atan2(y2-y1,x2-x1);
    line(x1,y1,x2,y2,'#fff9e9',9,dash);
    line(x1,y1,x2,y2,color,5,dash);
    line(x2,y2,x2-13*Math.cos(angle-.55),y2-13*Math.sin(angle-.55),color,5);
    line(x2,y2,x2-13*Math.cos(angle+.55),y2-13*Math.sin(angle+.55),color,5);
  }

  for (let x=20;x<w;x+=30) line(x,0,x,h,colors.grid,1);
  for (let y=20;y<h;y+=30) line(0,y,w,y,colors.grid,1);

  if (drawing.type === 'route') {
    const points = [[0,0]];
    for (const [dx,dy] of drawing.legs) {
      const [x,y] = points.at(-1);
      points.push([x+dx,y+dy]);
    }
    const minX = Math.min(...points.map(([x])=>x));
    const maxX = Math.max(...points.map(([x])=>x));
    const minY = Math.min(...points.map(([,y])=>y));
    const maxY = Math.max(...points.map(([,y])=>y));
    const step = Math.min(400/Math.max(1,maxX-minX),190/Math.max(1,maxY-minY),48);
    const asPixel = ([x,y])=>[w/2+(x-(minX+maxX)/2)*step,h/2+5-(y-(minY+maxY)/2)*step];
    const graph = points.map(asPixel);
    const start = graph[0];
    const end = graph.at(-1);
    const double = drawing.legs.length > 1;
    if (drawing.reveal && double && Math.hypot(end[0]-start[0],end[1]-start[1]) > 14) {
      arrow(...start,...end,colors.second,[7,7]);
    }
    graph.slice(1).forEach(([x,y], index) => {
      const [px,py] = graph[index];
      const lane = y===py && index>0 && graph[index-1][1]===py ? 10 : 0;
      arrow(px,py+lane,x,y+lane,colors.path);
    });
    graph.slice(1).forEach(([x,y], index) => {
      const [px,py] = graph[index];
      const [dx,dy] = drawing.legs[index];
      const annotations = drawing.legs.length <= 2
        ? (Array.isArray(drawing.hideLeg) ? drawing.hideLeg.includes(index) : drawing.hideLeg === index) ? '?' : dy && dx ? Math.abs(dx) + ' + ' + Math.abs(dy) : islandNumber(Math.hypot(dx,dy))
        : String(index+1);
      const baseX = (px+x)/2 + (x===px ? 31 : 0);
      const baseY = (py+y)/2 + (py===y ? (index%2===0?-23:28) : 0);
      label(annotations,baseX,baseY);
    });
    if (drawing.reveal && double) {
      const value = drawing.unknown ? '?' : drawing.diagonal ?? islandNumber(Math.hypot(...points.at(-1)));
      label('Atajo ' + value,(start[0]+end[0])/2-27,(start[1]+end[1])/2-28,colors.second);
    }
    if (drawing.turn) label(drawing.turn + ' marcas',start[0]+76,start[1]-30,colors.second);
    label('Salida',start[0],start[1]+29);
    label('Llegada',end[0],end[1]+(end[1]>start[1]+14?29:-30));
    text('N ↑',592,32,colors.ink,20);
    text('E →',592,57,colors.ink,20);
    return;
  }

  function cartBox(x, y, mass, fill='#fff2cf') {
    tile(x-56,y-30,112,60,fill,colors.ink);
    text(mass + (mass===1?' bulto':' bultos'),x,y,colors.ink,19);
    for (const offset of [-32,32]) tile(x+offset-9,y+24,18,15,colors.ink);
  }

  if (drawing.type === 'forces' || drawing.type === 'lift') {
    const lift = drawing.type === 'lift';
    const baseline = 249;
    line(52,baseline,588,baseline,colors.ink,4);
    if (drawing.floor || lift) {
      tile(74,baseline+4,492,28,colors.soft);
      text(drawing.floor && !lift ? 'Suelo con agarre' : 'Plataforma',320,baseline+19,colors.ink,18);
    }
    if (lift) {
      cartBox(320,183,drawing.load);
      arrow(320,149,320,54,colors.path);
      label('↑ ' + drawing.floor + ' manos',430,73,colors.path);
      arrow(280,217,280,244,colors.second);
      label('↓ ' + drawing.down + ' manos',175,224,colors.second);
      return;
    }
    const leftX = drawing.rear ? 207 : 320;
    const rightX = drawing.rear ? 420 : 320;
    if (drawing.rear) {
      line(leftX+55,198,rightX-55,198,colors.ink,5,[5,4]);
      cartBox(leftX,195,drawing.rear,colors.soft);
    }
    cartBox(rightX,195,drawing.load);
    const effort = Math.max(1,...[drawing.left,drawing.right].filter(Number.isFinite));
    const span = value => value==='?' ? 76 : 78 + 46*value/effort;
    if (drawing.left) arrow(leftX,140,leftX-span(drawing.left),140,colors.second);
    if (drawing.right) arrow(rightX,140,rightX+span(drawing.right),140,colors.path);
    label('← ' + drawing.left + ' manos',leftX-90,103,colors.second);
    label(drawing.right + ' manos →',rightX+90,103,colors.path);
    return;
  }

  if (drawing.type === 'pulley') {
    line(55,206,470,206,colors.ink,5);
    line(470,206,470,322,colors.ink,5);
    cartBox(210,163,drawing.load);
    line(266,158,520,158,colors.ink,5,[5,4]);
    line(520,158,520,233,colors.ink,5,[5,4]);
    tile(504,144,32,32,colors.soft,colors.ink);
    tile(471,233,98,61,'#fff2cf',colors.ink);
    text(drawing.hanging + ' bultos',520,264,colors.ink,18);
    arrow(212,111,112,111,colors.second);
    label('Freno: ' + drawing.drag + ' manos',165,75,colors.second);
    label('Saco colgante',520,325);
    return;
  }

  const double = drawing.masses.length > 1;
  const tracks = [118,255];
  const moving = (mass, speed, x, y, htmlColor, bodyColor) => {
    cartBox(x,y,mass,bodyColor);
    if (typeof speed === 'number' && speed !== 0) {
      const width=48+7*Math.min(Math.abs(speed),10);
      arrow(x,y-48,x+Math.sign(speed)*width,y-48,htmlColor);
    }
    if (speed !== undefined) label('Ritmo ' + speed,x,y+52,htmlColor);
  };
  text('Antes',25,26,colors.ink,20,'left');
  line(25,182,615,182,colors.ink,2,[5,7]);
  moving(drawing.masses[0],drawing.speeds[0],double?176:244,tracks[0],colors.path,'#fff2cf');
  if (double) moving(drawing.masses[1],drawing.speeds[1],465,tracks[0],colors.second,colors.soft);
  if (drawing.after !== undefined || drawing.outward !== undefined) {
    text('Después',25,207,colors.ink,20,'left');
    const joined = double && drawing.outward === undefined;
    moving(joined?drawing.masses[0]+drawing.masses[1]:drawing.masses[0],drawing.after,
      drawing.outward===undefined?244:176,tracks[1],colors.path,'#fff2cf');
    if (drawing.outward !== undefined) moving(drawing.masses[1],drawing.outward,465,tracks[1],colors.second,colors.soft);
  } else {
    label('¿Qué pasa cuando se tocan?',320,258);
  }
}
