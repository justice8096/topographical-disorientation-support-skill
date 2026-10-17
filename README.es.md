# topographical-disorientation-support-skill (version en espanol)

Marco de ajustes y herramientas para la **desorientacion topografica del desarrollo** (DTD, tambien llamada **atopia**): la incapacidad permanente, a menudo familiar, de formar un mapa mental del entorno, con una correspondencia poco fiable entre las palabras de direccion (izquierda, derecha, norte, sur) y las direcciones reales, reconocimiento de puntos de referencia conservado, y perdida de la estrategia deliberada de compensacion bajo estres.

Tercera skill de la familia de accesibilidad, junto a dyslexia-support-skill y dyscalculia-support-skill. Mismo sistema de build, mismos cuatro formatos de salida, mismas tres jurisdicciones (Estados Unidos, Francia, Espana), misma regla: cada recomendacion lleva un grado de evidencia.

## Que hace

La DTD se trata como una condicion de **evitacion**, no de remediacion. El producto es la via de las protesis cognitivas:

- **Reescritura de indicaciones** sin palabras de direccion: relaciones con puntos de referencia en lugar de izquierda/derecha, lados vinculados a un hecho corporal que la persona indica una sola vez (« tu reloj »), frase de orientacion al principio, y tarjeta de « modo estres » que asume que la estrategia de compensacion ya ha fallado.
- **Guiones de ruta por puntos de referencia** a partir de los puntos de decision de un motor de rutas, clasificando los puntos de referencia con la receta de saliencia de Graser 2016 sobre datos de OpenStreetMap.
- **Referencias de un area geografica**: constructor de consultas Overpass seguro (lista blanca de servidores, areas acotadas, resultados saneados); punto de entrada para leer una imagen de mapa y anclarla despues en datos vectoriales.
- **Referencias en un texto**: extraccion de lugares citados en prosa (la descripcion de un barrio, una ruta recibida por correo) y emparejamiento con los puntos de referencia del area.
- **Comprobacion de contenido** que senala palabras de direccion sin punto de referencia, cualquier direccion cardinal, mapas con « el norte arriba », marcadores « usted esta aqui » sin frase de orientacion y, segun el perfil, instrucciones que dependen de una rotacion o que piden mirar hacia arriba. Los patrones de inyeccion de instrucciones se informan y el contenido se trata como datos.
- **Documentos de ajustes**: solicitud de ajustes razonables (Real Decreto Legislativo 1/2013, art. 40), solicitud de reconocimiento del grado de discapacidad, solicitud al servicio de atencion a la discapacidad de una universidad; cada uno indica con claridad que la DTD no tiene reconocimiento legal especifico y que el encuadre es por analogia.

Se admiten dos perfiles comorbidos opcionales, clasificados en grado C: **desplazamiento del punto de vista al mirar hacia arriba** y **lectura invariante a la orientacion** (no notar que una pagina o un mapa estan girados).

## Alcance y limites

Es una ayuda de lectura para una persona a pie o como pasajera. No es una ayuda a la conduccion y no debe ser la unica guia en un vehiculo ni donde un giro equivocado sea peligroso. El comando area-landmarks envia las coordenadas que indiques a un servidor Overpass publico de OpenStreetMap; no consultes un lugar que no quieras que un tercero conozca (usa `--offline` para obtener solo el texto de la consulta). Los parrafos de antecedentes familiares describen a familiares; esa informacion es suya, confirma con ellos antes de enviar el documento.

## Terminologia

Desorientacion topografica del desarrollo (DTD). El termino aparece en la divulgacion cientifica (psyciencia.com) pero no es una categoria administrativa. La clasificacion DEA/ACNEAE no se aplica (cubre dificultades de aprendizaje en la etapa escolar); la via es la general de la discapacidad con informe clinico.

## Comandos

`/rewrite-directions --locale es`, `/landmark-route-script --locale es`, `/area-landmarks --locale es`, `/place-references --locale es`, `/wayfinding-content-check --locale es`, `/dtd-accommodation-request --jurisdiction es --locale es`.

El lexico de direccion cubre izquierda, derecha, norte, sur, este, oeste y sus compuestos, todo recto, media vuelta y las posiciones horarias (« a las 2 en punto »). Los acentos se neutralizan para el emparejamiento; el texto original se conserva en los informes.

## Build y pruebas

Vease README.md (seccion Build). Las pruebas de seguridad (`tooling/test-security.ts`) cubren resistencia a ReDoS, limites de tamano, inyeccion en consultas Overpass, SSRF, datos OSM no confiables, saneamiento de salidas, deteccion de inyeccion de instrucciones y confinamiento de rutas de archivo.

## Licencia

CC0-1.0. Los datos de OpenStreetMap usados en tiempo de ejecucion estan bajo ODbL y deben ser atribuidos por la aplicacion que los consume.
