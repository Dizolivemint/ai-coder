import { NextRequest, NextResponse } from 'next/server';
import { getToken } from "next-auth/jwt";

export async function GET(req: NextRequest) {
  const token = await getToken({
    req,
  });

  if (!token) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  // Example GitHub API endpoint to fetch user repositories
  const url = 'https://api.github.com/user/repos';

  // Set the headers with the Authorization token
  const headers = {
    'Authorization': `token ${token.access_token}`,
    'User-Agent': 'YourAppName'
  };

  try {
    // Fetch the data from GitHub
    const response = await fetch(url, {
      headers: headers
    });

    if (!response.ok) {
      throw new Error('Failed to fetch GitHub repositories');
    }

    const data = await response.json();

    // You can process the data here if necessary
    // For example, log the data or modify it before sending it to the client
    console.log(data);

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Error fetching GitHub repositories:', error);
    return new Response(JSON.stringify({ message: error }), { status: 500 });
  }
}
