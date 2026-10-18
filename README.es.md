# topographical-disorientation-support-skill (versión en español)

Marco de ajustes y herramientas para la **desorientación topográfica del desarrollo** (DTD, también llamada **atopia**): la incapacidad permanente, a menudo familiar, de formar un mapa mental del entorno, con una correspondencia poco fiable entre las palabras de dirección (izquierda, derecha, norte, sur) y las direcciones reales, reconocimiento de puntos de referencia conservado, y pérdida de la estrategia deliberada de compensación bajo estrés.

Tercera skill de la familia de accesibilidad, junto a dyslexia-support-skill y dyscalculia-support-skill. Mismo sistema de build, mismos cuatro formatos de salida, mismas tres jurisdicciones (Estados Unidos, Francia, España), misma regla: cada recomendación lleva un grado de evidencia.

## Qué hace

La DTD se trata como una condición de **evitación**, no de remediación. El producto es la vía de las prótesis cognitivas:

- **Reescritura de indicaciones** sin palabras de dirección: relaciones con puntos de referencia en lugar de izquierda/derecha, lados vinculados a un hecho corporal que la persona indica una sola vez (« tu reloj »), frase de orientación al principio, y tarjeta de « modo estrés » que asume que la estrategia de compensación ya ha fallado.
- **Guiones de ruta por puntos de referencia** a partir de los puntos de decisión de un motor de rutas, clasificando los puntos de referencia con la receta de saliencia de Graser 2016 sobre datos de OpenStreetMap.
- **Referencias de un área geográfica**: constructor de consultas Overpass seguro (lista blanca de servidores, áreas acotadas, resultados saneados); punto de entrada para leer una imagen de mapa y anclarla después en datos vectoriales.
- **Referencias en un texto**: extracción de lugares citados en prosa (la descripción de un barrio, una ruta recibida por correo) y emparejamiento con los puntos de referencia del área.
- **Comprobación de contenido** que señala palabras de dirección sin punto de referencia, cualquier dirección cardinal, mapas con « el norte arriba », marcadores « usted está aquí » sin frase de orientación y, según el perfil, instrucciones que dependen de una rotación o que piden mirar hacia arriba. Los patrones de inyección de instrucciones se informan y el contenido se trata como datos.
- **Documentos de ajustes**: solicitud de ajustes razonables (Real Decreto Legislativo 1/2013, art. 40), solicitud de reconocimiento del grado de discapacidad, solicitud al servicio de atención a la discapacidad de una universidad; cada uno indica con claridad que la DTD no tiene reconocimiento legal específico y que el encuadre es por analogía.

Se admiten dos perfiles comórbidos opcionales, clasificados en grado C: **desplazamiento del punto de vista al mirar hacia arriba** y **lectura invariante a la orientación** (no notar que una página o un mapa están girados).

## Alcance y límites

Es una ayuda de lectura para una persona a pie o como pasajera. No es una ayuda a la conducción y no debe ser la única guía en un vehículo ni donde un giro equivocado sea peligroso. El comando area-landmarks envía las coordenadas que indiques a un servidor Overpass público de OpenStreetMap; no consultes un lugar que no quieras que un tercero conozca (usa `--offline` para obtener solo el texto de la consulta). Los párrafos de antecedentes familiares describen a familiares; esa información es suya, confirma con ellos antes de enviar el documento.

## Terminología

Desorientación topográfica del desarrollo (DTD). El término aparece en la divulgación científica (psyciencia.com) pero no es una categoría administrativa. La clasificación DEA/ACNEAE no se aplica (cubre dificultades de aprendizaje en la etapa escolar); la vía es la general de la discapacidad con informe clínico.

## Comandos

`/rewrite-directions --locale es`, `/landmark-route-script --locale es`, `/area-landmarks --locale es`, `/place-references --locale es`, `/wayfinding-content-check --locale es`, `/dtd-accommodation-request --jurisdiction es --locale es`.

El léxico de dirección cubre izquierda, derecha, norte, sur, este, oeste y sus compuestos, todo recto, media vuelta y las posiciones horarias (« a las 2 en punto »). Los acentos se neutralizan para el emparejamiento; el texto original se conserva en los informes.

## Build y pruebas

Véase README.md (sección Build). Las pruebas de seguridad (`tooling/test-security.ts`) cubren resistencia a ReDoS, límites de tamaño, inyección en consultas Overpass, SSRF, datos OSM no confiables, saneamiento de salidas, detección de inyección de instrucciones y confinamiento de rutas de archivo.

## Licencia

CC0-1.0. Los datos de OpenStreetMap usados en tiempo de ejecución están bajo ODbL y deben ser atribuidos por la aplicación que los consume.
