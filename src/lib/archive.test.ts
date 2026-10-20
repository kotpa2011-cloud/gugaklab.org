import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { test } from "node:test";

import { archiveEntryHref, archiveProgramHref, loadArchiveData, resolveArchiveImage } from "./archive";
import { getArchiveSections, safeArchiveLink } from "./archive-markdown";

const programs = [
  { id: "meetup", label: "MEET UP", title: "프로그램", period: "2026. 8.31-9.4", enabled: true },
  { id: "bootcamp", label: "BOOT CAMP", title: "다음 프로그램", enabled: false },
];

function fixture() {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "gukak-archive-"));
  fs.writeFileSync(path.join(directory, "programs.json"), JSON.stringify(programs));
  return directory;
}

function entry(directory: string, name: string, values: Record<string, unknown> = {}, body = "기록 본문") {
  const data = { id: name, slug: name, program: "meetup", order: 10, badge: "DAY 1", title: "제목", date: "2026-08-31", ...values };
  const source = `---\n${Object.entries(data).map(([key, value]) => `${key}: ${JSON.stringify(value)}`).join("\n")}\n---\n\n${body}`;
  fs.writeFileSync(path.join(directory, `${name}.md`), source);
}

function withFixture(run: (directory: string) => void) {
  const directory = fixture();
  try { run(directory); } finally { fs.rmSync(directory, { recursive: true, force: true }); }
}

test("new Markdown files generate sorted entries and their detail URLs without UI edits", () => withFixture((directory) => {
  entry(directory, "a-later", { order: 20, date: "2026-08-31" });
  entry(directory, "z-earlier", { order: 1, date: "2026-09-04" });
  let data = loadArchiveData(directory);
  assert.deepEqual(data.entries.map((value) => value.slug), ["z-earlier", "a-later"]);
  entry(directory, "new-record", { order: 5, title: "새 제목", badge: "DAY 2", date: "2026-09-02", location: "새 장소" });
  data = loadArchiveData(directory);
  const added = data.entries[1];
  assert.equal(archiveEntryHref(added), "/archive/new-record");
  assert.equal(added.listTitle, "새 제목");
  assert.equal(added.badge, "DAY 2");
  assert.equal(added.location, "새 장소");
  entry(directory, "new-record", { order: 0, title: "수정한 제목", listTitle: "짧은 제목" });
  const changed = loadArchiveData(directory).entries[0];
  assert.equal(changed.title, "수정한 제목");
  assert.equal(changed.listTitle, "짧은 제목");
}));

test("drafts/templates and disabled program entries stay unpublished; settings can enable BOOT CAMP", () => withFixture((directory) => {
  entry(directory, "visible");
  entry(directory, "draft", { published: false });
  entry(directory, "bootcamp-entry", { program: "bootcamp" });
  fs.writeFileSync(path.join(directory, "_template.md"), "미완성 템플릿");
  assert.deepEqual(loadArchiveData(directory).entries.map((value) => value.slug), ["visible"]);
  fs.writeFileSync(path.join(directory, "programs.json"), JSON.stringify(programs.map((program) => ({ ...program, enabled: true }))));
  const enabled = loadArchiveData(directory);
  assert.ok(enabled.entries.some((value) => value.slug === "bootcamp-entry"));
  assert.equal(archiveProgramHref(enabled.programs[1]), "/archive?program=bootcamp");
}));

test("invalid dates, missing metadata, unknown programs and duplicate slugs stop publication with a filename", () => {
  for (const fields of [{ date: "2026-02-30" }, { title: "" }, { program: "unknown" }, { order: "first" }, { published: "false" }, { slug: "../outside" }]) {
    withFixture((directory) => {
      entry(directory, "invalid-record", fields);
      assert.throws(() => loadArchiveData(directory), /invalid-record\.md/);
    });
  }
  withFixture((directory) => {
    entry(directory, "first");
    entry(directory, "second", { slug: "first" });
    assert.throws(() => loadArchiveData(directory), /중복/);
  });
  withFixture((directory) => {
    fs.writeFileSync(path.join(directory, "broken.md"), '---\ntitle: "닫히지 않은 제목\n---\n');
    assert.throws(() => loadArchiveData(directory), /broken\.md/);
  });
});

test("YAML dates work without quotes and empty enabled programs are safe", () => withFixture((directory) => {
  assert.deepEqual(loadArchiveData(directory).entries, []);
  entry(directory, "unquoted");
  const file = path.join(directory, "unquoted.md");
  fs.writeFileSync(file, fs.readFileSync(file, "utf8").replace('date: "2026-08-31"', 'date: 2026-08-31'));
  assert.equal(loadArchiveData(directory).entries[0].date, "2026-08-31");
  fs.writeFileSync(file, fs.readFileSync(file, "utf8").replace("date: 2026-08-31", "date: 2026-02-30"));
  assert.throws(() => loadArchiveData(directory), /unquoted\.md/);
}));

test("missing, empty and unsafe image paths use the placeholder; existing images keep their URL", () => withFixture((directory) => {
  fs.mkdirSync(path.join(directory, "images/archive"), { recursive: true });
  fs.writeFileSync(path.join(directory, "images/archive/photo.svg"), '<svg xmlns="http://www.w3.org/2000/svg"/>');
  fs.writeFileSync(path.join(directory, "images/archive/empty.jpg"), "");
  const fallback = "/images/archive/placeholder.svg";
  for (const src of ["/images/archive/missing.jpg", "/images/archive/empty.jpg", "/images/archive/../../secret.jpg", "https://example.com/photo.jpg"]) {
    assert.equal(resolveArchiveImage(src, directory), fallback);
  }
  assert.equal(resolveArchiveImage("/images/archive/photo.svg", directory), "/images/archive/photo.svg");
}));

test("repeated headings, paragraphs and images retain source order, captions and alt text", () => {
  const sections = getArchiveSections('시작 문단\n\n## 첫 제목\n\n![사진 설명](/images/archive/one.jpg "캡션")\n\n**본문**\n\n다음 문단\n\n![두 번째](/images/archive/two.jpg)\n\n## 이미지 없는 제목\n\n마지막 문단');
  assert.equal(sections.length, 4);
  assert.equal(sections[0].blocks.length, 1);
  assert.equal(sections[1].heading?.text, "첫 제목");
  assert.equal(sections[1].image?.text, "사진 설명");
  assert.equal(sections[1].image?.title, "캡션");
  assert.equal(sections[1].blocks.length, 2);
  assert.equal(sections[2].image?.href, "/images/archive/two.jpg");
  assert.equal(sections[3].heading?.text, "이미지 없는 제목");
  assert.equal(sections[3].blocks.length, 1);
  const adjacent = getArchiveSections('![하나](/images/archive/a.jpg) ![둘](/images/archive/b.jpg)');
  assert.equal(adjacent.length, 2);
  assert.equal(safeArchiveLink("javascript:alert(1)"), undefined);
  assert.equal(safeArchiveLink("https://example.com"), "https://example.com");
});
