import { GithubApiClient } from "./GithubApiClient";

export const AddComitTopic = "addCommit";

export type AddCommitJsonType = { repositoryOwner: string; repositoryName: string; commitId: string };

export const addCommit = async (json: AddCommitJsonType) => {
  const { repositoryOwner, repositoryName, commitId } = json;

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

  const aggrigateData = {
    repository_owner: repositoryOwner,
    repository_name: repositoryName,
    commit_id: commitId,
    user_id: author.id,
    extentions: extentionDict,
    date,
    testDate: Date.parse(date).toString(),
  };
  console.log("aggrigateData:", JSON.stringify(aggrigateData));

  return aggrigateData;
};
