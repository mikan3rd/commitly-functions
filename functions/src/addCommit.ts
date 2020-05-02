import * as admin from "firebase-admin";

import { GithubApiClient } from "./GithubApiClient";

export const AddComitTopic = "addCommit" as const;

export const CommitsCollection = "commits" as const;
const collection = admin.firestore().collection(CommitsCollection);
const { FieldValue } = admin.firestore;

export type AddCommitJsonType = {
  repositoryId: string;
  repositoryOwner: string;
  repositoryName: string;
  commitId: string;
};

export type CommitDocType = {
  repositoryId: string;
  commitId: string;
  userId: string;
  extentions: { [k: string]: number };
  totalCommits: number;
  commitTimestamp: Date;
  updatedAt: admin.firestore.FieldValue;
};

export const addCommit = async (json: AddCommitJsonType) => {
  const { repositoryId, repositoryName, repositoryOwner, commitId } = json;

  const client = new GithubApiClient();
  await client.setAppToken();
  await client.setRepositoryInstallationToken(repositoryOwner, repositoryName);

  const {
    data: {
      files,
      author,
      commit: {
        author: { date },
      },
      stats: { total: totalCommits },
    },
  } = await client.getCommit(repositoryOwner, repositoryName, commitId);

  const extentionDict: { [p: string]: number } = {};
  for (const file of files) {
    const { filename, changes } = file;
    if (changes === 0) {
      continue;
    }
    const result = filename.match(/\.\w+$/);
    let key = "no_extension";
    if (result) {
      key = result[0].replace(".", "");
    }
    if (!extentionDict[key]) {
      extentionDict[key] = 0;
    }
    extentionDict[key] += changes;
  }

  const aggrigateData: CommitDocType = {
    repositoryId,
    commitId,
    userId: String(author.id),
    extentions: extentionDict,
    totalCommits,
    commitTimestamp: new Date(date),
    updatedAt: FieldValue.serverTimestamp(),
  };
  await collection.doc(commitId).set(aggrigateData, { merge: true });

  return aggrigateData;
};
