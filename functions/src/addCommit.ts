import { GithubApiClient } from "./GithubApiClient";

export const AddComitTopic = "addCommit";

export type AddCommitJsonType = { repositoryName: string; repositoryOwner: string; commitId: string };

export const addCommit = async (json: AddCommitJsonType) => {
  const { repositoryName, repositoryOwner, commitId } = json;
  const client = new GithubApiClient();
  await client.setAppToken();
  await client.setRepositoryInstallationToken(repositoryOwner, repositoryName);
  const response = await client.getCommit(repositoryOwner, repositoryName, commitId);
  console.log(response.data);
};
