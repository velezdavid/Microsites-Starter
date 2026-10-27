/**
 * Mediaudience content, transcribed from reference/mediaudience (home + solution pages).
 * Source for the initial import into Sanity (see ./documents.ts). After the import,
 * Sanity is the source of truth: edit content in the Studio, not here.
 */

export type GroupId = "obj" | "prod" | "ch" | "tool";

export const MAIL = "hola@mediaudience.com";

export const GROUPS: Record<GroupId, { name: string; anchor: string }> = {
  obj: { name: "Objetivos", anchor: "objetivos" },
  prod: { name: "Productos", anchor: "productos" },
  ch: { name: "Canales", anchor: "canales" },
  tool: { name: "Herramientas", anchor: "herramientas" },
};

/** Page path of each solution, identical to the production URLs. */
export const PAGE_PATHS: Record<string, string> = {
  intel: "producto - inteligencia de audiencia",
  awareness: "producto - notoriedad",
  consider: "producto - consideracion",
  convert: "producto - conversion",
  loyal: "producto - fidelizacion",
  ctv: "producto - ctv video",
  push: "producto - mobile push premium",
  richmedia: "producto - richmedia display",
  ingame: "producto - blended in-game",
  "sq-predict": "producto - curaduria de audiencias",
  "ch-ctv": "producto - canal connected tv",
  "ch-telco": "producto - canal telco claro",
  "ch-prog": "producto - canal programmatic",
  "ch-gaming": "producto - canal gaming",
  "ch-sqreem": "producto - canal ai audiences sqreem one",
  "first-party": "producto - audiencias first party",
  drivers: "producto - segmentacion 6 drivers",
  "sqreem-one": "producto - sqreem one",
  privacy: "producto - privacy-first cookieless",
};

export const LEGAL_PATH = "terminos y condiciones";

/* ---------- Home summaries ---------- */

export const KPI_LABELS = ["USUARIOS", "OPORTUNIDADES CTV / MES", "JUEGOS MOBILE CUBIERTOS", "AÑOS DE OPERACIÓN"];

export const COUNTRIES = [
  { name: "Perú", code: "PE", kpis: ["34M", "18M", "+85%", "6+"] },
  { name: "Ecuador", code: "EC", kpis: ["17M", "7M", "+82%", "3+"] },
  { name: "Chile", code: "CL", kpis: ["19M", "12M", "+80%", "1+"] },
  { name: "México", code: "MX", kpis: ["98M", "43M", "+87%", "1+"] },
];

export const OBJECTIVES = [
  { id: "intel", name: "Inteligencia de audiencia", stage: "PLANIFICACIÓN", headline: "Descubre quién está listo para comprar", desc: "Con SQREEM ONE identificamos audiencias por comportamiento e intención, con IA y sin cookies, antes de invertir en medios.", kpis: ["Tamaño de audiencia", "Intención de compra", "Afinidad", "Share of search"], recs: ["sq-predict", "push", "ctv"] },
  { id: "awareness", name: "Notoriedad", stage: "TOP FUNNEL", headline: "Que tu marca se vea y se recuerde", desc: "Alcance masivo en pantallas premium con formatos que se ven completos y en entornos seguros.", kpis: ["Alcance", "VTR", "Viewability", "Frecuencia"], recs: ["ctv", "push", "ingame"] },
  { id: "consider", name: "Consideración", stage: "MID FUNNEL", headline: "Genera interés e interacción", desc: "Formatos interactivos que invitan a explorar tu marca y elevan el tiempo de contacto.", kpis: ["Engagement", "CTR", "Tiempo de interacción"], recs: ["richmedia", "ctv", "sq-predict"] },
  { id: "convert", name: "Conversión", stage: "BOTTOM FUNNEL", headline: "Lleva a tu audiencia a la acción", desc: "Visitas, descargas y ventas con segmentación por ubicación, comportamiento y datos de la telco.", kpis: ["CTR", "CPA", "Visitas", "Descargas"], recs: ["push", "sq-predict", "richmedia"] },
  { id: "loyal", name: "Fidelización", stage: "RETENCIÓN", headline: "Reactiva a quien ya te conoce", desc: "Retargeting con audiencias construidas en tus campañas para volver a impactar a clientes y usuarios.", kpis: ["Recurrencia", "Retargeting", "CTR"], recs: ["ingame", "push", "sq-predict"] },
];

export const CHANNELS = [
  { id: "ctv", name: "Connected TV", stat: "80M", statLabel: "OPORTUNIDADES / MES", desc: "Smart TV y apps de streaming premium." },
  { id: "telco", name: "Telco · Claro", stat: "192M", statLabel: "USUARIOS EN LATAM", desc: "Notificaciones enviadas por el teleoperador con First Party Data." },
  { id: "prog", name: "Programmatic", stat: "+8%", statLabel: "CTR RICHMEDIA", desc: "Web y apps mobile con inventario premium como SSP." },
  { id: "gaming", name: "Gaming", stat: "+85%", statLabel: "JUEGOS MOBILE", desc: "Anuncios integrados en entornos de juego, con brand safety." },
  { id: "sqreem", name: "AI Audiences · SQREEM ONE", stat: "IA", statLabel: "COOKIELESS", desc: "Audiencias conductuales construidas con IA y activadas en programática y social." },
];

export const PRODUCTS = [
  { id: "ctv", name: "CTV Video", ch: "ctv", desc: "Video non-skippable en Smart TV y streaming, en primera línea de compra.", bullets: ["Segmentación por contenido, geo, horario y dispositivo", "Sin monto mínimo"], stat: "94.5%", statLabel: "VTR", objs: ["awareness", "consider"] },
  { id: "push", name: "Mobile Push Premium", ch: "telco", desc: "Rich Notification en video, no intrusiva, enviada por Claro.", bullets: ["6 drivers de segmentación", "Integración con apps nativas de Claro"], stat: "13.3%", statLabel: "CTR", objs: ["awareness", "convert", "loyal"] },
  { id: "richmedia", name: "Richmedia Display", ch: "prog", desc: "Formatos de alto impacto que maximizan el engagement por impresión.", bullets: ["Scratch, Box Cube, Carrusel y más", "Pop-under orientado a sesiones"], stat: "+8%", statLabel: "CTR", objs: ["consider", "convert"] },
  { id: "ingame", name: "Blended In-Game", ch: "gaming", desc: "Anuncios integrados de forma natural dentro del juego.", bullets: ["No interrumpe la experiencia", "Alimenta audiencias para retargeting"], stat: "+85%", statLabel: "COBERTURA", objs: ["awareness", "loyal"] },
  { id: "sq-predict", name: "Curaduría de audiencias", ch: "sqreem", desc: "Modelos de IA que detectan a quién tiene mayor probabilidad de convertir.", bullets: ["Segmentos por intención y etapa del funnel", "Sin cookies de terceros"], stat: "Intent", statLabel: "MODELO", objs: ["intel", "consider", "convert"] },
];

export const TOOLS: { code: string; slug?: string; name: string; desc: string }[] = [
  { code: "CC", name: "Campaign Console", desc: "Reportes en tiempo real: delivery, VTR, CTR y viewability por campaña." },
  { code: "1P", slug: "first-party", name: "Audiencias First Party", desc: "Datos propios de la telco para construir audiencias reales, no inferidas." },
  { code: "6D", slug: "drivers", name: "Segmentación 6 drivers", desc: "Ubicación, comportamiento, dispositivo, contenido, horario y perfil." },
  { code: "BS", name: "Brand Safety & Viewability", desc: "Entornos verificados y medición de visibilidad en cada impresión." },
  { code: "S1", slug: "sqreem-one", name: "SQREEM ONE", desc: "Plataforma de inteligencia de audiencias con IA: descubre, modela y activa segmentos conductuales." },
  { code: "PR", slug: "privacy", name: "Privacy-first · Cookieless", desc: "Datos anonimizados y agregados, sin dependencia de cookies de terceros." },
];

export const ABOUT_LINKS = [
  { title: "Qué es Mediaudience", desc: "Compañía multilatina de AdTech: SSP y representación de medios digitales en Perú, México, Ecuador y Chile.", anchor: "nosotros" },
  { title: "Contacto", desc: "Datos institucionales y canal para coordinar una demo.", anchor: "contacto" },
];

/* ---------- Solution pages ---------- */

type Pair = [string, string];

export interface SolutionDetail {
  g: GroupId;
  name: string;
  tag: string;
  headline: string;
  desc: string;
  stat: string;
  statLabel: string;
  pointsTitle?: string;
  points: Pair[];
  listTitle?: string;
  list?: string[];
  what?: { text: string; listTitle: string; items: string[] };
  variants?: { eyebrow: string; title: string; note: string; items: [string, string, Pair[]?, string?][] };
  ctx?: { eyebrow: string; title: string; stats: { v: string; l: string }[]; blocks: [string, string, string?][]; source: string };
  segsTitle?: string;
  segs?: Pair[];
  formats?: { eyebrow: string; title: string; desc: string; placements: string[]; listTitle: string; interactive: string[] };
  specsEyebrow?: string;
  specsTitle?: string;
  specs?: Pair[];
  specNotes?: string[];
  tipsTitle?: string;
  tips?: string[];
  flow?: { eyebrow: string; title: string; desc: string; steps: string[]; note: string };
  extHref?: string;
  extLabel?: string;
  rel: string[];
}

const SDC = "SEGÚN DATOS DE LA COMPAÑÍA";
const SDS = "SEGÚN DATOS DE SQREEM";
const CTV_FLOW = { eyebrow: "Retargeting cruzado", title: "Retargeting cruzado CTV + Mobile", desc: "Doble impacto sobre la misma audiencia por reconocimiento de IP. Tecnología 100% Siprocal.", steps: ["Campaña CTV", "Usuarios impactados", "Targeting a partir de los datos", "Match exacto en OTT mobile", "Campaña mobile al mismo público"], note: "El impacto en mobile se logra después de una semana, cuando la plataforma reconoce la IP." };
const CTV_WHAT = { text: "Publicidad de video en dispositivos conectados a internet con acceso a servicios de streaming, en plataformas de pago y gratuitas.", listTitle: "DÓNDE SE VE", items: ["Smart TV", "Devices de streaming", "Consolas de videojuegos", "OTT en desktop, smartphone y tablet"] };
const ONE_STEPS = ["Entender: marca, tema e intención", "Curar audiencia: personas y segmentos accionables", "Curar inventario: medios relevantes en Web Abierta o walled gardens", "Activar: vía PMP Deal ID, en cualquier DSP o walled garden"];

export const SOLUTIONS: Record<string, SolutionDetail> = {
  intel: { g: "obj", name: "Inteligencia de audiencia", tag: "Planificación", headline: "Descubre quién está listo para comprar", desc: "Con ONE by SQREEM interpretamos intención y predecimos comportamiento para definir audiencias antes de invertir en medios.", stat: "+70", statLabel: "MERCADOS CUBIERTOS POR ONE · " + SDS,
    points: [["Intención, no clics", "ONE interpreta intención y predice comportamiento en tiempo real."], ["Sin cookies", "No rastrea individuos: su inteligencia se basa en compresión de datos y entropía."], ["Web Abierta y walled gardens", "Display, video, audio y CTV, más YouTube, Meta y TikTok."], ["Gestionado o híbrido", "El modelo de servicio se adapta a cómo trabaja tu equipo."]],
    variants: { eyebrow: "Modelo de trabajo", title: "Tres roles, una sola estrategia", note: "Cada parte aporta lo suyo para que la audiencia llegue lista a la activación.", items: [["Anunciante", "Define objetivos y KPIs."], ["Agencia", "Diseña la estrategia de medios y opera la activación."], ["ONE by SQREEM", "Aporta inteligencia de audiencias y curaduría on-demand."]] },
    rel: ["sq-predict", "sqreem-one", "ch-sqreem", "privacy"] },
  awareness: { g: "obj", name: "Notoriedad", tag: "Top funnel", headline: "Que tu marca se vea y se recuerde", desc: "Alcance en las pantallas donde se consume contenido, con video que se ve completo y formatos integrados a la experiencia.", stat: "4,3 h", statLabel: "CONSUMO DIARIO PROMEDIO DE CTV · LATAM · COMSCORE 2024",
    points: [["Connected TV", "Compra por CPM orientada a alcance, en plataformas de streaming de pago y gratuitas."], ["Video non-skippable", "El spot se reproduce completo en pre-roll, mid-roll o post-roll."], ["Blended In-Game", "Anuncios integrados al escenario del juego, sin interrumpir."], ["Push no intrusivo", "La notificación se aloja en la bandeja del usuario."]],
    listTitle: "KPIS", list: ["Impresiones", "VTR", "Alcance"], rel: ["ctv", "ingame", "push", "ch-ctv"] },
  consider: { g: "obj", name: "Consideración", tag: "Mid funnel", headline: "Genera interés e interacción", desc: "Formatos interactivos que invitan a explorar la marca: Richmedia en programática y formatos interactivos sobre Connected TV.", stat: "7", statLabel: "FORMATOS RICHMEDIA DE ALTO IMPACTO",
    points: [["Richmedia de alto impacto", "Header Cascada, Carrusel Box, Box Cube, Scratch, Video Rewarded, Video Banner Rich Media e ITT."], ["CTV interactivo", "Expandible con galería de productos + código QR, galería de videos y canvas carrusel."], ["Audiencias por intención", "Segmentos curados con ONE by SQREEM."], ["Optimización constante", "Ajustes durante la campaña, con reporting en dashboard o Excel."]],
    listTitle: "KPIS", list: ["CTR", "Interacción", "VTR"], rel: ["richmedia", "ctv", "sq-predict", "ch-prog"] },
  convert: { g: "obj", name: "Conversión", tag: "Bottom funnel", headline: "Lleva a tu audiencia a la acción", desc: "Push con destino directo, segmentación por puntos de venta y Pop Under orientado a sesiones.", stat: "8%+", statLabel: "CTR DE REFERENCIA · PUSH PREMIUM VIDEO · " + SDC,
    points: [["Destinos de acción", "Directo al sitio, instalación de apps, deep linking o app engagement."], ["Cerca del punto de venta", "Push Premium Video georreferenciado sobre puntos de consumo propios o de la competencia."], ["Sesiones de calidad", "Pop Under con sesiones de 2 minutos como mínimo."], ["Tráfico medido", "UTM, Google Analytics y Looker Studio para medir sesiones, visitas y fuente de tráfico."]],
    listTitle: "KPIS", list: ["CTR", "Sesiones", "Visitas", "Descargas"], rel: ["push", "richmedia", "drivers", "ch-telco"] },
  loyal: { g: "obj", name: "Fidelización", tag: "Retención", headline: "Reactiva a quien ya te conoce", desc: "Retargeting sobre audiencias que ya impactaste: en push, entre pantallas y desde los juegos.", stat: "+2%", statLabel: "CTR DE RETARGETING EN PUSH · " + SDC,
    points: [["Retargeting de push", "La semana siguiente a la primera campaña, para que el usuario no se sienta acosado."], ["Universo segmentado", "Impactados, vieron sin click e hicieron click."], ["De la TV al celular", "Retargeting cruzado CTV + Mobile por reconocimiento de IP."], ["Audiencias desde gaming", "Blended In-Game alimenta audiencias para retargeting."]],
    flow: CTV_FLOW, rel: ["push", "ctv", "ingame", "first-party"] },
  ctv: { g: "prod", name: "CTV Video", tag: "Connected TV", headline: "Tu marca en la pantalla grande del hogar", desc: "Video non-skippable en Smart TV, devices de streaming, consolas y OTT, con segmentación contextual y compra por CPM orientada a alcance.", stat: "4,3 h", statLabel: "CONSUMO DIARIO PROMEDIO DE CTV · LATAM · COMSCORE 2024",
    pointsTitle: "Por qué Connected TV",
    points: [["Flexibilidad de horarios", "El usuario ve el contenido cuando quiere, no cuando lo programa un canal."], ["Contenido bajo demanda", "Experiencia personalizada por algoritmo según los hábitos de cada usuario."], ["Streaming gratuito", "Acceso a Pluto, Vix, Canela, Pelisplay, Samsung TV y Roku TV, además de plataformas de pago."], ["Más diversidad que la TV lineal", "Más títulos, géneros y nichos de audiencia en un mismo canal."], ["Multidispositivo", "La misma campaña llega a Smart TV, consolas y pantallas OTT."], ["Medición precisa", "Impresiones medidas por tracker, con reporting y optimización constante."]],
    listTitle: "CONDICIONES", list: ["Compra por CPM · objetivo alcance", "Sin monto mínimo de inversión", "Tecnología Siprocal"],
    what: CTV_WHAT,
    ctx: { eyebrow: "Contexto de consumo", title: "El streaming se ve en la sala, acompañado y en prime time", stats: [{ v: "4,3 h", l: "de consumo promedio de CTV por día." }, { v: "83%", l: "ve contenido de streaming acompañado (coviewing)." }, { v: "56%", l: "considera la sala de estar la mejor opción para ver películas y series." }],
      blocks: [["Morning", "6:00–12:00"], ["Daytime", "12:00–19:00"], ["Prime Time", "19:00–24:00", "MAYOR CONSUMO"], ["Overnight", "00:00–6:00"]],
      source: "Fuente: Comscore Custom Solutions, “CTV OTT & Addressable Advertising in Latin America”, 2024. Cifras citadas por Mediaudience." },
    segsTitle: "Segmentación contextual en 7 ejes",
    segs: [["Horario", "Prime time, fines de semana y festivos."], ["Publishers", "Canales de contenido específicos."], ["Contenido", "Por categoría de lo que se está viendo."], ["Temporada", "Verano, vuelta al cole, viajes."], ["Geolocalización", "Por ubicación geográfica de la audiencia."], ["Dispositivo", "Tipo, marca y modelo."], ["Paquetes personalizados", "Combinaciones de ejes a la medida de la campaña."]],
    formats: { eyebrow: "Formato", title: "Video non-skippable", desc: "El spot se reproduce completo, en la posición que elijas. El límite técnico es de 120 segundos, pero recomendamos no exceder 30.", placements: ["Pre-roll", "Mid-roll", "Post-roll"], listTitle: "FORMATOS INTERACTIVOS", interactive: ["Expandible con galería de productos + código QR", "Expandible con galería de videos", "Canvas carrusel"] },
    specs: [["Formato de archivo", "MP4 o MOV"], ["Dimensiones", "1920×1080 px máximo"], ["Peso", "50 MB máximo"], ["Tasa de bits", "10.000"], ["Duración", "Hasta 120 s (preferible 15 s o 30 s)"], ["Entrega de materiales", "Mínimo 48 horas de anticipación"]],
    specNotes: ["Tracking: URL de tracker para medir impresiones. El anuncio de CTV no admite links clicables; los trackers son solo de medición.", "Reporting: dashboard personalizado o Excel, con optimización constante."],
    tipsTitle: "RECOMENDACIONES CREATIVAS", tips: ["Usa siempre anuncios de televisión o de YouTube para pautas de CTV.", "No adaptes un anuncio display (banner) a video sin sonido.", "La experiencia de CTV es similar a la TV lineal: un anuncio prácticamente estático y sin sonido lleva a mal performance."],
    flow: { ...CTV_FLOW, eyebrow: "Capacidad avanzada" }, rel: ["awareness", "consider", "ch-ctv"] },
  push: { g: "prod", name: "Mobile Push Premium", tag: "Telco · Claro", headline: "La notificación que envía el propio operador", desc: "Notificación enviada a través de las apps nativas de Claro, con first-party data de la telco integrada vía SDK. Compra por CPE (costo por envío).", stat: "+3%", statLabel: "CTR DE REFERENCIA · " + SDC,
    pointsTitle: "Características",
    points: [["No intrusivo", "La notificación se aloja en la bandeja de notificaciones del usuario."], ["Impacto directo", "Llega a usuarios de Claro desde sus apps nativas."], ["First-party data", "Segmentación óptima con datos de la telco obtenidos vía SDK."], ["Destinos de acción", "Directo al sitio, instalación de aplicaciones, deep linking o app engagement."]],
    listTitle: "CONDICIONES", list: ["Compra por CPE (costo por envío)", "Disparo solo de lunes a viernes"],
    formats: { eyebrow: "Formatos", title: "Dos formatos, siempre hacia una URL", desc: "Elige entre una notificación con imagen o una de solo texto.", placements: [], listTitle: "FORMATOS", interactive: ["Rich Notification: texto + banner estático", "Formato estándar: solo texto"] },
    variants: { eyebrow: "Familia Mobile Push", title: "Tres productos de push, cada uno con su propósito", note: "Universos, CTR y ventanas de disparo distintos. CTR de referencia según datos de la compañía.", items: [
      ["Push Premium · Claro", "Apps nativas de Claro con first-party data vía SDK.", [["CTR de referencia", "+3%"], ["Compra", "CPE"], ["Disparo", "Lunes a viernes"]], "ESTE PRODUCTO"],
      ["Push Premium Video · georreferenciado", "Hipersegmentado sobre app behavior y geo behavior, cerca de los puntos de venta.", [["CTR de referencia", "8% o más"], ["Compra", "CPE"], ["Segmentación", "6 drivers"]]],
      ["Push Programático", "Imagen o video al dispositivo, mobile o desktop, aunque el usuario no esté navegando.", [["CTR de referencia", "+1%"], ["Disparo", "Lunes a domingo"], ["Segmentación", "Demográfica"]]]] },
    specsEyebrow: "Restricciones", specsTitle: "Categorías no admitidas", specs: [["Bebidas alcohólicas", "No admitida"], ["Tabaco", "No admitida"], ["Gambling", "No admitida"], ["Campañas políticas", "No admitida"]], specNotes: ["Aplica a Push Premium · Claro y a Push Programático."],
    flow: { eyebrow: "Retargeting", title: "Retargeting de push, sin acosar al usuario", desc: "Recomendamos ejecutarlo la semana siguiente al envío de la primera campaña.", steps: ["Impactados", "Vieron sin click", "Hicieron click"], note: "CTR de retargeting de referencia: +2%, según datos de la compañía." },
    rel: ["convert", "loyal", "ch-telco", "drivers"] },
  richmedia: { g: "prod", name: "Richmedia Display", tag: "Programmatic", headline: "Display de alto impacto en programática", desc: "Formatos Richmedia ejecutados a través de Display & Video 360 (DV360), más Pop Up y Pop Under orientados a sesiones.", stat: "2 min", statLabel: "SESIÓN MÍNIMA CON POP UNDER · " + SDC,
    points: [["Alto impacto", "Formatos que ocupan, animan e invitan a interactuar."], ["Ejecución en DV360", "Compra programática a través de Display & Video 360."], ["Pop Under no intrusivo", "Aparece debajo de la ventana principal sin interrumpir al usuario."], ["Presupuesto cuidado", "Usuarios únicos una vez cada 24 horas o con frecuencia óptima, sin visitas repetidas."]],
    formats: { eyebrow: "Formatos", title: "Siete formatos Richmedia", desc: "Para elegir según el objetivo y el espacio disponible.", placements: [], listTitle: "RICHMEDIA", interactive: ["Header Cascada", "Carrusel Box", "Box Cube", "Scratch", "Video Rewarded", "Video Banner Rich Media", "ITT"] },
    variants: { eyebrow: "Pop Up / Pop Under", title: "Dos formas de aparecer", note: "Pop Under tiene mayor tasa de conversión por no ser intrusivo.", items: [
      ["Pop Up", "Emerge en la misma ventana del navegador.", [["Impacto", "Inmediato y visible"]]],
      ["Pop Under", "Aparece debajo de la ventana principal y no interrumpe la actividad del usuario.", [["KPI", "Sesiones"], ["Sesión mínima", "2 minutos"], ["Frecuencia", "1 vez cada 24 h por usuario único"], ["Vertical óptimo", "Juegos, apuestas, cámaras"]]]] },
    specsEyebrow: "Implementación", specsTitle: "Requisitos para Pop Under", specs: [["UTM", "Creación de UTM para la campaña"], ["Google Analytics", "Acceso como lector"], ["Looker Studio", "Tablero para medir sesiones, visitas y fuente de tráfico"]], specNotes: [],
    rel: ["consider", "convert", "ch-prog", "ingame"] },
  ingame: { g: "prod", name: "Blended In-Game", tag: "Programmatic · Gaming", headline: "Publicidad que forma parte del escenario", desc: "Formato programático que inserta anuncios dentro de videojuegos, integrados al escenario del juego.", stat: "In-Game", statLabel: "INTEGRADO AL ESCENARIO DEL JUEGO",
    points: [["Integrado al escenario", "El anuncio vive en vallas, carteles, camisetas y elementos urbanos del juego."], ["No interrumpe", "El jugador sigue su partida sin pausas forzadas."], ["Alta visibilidad", "La marca aparece en el campo de visión del jugador."], ["Brand safety", "Entornos de juego seguros para la marca."]],
    listTitle: "DÓNDE APARECE", list: ["Vallas", "Carteles", "Camisetas de jugadores", "Elementos urbanos"],
    flow: { eyebrow: "Valor estratégico", title: "Alimenta tus campañas de retargeting", desc: "Blended In-Game solo mide impresiones: su valor está en las audiencias que construye.", steps: ["Anuncio dentro del juego", "Audiencia impactada", "Campaña de retargeting"], note: "Medición: impresiones." },
    rel: ["awareness", "loyal", "ch-gaming", "ch-prog"] },
  "sq-predict": { g: "prod", name: "Curaduría de audiencias", tag: "AI Audiences · ONE by SQREEM", headline: "Audiencias curadas por intención, no por clics", desc: "ONE by SQREEM convierte señales de comportamiento humano en personas y segmentos accionables, listos para activar.", stat: "8", statLabel: "TIPOS DE SEÑAL DE COMPORTAMIENTO",
    pointsTitle: "Qué resuelve",
    points: [["El fin de las cookies", "Audiencias que no dependen de cookies de terceros."], ["Walled gardens cerrados", "YouTube, Meta y TikTok concentran la atención pero aíslan sus datos."], ["Datos fragmentados", "Más de 40 herramientas que no se comunican entre sí."], ["Gasto desperdiciado", "Menos impresiones en personas sin intención real."]],
    segsTitle: "Ocho tipos de señal",
    segs: [["Búsquedas web", "Todas, cada día."], ["Tráfico web", "Visitantes por capa de URL."], ["E-commerce", "Taxonomías de producto."], ["Medios visuales", "Video y CTV a nivel frame."], ["Contenido de página", "Texto y metadatos."], ["Geolocalización", "Actividad geoespacial masiva."], ["Actividad in-app", "Paquetes y capas de apps."], ["Redirecciones", "De la búsqueda al sitio."]],
    flow: { eyebrow: "Recorrido", title: "De la intención a la activación", desc: "Cuatro pasos para llegar a la audiencia correcta en el medio correcto.", steps: ONE_STEPS, note: "Fuente: ONE by SQREEM." },
    rel: ["intel", "sqreem-one", "ch-sqreem", "privacy"] },
  "ch-ctv": { g: "ch", name: "Connected TV", tag: "Canal", headline: "Smart TV, streaming, consolas y OTT", desc: "Video en dispositivos conectados a internet con acceso a servicios de streaming, de pago y gratuitos.", stat: "83%", statLabel: "VE STREAMING ACOMPAÑADO · COMSCORE 2024",
    points: [["Pago y gratuito", "Incluye Pluto, Vix, Canela, Pelisplay, Samsung TV y Roku TV."], ["Prime Time", "De 19:00 a 24:00, el bloque de mayor consumo."], ["La sala de estar", "El 56% la considera la mejor opción para ver películas y series (Comscore 2024)."], ["De la TV al celular", "Retargeting cruzado CTV + Mobile por reconocimiento de IP."]],
    listTitle: "PRODUCTOS", list: ["CTV Video"], what: CTV_WHAT, rel: ["ctv", "awareness", "loyal"] },
  "ch-telco": { g: "ch", name: "Telco · Claro", tag: "Canal", headline: "Notificaciones con first-party data de Claro", desc: "Formato enviado a través de las apps nativas de Claro; la tecnología se integra vía SDK de la telco.", stat: "+3%", statLabel: "CTR DE REFERENCIA · " + SDC,
    points: [["Único formato de Claro", "El único formato publicitario enviado por el teleoperador."], ["SDK nativo", "Integración directa con las apps de Claro."], ["Bandeja de notificaciones", "No intrusivo: el usuario lo abre cuando quiere."], ["Difícil de replicar", "Acceso a first-party data de telco que la programática pura no tiene."]],
    listTitle: "PRODUCTOS", list: ["Mobile Push Premium"], rel: ["push", "first-party", "convert"] },
  "ch-prog": { g: "ch", name: "Programmatic", tag: "Canal", headline: "Programática con DV360 y formatos de alto impacto", desc: "Ejecución programática a través de Display & Video 360, con Richmedia, Pop Up / Pop Under y Blended In-Game.", stat: "DV360", statLabel: "DSP DE EJECUCIÓN PROGRAMÁTICA",
    points: [["Primera línea de compra", "Como SSP, sin intermediarios que revenden: inventario premium y mejores condiciones."], ["Display & Video 360", "DSP de ejecución programática."], ["Richmedia", "Siete formatos de alto impacto."], ["Pop Under", "Sesiones de 2 minutos como mínimo, sin interrumpir."]],
    listTitle: "PRODUCTOS", list: ["Richmedia Display", "Blended In-Game", "Push Programático"], rel: ["richmedia", "ingame", "consider"] },
  "ch-gaming": { g: "ch", name: "Gaming", tag: "Canal", headline: "Publicidad dentro de los juegos móviles", desc: "Cobertura en más del 85% de los juegos móviles del mercado, según datos de la compañía.", stat: "+85%", statLabel: "DE LOS JUEGOS MÓVILES DEL MERCADO · " + SDC,
    points: [["Amplia cobertura", "Más del 85% de los juegos móviles del mercado."], ["KPIs de video y clic", "Se optimiza por VTR y CTR."], ["Blended In-Game", "Anuncios integrados al escenario del juego."], ["Retargeting", "Las audiencias de gaming alimentan otras campañas."]],
    listTitle: "PRODUCTOS", list: ["Blended In-Game"], rel: ["ingame", "awareness", "loyal"] },
  "ch-sqreem": { g: "ch", name: "AI Audiences · SQREEM ONE", tag: "Canal", headline: "Inteligencia de audiencias sin cookies", desc: "ONE by SQREEM convierte señales de comportamiento humano en audiencias listas para activar en Web Abierta y walled gardens.", stat: "+4.000 M", statLabel: "SITIOS Y APPS PROCESADOS POR MES · " + SDS,
    points: [["IA cognitiva", "Interpreta intención y predice comportamiento en tiempo real."], ["PMP Deal ID", "Activación en cualquier DSP o walled garden."], ["Hiper-curaduría", "Segmentos ajustados a cada plataforma."], ["Gestionado o híbrido", "El modelo de servicio se adapta a tu equipo."]],
    variants: { eyebrow: "Alcance", title: "Web Abierta y walled gardens", note: "", items: [["Web Abierta", "Display, video, audio y CTV.", []], ["Walled Gardens", "YouTube, Meta y TikTok, con hiper-curaduría por plataforma.", []]] },
    listTitle: "PRODUCTOS", list: ["Curaduría de audiencias"], rel: ["sq-predict", "sqreem-one", "intel"] },
  "first-party": { g: "tool", name: "Audiencias First Party", tag: "Herramienta · 1P", headline: "Datos de la telco, no inferidos", desc: "First-party data de Claro, obtenida vía SDK integrado a sus apps nativas.", stat: "1P", statLabel: "DATOS DE TELCO VÍA SDK",
    points: [["SDK nativo", "La tecnología se integra a las apps nativas de Claro."], ["Único formato de Claro", "El único formato enviado por el teleoperador."], ["Segmentación óptima", "Audiencias definidas con datos propios de la telco."], ["Ventaja estructural", "Lo que ningún competidor programático puro puede replicar."]],
    rel: ["push", "ch-telco", "drivers"] },
  drivers: { g: "tool", name: "Segmentación 6 drivers", tag: "Herramienta · 6D", headline: "Seis drivers para llegar a quien está cerca", desc: "La segmentación de Push Premium Video georreferenciado: hipersegmentación sobre app behavior y geo behavior.", stat: "6", statLabel: "DRIVERS DE SEGMENTACIÓN",
    pointsTitle: "Los 6 drivers",
    points: [["Punto de venta", "Puntos de consumo propios o de la competencia."], ["Aplicaciones", "Apps descargadas y apps más usadas."], ["Uso de celular", "Operador, marca y modelo, estado de batería, uso de wifi y de datos."], ["Zona vital (histórico)", "Lugar de residencia y de trabajo."], ["Forma de pago", "Tarjeta de débito o de crédito."], ["Demográfico", "Género y edad."]],
    flow: { eyebrow: "Secuencia", title: "Rich Notification → Video Notification", desc: "Contacta usuarios en el perímetro donde se desplazan a diario y cerca de los puntos de venta de la marca.", steps: ["Rich Notification", "Video Notification"], note: "CTR de referencia: 8% o más, según datos de la compañía." },
    rel: ["push", "convert", "first-party"] },
  "sqreem-one": { g: "tool", name: "SQREEM ONE", tag: "Herramienta · S1", headline: "IA cognitiva para inteligencia de audiencias", desc: "Plataforma de IA cognitiva que convierte miles de millones de señales de comportamiento humano en audiencias listas para activar.", stat: "+5.000", statLabel: "SEÑALES POR DÍA · " + SDS,
    points: ONE_STEPS.map((x) => x.split(": ") as Pair),
    ctx: { eyebrow: "ONE en cifras", title: "Escala global", stats: [{ v: "+4.000 M", l: "sitios y apps procesados por mes." }, { v: "+5.000", l: "señales por día." }, { v: "+70", l: "mercados, multilingüe." }], blocks: [], source: "Fuente: SQREEM, Plataforma ONE. Cifras según datos de SQREEM." },
    variants: { eyebrow: "Modelo de trabajo", title: "Tres roles, una sola estrategia", note: "Servicio gestionado o híbrido.", items: [["Anunciante", "Define objetivos y KPIs."], ["Agencia", "Diseña la estrategia de medios y opera la activación."], ["ONE by SQREEM", "Aporta inteligencia de audiencias y curaduría on-demand."]] },
    rel: ["sq-predict", "intel", "privacy"] },
  privacy: { g: "tool", name: "Privacy-first · Cookieless", tag: "Herramienta · PR", headline: "Inteligencia sin rastrear individuos", desc: "ONE by SQREEM no rastrea individuos: su inteligencia se basa en compresión de datos y entropía.", stat: "GDPR", statLabel: "HIPAA · ISO-27001 · " + SDS,
    points: [["No rastrea individuos", "La inteligencia trabaja sobre patrones, no sobre personas."], ["Compresión y entropía", "El método con el que ONE procesa las señales."], ["Cumplimiento", "GDPR, HIPAA e ISO-27001."], ["Sin cookies", "Preparado para la desaparición de las cookies de terceros."]],
    rel: ["sqreem-one", "sq-predict", "ch-sqreem"] },
};
