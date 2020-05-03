import * as admin from "firebase-admin";
import * as dayjs from "dayjs";

import { CommitDocType } from "./addCommit";
import { commitCollection, dailyCommitCollection } from "./firestoreCollection";

export const AggregateDailyCommitTopic = "aggregateDailyCommitTopic" as const;
const { FieldValue } = admin.firestore;

export type AggregateDailyCommitJsonType = { userId: string };

export type DailyCommitDocType = {
  userId: string;
  extentions: { [k: string]: number };
  totalCommits: number;
  date: Date;
  updatedAt: admin.firestore.FieldValue;
};

export const aggregateDailyCommit = async (json: AggregateDailyCommitJsonType) => {
  const { userId } = json;

  const today = dayjs().add(9, "hour").startOf("day");
  const startTime = today.subtract(1, "day");
  const commitDocs = await commitCollection
    .where("userId", "==", userId)
    .where("commitTimestamp", ">=", startTime.toDate())
    .where("commitTimestamp", "<", today.toDate())
    .get();

  if (commitDocs.empty) {
    console.log(`NotFound, userId: ${userId}`);
    return null;
  }

  let totalCommits = 0;
  const extentionDict: { [p: string]: number } = {};
  commitDocs.forEach((doc) => {
    const commit = doc.data() as CommitDocType;
    totalCommits += commit.totalCommits;
    for (const [key, value] of Object.entries(commit.extentions)) {
      if (!extentionDict[key]) {
        extentionDict[key] = 0;
      }
      extentionDict[key] += value;
    }
  });

  const aggrigateData: DailyCommitDocType = {
    userId,
    extentions: extentionDict,
    totalCommits,
    date: today.toDate(),
    updatedAt: FieldValue.serverTimestamp(),
  };
  await dailyCommitCollection.doc().set(aggrigateData, { merge: true });

  return aggrigateData;
};