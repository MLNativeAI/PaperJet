import fs from "node:fs";
import path from "node:path";
import type { ApiRoutes } from "@api/index";
import { test } from "@playwright/test";
import { hc } from "hono/client";
import { LoginPage } from "../page-objects/login-page";

const client = hc<ApiRoutes>("/");

test.setTimeout(180000); // 3 minutes

test.describe("Extract energy invoice for Energa", () => {
  test("login, create and run extraction", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login("lukasz@mlnative.com", "lukasz@mlnative.com");

    const file = path.join(process.cwd(), "tests/fixtures/energa/Energa.pdf");

    const response = await page.request.post("/api/workflows", {
      multipart: {
        file: {
          name: "Energa.pdf",
          mimeType: "application/pdf",
          buffer: fs.readFileSync(file),
        },
      },
    });

    if (!response.ok) {
      console.log(response.status);
      throw new Error("Failed to create workflow from file");
    }

    const createResult = await response.json();
    const workflowId = createResult.workflowId;

    // 2nd request: Update workflow with schema
    const schemaResponse = await page.request.put(`/api/workflows/${workflowId}`, {
      data: {
        fields: [
          {
            name: "invoice_number",
            description: "Invoice number from Energa",
            type: "string"
          },
          {
            name: "total_amount",
            description: "Total amount to pay",
            type: "number"
          },
          {
            name: "due_date",
            description: "Payment due date",
            type: "date"
          }
        ]
      }
    });

    if (!schemaResponse.ok) {
      console.log("Schema update failed:", schemaResponse.status);
      throw new Error("Failed to update workflow schema");
    }

    // 3rd request: Set workflow name and description
    const nameResponse = await page.request.patch(`/api/workflows/${workflowId}/basic-data`, {
      data: {
        slug: "Energa Invoice Extraction",
        description: "Extract key fields from Energa energy invoices including invoice number, amount, and due date"
      }
    });

    if (!nameResponse.ok) {
      console.log("Name update failed:", nameResponse.status);
      throw new Error("Failed to update workflow name and description");
    }

    console.log("Workflow created and configured successfully:", workflowId);

    // 4th request: Execute the workflow with the same file
    const executionResponse = await page.request.post("/api/executions", {
      multipart: {
        workflowId: workflowId,
        file: {
          name: "Energa.pdf",
          mimeType: "application/pdf",
          buffer: fs.readFileSync(file),
        },
      },
    });

    if (!executionResponse.ok) {
      console.log("Execution failed:", executionResponse.status);
      throw new Error("Failed to execute workflow");
    }

    const executionResult = await executionResponse.json();
    console.log("Workflow execution started:", executionResult.workflowExecutionId);
  });
});
