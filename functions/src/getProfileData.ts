import { userCollection, dailyCommitCollection, DailyCommitDocType } from "./helper/firestoreCollection";

export const getProfileData = async (username: string) => {
  const userDocs = await userCollection.where("github.username", "==", username).limit(1).get();

  if (userDocs.empty) {
    return null;
  }

  let userData: any;
  userDocs.forEach((doc) => {
    userData = doc.data();
  });

  const commitDocs = await dailyCommitCollection
    .where("userId", "==", userData.github.userId)
    .orderBy("date")
    .limit(10)
    .get();

  const commits: DailyCommitDocType[] = [];
  commitDocs.forEach((doc) => {
    const commtiData = doc.data() as DailyCommitDocType;
    commits.push(commtiData);
  });

  return { user: userData, commits };
};
