import { octokitForToken } from "./githubService.js";

export async function createPrWithGeneratedTest(token, owner, repo, baseBranch, branchName, filesToCreate, prTitle, prBody) {
  const octokit = octokitForToken(token);

  const baseRef = await octokit.git.getRef({ owner, repo, ref: `heads/${baseBranch}` });
  const baseSha = baseRef.data.object.sha;
  // create branch
  await octokit.git.createRef({ owner, repo, ref: `refs/heads/${branchName}`, sha: baseSha });

  for (const f of filesToCreate) {
    await octokit.repos.createOrUpdateFileContents({
      owner,
      repo,
      path: f.path,
      message: `chore: add generated test ${f.path}`,
      content: Buffer.from(f.code).toString("base64"),
      branch: branchName
    });
  }

  const pr = await octokit.pulls.create({ owner, repo, title: prTitle, head: branchName, base: baseBranch, body: prBody });
  return pr.data;
}
