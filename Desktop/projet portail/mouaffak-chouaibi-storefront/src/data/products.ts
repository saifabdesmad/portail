export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  images: string[];
  rating: number;
  reviews: number;
  inStock: boolean;
  isNew?: boolean;
  isBestSeller?: boolean;
  colors?: string[];
  material: string;
  printTime: string;
  tags: string[];
}

export const categories = [
  { id: 'all',         label: 'Tous les produits',   icon: '✨' },
  { id: 'home-decor',  label: 'Décoration maison',   icon: '🏠' },
  { id: 'jewelry',     label: 'Bijoux & Accessoires', icon: '💎' },
  { id: 'tech',        label: 'Accessoires Tech',     icon: '📱' },
  { id: 'figurines',   label: 'Figurines & Art',      icon: '🎨' },
  { id: 'organizers',  label: 'Organisateurs',        icon: '📦' },
  { id: 'keychains',   label: 'Porte-clés',           icon: '🔑' },
  { id: 'custom',      label: 'Personnalisé',         icon: '⭐' },
];

export const products: Product[] = [
  /* ── Décoration maison ──────────────────────────────────────────────── */
  {
    id: 1,
    name: 'Vase Géométrique Moderne',
    description: 'Vase élégant imprimé en 3D avec un design géométrique moderne. Parfait pour décorer votre intérieur avec style. Disponible en plusieurs coloris.',
    price: 45.000,
    originalPrice: 60.000,
    category: 'home-decor',
    images: [
      '/Produits/DECO/1/2025-11-18_4e2e3008af2718.webp',
      '/Produits/DECO/1/2025-11-18_fc807149f6f17.webp',
    ],
    rating: 4.8, reviews: 124, inStock: true, isNew: false, isBestSeller: true,
    colors: ['#F5C842', '#4ECDC4', '#FF6B6B', '#ffffff'],
    material: 'PLA Premium', printTime: '4h',
    tags: ['vase', 'décoration', 'géométrique', 'moderne'],
  },
  {
    id: 7,
    name: 'Lampe LED Hexagonale',
    description: 'Lampe décorative avec structure hexagonale imprimée en 3D. Crée une ambiance chaleureuse et moderne dans votre pièce.',
    price: 120.000,
    originalPrice: 150.000,
    category: 'home-decor',
    images: [
      '/Produits/DECO/2/79b0c855324e5174.webp',
      '/Produits/DECO/2/7f3d30554ddee5d0.webp',
    ],
    rating: 4.8, reviews: 94, inStock: true, isNew: true,
    colors: ['#ffffff', '#F5C842', '#1a1a2e'],
    material: 'PETG Translucide', printTime: '8h',
    tags: ['lampe', 'LED', 'hexagonal', 'ambiance'],
  },
  {
    id: 12,
    name: 'Pot de Plante Suspendu',
    description: 'Pot de plante design à suspendre, imprimé en 3D avec motifs inspirés de la nature. Idéal pour plantes grasses et petites plantes d\'intérieur.',
    price: 30.000,
    category: 'home-decor',
    images: [
      '/Produits/DECO/3/2025-04-22_415e8b3f5b7c38.webp',
      '/Produits/DECO/3/2025-04-22_aedb852824d2c8.webp',
    ],
    rating: 4.6, reviews: 198, inStock: false,
    colors: ['#F5C842', '#4ECDC4', '#ffffff', '#1a1a2e'],
    material: 'PLA Biodégradable', printTime: '4h',
    tags: ['pot', 'plante', 'suspendu', 'nature'],
  },

  /* ── Bijoux & Accessoires ────────────────────────────────────────────── */
  {
    id: 5,
    name: 'Bague Géométrique Personnalisée',
    description: 'Bague élégante au design géométrique, personnalisable avec votre taille et initiales. Fabriquée en résine haute qualité pour un rendu bijou.',
    price: 35.000,
    category: 'jewelry',
    images: [
      '/Produits/BIJOUX/1/2025-07-29_a9dd4a4f2b84f8.webp',
      '/Produits/BIJOUX/1/2025-07-29_d017775caf95.webp',
    ],
    rating: 4.6, reviews: 203, inStock: true,
    colors: ['#C0C0C0', '#FFD700', '#F5C842', '#4ECDC4'],
    material: 'Résine UV', printTime: '1h',
    tags: ['bague', 'bijou', 'géométrique', 'élégant'],
  },
  {
    id: 10,
    name: 'Collier Pendentif Minimaliste',
    description: 'Pendentif au design minimaliste et épuré. Impression résine haute précision pour un rendu luxueux. Chaîne acier inoxydable incluse.',
    price: 42.000,
    originalPrice: 55.000,
    category: 'jewelry',
    images: [
      '/Produits/BIJOUX/2/2023-11-29_489ca32446eef.webp',
      '/Produits/BIJOUX/2/2024-03-22_0c1203dc146b1.webp',
    ],
    rating: 4.7, reviews: 145, inStock: true,
    colors: ['#C0C0C0', '#FFD700', '#F5C842'],
    material: 'Résine UV', printTime: '1.5h',
    tags: ['collier', 'pendentif', 'minimaliste', 'bijou'],
  },
  {
    id: 13,
    name: 'Bracelet Tressé 3D',
    description: 'Bracelet au motif tressé unique, entièrement imprimé en 3D en une seule pièce. Souple, léger et personnalisable en couleur.',
    price: 28.000,
    category: 'jewelry',
    images: [
      '/Produits/BIJOUX/3/2025-02-14_ebc190a554d3a.jpg',
      '/Produits/BIJOUX/3/2025-02-19_6a8c5cd2fecbe.jpg',
    ],
    rating: 4.5, reviews: 78, inStock: true, isNew: true,
    colors: ['#F5C842', '#4ECDC4', '#1a1a2e', '#FF6B6B', '#C0C0C0'],
    material: 'TPU Flexible', printTime: '2h',
    tags: ['bracelet', 'bijou', 'tressé', 'flexible'],
  },

  /* ── Accessoires Tech ────────────────────────────────────────────────── */
  {
    id: 2,
    name: 'Coque iPhone Personnalisée',
    description: 'Coque de protection pour iPhone imprimée en 3D avec votre prénom ou design personnalisé. Protection maximale avec style unique.',
    price: 25.000,
    category: 'tech',
    images: [
      'https://images.unsplash.com/photo-1601593346740-925612772716?w=500&q=80',
      'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=500&q=80',
    ],
    rating: 4.9, reviews: 287, inStock: true, isNew: true, isBestSeller: true,
    colors: ['#1a1a2e', '#F5C842', '#4ECDC4', '#FF6B6B'],
    material: 'TPU Flexible', printTime: '2h',
    tags: ['coque', 'iphone', 'personnalisé', 'protection'],
  },
  {
    id: 8,
    name: 'Support Téléphone Voiture',
    description: 'Support magnétique pour smartphone en voiture. Design aérodynamique et fixation sécurisée sur grille d\'aération. Compatible avec tous les téléphones.',
    price: 28.000,
    category: 'tech',
    images: [
      '/Produits/ACCESSOIRES%20TECH/1/2024-07-10_1ef9b7bdf739.webp',
      '/Produits/ACCESSOIRES%20TECH/1/2024-07-10_7429bc52f1964.webp',
    ],
    rating: 4.5, reviews: 178, inStock: true,
    colors: ['#1a1a2e', '#ffffff'],
    material: 'ABS Renforcé', printTime: '3h',
    tags: ['support', 'voiture', 'téléphone', 'magnétique'],
  },
  {
    id: 16,
    name: 'Station de Charge Bureau',
    description: 'Station de charge multi-appareils imprimée en 3D. Rangez et rechargez téléphone, montre et écouteurs élégamment sur votre bureau.',
    price: 55.000,
    originalPrice: 70.000,
    category: 'tech',
    images: [
      '/Produits/ACCESSOIRES%20TECH/2/2025-10-17_77cfe8167b874.webp',
      '/Produits/ACCESSOIRES%20TECH/2/2025-10-17_ba6d61b4b03188.webp',
    ],
    rating: 4.7, reviews: 52, inStock: true, isNew: true,
    colors: ['#1a1a2e', '#ffffff', '#F5C842'],
    material: 'PETG', printTime: '5h',
    tags: ['station', 'charge', 'bureau', 'tech'],
  },

  /* ── Figurines & Art ─────────────────────────────────────────────────── */
  {
    id: 3,
    name: 'Figurine Dragon Articulée',
    description: 'Dragon fantastique entièrement articulé imprimé en une seule pièce. Chaque écaille est détaillée avec précision. Un chef-d\'œuvre de l\'impression 3D.',
    price: 85.000,
    originalPrice: 110.000,
    category: 'figurines',
    images: [
      '/Produits/ART/1/2025-09-29_0e76fc4d870108.webp',
      '/Produits/ART/1/2025-09-29_5ef929c7632408.webp',
    ],
    rating: 5.0, reviews: 89, inStock: true, isBestSeller: true,
    colors: ['#1a1a2e', '#FF6B6B', '#4ECDC4', '#F5C842'],
    material: 'PLA+', printTime: '12h',
    tags: ['dragon', 'figurine', 'articulé', 'fantaisie'],
  },
  {
    id: 15,
    name: 'Figurine Félin Articulée',
    description: 'Chat articulé imprimé en 3D en une seule pièce sans aucun assemblage. Chaque jointure bouge librement. Idéal comme objet de collection ou cadeau.',
    price: 65.000,
    category: 'figurines',
    images: [
      '/Produits/ART/2/2025-07-29_db2061ab40778.webp',
      '/Produits/ART/2/2025-08-22_c1921085c102e.webp',
    ],
    rating: 4.8, reviews: 41, inStock: true, isNew: true,
    colors: ['#F5C842', '#ffffff', '#1a1a2e', '#FF6B6B'],
    material: 'PLA+', printTime: '10h',
    tags: ['chat', 'figurine', 'articulé', 'collection'],
  },

  /* ── Organisateurs ───────────────────────────────────────────────────── */
  {
    id: 4,
    name: 'Organisateur de Bureau Modulaire',
    description: 'Système d\'organisation de bureau modulaire et personnalisable. Rangez stylos, trombones, post-its en style. Design épuré et fonctionnel.',
    price: 55.000,
    category: 'organizers',
    images: [
      '/Produits/ORGANISATEURS/1/2024-02-18_6m3fj544d8o0.webp',
      '/Produits/ORGANISATEURS/1/2024-02-18_ep2uyj46gk1p.webp',
    ],
    rating: 4.7, reviews: 156, inStock: true, isNew: true,
    colors: ['#ffffff', '#F5C842', '#1a1a2e', '#4ECDC4'],
    material: 'PETG', printTime: '6h',
    tags: ['bureau', 'organisateur', 'modulaire', 'fonctionnel'],
  },
  {
    id: 14,
    name: 'Range-Câbles Mural',
    description: 'Organisateur de câbles à fixer au mur. Gardez votre espace propre et sans fil apparent. Compatible tous types de câbles (USB-C, Lightning, HDMI).',
    price: 22.000,
    category: 'organizers',
    images: [
      '/Produits/ORGANISATEURS/2/2025-08-18_6m8o3vvti9j0.webp',
      '/Produits/ORGANISATEURS/2/2025-08-18_wn5xnew561kv.webp',
    ],
    rating: 4.4, reviews: 63, inStock: true, isNew: true,
    colors: ['#ffffff', '#1a1a2e', '#F5C842'],
    material: 'PLA Premium', printTime: '2h',
    tags: ['câbles', 'organisateur', 'mural', 'bureau'],
  },

  /* ── Porte-clés ──────────────────────────────────────────────────────── */
  {
    id: 6,
    name: 'Porte-clés Prénom 3D',
    description: 'Porte-clés avec votre prénom en relief 3D. Cadeau idéal et personnalisé. Résistant et léger, disponible en plus de 20 coloris.',
    price: 15.000,
    category: 'keychains',
    images: [
      '/Produits/PORTE%20CLE/422011c7e3fc3cb3.webp',
      '/Produits/PORTE%20CLE/c7b53efc00fce2e9.webp',
    ],
    rating: 4.9, reviews: 512, inStock: true, isBestSeller: true,
    colors: ['#F5C842', '#4ECDC4', '#FF6B6B', '#1a1a2e', '#ffffff'],
    material: 'PLA Premium', printTime: '45min',
    tags: ['porte-clés', 'prénom', 'cadeau', 'personnalisé'],
  },

  /* ── Personnalisé ────────────────────────────────────────────────────── */
  {
    id: 9,
    name: 'Plaque Prénom Chambre Enfant',
    description: 'Décoration murale avec prénom de votre enfant en 3D. Design joyeux et coloré pour égayer la chambre. Fixation murale simple incluse.',
    price: 40.000,
    category: 'custom',
    images: [
      '/Produits/PERSONNALISE/1/4e2595cc19d41b2c.webp',
      '/Produits/PERSONNALISE/1/c73fb47030d80945.webp',
    ],
    rating: 5.0, reviews: 67, inStock: true, isNew: true,
    colors: ['#F5C842', '#4ECDC4', '#FF6B6B', '#9B59B6'],
    material: 'PLA Premium', printTime: '3h',
    tags: ['prénom', 'enfant', 'chambre', 'décoration'],
  },
  {
    id: 11,
    name: 'Statuette Buste Personnalisé',
    description: 'Créez votre propre statuette à partir d\'une photo ! Scannez votre visage ou celui d\'un proche et recevez un buste 3D imprimé avec précision.',
    price: 200.000,
    category: 'custom',
    images: [
      '/Produits/PERSONNALISE/2/2025-06-03_05155b4609766.webp',
      '/Produits/PERSONNALISE/2/2025-06-03_5dae64896e7c1.webp',
    ],
    rating: 4.9, reviews: 43, inStock: true, isBestSeller: true,
    colors: ['#C0C0C0', '#F5C842', '#ffffff'],
    material: 'Résine Premium', printTime: '15h',
    tags: ['statuette', 'buste', 'personnalisé', 'portrait'],
  },
];

export const featuredProducts = products.filter(p => p.isBestSeller || p.isNew).slice(0, 6);
