import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as dayjs from "dayjs";
import "dayjs/locale/ja";
dayjs.locale("ja");

admin.initializeApp();

import { publishCommit, WebhookPushEventType } from "./publishCommit";
import { addCommit, AddCommitJsonType, AddComitTopic } from "./addCommit";
import { publishDailyCommitAggregation, UserDataType } from "./publishDailyCommitAggregation";
import { AggregateDailyCommitTopic, aggregateDailyCommit, AggregateDailyCommitJsonType } from "./aggregateDailyCommit";
import { publishDailyTweet } from "./publishDailyTweet";
import { tweetDaily, TweetDailyTopic } from "./tweetDaily";

export const githubWebhook = functions.region("asia-northeast1").https.onRequest(async (request, response) => {
  const { method, headers, body } = request;

  if (method !== "POST") {
    return response.status(400).send(`Method Not Allowed: ${method}`);
  }

  const eventType = headers["x-github-event"] as string;
  if (eventType !== "push") {
    return response.status(400).send(`EventType Not Matched: ${eventType}`);
  }

  const result = await publishCommit(body as WebhookPushEventType);
  return response.send(result);
});

export const addCommitPubSub = functions
  .region("asia-northeast1")
  .pubsub.topic(AddComitTopic)
  .onPublish(async (message) => {
    return await addCommit(message.json as AddCommitJsonType);
  });

export const aggregateDailyCommitScheduler = functions
  .region("asia-northeast1")
  .pubsub.schedule("0 0 * * *")
  .timeZone("Asia/Tokyo")
  .onRun(async (context) => {
    await publishDailyCommitAggregation();
  });

export const aggregateDailyCommitPubSub = functions
  .region("asia-northeast1")
  .pubsub.topic(AggregateDailyCommitTopic)
  .onPublish(async (message) => {
    await aggregateDailyCommit(message.json as AggregateDailyCommitJsonType);
  });

export const tweetDailyScheduler = functions
  .region("asia-northeast1")
  .pubsub.schedule("0 * * * *")
  .timeZone("Asia/Tokyo")
  .onRun(async (context) => {
    await publishDailyTweet();
  });

export const tweetDailyPubSub = functions
  .region("asia-northeast1")
  .pubsub.topic(TweetDailyTopic)
  .onPublish(async (message) => {
    await tweetDaily(message.json as UserDataType);
  });
