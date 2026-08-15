interface IconProps {
  size?: number;
  strokeWidth?: number;
}

export function FacebookIcon({ size = 17 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M13.5 21v-8h2.7l.4-3.3h-3.1V7.6c0-.95.26-1.6 1.63-1.6H16.7V3.14C16.4 3.1 15.44 3 14.33 3 12 3 10.4 4.4 10.4 7.3v2.4H7.7V13h2.7v8h3.1z" />
    </svg>
  );
}

export function InstagramIcon({ size = 17 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function TikTokIcon({ size = 17 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M16.6 3c.35 2.1 1.72 3.6 3.9 3.83v2.62c-1.36.13-2.56-.29-3.85-1.1v6.4c0 3.24-2.36 5.5-5.4 5.5-2.98 0-5.4-2.3-5.4-5.35 0-3.02 2.5-5.4 5.5-5.32.29 0 .57.03.85.08v2.7a2.86 2.86 0 0 0-.85-.14 2.7 2.7 0 1 0 2.7 2.7V3h2.55z" />
    </svg>
  );
}

export function YoutubeIcon({ size = 17 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M21.6 7.6a2.7 2.7 0 0 0-1.9-1.9C18 5.2 12 5.2 12 5.2s-6 0-7.7.5A2.7 2.7 0 0 0 2.4 7.6 28 28 0 0 0 2 12a28 28 0 0 0 .4 4.4 2.7 2.7 0 0 0 1.9 1.9c1.7.5 7.7.5 7.7.5s6 0 7.7-.5a2.7 2.7 0 0 0 1.9-1.9A28 28 0 0 0 22 12a28 28 0 0 0-.4-4.4zM10 15V9l5.2 3-5.2 3z" />
    </svg>
  );
}

export function XIcon({ size = 17 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M3 3h4.3l4 5.5L16 3h4.5l-6.4 8.3L21 21h-4.4l-4.4-6-5 6H3l6.9-8.5L3 3z" />
    </svg>
  );
}
