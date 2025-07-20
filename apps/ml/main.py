import base64
import logging
import os
import tempfile

import pymupdf
from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware

# Configure logging
# logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create debug directory
debug_dir = "debug_ocr"
os.makedirs(debug_dir, exist_ok=True)

# Create jobs directory for PDF processing
jobs_dir = "jobs"
os.makedirs(jobs_dir, exist_ok=True)

app = FastAPI(title="Technical Drawing Analyzer API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)


@app.get("/")
async def root():
    return {"message": "Technical Drawing Analyzer API is running"}


@app.post("/split-pdf")
async def split_pdf(pdf: UploadFile = File(...)):
    """
    Split a PDF file into images and return them as base64-encoded strings.

    Args:
        pdf: The uploaded PDF file
        job_id: Unique identifier for this processing job (UUID)

    Returns:
        Dictionary containing job information and base64-encoded page images
    """
    try:
        # Create a temporary directory for the uploaded PDF
        with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as temp_pdf:
            # Write uploaded file to temporary location
            content = await pdf.read()
            temp_pdf.write(content)
            temp_pdf_path = temp_pdf.name

        # Open the PDF file
        pdf_document = pymupdf.open(temp_pdf_path)
        total_pages = len(pdf_document)
        pages_data = []

        # Calculate zoom factor for 300 DPI (default PDF is 72dpi)
        zoom = 300 / 72

        # Process each page
        for page_num in range(total_pages):
            page = pdf_document[page_num]
            # mat = fitz.Matrix(zoom, zoom)
            pix = page.get_pixmap()

            # Get image dimensions
            width = pix.width
            height = pix.height

            # Convert pixmap to PNG bytes
            png_bytes = pix.tobytes("png")

            # Convert PNG bytes to base64
            base64_image = base64.b64encode(png_bytes).decode("utf-8")

            pages_data.append(
                {
                    "page_number": page_num + 1,
                    "image_data": base64_image,
                    "width": width,
                    "height": height,
                }
            )

            logger.info(f"Processed page {page_num + 1} - dimensions: {width}x{height}")

        pdf_document.close()

        # Clean up temporary PDF file
        os.unlink(temp_pdf_path)

        return {
            "success": True,
            # "job_id": job_id,
            "total_pages": total_pages,
            "pages": pages_data,
        }

    except Exception as e:
        logger.error(f"Error splitting PDF: {str(e)}")
        # Clean up temporary file if it exists
