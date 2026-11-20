import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'UrFoodBox — Machew devan pot kay ou.',
    short_name: 'UrFoodBox',
    description:
      'Machew devan pot kay ou. Order curated grocery food boxes online in USD or HTG and get doorstep delivery.',
    start_url: '/',
    display: 'standalone',
    background_color: '#FFFFFF',
    theme_color: '#F47B20',
    icons: [
      {
        src: '/assets/aistudio/IMG-20261115-WA0000_6c778049_6c778049.jpg',
        sizes: '512x512',
        type: 'image/jpeg',
      },
    ],
  };
}
