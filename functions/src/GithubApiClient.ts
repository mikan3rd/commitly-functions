import axios from "axios";

const BaseUrl = "https://api.github.com";

export class GithubApiClient {
  appToken?: string;
  repositoryInstallationToken?: string;

  async setRepositoryInstallationToken(owner: string, repo: string) {
    const headers = this.getAppHeader();
    const url = `${BaseUrl}/repos/${owner}/${repo}/installation`;
    const {
      data: { access_tokens_url },
    } = await axios.get(url, { headers });

    const {
      data: { token },
    } = await axios.post(access_tokens_url, { headers });

    this.repositoryInstallationToken = token;
  }

  async getCommit(owner: string, repo: string, commitId: string) {
    const url = `${BaseUrl}/repos/${owner}/${repo}/commits/${commitId}`;
    return await axios.get(url, { headers: this.getInstallationHeader() });
  }

  private getAppHeader() {
    if (!this.appToken) {
      throw Error("appToken required");
    }
    return {
      Authorization: `Bearer ${this.appToken}`,
      Accept: "application/vnd.github.machine-man-preview+json",
    };
  }

  private getInstallationHeader() {
    if (!this.repositoryInstallationToken) {
      throw Error("repositoryInstallationToken required");
    }
    return {
      Authorization: `Bearer ${this.repositoryInstallationToken}`,
      Accept: "application/vnd.github.machine-man-preview+json",
    };
  }
}
