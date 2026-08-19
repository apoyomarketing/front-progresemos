// Los campos "media" (noticias/comunicados.multimedia) aceptan foto o video
// indistintamente — hay que distinguir cuál es cuál para elegir <img> o <video>.
export function isVideoSrc(src: string): boolean {
  if (src.startsWith("data:video")) return true;
  if (src.startsWith("data:image")) return false;
  return /\.(mp4|webm|ogv|ogg|mov|m4v)(\?.*)?$/i.test(src);
}
