export interface DocumentEntry {
  icon: "file-text" | "folder-open" | "megaphone" | "clipboard-list" | "scale" | "building-2";
  title: string;
  description: string;
}

export const documents: DocumentEntry[] = [
  {
    icon: "file-text",
    title: "Plan de gobierno",
    description: "Consulta la propuesta integral de gobierno presentada ante el organismo electoral.",
  },
  {
    icon: "folder-open",
    title: "Documentos institucionales",
    description: "Estatuto, actas y documentos de constitución del partido.",
  },
  {
    icon: "megaphone",
    title: "Comunicados",
    description: "Pronunciamientos oficiales de la organización.",
  },
  {
    icon: "clipboard-list",
    title: "Convocatorias",
    description: "Procesos abiertos de afiliación, voluntariado y elecciones internas.",
  },
  {
    icon: "scale",
    title: "Normativas",
    description: "Marco legal y normativo que rige la vida institucional del partido.",
  },
  {
    icon: "building-2",
    title: "Información institucional",
    description: "Estructura orgánica, órganos de dirección y representación regional.",
  },
];
