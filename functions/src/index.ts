import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

import { saveCommit, WebhookPushEventType } from './saveCommit';

export const saveWebhookCommit = functions.region('asia-northeast1').https.onRequest((request, response) => {
  const { method, headers, body } = request;

  if (method !== 'POST') {
    return response.status(400).send(`Method Not Allowed: ${method}`);
  }

  const evendId = headers['x-github-delivery'] as string;
  const eventType = headers['x-github-event'] as string;

  if (eventType !== 'push') {
    return response.status(400).send(`EventType Not Matched: ${eventType}`);
  }

  saveCommit(body as WebhookPushEventType);

  return response.send('SUCCESS: saveWebhookCommit');
});
