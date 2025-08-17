import path from "node:path";
import { test } from "@playwright/test";
import dotenv from "dotenv";
import { energaWorkflowConfig } from "fixtures/energa/energa-config";
import { awaitWorkflowExecutionCompleted, createNewWorkflow, startWorkflowExecution } from "helpers/test-helpers";
import { verifyExtractionAccuracy } from "helpers/verify";
import { LoginPage } from "page-objects/login-page";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

test.setTimeout(180000); // 3 minutes

test.describe("Extract energy invoice for Energa", () => {
  test("login, create and run extraction", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login("lukasz@mlnative.com", "lukasz@mlnative.com");

    const inputFilePath = path.join(process.cwd(), "/fixtures/energa/Energa.pdf");
    const expectedResultFilePath = path.join(process.cwd(), "/fixtures/energa/energa-result.json");

    const workflowId = await createNewWorkflow("Energa invoice parser", "Test workflow", energaWorkflowConfig, page);
    const workflowExecutionId = await startWorkflowExecution(workflowId, inputFilePath, page);
    await awaitWorkflowExecutionCompleted(workflowId, workflowExecutionId, page);
    await verifyExtractionAccuracy(workflowId, workflowExecutionId, expectedResultFilePath, page);
  });
});
