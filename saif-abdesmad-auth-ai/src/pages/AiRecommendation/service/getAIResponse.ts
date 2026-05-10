import { products } from "../../../data/products";
import { formatPrice } from "../../../utils/format";
import type { Product } from "../../../data/products";

import { callMistral } from "./callMistrall";

export const getAIResponseMock = (query: string): { text: string; recs: Product[] } => {
  const q = query.toLowerCase();
  let recs: Product[] = [];
  let text = "";

  if (q.includes("salon") || q.includes("décor") || q.includes("maison") || q.includes("intérieur")) {
    recs = products.filter(p => p.category === "home-decor");
    text = `🏠 **Pour votre intérieur**\n\nVoici nos meilleures créations déco. Toutes sont personnalisables.`;
  }

  else if (q.includes("cadeau") || q.includes("ami") || q.includes("offrir")) {
    recs = products.filter(p => p.isBestSeller && p.inStock).slice(0, 4);
    text = `🎁 **Cadeaux qui marquent**\n\nNos sélections les plus offertes.`;
  }

  else if (q.includes("bijou") || q.includes("bague") || q.includes("collier")) {
    recs = products.filter(p => p.category === "jewelry");
    text = `💎 **Collection bijoux**\n\nImprimés en résine UV haute précision.`;
  }

  else if (q.includes("tech") || q.includes("bureau") || q.includes("organis")) {
    recs = products.filter(p => p.category === "tech" || p.category === "organizers");
    text = `💻 **Accessoires & Organisation**\n\nFonctionnels et stylés.`;
  }

  else if (q.includes("enfant") || q.includes("figurine") || q.includes("dragon")) {
    recs = products.filter(p => p.category === "figurines");
    text = `🐉 **Figurines 3D articulées**\n\nLe dragon est notre bestseller.`;
  }

  else if (q.includes("budget") || q.includes("30") || q.includes("pas cher")) {
    recs = products.filter(p => p.price < 35).sort((a, b) => a.price - b.price);
    text = `💰 **Petits prix, grande qualité**\n\nÀ partir de ${formatPrice(15)}.`;
  }

  else if (q.includes("personnalis") || q.includes("prénom")) {
    recs = products.filter(p => p.category === "custom" || p.tags.includes("personnalisé"));
    text = `⭐ **Personnalisation totale**\n\nChaque pièce est unique.`;
  }

  else {
    recs = products.filter(p => p.isBestSeller || p.isNew).slice(0, 4);
    text = `✨ **Nos coups de cœur du moment**\n\nDites-moi plus pour affiner.`;
  }

  return { text, recs: recs.slice(0, 4) };
};





export const getAIResponseMistral = async (query: string): Promise<{ text: string; recs: Product[] }> => {

  // If Ollama (Mistral) isn't reachable, gracefully fall back to the local mock
  // so the chat never hangs during demos.
  try {
    const { text, wantsRec } = await callMistral(query);

    let recs: Product[] = [];
    if (wantsRec) {
      recs = products
        .filter(p => p.isBestSeller || p.isNew)
        .slice(0, 4);
    }
    return { text, recs };
  } catch (err) {
    console.warn("Mistral unavailable, using local mock:", err);
    return getAIResponseMock(query);
  }
}

