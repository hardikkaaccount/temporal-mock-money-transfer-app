export async function withdraw(accountId: string, amount: number): Promise<string> {
  await new Promise((resolve) => setTimeout(resolve, 10000));
  return `Withdrew ${amount}`;
}

export async function deposit(accountId: string, amount: number): Promise<string> {
  await new Promise((resolve) => setTimeout(resolve, 10000));
  return `Deposited ${amount}`;
}

export async function refund(accountId: string, amount: number): Promise<string> {
  return `Refunded ${amount}`;
}
