import { z } from 'zod';

export const UiNode = z.object({
  type: z.enum([
    'Page','Header','Section','Card','Tabs','Tab','Table','Form','Field',
    'Text','Badge','Button','Icon','Banner','Toast','Modal','Avatar',
    'Breadcrumbs','Footer'
  ]),
  props: z.record(z.any()).optional(),
  children: z.array(z.lazy(() => UiNode)).optional()
});

export const UiResponse = z.object({
  version: z.literal('1.0'),
  title: z.string(),
  tree: UiNode
});

export type UiResponse = z.infer<typeof UiResponse>;
export type UiNode = z.infer<typeof UiNode>;