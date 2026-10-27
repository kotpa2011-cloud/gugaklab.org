import fs from "node:fs";
import path from "node:path";
import { cache } from "react";
import matter from "gray-matter";

import type { ArchiveData, ArchiveEntry, ArchiveProgram } from "@/types/archive";

const contentDirectory = path.join(process.cwd(), "content/archive");
const publicDirectory = path.join(process.cwd(), "public");
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function text(value: unknown, field: string, file: string, optional = false): string {
  if (optional && (value === undefined || value === null || value === "")) return "";
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`${file}: ${field}에 비어 있지 않은 문구를 입력해 주세요.`);
  }
  return value.trim();
}

function identifier(value: unknown, field: string, file: string): string {
  const result = text(value, field, file);
  if (!slugPattern.test(result)) {
    throw new Error(`${file}: ${field}는 영문 소문자, 숫자, 하이픈(-)으로 작성해 주세요.`);
  }
  return result;
}

/** Invalid metadata stops the build with a filename, rather than publishing broken links. */
export function loadArchiveData(directory = contentDirectory): ArchiveData {
  const programFile = path.join(directory, "programs.json");
  let rawPrograms: unknown;
  try {
    rawPrograms = JSON.parse(fs.readFileSync(programFile, "utf8"));
  } catch (error) {
    throw new Error(`${programFile}: 프로그램 정보의 쉼표와 따옴표를 확인해 주세요.`, { cause: error });
  }
  if (!Array.isArray(rawPrograms) || rawPrograms.length === 0) {
    throw new Error(`${programFile}: 프로그램 목록을 입력해 주세요.`);
  }
  const programIds = new Set<string>();
  const programs: ArchiveProgram[] = rawPrograms.map((raw: unknown) => {
    if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
      throw new Error(`${programFile}: 프로그램 설정을 확인해 주세요.`);
    }
    const value = raw as Record<string, unknown>;
    const id = identifier(value.id, "id", programFile);
    if (programIds.has(id)) throw new Error(`${programFile}: id가 중복되었습니다: ${id}`);
    programIds.add(id);
    if (typeof value.enabled !== "boolean") {
      throw new Error(`${programFile}: enabled는 true 또는 false로 입력해 주세요.`);
    }
    return {
      id,
      label: text(value.label, "label", programFile),
      title: text(value.title, "title", programFile),
      subtitle: text(value.subtitle, "subtitle", programFile, true),
      period: text(value.period, "period", programFile, true),
      enabled: value.enabled,
    };
  });
  if (!programs.some((program) => program.enabled)) {
    throw new Error(`${programFile}: 적어도 한 프로그램의 enabled를 true로 설정해 주세요.`);
  }
  const ids = new Set<string>();
  const slugs = new Set<string>();
  const entries: ArchiveEntry[] = [];
  for (const name of fs.readdirSync(directory).sort()) {
    if (!name.endsWith(".md") || name.startsWith("_")) continue;
    const filename = path.join(directory, name);
    const source = fs.readFileSync(filename, "utf8");
    if (!/^---\r?\n/.test(source)) {
      throw new Error(`${filename}: 첫 줄에 ---를 넣고 콘텐츠 정보를 작성해 주세요.`);
    }
    let parsed: ReturnType<typeof matter>;
    try {
      parsed = matter(source);
    } catch (error) {
      throw new Error(`${filename}: 상단 콘텐츠 정보의 따옴표와 줄바꿈을 확인해 주세요.`, { cause: error });
    }
    const { data, content } = parsed;
    if (data.published === false) continue;
    if (data.published !== undefined && data.published !== true) {
      throw new Error(`${filename}: published는 true 또는 false로 입력해 주세요.`);
    }
    const id = identifier(data.id, "id", filename);
    const slug = identifier(data.slug, "slug", filename);
    const program = identifier(data.program, "program", filename);
    if (!programIds.has(program)) throw new Error(`${filename}: programs.json에 없는 program입니다: ${program}`);
    if (ids.has(id) || slugs.has(slug)) throw new Error(`${filename}: id 또는 slug가 중복되었습니다.`);
    if (typeof data.order !== "number" || !Number.isFinite(data.order)) {
      throw new Error(`${filename}: order에 정렬 순서를 숫자로 입력해 주세요.`);
    }
    // YAML timestamps can normalize invalid dates (e.g. February 30); validate the literal.
    const date = data.date instanceof Date
      ? text(parsed.matter.match(/^[ \t]*date[ \t]*:[ \t]*(\d{4}-\d{2}-\d{2})[ \t]*(?:#.*)?$/m)?.[1], "date", filename)
      : text(data.date, "date", filename);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !Number.isFinite(Date.parse(date)) || new Date(date).toISOString().slice(0, 10) !== date) {
      throw new Error(`${filename}: date는 실제 날짜를 YYYY-MM-DD 형식으로 입력해 주세요.`);
    }
    const title = text(data.title, "title", filename);
    entries.push({
      id, slug, program,
      order: data.order,
      badge: text(data.badge, "badge", filename),
      title,
      listTitle: text(data.listTitle, "listTitle", filename, true) || title,
      date,
      location: text(data.location, "location", filename, true),
      subtitle: text(data.subtitle, "subtitle", filename, true),
      body: content.trim(),
    });
    ids.add(id);
    slugs.add(slug);
  }
  const enabledIds = new Set(programs.filter((program) => program.enabled).map((program) => program.id));
  return {
    programs,
    entries: entries.filter((entry) => enabledIds.has(entry.program))
      .sort((a, b) => a.order - b.order || a.slug.localeCompare(b.slug)),
  };
}

export const getArchiveData = cache(() => loadArchiveData());

export function archiveProgramHref(program: ArchiveProgram): string {
  return program.id === "meetup" ? "/archive" : `/archive?program=${program.id}`;
}

export function archiveEntryHref(entry: ArchiveEntry): string {
  return `/archive/${entry.slug}`;
}

export function formatArchiveDate(date: string): string {
  const [year, month, day] = date.split("-");
  return `${year}. ${Number(month)}. ${Number(day)}`;
}

/** A missing or invalid image keeps the same layout using the Figma placeholder. */
export function resolveArchiveImage(src: string, root = publicDirectory): string {
  if (!/^\/images\/archive\/[a-zA-Z0-9_./-]+\.(?:png|jpe?g|webp|gif|avif|svg)$/i.test(src) || src.split("/").includes("..")) {
    return "/images/archive/placeholder.svg";
  }
  const filename = path.join(root, src);
  return fs.existsSync(filename) && fs.statSync(filename).isFile() && fs.statSync(filename).size > 0
    ? src : "/images/archive/placeholder.svg";
}
