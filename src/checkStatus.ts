import { Client, Connection } from '@temporalio/client';
import { getStatusQuery } from './workflows';
async function run() {
  const connection = await Connection.connect({ address: 'localhost:7233' });
  const client = new Client({ connection });
  const workflowId = 'transfer-1767003436570'; 
  const handle = client.workflow.getHandle(workflowId);
  const status = await handle.query(getStatusQuery);
  console.log(`Current Status for ${workflowId}:`, status);
}
run().catch(console.error);
