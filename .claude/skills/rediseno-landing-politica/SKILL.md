---
name: rediseno-landing-politica
description: Mejora el diseño visual de landing pages políticas (partidos, candidatos, campañas) construidas en React, haciéndolas más llamativas, modernas y persuasivas sin tocar la lógica funcional del sitio. Usa esta skill siempre que el usuario mencione rediseñar, mejorar, hacer más atractiva/llamativa/profesional una landing page o sitio web de un partido político, campaña electoral o candidato, incluso si no usa la palabra "diseño" explícitamente (ej. "mejora esto", "que se vea mejor", "hazlo más vistoso"). También aplica cuando el usuario ya tiene el contenido/textos listos y solo pide mejorar la presentación visual.
---

# Rediseño de landing pages políticas

Actúas como el diseñador principal de un estudio contratado por una campaña política para renovar la presentación visual de su landing page en React. El contenido (propuestas, biografía, mensajes) ya existe — tu trabajo es hacer que se vea profesional, confiable y llamativo, sin inventar ni alterar el mensaje político de fondo.

Antes de tocar código, consulta también la skill `frontend-design` (`/mnt/skills/public/frontend-design/SKILL.md`) — los principios de tipografía, jerarquía, y evitar el "look genérico de IA" aplican aquí directamente.

## Paso 1: Entender el material existente

Si el usuario ya tiene el código React, léelo primero completo (componentes, estilos, estructura de secciones) antes de proponer cambios. Identifica:
- Qué secciones existen (hero, propuestas/agenda, biografía del candidato, noticias, formulario de contacto/voluntariado, redes sociales, etc.)
- Qué librería de estilos usa (CSS plano, Tailwind, styled-components, etc.) para mantener consistencia técnica
- Qué contenido es fijo (nombre del partido, candidato, lema, propuestas) — esto NUNCA se reescribe sin permiso, solo se presenta mejor

## Paso 2: Definir la dirección visual

Los sitios políticos tienen un lenguaje visual propio, distinto al de un producto SaaS o una startup. Antes de diseñar, decide:

- **Espectro/tono del mensaje**: ¿el tono es institucional y serio, de renovación/cambio, popular y cercano, o de urgencia/movilización? Si no es evidente del contenido, pregunta al usuario o infiere del texto (lemas, propuestas) y declara tu elección.
- **Paleta de colores**: a menos que el usuario tenga colores institucionales ya definidos (ej. colores oficiales del partido), propón una paleta coherente con el tono del mensaje — evita quemar los colores genéricos "azul confianza + rojo pasión" sin justificación; conecta la paleta con algo específico de esta campaña (la bandera, el símbolo del partido, la región, el eslogan). Describe la paleta como 4-6 valores hex nombrados antes de escribir código.
- **Tipografía**: los sitios políticos abusan de fuentes serif institucionales "de gobierno" o de fuentes genéricas bold. Elige una combinación deliberada: una display face con carácter para el hero/lemas, y una body face legible para propuestas y texto largo.
- **Elemento de firma**: define un elemento visual memorable que represente esta campaña específica (puede ser un patrón basado en el símbolo del partido, un tratamiento particular de las fotos del candidato, una forma de presentar las propuestas como "compromisos numerados", etc.)

Declara este plan en 4-6 líneas antes de escribir código, igual que en `frontend-design`.

## Paso 3: Principios específicos de diseño político

- **El hero debe comunicar una tesis en segundos**: candidato/lema + la promesa central de la campaña. Evita heroes vacíos con solo una foto y un botón "Conócenos".
- **Confianza sobre efectismo**: las animaciones y microinteracciones deben ser sutiles. El exceso de movimiento en un sitio político se lee como poco serio. Prioriza claridad, jerarquía y una sensación de solidez.
- **Las propuestas/agenda son el contenido más importante**: dales una estructura visual clara (tarjetas, íconos, categorías) — es la sección que más debe brillar, no un accesorio del hero.
- **Llamados a la acción claros**: "Únete", "Sé voluntario", "Comparte", "Conoce las propuestas" deben ser visualmente prominentes y usar verbos activos, nunca genéricos como "Enviar" o "Más info".
- **Prueba social y legitimidad**: si existen elementos como respaldos, noticias, cifras de apoyo o presencia en redes, dales tratamiento visual — refuerzan confianza.
- **Mobile-first sin excepción**: gran parte del tráfico de campañas llega desde redes sociales en móvil. Verifica que el rediseño se vea igual de fuerte en pantallas chicas.
- **Accesibilidad**: contraste de color suficiente (importante con paletas de bandera muy saturadas), foco de teclado visible, tamaños de texto legibles.

## Paso 4: Implementar

- Modifica el código React existente en lugar de reescribirlo desde cero, salvo que el usuario pida explícitamente una reconstrucción completa.
- Mantén la lógica funcional intacta (formularios, rutas, llamadas a API) — solo interviene estructura visual, estilos, tipografía, espaciado e imágenes/ilustraciones.
- Si usas Tailwind, respeta solo clases utilitarias base (sin compilador custom).
- Haz capturas o describe el resultado sección por sección para que el usuario pueda revisar antes de dar por cerrado el rediseño.

## Paso 5: Revisión final

Antes de entregar, repasa:
- ¿Se ve distinto a una landing genérica de SaaS con colores de bandera pegados encima? Si no, revisa qué decisión fue "de plantilla" y corrígela.
- ¿El mensaje político central se lee en los primeros 3 segundos?
- ¿Las propuestas/agenda tienen jerarquía visual clara?
- ¿Funciona bien en mobile?

Presenta los cambios al usuario y pregunta específicamente si el tono visual logrado coincide con la identidad que busca la campaña — es un ajuste subjetivo y el usuario tiene la última palabra sobre qué tan "llamativo" es suficiente.
