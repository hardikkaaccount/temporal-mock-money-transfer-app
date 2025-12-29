// src/adminApprove.ts
import { Client, Connection } from '@temporalio/client';
import { approveSignal } from './workflows';
async function run() {
  const connection = await Connection.connect({ address: 'localhost:7233' });
  const client = new Client({ connection });
  const workflowId = 'transfer-1767003436570';
  const handle = client.workflow.getHandle(workflowId);
  console.log(`Sending Approval Signal to ${workflowId}...`);
  await handle.signal(approveSignal);
  console.log('Signal Sent!');
}
run().catch(console.error);
