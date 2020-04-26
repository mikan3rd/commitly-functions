import * as admin from 'firebase-admin';

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
  commits: { id: string; distinct: boolean }[];
};

export const saveCommit = (body: WebhookPushEventType) => {
  console.log(body);
};
