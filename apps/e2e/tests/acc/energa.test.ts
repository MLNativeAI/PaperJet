import fs from "node:fs";
import path from "node:path";
import { WorkflowExecutionStatus, type WorkflowConfiguration } from "@paperjet/engine/types";
import { expect, test } from "@playwright/test";
import { LoginPage } from "../page-objects/login-page";

test.setTimeout(180000); // 3 minutes

test.describe("Extract energy invoice for Energa", () => {
  test("login, create and run extraction", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login("lukasz@mlnative.com", "lukasz@mlnative.com");

    const file = path.join(process.cwd(), "tests/fixtures/energa/Energa.pdf");

    const configuration: WorkflowConfiguration = {
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
          fields: [
            {
              name: "Period from",
              type: "date",
            },
            {
              name: "Period to",
              type: "date",
            },
            {
              name: "Total MWh",
              type: "number",
            },
            {
              name: "Należność",
              type: "number",
            },
            {
              name: "Średnia cenna netto",
              type: "string",
            },
          ],
          tables: [
            {
              name: "Sales and distribution table",
              columns: [
                {
                  name: "Nazwa towaru lub usługi",
                  type: "string",
                },
                {
                  name: "Współczynnik",
                  type: "string",
                },
                {
                  name: "Ilość / Zużycie",
                  type: "string",
                },
                {
                  name: "Jedn. Miary",
                  type: "string",
                },
                {
                  name: "Cena jedn. netto",
                  type: "number",
                },
                {
                  name: "Wartość netto",
                  type: "number",
                },
              ],
            },
          ],
        },
      ],
    };

    const payload = {
      name: "Energa invoice parser",
      description: "Extracts core invoice information",
      configuration: configuration,
    };

    const newWorkflow = await page.request.post("/api/v1/workflows", {
      data: payload,
    });

    console.log(JSON.stringify(await newWorkflow.json(), null, 2));
    expect(newWorkflow.ok()).toBeTruthy();

    const createResult = await newWorkflow.json();
    const workflowId = createResult.workflowId;

    console.log(`New workflow ID: ${workflowId}`);

    const executionResponse = await page.request.post(`/api/v1/workflows/${workflowId}/execute`, {
      multipart: {
        workflowId: workflowId,
        file: {
          name: "Energa.pdf",
          mimeType: "application/pdf",
          buffer: fs.readFileSync(file),
        },
      },
    });

    expect(executionResponse.ok()).toBeTruthy();
    if (!executionResponse.ok) {
      console.log("Execution failed:", executionResponse.status);
      throw new Error("Failed to execute workflow");
    }

    const { workflowExecutionId } = await executionResponse.json();
    console.log(`Workflow executionId: ${workflowExecutionId}`);

    let currentStatus = null;
    while (currentStatus !== WorkflowExecutionStatus.enum.Completed) {
      const statusResponse = await page.request.fetch(
        `/api/v1/workflows/${workflowId}/executions/${workflowExecutionId}`,
      );
      expect(statusResponse.ok()).toBeTruthy();
      if (!statusResponse.ok) {
        console.log("Failed to get status", executionResponse.status);
        throw new Error("Failed to get status ");
      }
      const { status } = await statusResponse.json();
      console.log(status);
      await page.waitForTimeout(3000);
      currentStatus = status;
    }
  });
});
