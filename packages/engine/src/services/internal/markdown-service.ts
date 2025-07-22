import { logger } from "@paperjet/shared";
import { z } from "zod";
import { generateObject } from "../../lib/ai-sdk-wrapper";
import { convertPdfToImages } from "./pdf-image-service";

export type MarkdownDocument = {
  pages: string[];
  fullDocument: string;
};

export const convertDocumentToMarkdown = async (presignedUrl: string): Promise<MarkdownDocument> => {
  const pdfSplitResult = await convertPdfToImages(presignedUrl);

  logger.info("Converting document to markdown");

  const markdownPages = [];
  // we need to add queueing support for large documents to do this in parallel
  for (let index = 0; index < pdfSplitResult.pages.length; index++) {
    logger.debug(`Converting page ${index + 1} into markdown`);
    const pageImage = pdfSplitResult.pages[index];
    if (!pageImage) {
      throw new Error("Page not found");
    }
    const extractionResult = await extractMarkdownFromPageImage(pageImage.image_data);
    markdownPages.push(extractionResult.markdown);
  }

  const markdownDocument = {
    pages: markdownPages,
    fullDocument: markdownPages.join("\n"),
  };
  logger.info("Markdown extraction completed");
  return markdownDocument;
};

const extractMarkdownFromPageImage = async (imageBase64: string) => {
  const prompt =
    "You're an expert in document processing. Please convert this document page into markdown. Reply only with the markdown, make sure to preserve all of the original content of the document page.";

  const result = await generateObject("convert-to-markdown", {
    schema: z.object({
      markdown: z.string(),
    }),
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: prompt,
          },
          {
            type: "image",
            image: imageBase64,
          },
        ],
      },
    ],
  });

  return result.object;
};
