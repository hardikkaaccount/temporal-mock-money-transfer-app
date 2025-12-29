// import { Connection, Client } from '@temporalio/client';
// import { moneyTransfer } from './workflows';
// async function run() {
//   const connection = await Connection.connect({ address: 'localhost:7233' });
//   const client = new Client({ connection });
//   const handle = await client.workflow.start(moneyTransfer, {
//     taskQueue: 'payment-queue', // Must match the Worker's queue!
//     args: ['Account-A', 'Account-B', 100], // Transfer $100
//     workflowId: 'transfer-' + Date.now(),
//   });
//   console.log(`Transfer started: ${handle.workflowId}`);
//   console.log(await handle.result());
// }
// run().catch(console.error);

import { Connection, Client } from '@temporalio/client';
import { moneyTransfer } from './workflows';

async function run() {
  const connection = await Connection.connect({address: 'localhost:7233'});
  const client = new Client({connection});
  const handle = await client.workflow.start(moneyTransfer, {
    taskQueue: 'payment-queue',
    args: ['Account-A', 'Account-B', 510],
    workflowId: 'transfer-' + Date.now(),
  });
  console.log(`Transfer started: ${handle.workflowId}`);
  console.log(await handle.result());
  connection.close();
}

run().catch(console.error);
