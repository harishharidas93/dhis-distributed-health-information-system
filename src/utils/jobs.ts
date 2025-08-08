import { TopicMessageSubmitTransaction } from '@hashgraph/sdk';
import { hederaClient } from '@/services/hedera.client';

const client = hederaClient();

const scheduledExpiries = new Map<string, NodeJS.Timeout>();

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

  const timeoutId = setTimeout(async () => {
    const message = {
      requestType: 'access-expired',
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
    } finally {
      // Clean up the timeout reference
      scheduledExpiries.delete(`${requestId}-${topicId}`);
    }
  }, delay);

  // Store the timeout for potential cancellation
  scheduledExpiries.set(`${requestId}-${topicId}`, timeoutId);
  
  console.log(`[📅] Scheduled expiry for requestId=${requestId}, topicId=${topicId}, delay=${delay}ms`);
}

/**
 * Cancel scheduled expiry messages for a request
 */
export function cancelExpiryMessages(requestId: string) {
  const keysToDelete: string[] = [];
  
  for (const [key, timeoutId] of scheduledExpiries.entries()) {
    if (key.startsWith(requestId)) {
      clearTimeout(timeoutId);
      keysToDelete.push(key);
      console.log(`[❌] Cancelled expiry for ${key}`);
    }
  }
  
  // Clean up the cancelled timeouts
  keysToDelete.forEach(key => scheduledExpiries.delete(key));
}
