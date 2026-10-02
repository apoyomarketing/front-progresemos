export interface FullGalleryPhoto {
  image: string;
  alt: string;
}

const modules = import.meta.glob('../assets/galeria\\ de\\ fotos/*.{jpg,jpeg,png,mp4,webm}', { eager: true });
const galleryImages = Object.values(modules).map((mod: any) => mod.default || mod);

export const galleryFull: FullGalleryPhoto[] = galleryImages.map((img: string, index: number) => ({
  image: img,
  alt: `Fotografía de campaña ${index + 1}`
}));
