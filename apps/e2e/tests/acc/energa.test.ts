import fs from "node:fs";
import path from "node:path";
import { expect, test } from "@playwright/test";
import { LoginPage } from "../page-objects/login-page";

test.setTimeout(180000); // 3 minutes

test.describe("Extract energy invoice for Energa", () => {
  test("login, create and run extraction", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login("lukasz@mlnative.com", "lukasz@mlnative.com");

    const file = path.join(process.cwd(), "tests/fixtures/energa/Energa.pdf");

    const newWorkflow = await page.request.post("/api/v1/workflows", {
      data: {
        name: "Energa invoice parser",
        description: "Extracts core invoice information",
        configuration: {
          objects: [
            {
              name: "Seller details",
              fields: [
                {
                  name: "Seller name",
                  type: "string",
                },
                {
                  name: "Seller address",
                  type: "string",
                },
                {
                  name: "Seller NIP",
                  type: "string",
                },
              ],
            },
            {
              name: "Buyer details",
              fields: [
                {
                  name: "Buyer name",
                  type: "string",
                },
                {
                  name: "Buyer address",
                  type: "string",
                },
                {
                  name: "Buyer NIP",
                  type: "string",
                },
                {
                  name: "Customer number",
                  type: "string",
                },
              ],
            },
            {
              name: "Invoice Data",
              fields: [
                {
                  name: "Invoice Number",
                  type: "string",
                },
                {
                  name: "Billing period start",
                  type: "date",
                },
                {
                  name: "Billing period end",
                  type: "date",
                },
                {
                  name: "PPE Number",
                  type: "string",
                },
                {
                  name: "Total amount",
                  type: "number",
                },
                {
                  name: "Invoice Currency",
                  type: "string",
                  description: "3-letter currency code",
                },
                {
                  name: "Invoice due date",
                  type: "date",
                },
                {
                  name: "Invoice issue date",
                  type: "date",
                },
              ],
            },
            {
              name: "Energy usage data",
              tables: [
                {
                  name: "Sales and distribution",
                  description: "Refererred to as 'Sprzedaż/dystrybucja energii elektrycznej'.",
                  columns: [
                    {
                      name: "Entry name",
                      type: "string",
                    },
                    {
                      name: "Net amount",
                      type: "number",
                    },
                    {
                      name: "VAT rate",
                      type: "number",
                    },
                    {
                      name: "Tax amount",
                      type: "number",
                    },
                    {
                      name: "Total amount",
                      type: "number",
                    },
                    {
                      name: "Period from",
                      type: "date",
                    },
                    {
                      name: "Period to",
                      type: "date",
                    },
                  ],
                },
              ],
            },
          ],
        },
      },
    });

    console.log(JSON.stringify(await newWorkflow.json(), null, 2));
    expect(newWorkflow.ok()).toBeTruthy();

    const createResult = await newWorkflow.json();
    const workflowId = createResult.workflowId;

    console.log(`New workflow ID: ${workflowId}`);

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
