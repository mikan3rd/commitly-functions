import axios from "axios";

const BaseUrl = "https://api.github.com";

export class GithubApiClient {
  installationToken?: string;

  async getCommit(owner: string, repo: string, commitId: string) {
    const url = `${BaseUrl}/repos/${owner}/${repo}/commits/${commitId}`;
    return await axios.get(url, { headers: this.getInstallationHeader() });
  }

  private getInstallationHeader() {
    return {
      Authorization: `Bearer ${this.installationToken}`,
      Accept: "application/vnd.github.machine-man-preview+json",
    };
  }
}
