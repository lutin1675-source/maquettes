import { defineCollection, z } from 'astro:content';

const cardsSection = z.object({
	type: z.literal('cards'),
	id: z.string(),
	title: z.string(),
	cards: z.array(
		z.object({
			title: z.string(),
			description: z.string().optional(),
			meta: z.string().optional(),
			details: z.array(z.string()).optional(),
		}),
	),
});

const listSection = z.object({
	type: z.literal('list'),
	id: z.string(),
	title: z.string(),
	items: z.array(z.string()),
});

const textSection = z.object({
	type: z.literal('text'),
	id: z.string(),
	title: z.string(),
	body: z.string(),
});

const docSection = z.discriminatedUnion('type', [cardsSection, listSection, textSection]);

const hubCollectionSchema = z.object({
	title: z.string(),
	description: z.string(),
	introLabel: z.string(),
	introTitle: z.string(),
	introDescription: z.string(),
	editorialNotes: z.array(z.string()).optional(),
	contributeSteps: z.array(z.string()).optional(),
	workflow: z.array(z.string()).optional(),
});

const guideSchema = z.object({
	title: z.string(),
	summary: z.string(),
	description: z.string(),
	introLabel: z.string(),
	introTitle: z.string(),
	introBody: z.string(),
	order: z.number(),
	highlights: z.array(z.string()),
	breadcrumbs: z.array(
		z.object({
			label: z.string(),
			href: z.string().optional(),
		}),
	),
	docSections: z.array(docSection),
});

const infoSection = z.discriminatedUnion('type', [
	z.object({
		type: z.literal('cards'),
		title: z.string(),
		cards: z.array(
			z.object({
				label: z.string(),
				value: z.string().optional(),
				description: z.string(),
			}),
		),
	}),
	z.object({
		type: z.literal('list'),
		title: z.string(),
		items: z.array(z.string()),
	}),
]);

const infoPageSchema = z.object({
	title: z.string(),
	description: z.string(),
	heroLabel: z.string(),
	heroTitle: z.string(),
	heroBody: z.string(),
	sections: z.array(infoSection),
});

const modelSectionSchema = z.object({
	id: z.string(),
	title: z.string(),
	body: z.string(),
});

const imageField = z.object({
	src: z.string(),
	alt: z.string(),
	credit: z.string().optional(),
});

const galleryImageField = imageField.extend({
	caption: z.string().optional(),
});

const modelSchema = z.object({
	title: z.string(),
	manufacturer: z.string().optional(),
	reference: z.string().optional(),
	scale: z.string().optional(),
	summary: z.string(),
	intro: z.string(),
	coverImage: imageField.optional(),
	boxImage: imageField.optional(),
	historyImage: imageField.optional(),
	buildImages: z.array(galleryImageField).min(1).optional(),
	tags: z.array(z.string()).optional(),
	sections: z.array(modelSectionSchema),
	sources: z.array(z.string()).optional(),
});

export const collections = {
	'atelier-hub': defineCollection({
		type: 'content',
		schema: hubCollectionSchema,
	}),
	'atelier-guides': defineCollection({
		type: 'content',
		schema: guideSchema,
	}),
	'banc-hub': defineCollection({
		type: 'content',
		schema: hubCollectionSchema,
	}),
	'banc-guides': defineCollection({
		type: 'content',
		schema: guideSchema,
	}),
	'info-pages': defineCollection({
		type: 'content',
		schema: infoPageSchema,
	}),
	'atelier-models': defineCollection({
		type: 'content',
		schema: modelSchema,
	}),
};
