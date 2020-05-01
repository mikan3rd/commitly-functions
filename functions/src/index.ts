import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();

import { saveCommit, WebhookPushEventType } from "./saveCommit";

export const githubWebhook = functions.region("asia-northeast1").https.onRequest(async (request, response) => {
  const { method, headers, body } = request;

  if (method !== "POST") {
    return response.status(400).send(`Method Not Allowed: ${method}`);
  }

  const eventType = headers["x-github-event"] as string;
  if (eventType !== "push") {
    return response.status(400).send(`EventType Not Matched: ${eventType}`);
  }

  await saveCommit(body as WebhookPushEventType);

  return response.send("SUCCESS: saveWebhookCommit");
});

export const addCommit = functions
  .region("asia-northeast1")
  .pubsub.topic("addCommit")
  .onPublish(async (message) => {
    console.log(message.json);
  });
