import { UserDataType } from "./publishDailyCommitAggregation";

export const TweetDailyTopic = "tweetDailyTopic" as const;

export const tweetDaily = async (json: UserDataType) => {
  const {
    twitter: { accessToken, secret },
    github: { userId },
  } = json;
};
