import { mkdirSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// One-Line Laugh-Off entry: password / 2FA absurdity — locked out of your
// own life. One vivid scene, one twist at the very end, no setup notes.
const LINE =
  "I've changed my password so many times that even I need a verification code to prove I'm me.";

const OUT_DIR = "/output";
const OUT_FILE = join(OUT_DIR, "entry.txt");

// Enforce the competition gate in code: the entry must be 1-200 characters
// of non-whitespace UTF-8 text. Fail loudly instead of writing an entry
// the sealed scorer would reject.
const trimmed = LINE.trim();
if (trimmed.length < 1 || LINE.length > 200) {
  throw new Error(
    `entry line must be 1-200 characters, got ${LINE.length}`,
  );
}
if (!/^[\u0009\u000A\u000D\u0020-\uD7FF\uE000-\uFFFD]+$/.test(LINE)) {
  throw new Error("entry line contains characters outside valid UTF-8 text");
}

mkdirSync(OUT_DIR, { recursive: true });

// Clear the output directory's contents only — never remove the directory
// itself (the grader filesystem is read-only there).
for (const name of readdirSync(OUT_DIR)) {
  rmSync(join(OUT_DIR, name), { recursive: true, force: true });
}

writeFileSync(OUT_FILE, Buffer.from(LINE, "utf8"));
