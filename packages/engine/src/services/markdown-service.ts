import { db } from "@paperjet/db";
import { documentPage } from "@paperjet/db/schema";
import { logger } from "@paperjet/shared";
import { eq } from "drizzle-orm";
import { generateText } from "../lib/ai-sdk-wrapper";
import { s3Client } from "../lib/s3";

export type MarkdownDocument = {
  pages: string[];
  fullDocument: string;
};

export const convertPageToMarkdown = async (workflowExecutionId: string, documentPageId: string): Promise<void> => {
  const pageData = await db.query.documentPage.findFirst({
    where: eq(documentPage.id, documentPageId),
  });
  if (!pageData) {
    throw new Error(`Page ID ${documentPageId} not found`);
  }
  const pageFilePath = `executions/${workflowExecutionId}/pages/page-${pageData.pageNumber}.png`;
  const pageBuffer = await s3Client.file(pageFilePath).arrayBuffer();
  logger.info(`Converting page ${pageData.pageNumber} to markdown`);
  const markdownPage = await extractMarkdownFromPageImage(pageBuffer);

  await db
    .update(documentPage)
    .set({
      rawMarkdown: markdownPage,
    })
    .where(eq(documentPage.id, documentPageId));

  logger.info(`Converted page ${pageData.pageNumber} to markdown`);
};

const extractMarkdownFromPageImage = async (pageBuffer: ArrayBuffer) => {
  const prompt =
    "You're an expert in document processing. Please convert this document page into markdown. Reply only with the markdown, make sure to preserve all of the original content of the document page.";

  const result = await generateText("convert-to-markdown", {
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
            image: pageBuffer,
          },
        ],
      },
    ],
  });

  return result;
};
