import path from "path";

export function ensurePosixPath(inputPath: string) {
  return inputPath.split(path.sep).join(path.posix.sep);
}

export function resolveProjectPath(relativePath: string) {
  return path.posix.join(process.cwd(), "generated-project", relativePath);
}
