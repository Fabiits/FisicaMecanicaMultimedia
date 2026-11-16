const physicsPractice = {
  vectores: [
    {
      title:'Desplazamiento del dron', tag:'Magnitud',
      text:'Un dron se desplaza 120 m al este y luego 50 m al norte. ¿Cuál es la magnitud del desplazamiento total?',
      value:130, unit:'m', hint:'Los dos tramos son perpendiculares. El desplazamiento total es la hipotenusa.',
      steps:['Suma 120² + 50² = 16 900 m².', 'Calcula √16 900 = 130 m.']
    },
    {
      title:'Rumbo de la excursionista', tag:'Dirección',
      text:'Una excursionista queda a 80 m al este y a 60 m al norte de su punto de partida. ¿Qué ángulo forma su desplazamiento con el este, medido hacia el norte? Redondea a dos decimales.',
      value:36.86989765, unit:'°', hint:'Para el ángulo desde el este, el cateto opuesto es 60 m y el adyacente es 80 m.',
      steps:['Escribe tan θ = 60/80 = 0,75.', 'Aplica la arcotangente en grados. θ ≈ 36,87°.']
    },
    {
      title:'Componente horizontal de un cable', tag:'Componentes',
      text:'Un cable tira de un trineo con una fuerza de 80 N, a 30° por encima de la horizontal. ¿Cuánto vale la componente horizontal de esa fuerza? Redondea a dos decimales.',
      value:80*Math.cos(Math.PI/6), unit:'N', hint:'La componente horizontal es el lado adyacente al ángulo. Usa el coseno.',
      steps:['Proyecta la fuerza sobre el eje horizontal. Fₓ = 80 cos 30°.', 'Con la calculadora en grados, Fₓ ≈ 69,28 N.']
    },
    {
      title:'Suma de desplazamientos en el plano', tag:'Resultante',
      text:'Un robot realiza tres desplazamientos cuyas componentes (x, y) son (7, 4) m, (−2, 6) m y (1, −2) m. ¿Cuál es la magnitud del desplazamiento resultante?',
      value:10, unit:'m', hint:'Suma primero las componentes x entre sí y las y entre sí.',
      steps:['El desplazamiento resultante tiene componentes (7 − 2 + 1, 4 + 6 − 2) = (6, 8) m.', 'Su magnitud es √(6² + 8²) = 10 m.']
    }
  ],
  dinamica: [
    {
      title:'Carro de laboratorio', tag:'Segunda ley de Newton',
      text:'Un carro de 5 kg recibe una fuerza horizontal de 28 N hacia la derecha y otra de 8 N hacia la izquierda. ¿Cuál es su aceleración horizontal? Toma la derecha como positiva.',
      value:4, unit:'m/s²', hint:'Las fuerzas apuntan en sentidos opuestos. Calcula la fuerza neta y usa Fₙₑₜₐ = ma.',
      steps:['La fuerza neta horizontal es 28 − 8 = 20 N.', 'Divide por la masa. a = 20/5 = 4 m/s².']
    },
    {
      title:'Caja sobre un piso rugoso', tag:'Rozamiento cinético',
      text:'Una caja de 12 kg ya se desliza hacia la derecha. Una persona aplica una fuerza horizontal de 45 N hacia la derecha y el coeficiente de rozamiento cinético es 0,25. Usa g = 9,8 m/s². ¿Cuál es la aceleración hacia la derecha? Redondea a dos decimales.',
      value:1.3, unit:'m/s²', hint:'En este piso horizontal, la fuerza normal vale mg. El rozamiento se opone al deslizamiento.',
      steps:['Calcula el rozamiento cinético. f = 0,25 × 12 × 9,8 = 29,4 N.', 'La fuerza neta es 45 − 29,4 = 15,6 N. Divide por 12 kg para obtener 1,30 m/s².']
    },
    {
      title:'Báscula dentro del ascensor', tag:'Fuerza normal',
      text:'Una persona de 65 kg está sobre una báscula en un ascensor que acelera hacia arriba a 1,2 m/s². Usa g = 9,8 m/s². ¿Qué fuerza normal ejerce la báscula sobre la persona?',
      value:715, unit:'N', hint:'Dibuja la normal hacia arriba y el peso hacia abajo. La fuerza neta va hacia arriba.',
      steps:['Al tomar hacia arriba como positivo, N − mg = ma.', 'Despeja N = m(g + a) = 65(9,8 + 1,2) = 715 N.']
    },
    {
      title:'Bloque y masa colgante', tag:'Sistemas conectados',
      text:'Un bloque de 6 kg sobre una mesa sin rozamiento está unido por una cuerda inextensible a una masa colgante de 4 kg. La polea es ideal. Usa g = 9,8 m/s². ¿Cuál es la tensión en la cuerda? Redondea a dos decimales.',
      value:23.52, unit:'N', hint:'Encuentra primero la aceleración del sistema completo. Luego aplica la segunda ley al bloque de la mesa.',
      steps:['La fuerza que impulsa al conjunto es el peso de la masa colgante. a = 4 × 9,8/(6 + 4) = 3,92 m/s².', 'Sobre el bloque de la mesa, la tensión es la única fuerza horizontal. T = 6 × 3,92 = 23,52 N.']
    }
  ],
  colisiones: [
    {
      title:'Pelota que rebota en una pared', tag:'Impulso',
      text:'Una pelota de 0,20 kg llega a una pared con velocidad de +12 m/s y rebota con −8 m/s. ¿Cuál es el impulso neto recibido por la pelota? Incluye el signo.',
      value:-4, unit:'N·s', hint:'El impulso es el cambio de cantidad de movimiento. Conserva los signos de las velocidades.',
      steps:['Calcula Δv = vfinal − vinicial = −8 − 12 = −20 m/s.', 'J = mΔv = 0,20 × (−20) = −4 N·s.']
    },
    {
      title:'Choque entre dos carros acoplables', tag:'Choque inelástico',
      text:'En un riel con rozamiento despreciable, un carro de 3 kg se mueve con +4 m/s y otro de 2 kg se mueve con −1 m/s. Chocan y se quedan unidos. ¿Con qué velocidad se mueven después? Incluye el signo.',
      value:2, unit:'m/s', hint:'Conserva la cantidad de movimiento total. Después del choque, ambos carros tienen la misma velocidad.',
      steps:['La cantidad de movimiento inicial es 3 × 4 + 2 × (−1) = 10 kg·m/s.', 'Los carros unidos tienen 5 kg. v = 10/5 = +2 m/s.']
    },
    {
      title:'Esferas en un riel', tag:'Choque elástico',
      text:'En un choque elástico frontal, una esfera de 1 kg viaja con +6 m/s hacia una esfera de 2 kg en reposo. Después del choque, la primera esfera rebota con −2 m/s. ¿Cuál es la velocidad final de la segunda esfera?',
      value:4, unit:'m/s', hint:'Calcula la cantidad de movimiento de la primera esfera tras el choque. La diferencia hasta el total le corresponde a la segunda.',
      steps:['Al principio hay 6 kg·m/s de cantidad de movimiento. Al final se cumple 6 = 1 × (−2) + 2v₂.', 'Al despejar, 2v₂ = 8 y v₂ = +4 m/s. La energía cinética total también se conserva.']
    },
    {
      title:'Energía cinética en el acoplamiento', tag:'Energía',
      text:'Un carro de 2 kg se mueve a 6 m/s y choca contra otro de 4 kg inicialmente quieto. Después quedan unidos y el impulso externo es despreciable. ¿Cuánta energía cinética se pierde en el choque?',
      value:24, unit:'J', hint:'Halla la velocidad final con la conservación de la cantidad de movimiento. Luego compara las energías cinéticas.',
      steps:['La velocidad conjunta es (2 × 6)/6 = 2 m/s.', 'Antes hay ½ × 2 × 6² = 36 J. Después quedan ½ × 6 × 2² = 12 J. La disminución es 24 J.']
    }
  ]
};

const practiceArea = document.getElementById('ejercicios');
const practiceFilters = practiceArea.querySelectorAll('[data-practice-topic]');
const practiceList = document.getElementById('practice-list');
const practiceForm = document.getElementById('practice-form');
const practiceInput = document.getElementById('practice-answer');
const practiceFeedback = document.getElementById('practice-feedback');
const practiceSolution = document.getElementById('practice-solution');
const practiceHeading = document.getElementById('practice-title');
const practiceSteps = document.getElementById('practice-steps');
let practiceTopic = 'vectores';
let practiceIndex = 0;

function practiceKey(index) {
  return practiceTopic + '/' + index;
}

function refreshPracticeList() {
  const choices = physicsPractice[practiceTopic];
  practiceList.replaceChildren();
  choices.forEach(({title, tag}, index) => {
    const item = document.createElement('li');
    const button = document.createElement('button');
    const number = document.createElement('span');
    const name = document.createElement('span');
    const label = document.createElement('small');
    button.className = 'practice-choice';
    button.type = 'button';
    button.dataset.practiceIndex = index;
    button.setAttribute('aria-pressed', String(practiceIndex === index));
    number.className = 'practice-choice-number';
    const solved = profileData.read('practica:' + practiceKey(index)) === '1';
    number.textContent = solved ? '✓' : String(index + 1).padStart(2, '0');
    number.setAttribute('aria-hidden','true');
    name.textContent = title;
    label.textContent = tag + (solved ? ' · Resuelto' : '');
    name.append(label);
    button.append(number, name);
    item.append(button);
    practiceList.append(item);
  });
  const solvedCount = choices.filter((_, index) => profileData.read('practica:' + practiceKey(index)) === '1').length;
  document.getElementById('practice-count').textContent = solvedCount + ' de ' + choices.length + ' resueltos';
}

function showPractice(index, focus = false) {
  practiceIndex = index;
  const entry = physicsPractice[practiceTopic][index];
  practiceFilters.forEach(button => {
    button.setAttribute('aria-pressed', String(button.dataset.practiceTopic === practiceTopic));
  });
  refreshPracticeList();
  practiceHeading.textContent = entry.title;
  document.getElementById('practice-tag').textContent = entry.tag;
  document.getElementById('practice-text').textContent = entry.text;
  document.getElementById('practice-unit').textContent = entry.unit;
  document.getElementById('practice-answer-label').textContent = 'Respuesta (' + entry.unit + ')';
  practiceForm.reset();
  practiceInput.removeAttribute('aria-invalid');
  practiceFeedback.hidden = true;
  practiceFeedback.textContent = '';
  practiceSolution.open = false;
  practiceSteps.replaceChildren();
  entry.steps.forEach(step => {
    const item = document.createElement('li');
    item.textContent = step;
    practiceSteps.append(item);
  });
  if (focus) practiceHeading.focus();
}

practiceArea.addEventListener('click', event => {
  const button = event.target.closest('button');
  if (!button) return;
  if (button.dataset.practiceTopic) {
    practiceTopic = button.dataset.practiceTopic;
    showPractice(0);
  } else if (button.hasAttribute('data-practice-index')) {
    showPractice(Number(button.dataset.practiceIndex), true);
  }
});

function readPracticeNumber(raw, unit) {
  const normalise = text => text.toLowerCase().replace(/\s/g, '').replace(/\^2/g,'²').replace(/[⋅*]/g, '·').replace('−','-');
  let value = normalise(raw).replace(',', '.');
  const suffix = normalise(unit);
  if (value.endsWith(suffix)) value = value.slice(0, -suffix.length);
  return /^[+-]?(?:\d+(?:\.\d+)?|\.\d+)$/.test(value) ? Number(value) : NaN;
}

practiceForm.addEventListener('submit', event => {
  event.preventDefault();
  const entry = physicsPractice[practiceTopic][practiceIndex];
  const answer = readPracticeNumber(practiceInput.value, entry.unit);
  const correct = Math.abs(answer - entry.value) <= .005001;
  practiceFeedback.hidden = false;
  practiceFeedback.classList.toggle('practice-success', correct);
  if (correct) {
    profileData.write('practica:' + practiceKey(practiceIndex), '1');
    refreshPracticeList();
    practiceInput.removeAttribute('aria-invalid');
    practiceFeedback.textContent = '¡Correcto! Revisa el desarrollo para comparar tu procedimiento.';
    practiceSolution.open = true;
  } else {
    practiceInput.setAttribute('aria-invalid','true');
    practiceFeedback.textContent = Number.isFinite(answer)
      ? 'Pista · ' + entry.hint
      : 'Escribe un número en ' + entry.unit + '. Puedes usar coma o punto decimal.';
    practiceInput.focus();
  }
});

document.addEventListener('profilechange', () => { practiceTopic = 'vectores'; showPractice(0); });
showPractice(0);
