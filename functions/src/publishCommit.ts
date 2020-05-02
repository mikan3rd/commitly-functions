import { PubSub } from "@google-cloud/pubsub";

import { AddComitTopic, AddCommitJsonType } from "./addCommit";

export type WebhookPushEventType = {
  repository: {
    full_name: string;
    name: string;
    private: boolean;
    owner: { name: string };
  };
  sender: {
    id: number;
  };
  commits: { id: string; distinct: boolean; author: { username: string } }[];
};

export const publishCommit = async (body: WebhookPushEventType) => {
  const {
    repository: {
      name,
      owner: { name: repositoryOwner },
    },
    commits,
  } = body;

  const publishList: AddCommitJsonType[] = [];
  const pubSub = new PubSub();
  for (const commit of commits) {
    if (!commit.distinct) {
      continue;
    }
    const data: AddCommitJsonType = { repositoryOwner, repositoryName: name, commitId: commit.id };
    const dataJson = JSON.stringify(data);
    const dataBuffer = Buffer.from(dataJson);
    await pubSub.topic(AddComitTopic).publish(dataBuffer);
    publishList.push(data);
  }
  return publishList;
};
