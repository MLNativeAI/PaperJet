import { logger } from "@paperjet/shared";
import type { PdfSplitResult } from "../types";

export const convertPdfToImages = async (presignedUrl: string): Promise<PdfSplitResult> => {
  const formData = new FormData();
  formData.set("presigned_url", presignedUrl);
  const response = await fetch("http://localhost:8000/split-pdf", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    logger.error(`Failed to split PDF: ${response.status}`);
    return {
      pages: [],
      total_pages: 0,
      success: false,
    };
  }

  const result = (await response.json()) as unknown as PdfSplitResult;

  logger.info(
    {
      totalPages: result.total_pages,
    },
    "PDF Split result:",
  );
  return result;
};
