import { GithubApiClient } from "./GithubApiClient";

export const AddComitTopic = "addCommit";

export type AddCommitJsonType = { repositoryName: string; repositoryOwner: string; commitId: string };

export const addCommit = async (json: AddCommitJsonType) => {
  console.log(json);
  const { repositoryName, repositoryOwner, commitId } = json;
  const client = new GithubApiClient();
  const response = await client.getCommit(repositoryOwner, repositoryName, commitId);
  console.log(response.data);
};
