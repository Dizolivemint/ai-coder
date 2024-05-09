"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

interface Repository {
  id: number;
  name: string;
}

function RepositoriesSelection() {
  const { data: session } = useSession();
  const [repos, setRepos] = useState<Repository[]>([]);
  const [starred, setStarred] = useState<Repository[]>([]);
  const [selectedRepos, setSelectedRepos] = useState<Repository[]>([]);

  useEffect(() => {
    if (session) {
      fetch("/api/repos")
        .then((res) => res.json())
        .then((data: Repository[]) => setRepos(data))
        .catch(console.error);

      fetch("/api/starred")
        .then((res) => res.json())
        .then((data: Repository[]) => setStarred(data))
        .catch(console.error);
    }
  }, [session]);

  const handleRepoSelection = (repo: Repository) => {
    setSelectedRepos((prev) => {
      const exists = prev.find((r) => r.id === repo.id);
      if (exists) {
        return prev.filter((r) => r.id !== repo.id);
      }
      return [...prev, repo];
    });
  };

  return (
    <div>
      <h1>Select Repositories</h1>
      <div>
        <h2>Your Repositories</h2>
        {repos.map((repo) => (
          <label key={repo.id}>
            <input
              type="checkbox"
              checked={selectedRepos.some((r) => r.id === repo.id)}
              onChange={() => handleRepoSelection(repo)}
            />
            {repo.name}
          </label>
        ))}
      </div>
      <div>
        <h2>Starred Repositories</h2>
        {starred.map((repo) => (
          <label key={repo.id}>
            <input
              type="checkbox"
              checked={selectedRepos.some((r) => r.id === repo.id)}
              onChange={() => handleRepoSelection(repo)}
            />
            {repo.name}
          </label>
        ))}
      </div>
    </div>
  );
}

export default RepositoriesSelection;