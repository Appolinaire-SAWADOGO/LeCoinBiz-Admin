export type CategoryItem = {
  id: number;
  name: string;
};

export type SubCategoryItem = {
  id: number;
  categoryId: number;
  name: string;
};

export const CATEGORIES: CategoryItem[] = [
  { id: 1, name: "Véhicules" },
  { id: 2, name: "Immobilier" },
  { id: 3, name: "Informatique & High-Tech" },
  { id: 4, name: "Maison & Électroménager" },
  { id: 5, name: "Mode & Beauté" },
  { id: 6, name: "Bébé & Enfant" },
  { id: 7, name: "Matériel Professionnel" },
  { id: 8, name: "Animaux & Élevage" },
  { id: 9, name: "Sports & Loisirs" },
  { id: 10, name: "Services" },
  { id: 11, name: "Artisanat & Culture" },
  { id: 12, name: "Alimentation & Restauration" },
  { id: 13, name: "Santé & Bien-être" },
];

export const CATEGORIES_NAMES = CATEGORIES.map((category) => category.name);

export const SUB_CATEGORIES: SubCategoryItem[] = [
  // Véhicules
  { id: 1, categoryId: 1, name: "Vélos" },
  { id: 2, categoryId: 1, name: "Motos & tricycles" },
  { id: 3, categoryId: 1, name: "Voitures" },
  { id: 4, categoryId: 1, name: "Camions & bus" },
  { id: 5, categoryId: 1, name: "Pièces & accessoires" },
  { id: 6, categoryId: 1, name: "Location de véhicules" },

  // Immobilier
  { id: 7, categoryId: 2, name: "Maisons à vendre" },
  { id: 8, categoryId: 2, name: "Locations" },
  { id: 9, categoryId: 2, name: "Terrains" },
  {
    id: 10,
    categoryId: 2,
    name: "Bureaux & magasins",
  },
  { id: 11, categoryId: 2, name: "Hôtels & hébergements" },

  // Informatique & High-Tech
  { id: 12, categoryId: 3, name: "Téléphones portables" },
  { id: 13, categoryId: 3, name: "Ordinateurs & tablettes" },
  { id: 14, categoryId: 3, name: "Accessoires" },
  {
    id: 15,
    categoryId: 3,
    name: "Appareils électroniques",
  },
  { id: 16, categoryId: 3, name: "Réparation & maintenance" },

  // Maison & Électroménager
  { id: 17, categoryId: 4, name: "Meubles & déco" },
  {
    id: 18,
    categoryId: 4,
    name: "Appareils électroménagers",
  },
  {
    id: 19,
    categoryId: 4,
    name: "Cuisine & ustensiles",
  },
  { id: 20, categoryId: 4, name: "Bricolage & outils" },

  // Mode & Beauté
  { id: 21, categoryId: 5, name: "Vêtements" },
  { id: 22, categoryId: 5, name: "Chaussures" },
  { id: 23, categoryId: 5, name: "Montres & bijoux" },
  { id: 24, categoryId: 5, name: "Sacs & maroquinerie" },
  { id: 25, categoryId: 5, name: "Accessoires divers" },
  { id: 26, categoryId: 5, name: "Produits de beauté" },
  { id: 27, categoryId: 5, name: "Tissus & pagnes" },
  {
    id: 28,
    categoryId: 5,
    name: "Services de beauté",
  },

  // Bébé & Enfant
  {
    id: 29,
    categoryId: 6,
    name: "Vêtements pour bébé",
  },
  { id: 30, categoryId: 6, name: "jouets pour bébé" },
  {
    id: 31,
    categoryId: 6,
    name: "Accessoires pour bébé",
  },

  // Matériel Professionnel
  { id: 32, categoryId: 7, name: "Matériel de construction" },
  { id: 33, categoryId: 7, name: "Matériel agricole" },
  { id: 34, categoryId: 7, name: "Bureaux & fournitures" },
  { id: 35, categoryId: 7, name: "Outillage" },

  // Animaux & Élevage
  { id: 36, categoryId: 8, name: "Bœufs & vaches" },
  { id: 37, categoryId: 8, name: "Moutons & chèvres" },
  { id: 38, categoryId: 8, name: "Volaille" },
  { id: 39, categoryId: 8, name: "Chiens & chats" },
  { id: 40, categoryId: 8, name: "Porcs" },
  { id: 41, categoryId: 8, name: "Lapins" },
  {
    id: 42,
    categoryId: 8,
    name: "Accessoires & alimentation d'animaux",
  },

  // Sports & Loisirs
  { id: 43, categoryId: 9, name: "Instruments de musique" },
  { id: 44, categoryId: 9, name: "Équipements sportifs" },
  { id: 45, categoryId: 9, name: "Livres" },
  { id: 46, categoryId: 9, name: "Jeux" },
  { id: 47, categoryId: 10, name: "Tourisme & Guide" },

  // Services
  { id: 48, categoryId: 10, name: "Cours & formations" },
  {
    id: 49,
    categoryId: 10,
    name: "Transport & déménagement",
  },
  { id: 50, categoryId: 10, name: "Services de réparations" },
  {
    id: 51,
    categoryId: 10,
    name: "Services événementiel",
  },
  { id: 52, categoryId: 10, name: "Services à domicile" },
  { id: 53, categoryId: 10, name: "Services divers" },

  // Artisanat & Culture
  { id: 54, categoryId: 11, name: "Objets d'art" },
  { id: 55, categoryId: 11, name: "Poterie & sculpture" },
  {
    id: 56,
    categoryId: 11,
    name: "Tissage & couture",
  },
  { id: 57, categoryId: 11, name: "Peinture & décoration" },
  { id: 58, categoryId: 11, name: "Matériel d'artisanat" },

  // Alimentation & Restauration
  {
    id: 59,
    categoryId: 12,
    name: "Plats cuisinés & street food",
  }, //allocot, frites, etc.
  { id: 60, categoryId: 12, name: "Épicerie & produits locaux" },
  { id: 61, categoryId: 12, name: "Boissons" },

  // Santé & Bien-être
  {
    id: 62,
    categoryId: 13,
    name: "Médicaments & produits de santé",
  },
  { id: 63, categoryId: 13, name: "Matériel médical" },
  { id: 64, categoryId: 13, name: "Optique & lunetterie" },
  {
    id: 65,
    categoryId: 13,
    name: "Plantes médicinales & tradipraticiens",
  },
];

export const subCategoriesNames = (categoryName: string): string[] => {
  const categoryId = CATEGORIES.find(
    (category) => category.name === categoryName,
  )?.id;

  return SUB_CATEGORIES.filter(
    (subCategory) => subCategory.categoryId === categoryId,
  ).map((subCategory) => subCategory.name);
};

export const subCategories = (categoryName: string): SubCategoryItem[] => {
  const categoryId = CATEGORIES.find(
    (category) => category.name === categoryName,
  )?.id;

  return SUB_CATEGORIES.filter(
    (subCategory) => subCategory.categoryId === categoryId,
  );
};
