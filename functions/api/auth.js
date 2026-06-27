// OAuth 入口：把使用者導向 GitHub 授權頁面
export async function onRequestGet(context) {
  const { GITHUB_CLIENT_ID } = context.env;
  const redirectUri = `${new URL(context.request.url).origin}/api/callback`;

  const params = new URLSearchParams({
    client_id: GITHUB_CLIENT_ID,
    redirect_uri: redirectUri,
    scope: 'repo,user',
  });

  return Response.redirect(
    `https://github.com/login/oauth/authorize?${params}`,
    302
  );
}
