import { getToken } from "next-auth/jwt"
import { NextApiRequest } from "next"
import { OpenAI, OpenAIEmbeddings } from "@langchain/openai"
import RepoFile from "@/models/repoFile"
import RepoDirectory from "@/models/repoDirectory"

export async function GET(req: NextApiRequest, 
  { params }: { params: { 
    owner: string,
    repo: string 
  } 
}) {
  const { owner, repo } = params;
  const path = 'frontend';
  const token = await getToken({ req })
  if (!token) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }
  if (!process.env.OPENAI_API_KEY) {
    return new Response(JSON.stringify({ error: "Missing OpenAI API key" }), { status: 500 });
  }

  const accessToken: string = token?.accessToken as string;

  if (!accessToken) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  try {
    const data: RepoFile | RepoDirectory[] = await fetchRepoContents(owner as string, repo as string, path, accessToken);

    if (Array.isArray(data)) {
      // Handle directory response
      await processDirectory(data, owner as string, repo as string, accessToken);
    } else {
      // Handle file response
      await processFile(data);
    }

    return new Response(JSON.stringify(data), {
      status: 200,
    });
  } catch (error) {
    console.error('Error fetching GitHub repositories:', error);
    return new Response(JSON.stringify({ error }), { status: 500 });
  }
}

async function processDirectory(contents: RepoDirectory[], owner: string, repo: string, accessToken: string) {
  for (const item of contents) {
    if (item.type === 'file') {
      const fileContent = await fetchFileContent(owner, repo, item.path, accessToken);
      await processFile(fileContent);
    } else if (item.type === 'dir') {
      const subContents = await fetchRepoContents(owner, repo, item.path, accessToken);
      await processDirectory(subContents, owner, repo, accessToken);
    }
  }
}

async function fetchRepoContents(owner: string, repo: string, dirPath: string, accessToken: string): Promise<RepoDirectory[]> {
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${dirPath}`;
  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'User-Agent': 'My Local App'
    }
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch contents: ${response.statusText}`);
  }
  const data = await response.json();
  return data;
}

async function fetchFileContent(owner: string, repo: string, filePath: string, accessToken: string): Promise<RepoFile> {
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`;
  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Accept': 'application/vnd.github.raw',
      'User-Agent': 'My Local App'
    }
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch file content: ${response.statusText}`);
  }
  const content = await response.json();
  return content;
}

async function processFile(file: RepoFile) {
  if (file.encoding === 'base64') {
    const buffer = Buffer.from(file.content, 'base64');
    const content = buffer.toString('utf-8');

    // Initialize the language model and embeddings
    const model = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const embeddings = new OpenAIEmbeddings(model);

    // Vectorize the file content
    const vector = await embeddings.embedDocuments([content]);

    // Store the vector (this example logs the vector, replace this with actual storage logic)
    console.log(`Vector for ${file.path}:`, vector);
  }
}