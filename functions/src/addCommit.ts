export const AddComitTopic = "addCommit";

export type AddCommitJsonType = { repositoryName: string; repositoryOwner: string; commitId: string };

export const addCommit = (json: AddCommitJsonType) => {
  console.log(json);
};
