import fs from "node:fs";
import path from "node:path";
import { expect, test } from "@playwright/test";
import { energaWorkflowConfig } from "fixtures/energa/energa-config";
import { awaitWorkflowExecutionCompleted, createNewWorkflow, startWorkflowExecution } from "helpers/test-helpers";
import { LoginPage } from "page-objects/login-page";
import { verifyExtractionAccuracy } from "helpers/verify";

import dotenv from "dotenv";
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

test.setTimeout(180000); // 3 minutes

test.describe("Extract energy invoice for Energa", () => {
  test("login, create and run extraction", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login("lukasz@mlnative.com", "lukasz@mlnative.com");

    const inputFilePath = path.join(process.cwd(), "/fixtures/energa/Energa.pdf");
    const expectedResultFilePath = path.join(process.cwd(), "/fixtures/energa/energa-result.json");

    // const workflowId = await createNewWorkflow("Energa invoice parser", "Test workflow", energaWorkflowConfig, page);
    // const workflowExecutionId = await startWorkflowExecution(workflowId, inputFilePath, page);
    // await awaitWorkflowExecutionCompleted(workflowId, workflowExecutionId, page);
    const workflowExecutionId = "exe_a814c0e692a3";
    const workflowId = "wkf_22a8ce5ea060";

    await verifyExtractionAccuracy(workflowId, workflowExecutionId, expectedResultFilePath, page, inputFilePath);
  });
});
