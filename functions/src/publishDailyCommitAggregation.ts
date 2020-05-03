import { PubSub } from "@google-cloud/pubsub";

import { AggregateDailyCommitTopic, AggregateDailyCommitJsonType } from "./aggregateDailyCommit";
import { userCollection } from "./firestoreCollection";

type UserDataType = {
  github: GithubDataType;
};

type GithubDataType = {
  username: string;
  userId: string;
  accessToken: string;
  createdAt?: Date;
  updatedAt: Date;
};

export const publishDailyCommitAggregation = async () => {
  const users: UserDataType[] = [];

  const userDocs = await userCollection.get();
  userDocs.forEach((doc) => {
    const user = doc.data() as UserDataType;
    users.push(user);
  });

  const pubSub = new PubSub();
  for (const user of users) {
    const data: AggregateDailyCommitJsonType = { userId: user.github.userId };
    const dataJson = JSON.stringify(data);
    const dataBuffer = Buffer.from(dataJson);
    await pubSub.topic(AggregateDailyCommitTopic).publish(dataBuffer);
  }
};
