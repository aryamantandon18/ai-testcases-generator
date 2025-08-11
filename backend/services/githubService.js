import { Octokit } from "@octokit/rest";

export function octokitForToken(token) {
  return new Octokit({ auth: token });
}

export async function listRepoFiles(token, owner, repo, branch = "main") {
  const octokit = octokitForToken(token);
  // 1) get ref for branch
  const refResp = await octokit.git.getRef({ owner, repo, ref: `heads/${branch}` });
  const commitSha = refResp.data.object.sha;
  const commit = await octokit.git.getCommit({ owner, repo, commit_sha: commitSha });
  const treeSha = commit.data.tree.sha;
  const tree = await octokit.git.getTree({ owner, repo, tree_sha: treeSha, recursive: "1" });
  const files = tree.data.tree.filter(t => t.type === "blob").map(f => ({ path: f.path, sha: f.sha }));
  return files;
}

export async function getFileContent(token, owner, repo, path, ref) {
  const octokit = octokitForToken(token);
  const response = await octokit.repos.getContent({ owner, repo, path, ref });
  const content = Buffer.from(response.data.content, response.data.encoding).toString("utf-8");
  return content;
}
