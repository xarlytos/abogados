import type { LegalCode } from '../types';

export const codigosLegales: LegalCode[] = [
  {
    id: 'civil',
    name: 'Código Civil',
    shortName: 'CC',
    description: 'Regula las relaciones entre particulares en materia de personas, familia, patrimonio y obligaciones.',
    date: '1889-07-24',
    titles: [
      {
        id: 'libro1',
        number: 'Libro Primero',
        title: 'De las personas',
        chapters: [
          {
            id: 'tit1',
            number: 'Título I',
            title: 'Del comienzo de la existencia de la persona',
            articles: [
              {
                id: 'civil-30',
                number: 'Artículo 30',
                title: 'Comienzo de la personalidad',
                content: 'La personalidad se adquiere en el momento de nacer con vida, una vez producida la separación completa del seno materno.'
              },
              {
                id: 'civil-31',
                number: 'Artículo 31',
                title: 'Definición de nacido',
                content: 'Para los efectos de las leyes civiles, se considera que ha nacido todo el que ha salido con vida del seno materno, aunque fuere momentáneamente.'
              },
            ],
          },
        ],
      },
      {
        id: 'libro4',
        number: 'Libro Cuarto',
        title: 'De las obligaciones y contratos',
        chapters: [
          {
            id: 'tit2',
            number: 'Título II',
            title: 'De las obligaciones',
            articles: [
              {
                id: 'civil-1088',
                number: 'Artículo 1088',
                title: 'Fuentes de las obligaciones',
                content: `Las obligaciones nacen de la ley, de los contratos y cuasicontratos, 
y de los actos y omisiones ilícitos o en que intervenga cualquier género de culpa o negligencia.`
              },
              {
                id: 'civil-1089',
                number: 'Artículo 1089',
                title: 'De las obligaciones que nacen de la ley',
                content: `Las obligaciones que nacen de la ley no son susceptibles de modificación 
por la voluntad de las partes, y se rigen por las normas que establecen. 
En defecto de éstas, por las disposiciones del presente Título.`
              },
              {
                id: 'civil-1090',
                number: 'Artículo 1090',
                title: 'De las obligaciones que nacen del contrato',
                content: `Las obligaciones que nacen de los contratos tienen fuerza de ley 
entre las partes contratantes, y deben cumplirse conforme a lo pactado.`
              },
              {
                id: 'civil-1091',
                number: 'Artículo 1091',
                title: 'Caracteres de las obligaciones',
                content: `Las obligaciones que nacen del contrato deben cumplirse de buena fe, 
y se interpretarán según las reglas de la buena fe de los contratantes.`
              },
              {
                id: 'civil-1254',
                number: 'Artículo 1254',
                title: 'Concepto de contrato',
                content: `El contrato existe desde que uno o varios se obligan para con otro u otros 
a dar alguna cosa o a prestar algún servicio.`
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'penal',
    name: 'Código Penal',
    shortName: 'CP',
    description: 'Regula los delitos y las penas, así como las medidas de seguridad aplicables en España.',
    date: '1995-11-23',
    titles: [
      {
        id: 'libro1-penal',
        number: 'Libro Primero',
        title: 'Parte General',
        chapters: [
          {
            id: 'tit1-penal',
            number: 'Título I',
            title: 'De la ley penal',
            articles: [
              {
                id: 'penal-1',
                number: 'Artículo 1',
                title: 'Principio de legalidad',
                content: `1. No es punible ninguna acción u omisión que no esté previa y expresamente 
prevista como delito en la ley vigente en el momento de su comisión.

2. No se aplicarán penas o medidas de seguridad que no estén previas y expresamente 
establecidas por la ley vigente en el momento de la comisión del delito.`
              },
              {
                id: 'penal-9',
                number: 'Artículo 9',
                title: 'De los delitos y las faltas',
                content: `1. Son delitos las acciones y omisiones dolosas o imprudentes que la ley 
pune como tales.

2. Son faltas las infracciones penales no dolosas que la ley castiga con pena 
de multa de hasta 50 días o trabajos en beneficio de la comunidad.`
              },
            ],
          },
          {
            id: 'tit3-penal',
            number: 'Título III',
            title: 'De la persona responsable del delito o falta',
            articles: [
              {
                id: 'penal-19',
                number: 'Artículo 19',
                title: 'Capacidad criminal',
                content: `Para la responsabilidad criminal, se entiende por adulto la persona mayor 
de dieciocho años.`
              },
              {
                id: 'penal-20',
                number: 'Artículo 20',
                title: 'Causas de exculpación',
                content: `Son eximentes de la responsabilidad criminal:
1. El que obra en defensa propia.
2. El que obra por cumplimiento de un deber.
3. El que obra por obediencia debida.
4. El que obra en estado de necesidad.`
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'lec',
    name: 'Ley de Enjuiciamiento Civil',
    shortName: 'LEC',
    description: 'Regula el procedimiento civil en España, incluyendo jurisdicción, acciones y recursos.',
    date: '2000-01-07',
    titles: [
      {
        id: 'libro1-lec',
        number: 'Libro Primero',
        title: 'Disposiciones generales',
        chapters: [
          {
            id: 'tit1-lec',
            number: 'Título I',
            title: 'De la jurisdicción y la competencia',
            articles: [
              {
                id: 'lec-1',
                number: 'Artículo 1',
                title: 'Ámbito de aplicación',
                content: `La jurisdicción civil es la que corresponde a los Juzgados y Tribunales 
en orden a conocer y fallar de todas las cuestiones de Derecho civil y mercantil.`
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'lecrim',
    name: 'Ley de Enjuiciamiento Criminal',
    shortName: 'LECrim',
    description: 'Regula el procedimiento criminal, desde la investigación hasta la ejecución de sentencias.',
    date: '1882-09-14',
    titles: [
      {
        id: 'libro1-lecrim',
        number: 'Libro Primero',
        title: 'De los Jueces y Magistrados, Secretarios Judiciales, Letrados de la Administración de Justicia, Auxiliares de la Justicia y Agentes Judiciales',
        chapters: [
          {
            id: 'tit1-lecrim',
            number: 'Título I',
            title: 'De los Jueces y Magistrados',
            articles: [
              {
                id: 'lecrim-1',
                number: 'Artículo 1',
                title: 'Independencia judicial',
                content: `Los Jueces y Magistrados, sin sujeción más que a la Constitución y a la ley, 
ejercen la potestad jurisdiccional.`
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'et',
    name: 'Estatuto de los Trabajadores',
    shortName: 'ET',
    description: 'Regula los derechos y deberes laborales, así como las relaciones entre trabajadores y empresarios.',
    date: '1980-03-13',
    titles: [
      {
        id: 'titulo1-et',
        number: 'Título I',
        title: 'De la relación individual de trabajo',
        chapters: [
          {
            id: 'cap1-et',
            number: 'Capítulo I',
            title: 'Disposiciones generales',
            articles: [
              {
                id: 'et-4',
                number: 'Artículo 4',
                title: 'Capacidad para contratar',
                content: `1. Tienen capacidad para trabajar y para contratar:
a) Los mayores de dieciséis años.
b) Los menores de dieciséis años que se hallen en alguna de las situaciones 
previstas en el artículo 6 del presente texto legal.`
              },
            ],
          },
          {
            id: 'cap3-et',
            number: 'Capítulo III',
            title: 'Del contrato de trabajo',
            articles: [
              {
                id: 'et-8',
                number: 'Artículo 8',
                title: 'Concepto de contrato de trabajo',
                content: `1. Por el contrato de trabajo la persona trabajadora se obliga a prestar 
su actividad laboral por cuenta ajena y dentro del ámbito de organización 
y dirección de otra persona, física o jurídica, llamada empresaria o empresario, 
a cambio de una retribución.`
              },
              {
                id: 'et-14',
                number: 'Artículo 14',
                title: 'Derechos fundamentales',
                content: `Son derechos fundamentales de la persona trabajadora:
a) A la libre elección de trabajo.
b) A no ser discriminado por razón de sexo, estado civil, edad, etc.
c) Al respeto de su intimidad y dignidad.`
              },
            ],
          },
        ],
      },
    ],
  },
];

export default codigosLegales;
