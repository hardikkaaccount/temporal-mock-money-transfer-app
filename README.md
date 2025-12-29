# Temporal Money Transfer Demo

This project demonstrates a robust Money Transfer workflow using Temporal. It showcases advanced patterns like **Human-in-the-Loop**, **Signals**, **Queries**, and the **SAGA Pattern**.

## Features

1.  **Money Transfer Workflow**: Orchestrates withdrawals and deposits.
2.  **Human Approval (Signals)**: Transfers over $500 require explicit human approval before proceeding.
3.  **State Visibility (Queries)**: Real-time query capability to check if the workflow is "DEPOSITING", "WAITING_FOR_APPROVAL", etc.
4.  **SAGA Pattern**: Structure included for compensating transactions (Refunds) in case of deposit failures.

## Prerequisites

- Node.js
- [Temporal CLI](https://docs.temporal.io/cli)

## How to Run

### 1. Start the Temporal Server
Open a terminal and run:
```bash
temporal server start-dev
```

### 2. Start the Worker
In a new terminal, start the worker that processes the tasks:
```bash
npm run start.watch
```

---

## Scenarios

### Scenario A: Standard Transfer (Amount <= 500)
1.  Open `src/client.ts` and set the amount to `100` (or anything <= 500).
2.  Run the client:
    ```bash
    npm run workflow
    ```
3.  **Result**: The workflow runs `withdraw` -> `deposit` and completes automatically.

### Scenario B: High Value Transfer (Amount > 500)
1.  Open `src/client.ts` and set the amount to `510` (or anything > 500).
2.  Run the client:
    ```bash
    npm run workflow
    ```
3.  **Observation**:
    - The Workflow will perform `withdraw`.
    - Then it will **PAUSE**.
    - The logs will show: `Waiting for human approval...`.
    - Use the Web UI (localhost:8233) to see the workflow is "Running" but stuck.

4.  **Check Status (Query)**:
    - Get the `WorkflowId` from the client output.
    - Update `src/checkStatus.ts` with that ID.
    - Run: `npx ts-node src/checkStatus.ts`
    - **Output**: `WAITING_FOR_APPROVAL`

5.  **Approve the Transfer (Signal)**:
    - Update `src/adminApprove.ts` with that same `WorkflowId`.
    - Run: `npx ts-node src/adminApprove.ts`
    - **Result**: The workflow receives the signal, resumes, performs `deposit`, and completes.

## Project Structure
- `src/workflows.ts`: The business logic (Money Transfer, Approval Check, Try/Catch).
- `src/activities.ts`: Simulated external services (Withdraw, Deposit).
- `src/worker.ts`: The Temporal Worker listening on `payment-queue`.
- `src/client.ts`: Script to start a workflow.
- `src/adminApprove.ts`: Script to send an "Approve" signal.
- `src/checkStatus.ts`: Script to Query the workflow state.
