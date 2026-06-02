import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { execSync } from "node:child_process";

const repositoryName = process.env.GITHUB_REPOSITORY?.split("/")[1] ?? getRepositoryNameFromGit();

export default defineConfig({
  base: process.env.VITE_BASE ?? (repositoryName ? `/${repositoryName}/` : "/"),
  plugins: [vue()],
});

function getRepositoryNameFromGit() {
  try {
    const remoteUrl = execSync("git config --get remote.origin.url", { encoding: "utf8" }).trim();
    const match = remoteUrl.match(/[:/]([^/:]+?)(?:\.git)?$/);
    return match?.[1] || "";
  } catch {
    return "";
  }
}
