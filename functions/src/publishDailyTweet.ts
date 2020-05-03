import { PubSub } from "@google-cloud/pubsub";

import { AggregateDailyCommitTopic, AggregateDailyCommitJsonType } from "./aggregateDailyCommit";
import { userCollection } from "./firestoreCollection";
import { UserDataType } from "./publishDailyCommitAggregation";

export const publishDailyTweet = async () => {
  const users: UserDataType[] = [];

  const userDocs = await userCollection.where("twitter.userId", ">", "").get();
  userDocs.forEach((doc) => {
    const user = doc.data() as UserDataType;
    users.push(user);
  });

  const pubSub = new PubSub();
  for (const user of users) {
    const data = { user };
    const dataJson = JSON.stringify(data);
    const dataBuffer = Buffer.from(dataJson);
    await pubSub.topic(AggregateDailyCommitTopic).publish(dataBuffer);
  }
};
