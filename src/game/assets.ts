export type GameImages = {
  idle: HTMLImageElement[];
  charge: HTMLImageElement[];
  jump: HTMLImageElement[];
  shoes: Record<string, HTMLImageElement>;
  backgrounds: Record<string, HTMLImageElement>;
};

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load ${src}`));
    img.src = src;
  });
}

export async function loadGameImages(): Promise<GameImages> {
  const frame = (prefix: string) => Promise.all([1, 2, 3, 4].map((n) => loadImage(`/assets/${prefix}-${n}.png`)));

  const [idle, charge, jump, classic, wallabee, leather, sixty, desert, stamp, wheat, tan, cocoa, black, gold, greatbrak, schoolyard, woodstock, workshops, longstreet, tablemtn, waterfront, blouberg] =
    await Promise.all([
      frame("runner-idle"),
      frame("runner-charge"),
      frame("runner-jump"),
      loadImage("/assets/shoe-classic.png"),
      loadImage("/assets/shoe-wallabee.png"),
      loadImage("/assets/shoe-leather.png"),
      loadImage("/assets/shoe-60print.png"),
      loadImage("/assets/shoe-desert.png"),
      loadImage("/assets/shoe-stamp.png"),
      loadImage("/assets/shoe-wheat.png"),
      loadImage("/assets/shoe-tan.png"),
      loadImage("/assets/shoe-cocoa.png"),
      loadImage("/assets/shoe-black.png"),
      loadImage("/assets/shoe-gold.png"),
      loadImage("/assets/bg-greatbrak.jpg"),
      loadImage("/assets/bg-schoolyard.jpg"),
      loadImage("/assets/bg-woodstock.jpg"),
      loadImage("/assets/bg-workshops.jpg"),
      loadImage("/assets/bg-longstreet.jpg"),
      loadImage("/assets/bg-tablemountain.jpg"),
      loadImage("/assets/bg-waterfront.jpg"),
      loadImage("/assets/bg-blouberg.jpg"),
    ]);

  return {
    idle,
    charge,
    jump,
    shoes: { classic, wallabee, leather, sixty, desert, stamp, wheat, tan, cocoa, black, gold },
    backgrounds: {
      "/assets/bg-greatbrak.jpg": greatbrak,
      "/assets/bg-schoolyard.jpg": schoolyard,
      "/assets/bg-woodstock.jpg": woodstock,
      "/assets/bg-workshops.jpg": workshops,
      "/assets/bg-longstreet.jpg": longstreet,
      "/assets/bg-tablemountain.jpg": tablemtn,
      "/assets/bg-waterfront.jpg": waterfront,
      "/assets/bg-blouberg.jpg": blouberg,
    },
  };
}
