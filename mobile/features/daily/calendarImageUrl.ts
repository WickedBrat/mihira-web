export function getCalendarImageUri(imageUrl: string | null | undefined) {
  if (!imageUrl) return null;

  const githubMatch = imageUrl.match(
    /^https:\/\/github\.com\/([^/]+)\/([^/]+)\/(?:blob|raw)\/([^/]+)\/(.+)$/
  );

  if (!githubMatch) return imageUrl;

  const [, owner, repo, branch, assetPath] = githubMatch;
  return `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${assetPath}`;
}
