const $ = selector => document.querySelector(selector);
const modules = { vectores: 'Vectores', dinamica: 'Dinámica', colisiones: 'Colisiones' };
let currentModule = '';
let currentScreen = '';
let history = ['inicio'];

function show(id, focus = true) {
  document.querySelectorAll('.stage').forEach(screen => {
    screen.hidden = screen.id !== id;
  });
  const screen = document.getElementById(id);
  screen.className = 'stage' + (currentModule ? ' th-' + currentModule : '');
  currentScreen = id;
  document.querySelectorAll('.mod-name').forEach(label => {
    label.textContent = modules[currentModule] || modules.vectores;
  });
  if (id === 'inicio') renderHomeProfile();
  if (id === 'leccion') prepareLesson();
  if (id === 'ejercicio') prepareAttempt();
  if (id === 'niveles') renderMap();
  if (id === 'progreso') {
    renderProgress();
    renderJournal();
  }
  renderScore();
  window.scrollTo(0, 0);
  if (focus) screen.querySelector('h1:not([hidden] h1)')?.focus({ preventScroll: true });
}

function go(id) {
  if (history.at(-1) !== id) history.push(id);
  show(id);
}

document.addEventListener('click', event => {
  const control = event.target.closest('button');
  if (!control) return;
  if (control.dataset.module) {
    if (!profileData.active) return;
    currentModule = control.dataset.module;
    profileData.write('capitulo', currentModule);
    selectedLevel = nextLevel();
    go('niveles');
  } else if (control.dataset.go === 'inicio') {
    history = ['inicio'];
    currentModule = '';
    show('inicio');
  } else if (control.dataset.go === 'niveles' && ['resultado', 'ejercicio'].includes(currentScreen)) {
    if (currentScreen === 'resultado') selectedLevel = nextLevel();
    history = ['inicio', 'niveles'];
    show('niveles');
  } else if (control.dataset.go === 'ejercicio' && currentScreen === 'resultado') {
    history = ['inicio', 'niveles', 'leccion', 'ejercicio'];
    show('ejercicio');
  } else if (control === launch) {
    if (isUnlocked(selectedLevel)) {
      playingLevel = selectedLevel;
      go('leccion');
    }
  } else if (control.dataset.go) {
    go(control.dataset.go);
  } else if (control.hasAttribute('data-back')) {
    if (history.length > 1) history.pop();
    show(history.at(-1));
  } else if (control.matches('#goPractice')) {
    go('ejercicio');
  }
});

const worldWidth = 1000;
const worldHeight = 580;
const levels = [
  [155, 360, 1, 'Punto de partida'],
  [235, 314, 1, 'Cruce de los Sauces'],
  [187, 217, 2, 'Pradera del Viento'],
  [302, 232, 2, 'Mirador del Valle'],
  [408, 163, 2, 'Sendero del Sol'],
  [378, 330, 3, 'Loma de los Ecos'],
  [304, 411, 3, 'Jardín de Piedra'],
  [394, 473, 5, 'Cueva del Cristal'],
  [548, 214, 2, 'Puente de Ámbar'],
  [824, 138, 3, 'Observatorio'],
  [666, 282, 2, 'Colinas Violetas'],
  [819, 338, 3, 'Paso de la Cascada'],
  [693, 413, 2, 'Costa del Faro'],
  [843, 499, 3, 'Faro del Horizonte']
];
const routes = [[0,1], [1,2], [2,3], [3,4], [3,5], [4,8], [8,9], [8,10], [10,11], [11,12], [5,6], [6,7], [12,13]];
const nodes = $('#nodes');
const edges = $('#edges');
const token = $('.world-token');
const mapScroll = $('.map-scroll');
const launch = $('#world-launch');
const returnToStart = $('#world-return');
const directions = { ArrowLeft: [-1,0], ArrowRight: [1,0], ArrowUp: [0,-1], ArrowDown: [0,1] };
const lock = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 7V5a3 3 0 1 1 6 0v2"/><rect x="3" y="7" width="10" height="7" rx="2"/></svg>';
let selectedLevel = 0;

const levelButtons = levels.map(([x, y], index) => {
  const node = document.createElement('button');
  node.type = 'button';
  node.className = 'node';
  node.style.left = x / worldWidth * 100 + '%';
  node.style.top = y / worldHeight * 100 + '%';
  node.append(String(index + 1));
  node.insertAdjacentHTML('beforeend', '<span class="node-gate" aria-hidden="true"></span>');
  node.addEventListener('click', () => selectLevel(index));
  nodes.append(node);
  return node;
});

function renderMap() {
  renderChapter();
  const balance = moduleStars(currentModule);
  levelButtons.forEach((node, index) => {
    const open = balance >= unlockCosts[index];
    const done = hasObjective(currentModule, index, 'main');
    const status = done ? 'completado' : open ? 'disponible' : 'bloqueado';
    node.classList.toggle('open', open);
    node.classList.toggle('completed', done);
    node.setAttribute('aria-label', 'Nivel ' + (index + 1) + ': ' + makeProblem(currentModule,index).title + ', ' + status);
    const badge = node.querySelector('.node-gate');
    badge.hidden = open && !done;
    badge.innerHTML = done ? '✓' : open ? '' : lock;
  });
  edges.querySelectorAll('path').forEach(path => {
    path.classList.toggle('route-future', balance < unlockCosts[Number(path.dataset.to)]);
  });
  selectLevel(selectedLevel);
}

function selectLevel(index, focus = false) {
  const [x, y, stars, name] = levels[index];
  selectedLevel = index;
  levelButtons.forEach((node, position) => {
    node.tabIndex = position === index ? 0 : -1;
    node.setAttribute('aria-pressed', String(position === index));
  });
  token.style.left = x / worldWidth * 100 + '%';
  token.style.top = y / worldHeight * 100 + '%';
  const remaining = Math.max(0, unlockCosts[index] - moduleStars(currentModule));
  const earned = levelStars(currentModule, index);
  const done = hasObjective(currentModule, index, 'main');
  $('#world-status').textContent = 'Nivel ' + (index + 1) + (done ? ' · Completado' : remaining ? ' · Bloqueado' : ' · Disponible');
  const episode = makeProblem();
  $('#world-title').textContent = episode.title;
  $('#world-description').textContent = remaining
    ? 'Te faltan ' + starCount(remaining) + ' en este tema para abrirlo. Recompensa base: ' + stars + ' ★.'
    : name + ' · ' + (done ? earned + '/' + (stars + 3) + ' ★ encontradas' : 'Recompensa principal: ' + stars + ' ★');
  launch.textContent = done ? 'Rejugar nivel →' : 'Jugar nivel →';
  launch.hidden = remaining > 0;
  returnToStart.hidden = index === 0;

  const node = levelButtons[index];
  if (focus) node.focus({preventScroll: true});
  if (mapScroll.clientWidth) {
    const offset = node.offsetLeft - mapScroll.clientWidth / 2;
    mapScroll.scrollTo({left: Math.max(0, offset), behavior: 'auto'});
  }
}

nodes.addEventListener('keydown', event => {
  const direction = directions[event.key];
  if (!direction) return;
  event.preventDefault();
  const [x, y] = levels[selectedLevel];
  const [dx, dy] = direction;
  let best = -1;
  let alignment = 0.25;

  for (const [from, to] of routes) {
    const next = from === selectedLevel ? to : to === selectedLevel ? from : -1;
    if (next < 0) continue;
    const [nx, ny] = levels[next];
    const projection = (dx * (nx - x) + dy * (ny - y)) / Math.hypot(nx - x, ny - y);
    if (projection > alignment) {
      best = next;
      alignment = projection;
    }
  }
  if (best !== -1) selectLevel(best, true);
});

returnToStart.addEventListener('click', () => selectLevel(0, true));


for (const [from, to] of routes) {
  const [x1, y1] = levels[from];
  const [x2, y2] = levels[to];
  const horizontal = Math.abs(x2 - x1) > Math.abs(y2 - y1);
  const mx = Math.round((x1 + x2) / 2);
  const my = Math.round((y1 + y2) / 2);
  const curve = horizontal ? [mx, y1, mx, y2] : [x1, my, x2, my];
  const path = to === 13
    ? 'M693 413 Q701 466 755 476 T843 499'
    : 'M' + [x1, y1].join(' ') + ' C' + [...curve, x2, y2].join(' ');
  for (const style of ['route-outline', 'route-fill']) {
    const edge = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    edge.setAttribute('d', path);
    edge.setAttribute('class', style);
    edge.dataset.to = to;
    edges.append(edge);
  }
}


let playingLevel = 0;
let attempt;
let requirement = 0;
const unlockCosts = levels.map(([, , reward]) => {
  const current = requirement;
  requirement += reward;
  return current;
});
const objectives = [
  ['main', 'Pregunta principal', index => levels[index][2]],
  ['speed', 'Exploración opcional', () => 1],
  ['bonus', 'Reto adicional', () => 2]
];

function hasObjective(module, index, objective) {
  return profileData.readObjective(module + ':' + index + ':' + objective) === '1';
}

function grantObjective(name) {
  const {module, index} = attempt;
  if (!profileData.active || hasObjective(module, index, name)) return;
  profileData.write('objetivo:' + module + ':' + index + ':' + name, '1');
  attempt.earned += objectives.find(([id]) => id === name)[2](index);
}

function levelStars(module, index) {
  return objectives.reduce((total, [name, , value]) => total + (hasObjective(module, index, name) ? value(index) : 0), 0);
}
function moduleStars(module) {
  return levels.reduce((total, _, index) => total + levelStars(module, index), 0);
}
function starCount(count) {
  return count + (count === 1 ? ' estrella' : ' estrellas');
}
function isUnlocked(index) {
  return moduleStars(currentModule) >= unlockCosts[index];
}
function nextLevel() {
  const balance = moduleStars(currentModule);
  const next = levels.findIndex((_, index) => balance >= unlockCosts[index] && !hasObjective(currentModule, index, 'main'));
  return next < 0 ? levels.length - 1 : next;
}

function renderScore() {
  if (!currentModule) return;
  const count = moduleStars(currentModule);
  document.querySelectorAll('.module-score').forEach(element => element.textContent = '★ ' + starCount(count));
  document.querySelectorAll('.level-number').forEach(element => element.textContent = 'Nivel ' + (playingLevel + 1));
}

function renderChapter() {
  const chapter = adventureChapters[currentModule];
  $('#map-chapter-number').textContent = 'Capítulo ' + chapter.number;
  $('#map-chapter-title').textContent = chapter.title;
  $('#map-chapter-story').textContent = chapter.hook;
  $('#map-chapter-opening').textContent = chapter.opening;
  $('.chapter-details').open = false;
  const relic = $('#map-chapter-relic');
  relic.hidden = !hasObjective(currentModule, levels.length-1, 'main');
  relic.textContent = chapter.ending;
}

function renderJournal() {
  const journal = $('#campaign-relics');
  journal.replaceChildren();
  let found = 0;
  for (const [module, chapter] of Object.entries(adventureChapters)) {
    const earned = hasObjective(module, levels.length-1, 'main');
    found += Number(earned);
    const entry = document.createElement('li');
    entry.textContent = chapter.title + ' · ' + (earned ? 'Vela ya tiene ' + chapter.relic + '.' : 'Falta encontrar ' + chapter.relic + '.');
    journal.append(entry);
  }
  $('#campaign-ending').hidden = found < Object.keys(adventureChapters).length;
}

function renderGlossary(id, keys) {
  const glossary = document.getElementById(id);
  glossary.replaceChildren();
  for (const key of keys) {
    const [name, meaning] = islandGlossary[key];
    const term = document.createElement('dt');
    term.textContent = name;
    const definition = document.createElement('dd');
    definition.textContent = meaning;
    glossary.append(term, definition);
  }
}

function missionPlace() {
  return 'Capítulo ' + adventureChapters[currentModule].number + ' · Parada ' + (playingLevel + 1) + ' · ' + levels[playingLevel][3];
}

function prepareLesson() {
  const problem = makeProblem(currentModule, playingLevel);
  $('#lesson-place').textContent = missionPlace();
  $('#mission-title').textContent = problem.title;
  $('#mission-brief').textContent = problem.story;
  $('#lesson-example').textContent = problem.example;
  $('#leccion .crumb').textContent = adventureChapters[currentModule].title;
  const list = $('#lesson-steps');
  list.replaceChildren();
  for (const step of problem.lesson) {
    const item = document.createElement('li');
    item.textContent = step;
    list.append(item);
  }
  renderGlossary('lesson-glossary', problem.keys);
  drawIslandGraph($('#lesson-graph'), problem.exampleFigure, currentModule);
}

const form = $('#challenge-form');
const mainInput = $('#ans1');
// Keep the old speed objective key so previously earned stars still count.
const sideFields = [
  {key: 'scout', goal: 'speed', input: $('#ans-scout'), panel: $('#scout-quest')},
  {key: 'bonus', goal: 'bonus', input: $('#ans2'), panel: $('#bonus-quest')}
];
const skipBonus = $('#skip-bonus');

function prepareAttempt() {
  const problem = makeProblem(currentModule, playingLevel);
  attempt = {problem, module: currentModule, index: playingLevel, earned: 0, before: moduleStars(currentModule)};
  $('#challenge-place').textContent = missionPlace();
  $('#challenge-title').textContent = problem.title;
  $('#challenge-story').textContent = problem.story;
  $('#challenge-situation').textContent = problem.data;
  $('#challenge-question').textContent = problem.main.prompt;
  $('#base-reward').textContent = '+' + levels[playingLevel][2] + ' ★';
  $('#challenge-caption').textContent = {
    route: 'Croquis de Vela. Las flechas siguen el orden del recorrido.',
    forces: 'Las flechas muestran quién tira de cada lado.',
    lift: 'El piso sostiene la carga desde abajo.',
    pulley: 'La cuerda enlaza el carro del piso con el saco que cuelga.',
    impact: 'Sigue las flechas para ver hacia dónde viaja cada carro.'
  }[problem.figure.type];
  form.reset();
  clearFeedback(mainInput);
  for (const {key,input,panel} of sideFields) {
    $('#' + key + '-title').textContent = problem[key+'Title'];
    $('#' + key + '-question').textContent = problem[key].prompt;
    panel.open = false;
    clearFeedback(input);
  }
  $('#challenge-glossary').closest('details').open = false;
  skipBonus.hidden = true;
  $('#finish').textContent = 'Comprobar respuestas →';
  renderGlossary('challenge-glossary', problem.keys);
  drawIslandGraph($('#challenge-graph'), problem.figure, currentModule);
}

function parseAnswer(raw) {
  const value = raw.trim().replace(/^−/,'-').replace(',','.');
  if (!/^[+-]?(?:\d+(?:\.\d+)?|\.\d+)$/.test(value)) return NaN;
  return Number(value);
}

function checkAnswer(input, answer) {
  return Math.abs(parseAnswer(input.value) - answer.answer) <= .005001;
}

function clearFeedback(input) {
  const feedback = $('#' + input.id + '-feedback');
  input.removeAttribute('aria-invalid');
  feedback.textContent = '';
  feedback.hidden = true;
}

function showFeedback(input, headline, hint) {
  const feedback = $('#' + input.id + '-feedback');
  const title = document.createElement('strong');
  title.textContent = headline;
  feedback.replaceChildren(title, hint || '');
  feedback.hidden = false;
  input.setAttribute('aria-invalid', 'true');
}

function finishAttempt(skip = false) {
  const {problem} = attempt;
  if (!checkAnswer(mainInput, problem.main)) {
    const validNumber = Number.isFinite(parseAnswer(mainInput.value));
    showFeedback(mainInput, validNumber ? 'Prueba otra vez' : 'Escribe solo el número de tu respuesta.',
      mainInput.value.trim() ? problem.main.hint : '');
    mainInput.focus();
    return;
  }
  clearFeedback(mainInput);
  grantObjective('main');

  let firstMiss = null;
  if (!skip) {
    for (const {key,goal,input,panel} of sideFields) {
      clearFeedback(input);
      if (!input.value.trim()) continue;
      if (checkAnswer(input, problem[key])) {
        grantObjective(goal);
      } else {
        panel.open = true;
        showFeedback(input, 'La misión principal ya está resuelta. Puedes seguir buscando esta pista.', problem[key].hint);
        firstMiss ??= input;
      }
    }
  }
  if (firstMiss) {
    skipBonus.hidden = false;
    $('#finish').textContent = 'Comprobar otra vez →';
    firstMiss.focus();
    return;
  }
  renderResult();
  go('resultado');
}
form.addEventListener('submit', event => {
  event.preventDefault();
  finishAttempt();
});
skipBonus.addEventListener('click', () => finishAttempt(true));


function renderResult() {
  const {index, module, earned, before, problem} = attempt;
  const total = moduleStars(module);
  const unlocked = unlockCosts.filter(cost => cost > before && cost <= total).length;
  $('#result-earned').textContent = earned ? '+' + starCount(earned) + ' ★' : 'Nivel resuelto ✓';
  $('#result-summary').textContent = 'Tienes ' + starCount(total) + ' en ' + modules[module] + '.' +
    (unlocked ? ' Abriste ' + (unlocked === 1 ? '1 nivel nuevo.' : unlocked + ' niveles nuevos.') :
      earned ? '' : ' Ya habías obtenido las recompensas de los objetivos que completaste en este intento.') +
    (profileData.persistent ? '' : ' Este navegador solo pudo guardar el avance durante la sesión.');
  $('#result-story').textContent = problem.ending;
  $('#result-equation').textContent = 'La cuenta de Vela · ' + problem.main.solution;
  const list = $('#result-objectives');
  list.replaceChildren();
  for (const [name, label, value] of objectives) {
    const complete = hasObjective(module, index, name);
    const row = document.createElement('li');
    row.dataset.status = complete ? 'done' : 'open';
    const text = document.createElement('span');
    const objectiveTitle = name === 'speed' ? problem.scoutTitle : name === 'bonus' ? problem.bonusTitle : label;
    text.textContent = (complete ? '✓ ' : '○ ') + objectiveTitle;
    const points = document.createElement('b');
    points.textContent = complete ? value(index) + ' ★ obtenidas' : '+' + value(index) + ' ★';
    row.append(text, points);
    list.append(row);
  }
}

function renderProgress() {
  const breakdown = $('#progress-breakdown');
  breakdown.replaceChildren();
  let allStars = 0;
  let studied = 0;
  let completed = 0;
  for (const [module, label] of Object.entries(modules)) {
    const stars = moduleStars(module);
    const count = levels.filter((_, index) => hasObjective(module, index, 'main')).length;
    const open = unlockCosts.filter(cost => stars >= cost).length;
    allStars += stars;
    studied += Number(count > 0);
    completed += count;
    const panel = document.createElement('article');
    panel.className = 'panel progress';
    const heading = document.createElement('h2');
    heading.textContent = label;
    const status = document.createElement('p');
    status.textContent = count + '/' + levels.length + ' completados · ' + open + ' disponibles en total · ' + stars + ' ★';
    const progress = document.createElement('progress');
    progress.max = levels.length;
    progress.value = count;
    progress.setAttribute('aria-label', 'Niveles completados en ' + label);
    panel.append(heading, status, progress);
    breakdown.append(panel);
  }
  $('#progress-stars').textContent = allStars + ' ★';
  $('#progress-modules').textContent = studied + ' / ' + Object.keys(modules).length;
  $('#progress-levels').textContent = completed;
  $('#progress-save-note').textContent = profileData.persistent ? 'Partida de ' + profileData.active.name + ' · Guardada en este navegador.' : 'El avance se conserva durante esta sesión.';
}

window.addEventListener('storage', event => {
  if (!profileData.active || !profileData.observes(event.key)) return;
  if (currentScreen === 'inicio') renderHomeProfile();
  if (currentScreen === 'niveles') renderMap();
  if (currentScreen === 'progreso') {
    renderProgress();
    renderJournal();
  }
  renderScore();
});



renderGlossary('full-glossary', Object.keys(islandGlossary));
function renderHomeProfile() {
  const profile = profileData.active;
  const resume = $('#home-resume');
  document.querySelectorAll('.profile-trigger').forEach(button => {
    button.textContent = profile ? profile.name : 'Mi perfil';
    button.setAttribute('aria-label', profile ? 'Cambiar perfil. Jugador: ' + profile.name : 'Elegir perfil');
  });
  $('#home-profile-title').textContent = profile ? 'Partida de ' + profile.name : 'Tu partida';
  if (!profile) {
    resume.hidden = true;
    $('#home-profile-detail').textContent = '';
    return;
  }
  const count = Object.keys(modules).reduce((total, module) => total + moduleStars(module), 0);
  const chapter = profileData.read('capitulo');
  const hasChapter = Object.hasOwn(modules, chapter);
  $('#home-profile-detail').textContent = '★ ' + starCount(count) + (hasChapter ? ' · ' + modules[chapter] : ' · La aventura está por comenzar');
  resume.hidden = !hasChapter;
  if (hasChapter) resume.dataset.module = chapter;
}

setupProfiles(() => {
  currentModule = '';
  history = ['inicio'];
  show('inicio', Boolean(profileData.active));
  document.dispatchEvent(new Event('profilechange'));
});
