const adventureChapters = {
  vectores: {
    hook: 'Lina dejó una pista antes de que la niebla apagara el faro. Ayuda a Vela a seguirla.',
    title: 'El mapa bajo la niebla', number: 'I', relic: 'la aguja de la brújula',
    opening: 'Una noche, la niebla apaga el Faro del Horizonte. Lina, su guardiana, alcanza a enviar un mensaje. Vela, una pequeña flecha que reparte cartas por las islas, sale a buscarla. Una vieja brújula sin aguja es todo lo que lleva para orientarse.',
    ending: 'El farero de la costa entrega a Vela la aguja. Ya puede encontrar el dique, donde alguien sigue enviando señales a pesar de la niebla.'
  },
  dinamica: {
    hook: 'El dique bloquea el camino al faro. Boro necesita ayuda para ponerlo en marcha.',
    title: 'El dique de los ciervos', number: 'II', relic: 'la manivela del dique',
    opening: 'Al otro lado del canal, el dique se atascó y cortó el paso al faro. Boro, el tejón del taller, cree que puede abrirlo con la ayuda de Vela. Primero tendrán que averiguar qué empuja, qué frena y qué se obstina en quedarse quieto.',
    ending: 'Boro suelta la manivela del dique y el agua vuelve a correr. En la orilla queda una nota de Lina. La campana de rescate está al otro lado del puerto.'
  },
  colisiones: {
    hook: 'La campana de rescate está al otro lado del puerto. Vela y Nima deben llevarla hasta la última boya.',
    title: 'El puerto de los ecos', number: 'III', relic: 'la campana de rescate',
    opening: 'Los vagones del puerto se cruzan entre la niebla. Nima, la nutria que custodia la campana, le enseña a Vela a predecir qué harán al tocarse. Si logran llevar la campana a la última boya, Lina podrá guiarlos desde el faro.',
    ending: 'La campana suena tres veces. Lina contesta con su linterna y abre la puerta del faro desde dentro.'
  }
};

const islandGlossary = {
  paso: ['Pasos de manzana', 'Distancias o componentes en metros (m). Cada paso equivale a 1 m.'],
  huella: ['Huella', 'Desplazamiento. Es el cambio de posición desde la salida hasta la llegada, con dirección y sentido.'],
  tramo: ['Tramos', 'Componentes cartesianas de un vector. Se suman por eje.'],
  giro: ['Marcas de giro', 'Medida angular en grados (°). Una vuelta completa tiene 360°. En una calculadora, selecciona el modo DEG para obtener grados.'],
  avance: ['Ritmo', 'Velocidad, en metros por segundo (m/s). El signo indica el sentido.'],
  bulto: ['Bultos', 'Masa en kilogramos (kg). Un bulto equivale a 1 kg.'],
  mano: ['Manos de ayuda', 'Fuerza en newtons (N). Al combinar fuerzas opuestas se restan.'],
  chispa: ['Chispas de arranque', 'Aceleración en metros por segundo al cuadrado (m/s²). La fuerza neta dividida por la masa da la aceleración.'],
  agarre: ['Agarre del suelo', 'Rozamiento. La fuerza de rozamiento cinético es el coeficiente de rozamiento multiplicado por la fuerza normal.'],
  piso: ['Apoyo del piso', 'Fuerza normal. En un piso horizontal sin aceleración vertical ni otras fuerzas verticales, vale mg.'],
  tiron: ['Tirón hacia abajo', 'Peso. Es la fuerza de gravedad, mg. En estas misiones se aproxima g a 10 m/s².'],
  pareja: ['Tirones gemelos', 'Tercera ley de Newton. Dos cuerpos se ejercen fuerzas iguales y opuestas entre sí.'],
  empuje: ['Empuje de viaje', 'Cantidad de movimiento, masa por velocidad (kg·m/s). El signo indica el sentido.'],
  cambio: ['Cambio de empuje', 'Impulso neto, igual a la cantidad de movimiento final menos la inicial (N·s).'],
  latido: ['Latidos', 'Tiempo en segundos (s). Aquí cada latido dura un segundo.'],
  juntos: ['Viajar pegados', 'Choque perfectamente inelástico. Los cuerpos comparten velocidad final. Si el impulso externo es despreciable, la cantidad de movimiento total se conserva.'],
  brillo: ['Brillo de carrera', 'Energía cinética en julios (J). Para cada cuerpo se calcula como la mitad de la masa por el cuadrado de la rapidez.'],
  rebote: ['Rebote limpio', 'Choque elástico. Se conservan la cantidad de movimiento total y la energía cinética total.'],
  flotante: ['Piso que sube', 'En un ascensor que acelera hacia arriba, la fuerza normal es m(g + a).']
};

const formatIsland = new Intl.NumberFormat('es-CO', {maximumFractionDigits: 2, useGrouping: false});
const islandNumber = value => formatIsland.format(Math.abs(value) < 1e-10 ? 0 : value);
const reply = (prompt, answer, hint, solution, precise = false) => ({
  prompt: prompt + (precise ? ' Si sale con coma, escribe hasta dos cifras después de ella.' : ''),
  answer, hint, solution
});
const directionsText = (x, y) => [
  x && Math.abs(x) + (x > 0 ? ' al este' : ' al oeste'),
  y && Math.abs(y) + (y > 0 ? ' al norte' : ' al sur')
].filter(Boolean).join(' y ') || '0, se queda donde empezó';
const signedRoute = points => points.map(([x, y]) => directionsText(x, y)).join('; luego ');
const arrowAngle = (x, y) => Math.atan2(y, x) * 180 / Math.PI;
const angleOf = (x, y) => Math.atan2(Math.abs(y), Math.abs(x)) * 180 / Math.PI;

function corner(east, north, worked = [8, 6]) {
  const [a, b] = worked;
  const length = Math.hypot(east, north);
  const turn = arrowAngle(east, north);
  return {
    keys: ['paso', 'huella', 'giro'],
    lesson: [
      'Dibuja los dos tramos, uno hacia cada lado del mapa. El atajo es la línea que une el punto de salida con el de llegada.',
      'Multiplica cada tramo por sí mismo y junta ambos resultados. Busca qué número, multiplicado por sí mismo, da ese total.'
    ],
    example: a + ' × ' + a + ' + ' + b + ' × ' + b + ' = ' + (a*a+b*b) + '. El atajo mide ' + islandNumber(Math.hypot(a,b)) + ' pasos de manzana.',
    exampleFigure: {type: 'route', legs: [[a,0],[0,b]], reveal: true},
    figure: {type: 'route', legs: [[east,0],[0,north]], reveal: true, unknown: true},
    data: 'Desde la salida, Vela recorre ' + east + ' pasos de manzana al este y ' + north + ' al norte.',
    main: reply('¿Cuántos pasos de manzana mide el atajo?', length, 'Multiplica cada tramo por sí mismo, suma y busca qué número multiplicado por sí mismo da ese total.', '√(' + east + ' × ' + east + ' + ' + north + ' × ' + north + ') = ' + islandNumber(length)),
    scout: reply('¿Cuántos pasos de manzana suman los dos tramos marcados del camino?', east + north, 'Junta los dos tramos del camino.', east + ' + ' + north + ' = ' + (east+north)),
    bonus: reply('Desde el este, ¿cuántas marcas de giro hacia el norte tiene el atajo?', turn, 'Divide el tramo norte entre el tramo este. En tu calculadora, toca atan o tan⁻¹ con el ajuste que sugiere «Marcas de giro» en el glosario.', 'atan(' + north + ' ÷ ' + east + ') = ' + islandNumber(turn), true)
  };
}

function trail(legs, axis = 0, challenge = 'land') {
  const x = legs.reduce((sum, [dx]) => sum + dx, 0);
  const y = legs.reduce((sum, [,dy]) => sum + dy, 0);
  const flat = legs.reduce((sum, step) => sum + Math.abs(step[axis]), 0);
  const axisName = axis ? 'norte o sur' : 'este u oeste';
  const opposite = axis ? 'este u oeste' : 'norte o sur';
  const axisSign = axis ? 'norte como positivo' : 'este como positivo';
  const side = [x, y][axis];
  const other = [y, x][axis];
  const sideWork = legs.map(step => step[axis]).join(' + ');
  const otherWork = legs.map(step => step[1-axis]).join(' + ');
  const length = Math.hypot(x, y);
  const noTurn = x === 0 || y === 0;
  const exampleEast = Math.max(3,Math.abs(legs[0][0]));
  const exampleWest = exampleEast - 2;
  const exampleNorth = challenge === 'reach' ? 3 : Math.max(1,Math.abs(legs[1][1]));
  const sampleRoute = [[exampleEast,0],[-exampleWest,0],[0,exampleNorth]];
  const goal = challenge === 'reach'
    ? reply('¿Cuántos pasos de manzana mide el atajo desde la salida hasta el último punto?', length, 'Junta los pasos de este y oeste por un lado y los de norte y sur por el otro. Luego usa la regla del atajo en esquina.', '√(' + Math.abs(x) + ' × ' + Math.abs(x) + ' + ' + Math.abs(y) + ' × ' + Math.abs(y) + ') ≈ ' + islandNumber(length), true)
    : reply('¿Cuántos pasos de manzana quedó hacia ' + axisName + '? Usa el ' + axisSign + '.', side, 'Los pasos hacia el ' + (axis ? 'sur' : 'oeste') + ' se restan. Aquí importan solo los pasos de ese lado del mapa.', sideWork + ' = ' + side);
  const scout = challenge === 'reach'
    ? reply('¿Cuántos pasos de manzana hacia ' + axisName + ' separan la salida de la llegada? Usa el ' + axisSign + '.', side, 'Junta los pasos de ese lado del mapa, contando los regresos con un menos.', sideWork + ' = ' + side)
    : reply('¿Cuántos pasos de manzana recorrió en el lado ' + axisName + ' en total, contando las idas y las vueltas?', flat, 'Cuenta todos los pasos, incluso los de regreso.', legs.map(step => Math.abs(step[axis])).join(' + ') + ' = ' + flat);
  const bonus = challenge === 'reach' && !noTurn
    ? reply('¿Cuántas marcas hay que girar desde el ' + (x > 0 ? 'este' : 'oeste') + ' hacia el ' + (y > 0 ? 'norte' : 'sur') + ' para mirar al último punto?', angleOf(x, y), 'Divide lo que avanzaste hacia el norte o sur entre lo que avanzaste hacia el este u oeste, sin signos. Después usa atan con el ajuste que sugiere «Marcas de giro» en el glosario.', 'atan(' + Math.abs(y) + ' ÷ ' + Math.abs(x) + ') ≈ ' + islandNumber(angleOf(x,y)), true)
    : reply('¿Qué número deshace lo que avanzó hacia ' + opposite + '? Usa el ' + (axis ? 'este' : 'norte') + ' como positivo.', -other, 'Haz la cuenta de ese lado del mapa y cambia el signo para desandar esos pasos.', '−(' + otherWork + ') = ' + (-other));
  return {
    keys: ['paso', 'huella', 'tramo', ...(challenge === 'reach' && !noTurn ? ['giro'] : [])],
    lesson: ['En el mapa, el este y el norte cuentan a favor. El oeste y el sur llevan un menos.', 'Junta primero los pasos de derecha e izquierda y después los de arriba y abajo. Los regresos pueden borrar parte de lo que adelantaste.',
      ...(challenge === 'reach' ? ['Usa esas dos cuentas como los lados de una esquina. El atajo entre salida y llegada cruza por dentro.'] : [])],
    example: exampleEast + ' al este, ' + exampleWest + ' al oeste y ' + exampleNorth + ' al norte dejan la llegada 2 al este y ' + exampleNorth + ' al norte.' +
      (challenge === 'reach' ? ' El atajo mide √(2 × 2 + 3 × 3), cerca de 3,61 pasos de manzana.' : ' Para deshacer lo que ganó hacia el norte, toca bajar ' + exampleNorth + '.'),
    exampleFigure: {type: 'route', legs: sampleRoute, reveal: challenge === 'reach'},
    figure: {type: 'route', legs, reveal: false},
    data: 'El recorrido, en pasos de manzana, va ' + signedRoute(legs) + '.',
    main: goal, scout, bonus
  };
}

function missingLeg(distance, known, northIsMissing = true) {
  const other = Math.sqrt(distance*distance-known*known);
  const direction = northIsMissing ? 'norte' : 'este';
  return {
    keys: ['paso', 'huella', 'tramo'],
    lesson: ['Si ya sabes el atajo y un lado de la esquina, multiplica cada uno por sí mismo.', 'Quita el resultado del lado conocido al resultado del atajo. Busca qué número multiplicado por sí mismo da lo que queda.'],
    example: 'Con un atajo de 10 y un lado de 6: 10 × 10 − 6 × 6 = 64. El otro lado tiene 8 pasos de manzana.',
    exampleFigure: {type:'route', legs:[[6,0],[0,8]], reveal:true},
    figure: {type:'route', legs:[[northIsMissing?known:other,0],[0,northIsMissing?other:known]], reveal:true, diagonal: distance, hideLeg: northIsMissing?1:0},
    data: 'La cuerda del atajo mide ' + distance + ' pasos de manzana. El tramo hacia el ' + (northIsMissing?'este':'norte') + ' mide ' + known + '. Los tramos forman una esquina.',
    main: reply('¿Cuántos pasos de manzana lleva el tramo hacia el ' + direction + '?', other, 'Multiplica el atajo por sí mismo, resta el lado conocido multiplicado por sí mismo y busca la raíz.', '√(' + distance + ' × ' + distance + ' − ' + known + ' × ' + known + ') = ' + islandNumber(other)),
    scout: reply('¿Cuánto más larga es la cuerda del atajo que el tramo conocido?', distance-known, 'Quítale el tramo conocido a la cuerda.', distance + ' − ' + known + ' = ' + (distance-known)),
    bonus: reply('Si haces dos veces la ruta doblada por ambos lados de la esquina, ¿cuántos pasos de manzana recorrerás?', (known+other)*2, 'Primero suma los dos lados, y después duplica esa suma.', '2 × (' + known + ' + ' + islandNumber(other) + ') = ' + islandNumber((known+other)*2))
  };
}

function cart(mass, push, pull, target = 'start', wanted = 0) {
  const net = push - pull;
  const start = net / mass;
  const needed = mass * wanted + pull;
  const main = target === 'pull'
    ? reply('¿Cuántas manos de ayuda hacia adelante hacen falta para conseguir ' + wanted + ' chispas de arranque?', needed, 'Multiplica los bultos por las chispas deseadas. Suma las manos que frenan.', mass + ' × ' + wanted + ' + ' + pull + ' = ' + needed)
    : reply('¿Cuántas chispas de arranque tendrá el carro? Si se anima hacia atrás, usa un menos.', start, 'Quita la ayuda hacia atrás de la ayuda hacia adelante. Reparte lo que queda entre los bultos.', '(' + push + ' − ' + pull + ') ÷ ' + mass + ' = ' + islandNumber(start), true);
  return {
    keys:['bulto','mano','chispa'],
    lesson: ['Las manos que tiran hacia adelante se contrarrestan con las que van hacia atrás.', 'Si repartes la ayuda que sobra entre más bultos, a cada bulto le toca menos y cuesta más cambiar el ritmo.',
      ...(target === 'pull' ? ['Para encontrar cuánta ayuda pedir, haz la cuenta al revés. Decide cuántas chispas quiere cada bulto y añade la ayuda que se pierde hacia atrás.'] : [])],
    example:'Un carro de 2 bultos recibe 8 manos hacia adelante y 2 hacia atrás. Quedan 6 manos útiles. Son 3 chispas por cada bulto.',
    exampleFigure:{type:'forces', left:2, right:8, load:2},
    figure:{type:'forces', left:pull, right:target==='pull'?'?':push, load:mass},
    data:'El carro lleva ' + mass + ' bultos en total. Desde atrás lo frenan con ' + pull + ' manos de ayuda.' +
      (target==='pull'?' Aún puedes pedir manos hacia adelante.':' Desde delante lo ayudan con ' + push + ' manos.'),
    main,
    scout: target==='pull'
      ? reply('¿Cuántas manos útiles necesitaría el carro si nadie tirara hacia atrás?', mass*wanted, 'Multiplica las chispas que quieres por los bultos.', mass+' × '+wanted+' = '+mass*wanted)
      : reply('¿Cuántas manos quedan después de enfrentar las que tiran de lados opuestos? Usa un menos si ganan las de atrás.', net, 'Resta las manos de atrás a las de delante.',push+' − '+pull+' = '+net),
    bonus: target==='pull'
      ? reply('Si agregan 2 bultos y quieren las mismas chispas, ¿cuántas manos de ayuda hacia adelante necesitarían?', (mass+2)*wanted+pull, 'Añade dos bultos antes de hacer la cuenta; el freno no cambia.', '('+mass+' + 2) × '+wanted+' + '+pull+' = '+((mass+2)*wanted+pull))
      : reply('Si duplican la carga sin cambiar ninguna de las manos, ¿cuántas chispas tendrá el carro?',start/2,'La misma ayuda se reparte entre el doble de bultos.','('+push+' − '+pull+') ÷ '+(2*mass)+' = '+islandNumber(start/2),true)
  };
}

function floorGrip(mass, push, grip, goal = 'start', extra = 0) {
  const down = mass * 10;
  const drag = down * grip;
  const net = push-drag;
  const result = net/mass;
  const need = drag + mass*extra;
  const askPush = goal==='push';
  return {
    keys:['bulto','mano','chispa','agarre','piso','tiron'],
    lesson:['Cada bulto tira hacia abajo con 10 manos. El suelo devuelve la misma ayuda hacia arriba si nada empuja el carro hacia arriba o abajo.', 'Multiplica ese apoyo por el agarre del suelo. Así sabes qué parte de tu ayuda se pierde mientras el carro se desliza.',
      askPush ? 'La ayuda que pidas debe cubrir lo que se pierde en el suelo y dejar lo que necesita toda la carga.' : 'Quita ese freno de tu ayuda y reparte lo que queda entre la carga. Si queda un número negativo, el carro va perdiendo ritmo.'],
    example:'Con 4 bultos y un agarre de 0,25, el suelo frena con 4 × 10 × 0,25 = 10 manos. Si tiras con 18, quedan 8; la carga gana 2 chispas.',
    exampleFigure:{type:'forces', left:10, right:18, load:4, floor:true},
    figure:{type:'forces',left:'?',right:askPush?'?':push,load:mass,floor:true},
    data:'El carro ya se desliza hacia adelante por un piso plano. Lleva ' + mass + ' bultos y el suelo tiene un agarre de ' + islandNumber(grip) + '.' +
      (askPush?' Quieres que gane '+extra+' chispas de arranque.':' Tira de él con '+push+' manos de ayuda hacia adelante.'),
    main:askPush
      ? reply('¿Cuántas manos de ayuda hacia adelante hay que pedir?',need,'Junta el freno del suelo con lo que necesitan todos los bultos para ganar las chispas pedidas.',mass+' × 10 × '+islandNumber(grip)+' + '+mass+' × '+extra+' = '+islandNumber(need))
      : reply('¿Cuántas chispas de arranque quedan? Si el carro pierde ritmo, usa un menos.',result,'Encuentra el freno del suelo multiplicando los bultos por 10 y por el agarre. Réstalo a tu ayuda y reparte entre los bultos.', '('+push+' − '+islandNumber(drag)+') ÷ '+mass+' = '+islandNumber(result),true),
    scout:reply('¿Cuántas manos de ayuda hacia atrás se lleva el agarre del suelo?',drag,'Multiplica los bultos por 10 y luego por el agarre.',mass+' × 10 × '+islandNumber(grip)+' = '+islandNumber(drag),true),
    bonus:reply('Si el agarre se reduce a la mitad y mantienes ' + islandNumber(askPush?need:push) + ' manos hacia adelante, ¿cuántas chispas quedarán?',((askPush?need:push)-drag/2)/mass,'Vuelve a repartir la ayuda útil. Esta vez el suelo frena solo la mitad.', '('+islandNumber(askPush?need:push)+' − '+islandNumber(drag/2)+') ÷ '+mass+' = '+islandNumber(((askPush?need:push)-drag/2)/mass),true)
  };
}

function tandem(front, rear, push, resistance = 0) {
  const start = (push-resistance)/(front+rear);
  const link = rear*start+resistance;
  return {
    keys:['bulto','mano','chispa','pareja'],
    lesson:['Para mover los dos carros juntos, primero cuenta todos los bultos. El freno del segundo carro se opone a la ayuda del primero.', 'La cuerda tira del carro de atrás. Tiene que darle su parte de la ayuda y vencer cualquier freno que actúe sobre él.', 'La cuerda tira de cada carro con la misma fuerza hacia lados opuestos.'],
    example:'Dos carros de 2 y 3 bultos reciben 10 manos desde delante, sin frenos. Juntos ganan 2 chispas. El carro de atrás necesita 3 × 2 = 6 manos de la cuerda.',
    exampleFigure:{type:'forces',left:0,right:10,load:2,rear:3},
    figure:{type:'forces',left:resistance,right:push,load:front,rear},
    data:'Una cuerda une dos carros de ' + front + ' y ' + rear + ' bultos. Tiras del de adelante con ' + push + ' manos. Solo el de atrás recibe un freno de ' + resistance + ' manos.',
    main:reply('¿Cuántas manos transmite la cuerda al carro de atrás?',link,'Primero calcula las chispas de los carros juntos. Después multiplica esas chispas por los bultos de atrás y añade su freno.',rear+' × [('+push+' − '+resistance+') ÷ ('+front+' + '+rear+')] + '+resistance+' = '+islandNumber(link),true),
    scout:reply('¿Cuántas chispas ganan juntos?',start,'Quita el freno de la ayuda y reparte entre todos los bultos.', '('+push+' − '+resistance+') ÷ ('+front+' + '+rear+') = '+islandNumber(start),true),
    bonus:reply('Si se rompe la cuerda y el carro de delante conserva toda la ayuda, ¿cuántas chispas gana solo?',push/front,'Ahora solo reparte tu ayuda entre los bultos del carro de delante.',push+' ÷ '+front+' = '+islandNumber(push/front),true)
  };
}

function lift(mass, up, inverse = false, floor = 0) {
  const support=mass*(10+up);
  const showFloor=inverse?floor:support;
  const answer=inverse ? floor/mass-10 : support;
  return {
    keys:['bulto','mano','chispa','piso','tiron','flotante'],
    lesson:['Cuando subes en una plataforma, tu carga sigue tirando hacia abajo con 10 manos por bulto.', 'Si la plataforma quiere que la carga gane ritmo hacia arriba, el suelo tendrá que devolver más manos de las que tiran hacia abajo.'],
    example:'Con 3 bultos y 2 chispas hacia arriba, cada bulto necesita 10 + 2 manos del piso. En total el piso ofrece 36 manos.',
    exampleFigure:{type:'lift',load:3,floor:36,down:30},
    figure:{type:'lift',load:mass,floor:inverse?showFloor:'?',down:mass*10},
    data:'La carga tiene '+mass+' bultos. ' + (inverse?'El piso la sostiene con '+showFloor+' manos.':'La plataforma gana '+up+' chispas hacia arriba.'),
    main:inverse
      ? reply('¿Cuántas chispas gana hacia arriba?',answer,'Reparte las manos del piso entre los bultos y quita las diez que vencen el tirón hacia abajo.',floor+' ÷ '+mass+' − 10 = '+islandNumber(answer),true)
      : reply('¿Cuántas manos hace el piso sobre la carga?',answer,'A cada bulto le tocan diez manos para sostenerlo y manos extra para ganar ritmo. Multiplica por el número de bultos.',mass+' × (10 + '+up+') = '+islandNumber(answer)),
    scout:reply('Si la plataforma dejara de ganar ritmo y subiera parejo, ¿cuántas manos haría el piso?',mass*10,'Solo tendría que sostener la carga. Cuenta diez manos por bulto.',mass+' × 10 = '+mass*10),
    bonus:reply('¿Cuántas manos extra hace el piso en la subida de la misión, por encima de las que solo sostienen la carga?',showFloor-mass*10,'Quítale a la ayuda del piso la parte que solo sostiene los bultos.',showFloor+' − '+mass*10+' = '+(showFloor-mass*10),true)
  };
}

function singleImpact(mass, before, after, goal='change', beats=0) {
  const start=mass*before, end=mass*after, change=end-start;
  const motion = speed => speed===0?'se queda quieto': 'va con ritmo '+speed;
  const questions={
    start:reply('¿Con cuánto empuje de viaje llega el carro?',start,'Multiplica sus bultos por el número con el que llega de ritmo.',mass+' × '+before+' = '+start),
    change:reply('¿Cuánto cambia su empuje de viaje? Indica el signo.',change,'Multiplica la carga por el ritmo de llegada y por el de salida. Quítale el primero al último.',mass+' × ('+after+' − '+before+') = '+change),
    force:reply('¿Con cuántas manos actúa en promedio la barrera? Indica el signo.',change/(beats||1),'Calcula el cambio de empuje y repártelo entre los latidos que dura el toque.',change+' ÷ '+beats+' = '+islandNumber(change/(beats||1)),true)
  };
  return {
    keys:['bulto','avance','empuje','cambio',...(beats?['latido','mano']:[])],
    lesson:['Cada bulto aporta tanto empuje de viaje como lo que marca su ritmo. Multiplica la carga por el ritmo y conserva su signo.', 'El cambio se lee al revés de como ocurrió la historia: toma el empuje del final y quítale el del principio.',
      ...(beats ? ['Si ese cambio se reparte entre varios latidos, puedes averiguar cuántas manos actúan en promedio por latido.'] : [])],
    example: 'Un carro de 2 bultos llega con ritmo +3 y sale con ritmo −1. Pasa de +6 a −2 de empuje. Cambió −8. Si el toque dura 2 latidos, el promedio es −4 manos.',
    exampleFigure:{type:'impact', masses:[2], speeds:[3], after:-1},
    figure:{type:'impact',masses:[mass],speeds:[before],after},
    data:'Un carro de '+mass+' bultos '+motion(before)+' antes de tocar la barrera y '+motion(after)+' después. Hacia el faro cuenta positivo.' + (beats?' El toque dura '+beats+' latidos.':''),
    main:questions[goal],
    scout:goal==='start'
      ? reply('¿Cuánto empuje de viaje lleva justo después de tocar la barrera?',end,'Multiplica los bultos por el ritmo que queda al final.',mass+' × '+after+' = '+end)
      : questions.start,
    bonus:goal==='change'
      ? reply('Si en vez de ese final el carro vuelve con el mismo ritmo de antes, pero al revés, ¿cuánto cambiaría el empuje?',-2*start,'Si el ritmo se invierte sin hacerse más pequeño, cambia el signo de todo el empuje inicial. Entonces resta el empuje de antes.', '('+(-start)+') − '+start+' = '+(-2*start))
      : questions.change
  };
}

function docking(a,u,b,v,goal='speed', added=0) {
  const mass=a+b;
  const before=a*u+b*v;
  const speed=before/mass;
  const after=(before+added)/mass;
  const energy=(a*u*u+b*v*v)/2;
  const loss=energy-mass*speed*speed/2;
  return {
    keys:['bulto','avance','empuje','juntos',...(goal==='loss'?['brillo']:[]),...(goal==='extra'?['cambio']:[])],
    lesson:['Cuenta el empuje de viaje de los dos carros antes de juntarse. Un ritmo con menos resta empuje al grupo.', 'Si solo se empujan entre ellos y quedan pegados, el empuje total sigue ahí. Repártelo entre todos los bultos.',
      ...(goal==='loss' ? ['Para contar el brillo de carrera, multiplica cada ritmo por sí mismo, luego por los bultos, y divide entre dos. Al pegarse pueden perder brillo aunque conserven su empuje.'] : []),
      ...(goal==='extra' ? ['Una ayuda desde fuera sí cambia el empuje total. Añade ese cambio después de juntar los carros y vuelve a repartir entre todos los bultos.'] : [])],
    example:'Un carro de 2 bultos con ritmo +6 se pega a otro de 4 que está quieto. Comparten 12 de empuje entre 6 bultos, así que salen con ritmo +2.',
    exampleFigure:{type:'impact',masses:[2,4],speeds:[6,0],after:2},
    figure:{type:'impact',masses:[a,b],speeds:[u,v]},
    data:'Un carro de '+a+' bultos tiene ritmo '+u+' y otro de '+b+' tiene ritmo '+v+' (cero significa quieto). Se tocan y quedan pegados. Hacia el faro cuenta positivo.' +
      (goal==='extra'?' Después, una cuerda cambia el empuje del grupo en '+added+'.':''),
    main:goal==='loss'
      ? reply('¿Cuánto brillo de carrera se pierde al pegarse?',loss,'Halla el ritmo que comparten. Después resta el brillo del grupo al brillo que tenían por separado.',islandNumber(energy)+' − '+islandNumber(mass*speed*speed/2)+' = '+islandNumber(loss),true)
      : reply(goal==='extra'?'¿Con qué ritmo termina el grupo después de que actúe la cuerda?':'¿Con qué ritmo salen juntos?',after,'Junta los empujes iniciales con sus signos. '+(goal==='extra'?'Añade el cambio de la cuerda y reparte.':'Reparte entre todos los bultos.'), '('+a+' × ('+u+') + '+b+' × ('+v+')'+(added?' + ('+added+')':'')+') ÷ '+mass+' = '+islandNumber(after),true),
    scout:reply('¿Con cuánto empuje de viaje cuentan los dos carros justo antes de tocarse?',before,'Multiplica los bultos de cada carro por su ritmo. Junta los resultados con sus signos.',a+' × ('+u+') + '+b+' × ('+v+') = '+before),
    bonus:goal==='speed'
      ? reply('Si el primer carro llegara con el doble de ritmo y el segundo llegara igual, ¿qué ritmo compartirían?',(2*a*u+b*v)/mass,'Duplica solo el ritmo del primer carro, vuelve a juntar los empujes y reparte entre la misma carga.', '('+a+' × ('+(2*u)+') + '+b+' × ('+v+')) ÷ '+mass+' = '+islandNumber((2*a*u+b*v)/mass),true)
      : reply('¿Con qué ritmo salen justo después de juntarse?',speed,'Junta los empujes iniciales y reparte entre todos los bultos.',before+' ÷ '+mass+' = '+islandNumber(speed),true)
  };
}

function recoil(carry, cargo, outward) {
  const balance=-cargo*outward;
  return {
    keys:['bulto','avance','empuje','pareja'],
    lesson:['Si dos viajeros están quietos juntos, el empuje del grupo empieza en cero.', 'Cuando uno se aleja hacia el faro y el otro retrocede, sus empujes deben sumar cero si nadie los empuja desde fuera.', 'El viajero de más bultos puede equilibrar el empuje del otro con un ritmo más pequeño.'],
    example:'Un bote de 6 bultos y una caja de 2 están quietos. La caja sale con ritmo +3; el bote sale con ritmo −1. Así, 2 × 3 y 6 × (−1) se anulan.',
    exampleFigure:{type:'impact',masses:[6,2],speeds:[0,0],after:-1,outward:3},
    figure:{type:'impact',masses:[carry,cargo],speeds:[0,0],outward},
    data:'El bote de '+carry+' bultos y el paquete de '+cargo+' empiezan quietos. El paquete sale con ritmo '+(outward>0?'+':'')+outward+'. El signo positivo apunta al faro. Nada empuja desde fuera.',
    main:reply('¿Con qué ritmo sale el bote? Indica el signo.',balance/carry,'Cancela el empuje que se lleva el paquete. Reparte lo que necesita el bote entre sus propios bultos.', '−('+cargo+' × '+outward+') ÷ '+carry+' = '+islandNumber(balance/carry),true),
    scout:reply('¿Cuánto empuje se lleva el paquete?',-balance,'Multiplica sus bultos por el ritmo con el que sale.',cargo+' × '+outward+' = '+(-balance)),
    bonus:reply('¿Con qué ritmo saldría el bote si tuviera el doble de bultos y el paquete saliera igual?',balance/(2*carry),'El empuje a compensar sigue igual, pero ahora lo repartes entre el doble de bultos.',balance+' ÷ '+(2*carry)+' = '+islandNumber(balance/(2*carry)),true)
  };
}

function cleanBounce() {
  return {
    keys:['bulto','avance','empuje','brillo','rebote'],
    lesson:['Cuenta todo el empuje de viaje antes del choque. Al sumar los empujes después, debe quedar la misma cuenta.', 'En un rebote limpio también se conserva el brillo. Primero encuentra el ritmo que falta con el empuje y después puedes comprobar el brillo.'],
    example:'Dos carros de un bulto cada uno llegan con ritmos +4 y 0. Si después el primero queda quieto, el otro sale con ritmo +4. El empuje total sigue en 4 y el brillo total en 8.',
    exampleFigure:{type:'impact',masses:[1,1],speeds:[4,0],after:0,outward:4},
    figure:{type:'impact',masses:[1,2],speeds:[6,0],after:-2,outward:'?'},
    data:'Un carro de 1 bulto toca a otro de 2 que está quieto. El primero llega con ritmo +6 y rebota con ritmo −2. Hacia el faro cuenta positivo. El suelo no les quita empuje.',
    main:reply('¿Con qué ritmo sale el segundo carro?',4,'Antes había 6 de empuje. Después, el primero lleva −2. Averigua cuánto debe llevar el otro y repártelo entre sus dos bultos.', '(6 − (−2)) ÷ 2 = 4'),
    scout:reply('¿Cuánto empuje de viaje lleva el primer carro después del rebote?',-2,'Multiplica un bulto por su ritmo con signo.', '1 × (−2) = −2'),
    bonus:reply('¿Cuánto brillo de carrera conservan entre los dos después del rebote?',18,'Multiplica cada ritmo por sí mismo, después por los bultos, divide entre dos y junta ambos resultados.', '[1 × (−2) × (−2) + 2 × 4 × 4] ÷ 2 = 18')
  };
}
function lanternProjection() {
  return {
    keys: ['paso','huella','tramo','giro'],
    lesson: [
      'Una flecha que gira tiene una parte que va al este y otra que va al norte. Imagina la sombra que deja sobre cada lado del mapa.',
      'En la calculadora, cos te da la parte que sale hacia el este y sen la parte que sale hacia el norte. Aplica cada botón al giro y multiplica por el largo del vuelo.'
    ],
    example: 'Con 8 pasos de vuelo y 60 marcas de giro, cos da 0,5. La sombra al este tiene 4 pasos. Con sen, la sombra al norte tiene cerca de 6,93.',
    exampleFigure: {type:'route',legs:[[4,0],[0,4*Math.sqrt(3)]], reveal:true, diagonal:8},
    figure: {type:'route',legs:[[6*Math.sqrt(3),0],[0,6]], reveal:true, diagonal:12, hideLeg:[0,1], turn:30},
    data: 'El pájaro vuela 12 pasos de manzana en línea recta. Sale mirando al este y gira 30 marcas hacia el norte antes de volar.',
    main: reply('¿Cuántos pasos de manzana tiene la sombra del vuelo hacia el este?',6*Math.sqrt(3),'Usa cos con 30 marcas y multiplica lo que sale por 12. Revisa el ajuste en «Marcas de giro».','12 × cos(30) ≈ 10,39',true),
    scout: reply('¿Cuántos pasos de manzana tiene la sombra del vuelo hacia el norte?',6,'Usa sen para la parte norte. Luego multiplica por 12.','12 × sen(30) = 6'),
    bonus: reply('Si diera dos vuelos iguales seguidos, ¿cuánto avanzaría hacia el este en total?',12*Math.sqrt(3),'Calcula la sombra hacia el este sin redondear y duplícala.', '2 × 12 × cos(30) ≈ 20,78',true)
  };
}

function pulley() {
  return {
    keys:['bulto','mano','chispa','agarre','piso','tiron','pareja'],
    lesson: [
      'La cuerda dobla en una rueda. Mientras baja el saco, el carro recorre lo mismo hacia el torno.',
      'Desde fuera, el saco tira hacia abajo y el suelo frena al carro. Quita el freno del tirón del saco y reparte entre todos los bultos que se mueven.',
      'Para saber qué siente la cuerda, mira solo el carro. A él le llegan las manos de la cuerda, pero el suelo le quita una parte.'
    ],
    example: 'Si cuelgan 2 bultos y el carro lleva 3, el saco tira con 20 manos. Si el suelo frena con 5, quedan 15 manos para 5 bultos. Ganan 3 chispas.',
    exampleFigure: {type:'pulley', load:3, hanging:2, drag:5},
    figure: {type:'pulley', load:6, hanging:4, drag:'?'},
    data: 'El carro de 6 bultos se desliza sobre un piso con agarre de 0,25. Una cuerda pasa por una rueda ligera y lo une a un saco colgante de 4 bultos. La rueda deja correr la cuerda sin frenarla.',
    main: reply('¿Cuántas chispas ganan juntos el carro y el saco?',2.5,'El saco tira con 40 manos. Quita las que se lleva el suelo y reparte el resto entre todos los bultos.', '(4 × 10 − 6 × 10 × 0,25) ÷ (6 + 4) = 2,5',true),
    scout: reply('¿Con cuántas manos hacia atrás frena el suelo al carro?',15,'Multiplica los bultos del carro por 10 y por el agarre.', '6 × 10 × 0,25 = 15'),
    bonus: reply('¿Cuántas manos hace la cuerda sobre el carro?',30,'La cuerda cubre el freno del piso y, además, da al carro 2,5 chispas por bulto.', '15 + 6 × 2,5 = 30')
  };
}

const islandEpisodes = {
  vectores: [
    ['El atajo del camino rojo', 'La nota de Lina dice «Busca mi linterna donde termina el camino rojo». Vela encuentra dos tramos pintados en el suelo. Por la hierba puede cortar la esquina y llegar antes de que la niebla cubra las marcas.', 'Al final del camino, Vela recoge un trozo del mapa de Lina. Una mancha de barro cubre el camino de los sauces.', 'Contar los pasos del camino', 'Orientar la brújula', corner(3,4,[40,30])],
    ['Huellas en los sauces', 'Una liebre mensajera intenta seguir el mapa mojado. Se pasa del árbol señalado y vuelve sobre sus huellas. Desde un tocón, Vela apunta cada ida y cada vuelta.', 'Debajo del tocón aparece una pluma blanca. Es la señal que usan los mensajeros de la pradera.', 'Contar las huellas', 'Marcar el regreso', trail([[8,0],[-3,0],[0,2]])],
    ['Las cintas del viento', 'Una cometa de Lina quedó enganchada en la pradera. Vela sigue las cintas por dos senderos laterales y uno cuesta abajo. Hay otras cometas y solo una lleva el sello del faro.', 'Dentro de la cometa está dibujada la torre del mirador. Ahora Vela sabe qué buscar entre la hierba alta.', 'Revisar la cinta larga', 'Encontrar la vuelta', trail([[7,0],[0,5],[-2,-3]],1)],
    ['La cuerda del mirador', 'La vigilante del mirador ve algo brillar detrás de dos setos. Tiene una cuerda que alcanza en línea recta, pero Vela deberá rodear los setos para llegar sin pisar el nido que hay en medio.', 'Al otro lado encuentra un espejo pequeño. La vigilante le pide que lo lleve al Sendero del Sol.', 'Elegir un tramo de cuerda', 'Medir ida y vuelta', missingLeg(13,5)],
    ['El espejo del sol', 'Vela usa el espejo para seguir un destello que se mueve al cruzar la loma. Marca en el suelo los dos tramos del recorrido para saber por dónde podría atajar si la niebla vuelve.', 'El destello dibuja una marca hacia el puente. Otra luz parpadea cerca de la Loma de los Ecos.', 'Marcar el rodeo', 'Apuntar el espejo', corner(5,12)],
    ['Voces en la loma', 'Desde la loma se oye a alguien llamar a Vela por su nombre. Parecen voces distintas, pero son ecos. Una pastora propone rastrear el origen siguiendo tres marcas separadas.', 'Las marcas llevan a un jardín de piedras. De este desvío podría salir una pista que la niebla no ha borrado.', 'Leer la marca vertical', 'Apuntar al eco', trail([[10,0],[0,-7],[-4,3]],1,'reach')],
    ['El jardín que despista', 'Las piedras del jardín están dispuestas como huellas de un baile. Vela sigue las marcas, incluidas las que vuelven atrás. Solo quedará una piedra por señalar cuando termine.', 'La piedra correcta guarda el dibujo de una cueva. Vela puede explorarla o volver al cruce del puente.', 'Contar las idas', 'Deshacer la subida', trail([[5,2],[-9,0],[3,-6],[0,2]])],
    ['La cueva de la aguja falsa', 'Dentro de la cueva hay brillantes que imitan la aguja perdida. La última marca de Lina señala el escondite de una nota. Para llegar, Vela junta cuatro cambios de rumbo en dos cuentas y luego cruza la cueva en diagonal.', 'La nota confirma que la aguja verdadera está en manos del farero. Vela se lleva también un fragmento de cristal para recordar el desvío.', 'Rastrear la pared norte', 'Orientar el cristal', trail([[12,5],[-18,8],[3,-4],[-6,3]],1,'reach')],
    ['Las marcas del puente', 'El Puente de Ámbar tiene dos entradas. Un pescador vio a Lina dejar una marca bajo la entrada más corta. Vela conoce el largo de una cuerda tendida en diagonal y cuánto sube por la orilla.', 'Un grabado bajo el puente muestra cómo llamar a la vigilante del observatorio.', 'Medir cuerda sobrante', 'Preparar dos pasadas', missingLeg(17,8,false)],
    ['La linterna del observatorio', 'En el observatorio, Vela pide ayuda a un pájaro. El vigía solo conoce el largo del vuelo y cuánto se gira desde el este. Vela debe convertir ese aviso en dos marcas separadas para el siguiente mensajero.', 'La vigilante devuelve tres destellos y señala una sombra detrás de las colinas.', 'Marcar la sombra al norte', 'Anticipar un segundo vuelo', lanternProjection()],
    ['La sombra de las colinas', 'Una nube cambia de rumbo y Vela pierde de vista al pájaro. Un pastor encontró su sombra en tres lugares. Vela junta esas marcas para calcular dónde debe buscarlo ahora.', 'El pájaro vuelve con una cinta azul. Una vieja escalera baja hacia la cascada.', 'Contar el avance lateral', 'Mirar hacia la sombra', trail([[8,-1],[-11,6],[7,4]],0,'reach')],
    ['El salto de la cascada', 'El agua tapa parte de la escalera. Vela mide la cuerda que baja en diagonal y ve cuánto se separa la baranda de la pared. Le queda descubrir cuánto baja realmente el paso.', 'La escalera lleva a un sendero entre las rocas. Ya se ve la casa del farero en la costa.', 'Revisar el largo de la cuerda', 'Preparar otra pasada', missingLeg(25,7)],
    ['La costa de las señales', 'El farero dejó cuatro marcas para evitar las rocas de la costa. Hay que seguirlas con cuidado: dos corrigen el rumbo de las anteriores. Vela busca una ruta directa por si tiene que regresar de noche.', 'Vela entrega la cinta azul al farero. Él señala dónde escondió la aguja antes de que subiera la marea.', 'Anotar el saldo lateral', 'Orientar el regreso', trail([[11,8],[-3,5],[-6,-4],[6,6]],0,'reach')],
    ['La aguja del horizonte', 'Cuatro señales rodean la caja de la aguja. Desde la última, Vela puede tender una cuerda hacia la primera para que el farero también encuentre la caja cuando la niebla se cierre.', 'Vela recupera la aguja de la brújula. Al otro lado del canal, el dique se ha quedado cerrado y alguien golpea una baranda para pedir ayuda.', 'Apuntar al norte', 'Guardar el rumbo en la brújula', trail([[-14,2],[5,11],[-3,-4],[3,3]],1,'reach')]
  ],
  dinamica: [
    ['La carreta de Boro', 'Vela llega al taller del dique. Boro necesita mover una carreta de herramientas, pero un ciervo tira por el lado equivocado. Vela cuenta la ayuda de ambos lados.', 'La carreta llega al patio. Debajo de las herramientas hay una carta de Lina: el dique se puede abrir desde la torre de servicio.', 'Contar la ayuda que queda', 'Probar con carga doble', cart(2,8,2)],
    ['El carro que retrocede', 'Un ciervo empuja hacia la torre mientras una cuerda del taller tira con más ganas hacia atrás. Vela quiere saber qué hará el carro justo al soltar el freno de mano.', 'Boro cambia la cuerda de lado. El paso al almacén queda libre.', 'Comparar los dos lados', 'Cargar otro saco', cart(3,3,9)],
    ['Manos para el almacén', 'En el almacén, una ráfaga se opone a la carreta cargada. Boro le pide a Vela que decida cuánta ayuda llamar para salir antes de que se moje la harina.', 'Cuatro ciervos ayudan a salvar la harina. Uno conoce un pasillo que conduce al muelle.', 'Probar sin ráfaga', 'Planear dos sacos extra', cart(4,0,5,'pull',3)],
    ['Tablas mojadas', 'El carro ya se desliza por unas tablas mojadas en el muelle. La madera se agarra a las ruedas. Vela hace la cuenta para decidir si el carro gana o pierde ritmo.', 'El carro llega a la compuerta pequeña. A un lado, Boro encuentra huellas que llevan al taller bajo el dique.', 'Medir el agarre', 'Probar tablas enceradas', floorGrip(4,16,.3)],
    ['La puerta a medio abrir', 'La compuerta bloquea el camino a la torre. Su base se desliza, pero el suelo la frena. Vela quiere pedir la ayuda justa para que la puerta gane el ritmo que pide Boro.', 'Cuando queda una rendija, Vela ve que una cuerda une dos carros al otro lado. Alguien los dejó como contrapeso.', 'Inspeccionar el suelo', 'Probar con menos agarre', floorGrip(5,0,.2,'push',2)],
    ['Dos carros y una cuerda', 'En el desvío, Boro encuentra dos carros enganchados con una cuerda gastada. El carro de atrás arrastra un saco. Vela debe averiguar cuánto tendrá que aguantar la cuerda.', 'La cuerda aguanta y los carros llevan una caja al Jardín de Piedra.', 'Ver cómo salen juntos', 'Imaginar que la cuerda se rompe', tandem(4,2,22,4)],
    ['El ascensor de piedra', 'En el jardín hay un montacargas que sube hasta una galería. Boro ve cuántas manos hace el piso sobre la carga y le pregunta a Vela cuánto gana de ritmo la subida.', 'Desde la galería se ve un torno antiguo en la cueva. El equipo puede investigarlo o regresar al puente.', 'Probar una subida pareja', 'Separar la ayuda extra', lift(5,0,true,65)],
    ['El torno olvidado', 'La cueva guarda el torno que Boro construyó de joven. La cuerda une un carro del piso a un saco que cuelga. El saco baja mientras la piedra frena al carro. Vela debe contar lo que pierde en el suelo y lo que necesita para mover toda la carga.', 'Dentro del torno aparece un pasador que encaja en la manivela del dique. Vela lo guarda por si la compuerta se atasca de nuevo.', 'Inspeccionar el suelo del torno', 'Medir lo que soporta la cuerda', pulley()],
    ['El puente que agarra', 'El sendero vuelve al Puente de Ámbar. El suelo de ladrillo se agarra a un carro que ya va en marcha. La ayuda de delante ha bajado. Vela calcula cuánto pierde el carro para decidir dónde esperarlo.', 'El carro todavía alcanza el refugio del observatorio. Allí hay un elevador para subir a la torre.', 'Medir el freno de las ruedas', 'Probar ladrillos lisos', floorGrip(6,12,.4)],
    ['El elevador del observatorio', 'Vela monta en el elevador con provisiones para los vigías. La plataforma gana ritmo hacia arriba. Un crujido le hace preguntarse cuánta ayuda está haciendo el piso.', 'En la torre de observación, una cierva ve una carga trabada en la siguiente colina.', 'Comparar con una subida suave', 'Aislar el esfuerzo extra', lift(6,3)],
    ['La carga de la colina', 'La carga trabada ya ha empezado a deslizarse hacia delante. Dos voluntarios esperan la señal de Vela para ayudarla a subir el tramo plano que queda.', 'La carga llega al paso de la cascada. Bajo una lona se esconde el carro de repuestos.', 'Revisar el agarre del tramo', 'Probar una lona más lisa', floorGrip(8,0,.35,'push',3)],
    ['La cuerda de la cascada', 'Boro ata los carros de repuesto para cruzar la pasarela. El segundo carro arrastra un latón que se engancha en las tablas. Oyen cómo se estira la cuerda.', 'Con los repuestos a salvo, solo queda llevar la carga a la torre de servicio.', 'Comprobar la salida de los carros', 'Probar un carro suelto', tandem(5,7,45,9)],
    ['La torre de servicio', 'La torre tiene un piso móvil que gana ritmo al subir. Lina dejó escrito que no se puede forzar el piso más de la cuenta. Vela calcula cuánta ayuda hace sobre los repuestos.', 'El piso llega al engranaje superior. Por la rendija se alcanza a ver la cerradura de la manivela.', 'Medir la ayuda en una subida pareja', 'Averiguar la ayuda sobrante', lift(9,4)],
    ['El último tirón del dique', 'Una plataforma sostiene los engranajes. Boro lee cuánta ayuda hace el piso y Vela debe averiguar cuánto gana de ritmo. Si lo sabe, puede encajar la manivela justo cuando el pestillo pase.', 'La manivela gira y el canal vuelve a correr. Lina dejó otro mensaje entre los engranajes: la campana de rescate espera junto a los vagones del puerto.', 'Calcular la ayuda para sostener', 'Comprobar el tirón extra', lift(8,0,true,108)]
  ],
  colisiones: [
    ['La barrera de Nima', 'Nima, la nutria del puerto, muestra a Vela cómo el carro de mensajes llega a una barrera. Antes de mover la campana, quiere saber cuánto trae el pequeño carro en su carrera.', 'Nima presta dos carros para llevar la campana y esconde una llave de repuesto en uno de ellos.', 'Leer el carro tras tocar', 'Comparar antes y después', singleImpact(2,4,0,'start')],
    ['Un rebote en los sauces', 'Vela prueba un carro ligero para abrir el portón de los sauces. El carro toca la barrera y vuelve en dirección contraria. Vela anota qué cambió en el viaje.', 'La prueba descubre que el portón necesita una señal más suave. Nima señala un tope de madera en la pradera.', 'Medir cómo llegó el carro', 'Imaginar un rebote completo', singleImpact(2,5,-2)],
    ['El tope de la pradera', 'Un carro cargado llega al tope de madera y se queda quieto. Vela quiere saber cuánto perdió cuando el tope detuvo su carrera.', 'Bajo el tope había una placa que explica cómo enganchar dos vagones.', 'Leer el aviso de llegada', 'Comparar con una vuelta', singleImpact(3,6,0)],
    ['Los vagones del mirador', 'Nima acopla un vagón de carga a otro que está quieto. Vela calcula qué ritmo compartirán cuando se enganchen para que los guardias sepan cuándo abrir el paso.', 'Los vagones bajan despacio del mirador. Vela ve en dirección contraria un vagón con la llave que buscaban.', 'Contar el empuje de los dos', 'Probar una llegada más rápida', docking(2,6,4,0)],
    ['La llave que viene de frente', 'Un vagón con la llave rueda hacia el lado contrario. La guardiana del paso propone engancharlo al vagón de Vela. Antes de tocarse, la tripulación se pregunta hacia dónde irán.', 'Los carros consiguen llevar la llave al refugio. En la Loma de los Ecos se oye otro carro tocar una barrera metálica.', 'Leer los empujes opuestos', 'Probar un carro más apurado', docking(3,5,2,-4)],
    ['La barrera de los ecos', 'En el desvío, la barrera metálica devuelve un carro con menos ritmo. Nima cuenta cuánto dura el contacto al escuchar dos golpes. Vela estima cuántas manos actuaron en el choque.', 'Dentro de la barrera hay un dibujo de un paquete saltando de un bote. Nima quiere revisar ese experimento en la orilla.', 'Medir el empuje de llegada', 'Medir todo el cambio', singleImpact(4,5,-3,'force',2)],
    ['El paquete saltarín', 'Vela y Nima dejan un bote quieto junto a una piedra. Sueltan un paquete hacia el faro. El bote se aparta justo cuando el paquete sale. Vela calcula hacia dónde y cuánto.', 'El bote descubre una entrada lateral a la cueva. Se puede buscar una pieza allí o seguir por el puente.', 'Medir lo que se lleva el paquete', 'Probar con un bote cargado', recoil(9,3,6)],
    ['El rebote de cristal', 'En la cueva hay dos carros. Uno se acerca al otro y rebota. Vela apunta el ritmo con el que vuelve el primero, pero la niebla esconde el segundo. Las cuentas dirán por dónde salió.', 'El segundo carro entrega una pieza que protege la campana del golpe del viaje. Vela puede llevarla de vuelta al puerto.', 'Leer el primer carro tras el rebote', 'Comprobar el brillo que queda', cleanBounce()],
    ['El freno del puente', 'La lluvia alarga el toque del carro con el freno del puente. Vela debe calcular la ayuda promedio de la barrera para saber si el puente aguantará otra pasada.', 'La barrera suelta el carro. Falta recoger el vagón con la campana, que viene hacia el observatorio.', 'Leer el aviso de llegada', 'Calcular cuánto le quitó el freno', singleImpact(6,8,2,'force',3)],
    ['La campana viajera', 'El vagón con la campana va hacia el faro mientras otro, más pesado, se acerca por el lado contrario. Vela avisa qué ritmo compartirán al unirlos.', 'Los vagones pasan por el camino de las colinas. La campana puede cruzar el agua si el bote llega hasta la siguiente boya.', 'Leer los empujes con sus signos', 'Imaginar otro ritmo de llegada', docking(4,8,6,-3)],
    ['El bote detrás de la boya', 'Un bote está quieto. Nima manda un paquete con un aviso en dirección contraria al faro. Vela necesita saber adónde llegará el bote cuando el paquete salga.', 'El aviso cae en la boya correcta. Desde la cascada le devuelven una luz verde.', 'Leer el empuje del aviso', 'Probar con más bultos', recoil(8,3,-4)],
    ['El brillo de la cascada', 'Dos vagones se enganchan bajo la cascada. Vela quiere saber cuánto brillo de carrera pierden, porque las cuerdas se calientan cuando los dos vagones se pegan.', 'Las cuerdas aguantan. La campana llega a una playa, donde un bote espera una última señal.', 'Contar el empuje inicial', 'Leer el ritmo compartido', docking(3,8,5,0,'loss')],
    ['El cruce de las mareas', 'Los últimos vagones vienen uno contra otro. Vela necesita saber cuánto se apagará el brillo de carrera cuando queden pegados para escoger dónde poner las protecciones de la campana.', 'Vela asegura la campana y llega a la última boya. Hay niebla, pero algo al otro lado espera su señal.', 'Leer el empuje que queda', 'Prever el ritmo tras tocarse', docking(4,7,6,-3,'loss')],
    ['Tres golpes para Lina', 'El carro de Vela se engancha al de Nima. La cuerda de la boya les da un último empujón hacia el faro. Vela calcula con qué ritmo llegarán para tocar la campana justo al pasar.', 'La campana suena tres veces. Lina levanta la linterna y, desde dentro, abre la puerta del faro. Vela le entrega la carta que llevaba desde el primer viaje.', 'Contar el empuje antes de la cuerda', 'Prever qué habría pasado sin cuerda', docking(5,8,3,-4,'extra',12)]
  ]
};

function makeProblem(module = currentModule, index = selectedLevel) {
  const [title, story, ending, scoutTitle, bonusTitle, mechanics] = islandEpisodes[module][index];
  return {...mechanics, title, story, ending, scoutTitle, bonusTitle};
}
