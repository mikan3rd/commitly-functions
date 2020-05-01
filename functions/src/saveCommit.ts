import { PubSub } from "@google-cloud/pubsub";

export type WebhookPushEventType = {
  repository: {
    full_name: string;
    name: string;
    private: boolean;
    ownner: { name: string };
  };
  sender: {
    id: number;
  };
  commits: { id: string; distinct: boolean; author: { username: string } }[];
};

export const saveCommit = async (body: WebhookPushEventType) => {
  const {
    repository: { name, ownner },
    commits,
  } = body;
  const pubSub = new PubSub();
  for (const commit of commits) {
    const data = JSON.stringify({ repositoryName: name, repositoryOwner: ownner, commitId: commit.id });
    const dataBuffer = Buffer.from(data);
    await pubSub.topic("addCommit").publish(dataBuffer);
  }
};
