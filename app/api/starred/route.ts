import { getToken } from "next-auth/jwt"
import { NextApiRequest } from "next"

export async function GET(req: NextApiRequest) {
  const token = await getToken({ req })
  if (!token) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  const accessToken = token?.accessToken;

  if (!accessToken) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  const url = `https://api.github.com/user/starred`;

  const headers = {
    'Authorization': `Bearer ${accessToken}`,
    'User-Agent': 'My Local App'
  };

  try {
    const response = await fetch(url, {
      headers: headers
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch GitHub repositories | ${response.statusText}`);
    }

    const data = await response.json();

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Error fetching GitHub repositories:', error);
    return new Response(JSON.stringify({ error }), { status: 500 });
  }
}
