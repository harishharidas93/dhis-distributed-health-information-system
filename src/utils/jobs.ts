import { TopicMessageSubmitTransaction } from '@hashgraph/sdk';
import { hederaClient } from '@/services/hedera.client';

const client = hederaClient();

/**
 * Schedule HCS message for access expiry
 */
export function scheduleExpiryMessage({
  requestId,
  topicId,
  expirationTime
}: {
  requestId: string;
  topicId: string;
  expirationTime: Date | string;
}) {
  const expiry = new Date(expirationTime);

  const now = new Date();
  const delay = expiry.getTime() - now.getTime();

  if (delay <= 0) {
    console.warn(`[WARN] Expiry time already passed for requestId=${requestId}`);
    return;
  }

  setTimeout(async () => {
    const message = {
      type: 'access-expired',
      requestId,
      timestamp: new Date().toISOString(),
    };

    try {
      const tx = await new TopicMessageSubmitTransaction()
        .setTopicId(topicId)
        .setMessage(JSON.stringify(message))
        .execute(client);

      console.log(`[✅] Expiry message sent: txId=${tx.transactionId}`);
    } catch (err) {
      console.error(`[❌] Failed to send expiry message:`, err);
    }
  }, delay);
}
