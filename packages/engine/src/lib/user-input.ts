import { logger } from "@paperjet/shared";
import type { ImagePart } from "ai";
import { getValidModelConfig } from "../services/admin-service";
import { convertPdfToImages } from "../services/pdf-image-service";

export const prepareUserInput = async (presignedUrl: string): Promise<ImagePart[]> => {
  const modelConfig = await getValidModelConfig();
  if (modelConfig.type === "cloud") {
    return [
      {
        type: "image",
        image: new URL(presignedUrl),
      },
    ];
  } else {
    const images = await convertPdfToImages(presignedUrl);
    if (images.success) {
      return images.pages.map((base64Image) => {
        return {
          type: "image",
          image: base64Image.image_data,
        };
      });
    } else {
      logger.error("Split operation failed");
      throw new Error("PDF split operation has failed");
    }
  }
};
