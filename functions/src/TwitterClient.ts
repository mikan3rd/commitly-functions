import * as Twitter from "twitter";
import * as functions from "firebase-functions";

const TWITTER_ENV = functions.config().twitter;

export class TwitterClient {
  client: Twitter;

  constructor(client: Twitter) {
    this.client = client;
  }

  static get(access_token_key: string, access_token_secret: string) {
    const client = new Twitter({
      consumer_key: TWITTER_ENV.consumer_key,
      consumer_secret: TWITTER_ENV.consumer_secret,
      access_token_key,
      access_token_secret,
    });
    return new TwitterClient(client);
  }

  static getBot() {
    const client = new Twitter({
      consumer_key: TWITTER_ENV.consumer_key,
      consumer_secret: TWITTER_ENV.consumer_secret,
      access_token_key: TWITTER_ENV.access_token_key,
      access_token_secret: TWITTER_ENV.access_token_secret,
    });
    return new TwitterClient(client);
  }

  async postTweet(status: string, mediaIds: string[] = []) {
    return await this.client.post("statuses/update", {
      status,
      media_ids: mediaIds.join(","),
    });
  }
}
