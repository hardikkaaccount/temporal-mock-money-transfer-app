import { proxyActivities, defineSignal, defineQuery, setHandler, condition } from '@temporalio/workflow';
import type * as activities from './activities';
export const approveSignal = defineSignal('approve');
// 1. Define the Query
export const getStatusQuery = defineQuery<string>('getStatus');
const { withdraw, deposit, refund } = proxyActivities<typeof activities>({
  startToCloseTimeout: '1 minute',
  retry: { maximumAttempts: 2 }
});
export async function moneyTransfer(fromAccountId: string, toAccountId: string, amount: number) {
  let isApproved = false;
  let currentStatus = 'STARTING'; // 2. Track State
  // 3. Answer the Question
  setHandler(getStatusQuery, () => currentStatus);
  setHandler(approveSignal, () => {
    isApproved = true;
  });
  currentStatus = 'WITHDRAWING';
  await withdraw(fromAccountId, amount);
  if (amount > 500) {
    currentStatus = 'WAITING_FOR_APPROVAL'; // Update state before sleeping
    console.log(`Amount ${amount} is large. Waiting for human approval...`);
    
    await condition(() => isApproved);
    
    console.log('APPROVAL RECEIVED via Signal!');
  }
  currentStatus = 'DEPOSITING';
  try {
    await deposit(toAccountId, amount);
    currentStatus = 'COMPLETED';
    return `TRANSFER COMPLETE: ${amount}`;
  } catch (err) {
    currentStatus = 'REFUNDING';
    await refund(fromAccountId, amount);
    currentStatus = 'FAILED';
    return `TRANSFER FAILED: ${amount}`;
  }
}