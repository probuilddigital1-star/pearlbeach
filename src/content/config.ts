import { defineCollection, z } from 'astro:content';

const cottagesCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    shortTitle: z.string(),
    description: z.string(),
    vrboId: z.string(),
    vrboUrl: z.string(),
    bedrooms: z.number(),
    bathrooms: z.string(),
    sleeps: z.number(),
    sqft: z.number(),
    rating: z.number(),
    featured: z.boolean().default(false),
    basePrice: z.number().optional(),
    amenities: z.array(z.string()),
    heroImage: z.string(),
    images: z.array(z.string()),
    location: z.object({
      city: z.string(),
      state: z.string(),
      region: z.string(),
    }),
    highlights: z.array(z.object({
      icon: z.string(),
      title: z.string(),
      description: z.string(),
    })).optional(),
  }),
});

const reviewsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    author: z.string(),
    rating: z.number(),
    date: z.string(),
    cottage: z.string(),
    title: z.string(),
  }),
});

export const collections = {
  cottages: cottagesCollection,
  reviews: reviewsCollection,
};
