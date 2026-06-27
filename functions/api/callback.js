// OAuth callback：用 code 換 token，回傳給 Decap CMS
export async function onRequestGet(context) {
  const { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } = context.env;
  const url = new URL(context.request.url);
  const code = url.searchParams.get('code');

  if (!code) {
    return new Response('Missing code', { status: 400 });
  }

  const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      client_id: GITHUB_CLIENT_ID,
      client_secret: GITHUB_CLIENT_SECRET,
      code,
    }),
  });

  const tokenData = await tokenRes.json();

  if (tokenData.error) {
    return new Response(`GitHub OAuth error: ${tokenData.error_description}`, { status: 400 });
  }

  const token = tokenData.access_token;
  const payload = JSON.stringify({ token, provider: 'github' });

  const html = `<!doctype html>
<html>
<head><title>授權完成</title></head>
<body>
<script>
  (function() {
    const data = ${JSON.stringify(payload)};
    function receiveMessage(e) {
      window.opener.postMessage('authorization:github:success:' + data, e.origin);
    }
    window.addEventListener("message", receiveMessage, false);
    window.opener.postMessage("authorizing:github", "*");
  })();
</script>
<p>授權成功，正在返回後台...</p>
</body>
</html>`;

  return new Response(html, {
    headers: { 'Content-Type': 'text/html;charset=UTF-8' },
  });
}
