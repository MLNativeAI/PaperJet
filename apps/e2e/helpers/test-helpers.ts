import fs from "node:fs";
import { type WorkflowConfiguration, WorkflowExecutionStatus } from "@paperjet/engine/types";
import { expect, type Page } from "@playwright/test";

export async function createNewWorkflow(
  _name: string,
  _description: string,
  config: WorkflowConfiguration,
  page: Page,
) {
  const payload = {
    name: "Energa invoice parser",
    description: "Extracts core invoice information",
    configuration: config,
  };
  const newWorkflow = await page.request.post("/api/v1/workflows", {
    headers: {
      "x-api-key": process.env.API_KEY || "",
    },
    data: payload,
  });

  console.log(JSON.stringify(await newWorkflow.json(), null, 2));
  expect(newWorkflow.ok()).toBeTruthy();

  const createResult = await newWorkflow.json();
  const workflowId = createResult.workflowId;
  console.log(`New workflow ID: ${workflowId}`);
  return workflowId;
}

export async function startWorkflowExecution(workflowId: string, filePath: string, page: Page) {
  const executionResponse = await page.request.post(`/api/v1/workflows/${workflowId}/execute`, {
    headers: {
      "x-api-key": process.env.API_KEY || "",
    },
    multipart: {
      workflowId: workflowId,
      file: {
        name: "Energa.pdf",
        mimeType: "application/pdf",
        buffer: fs.readFileSync(filePath),
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
  return workflowExecutionId;
}
export async function awaitWorkflowExecutionCompleted(workflowId: string, workflowExecutionId: string, page: Page) {
  let currentStatus = null;
  while (currentStatus !== WorkflowExecutionStatus.enum.Completed) {
    const statusResponse = await page.request.fetch(
      `/api/v1/workflows/${workflowId}/executions/${workflowExecutionId}`,
      {
        headers: {
          "x-api-key": process.env.API_KEY || "",
        },
      },
    );
    expect(statusResponse.ok()).toBeTruthy();
    if (!statusResponse.ok) {
      console.log("Failed to get status", statusResponse.status);
      throw new Error("Failed to get status ");
    }
    const { status, extractedData } = await statusResponse.json();
    console.log(status);
    await page.waitForTimeout(3000);
    currentStatus = status;
    if (currentStatus === WorkflowExecutionStatus.enum.Completed) {
      return extractedData;
    }
  }
}
