import fs from "node:fs/promises";
import path from "node:path";
import os from "node:os";

const DEFAULT_CSV = path.join(os.homedir(), "Downloads", "aksha_calendar_rows.csv");
const DEFAULT_OUTPUT_DIR = path.join(os.homedir(), "Downloads", "calendar");
const DEFAULT_MODEL = process.env.OPENAI_IMAGE_MODEL || "gpt-image-1";
const DEFAULT_SIZE = process.env.OPENAI_IMAGE_SIZE || "1024x1024";
const DEFAULT_QUALITY = process.env.OPENAI_IMAGE_QUALITY || "medium";

const BASE_PROMPT =
  "Create a premium mobile app illustration for a self-improvement app depicting [title]. Clean centered composition, aspirational mood, premium aesthetic, suitable for app recommendation card, no text, no branding, 1:1. do not include text, watermark, logo, UI overlay, captions, cluttered background, extra people, distorted hands, bad anatomy, blurry face, low quality";

function parseArgs(argv) {
  const options = {
    csv: DEFAULT_CSV,
    outputDir: DEFAULT_OUTPUT_DIR,
    ids: new Set(),
    force: false,
    dryRun: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    const next = argv[index + 1];

    if (arg === "--csv") {
      if (!next) throw new Error("--csv requires a path");
      options.csv = path.resolve(next);
      index += 1;
    } else if (arg === "--out") {
      if (!next) throw new Error("--out requires a directory");
      options.outputDir = path.resolve(next);
      index += 1;
    } else if (arg === "--id") {
      if (!next) throw new Error("--id requires a row id");
      options.ids.add(next);
      index += 1;
    } else if (arg === "--force") {
      options.force = true;
    } else if (arg === "--dry-run") {
      options.dryRun = true;
    } else if (arg === "--help" || arg === "-h") {
      options.help = true;
    } else {
      throw new Error(`Unknown option: ${arg}`);
    }
  }

  return options;
}

function printHelp() {
  console.log(`Usage:
  OPENAI_API_KEY=... node mobile/scripts/generate-calendar-images.mjs [options]

Options:
  --csv <path>     CSV file to read. Defaults to ${DEFAULT_CSV}
  --out <dir>      Output directory. Defaults to ${DEFAULT_OUTPUT_DIR}
  --id <id>        Generate only one row. Repeat for multiple ids.
  --force          Regenerate images even if the output file already exists.
  --dry-run        Print planned output without calling the image API.
  --help           Show this help text.

Examples:
  node mobile/scripts/generate-calendar-images.mjs --dry-run --id 24
  OPENAI_API_KEY=... node mobile/scripts/generate-calendar-images.mjs --id 24
  OPENAI_API_KEY=... node mobile/scripts/generate-calendar-images.mjs
`);
}

function parseCsv(csv) {
  const rows = [];
  let row = [];
  let value = "";
  let inQuotes = false;

  for (let index = 0; index < csv.length; index += 1) {
    const char = csv[index];
    const next = csv[index + 1];

    if (char === '"') {
      if (inQuotes && next === '"') {
        value += '"';
        index += 1;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === "," && !inQuotes) {
      row.push(value);
      value = "";
    } else if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && next === "\n") index += 1;
      row.push(value);
      if (row.some((cell) => cell.length > 0)) rows.push(row);
      row = [];
      value = "";
    } else {
      value += char;
    }
  }

  if (value.length > 0 || row.length > 0) {
    row.push(value);
    rows.push(row);
  }

  return rows;
}

function recordsFromCsv(csv) {
  const [headers, ...rows] = parseCsv(csv);
  if (!headers?.length) throw new Error("CSV is empty");

  return rows.map((row, rowIndex) => {
    const record = {};
    for (let index = 0; index < headers.length; index += 1) {
      record[headers[index]] = row[index] || "";
    }

    if (!record.id) throw new Error(`Missing id in CSV row ${rowIndex + 2}`);
    if (!record.title) throw new Error(`Missing title in CSV row ${rowIndex + 2}`);
    return record;
  });
}

function promptForTitle(title) {
  return BASE_PROMPT.replace("[title]", title.trim());
}

async function outputExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function generateImage(prompt, apiKey) {
  const response = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: DEFAULT_MODEL,
      prompt,
      size: DEFAULT_SIZE,
      quality: DEFAULT_QUALITY,
      n: 1,
    }),
  });

  const payload = await response.json();

  if (!response.ok) {
    const message = payload?.error?.message || response.statusText;
    throw new Error(`OpenAI image generation failed: ${message}`);
  }

  const imageBase64 = payload?.data?.[0]?.b64_json;
  if (!imageBase64) {
    throw new Error("OpenAI response did not include data[0].b64_json");
  }

  return Buffer.from(imageBase64, "base64");
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  if (options.help) {
    printHelp();
    return;
  }

  const csv = await fs.readFile(options.csv, "utf8");
  const records = recordsFromCsv(csv);
  const selectedRecords = options.ids.size
    ? records.filter((record) => options.ids.has(record.id))
    : records;

  if (options.ids.size && selectedRecords.length !== options.ids.size) {
    const foundIds = new Set(selectedRecords.map((record) => record.id));
    const missingIds = [...options.ids].filter((id) => !foundIds.has(id));
    throw new Error(`No CSV row found for id(s): ${missingIds.join(", ")}`);
  }

  if (!selectedRecords.length) {
    console.log("No rows to process.");
    return;
  }

  await fs.mkdir(options.outputDir, { recursive: true });

  if (!options.dryRun && !process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is required unless --dry-run is passed");
  }

  let generated = 0;
  let skipped = 0;

  for (const record of selectedRecords) {
    const outputPath = path.join(options.outputDir, `${record.id}.png`);
    const prompt = promptForTitle(record.title);

    if (!options.force && (await outputExists(outputPath))) {
      console.log(`Skipping ${record.id}: ${outputPath} already exists`);
      skipped += 1;
      continue;
    }

    if (options.dryRun) {
      console.log(`[dry-run] ${record.id} -> ${outputPath}`);
      console.log(prompt);
      skipped += 1;
      continue;
    }

    console.log(`Generating ${record.id}: ${record.title}`);
    const image = await generateImage(prompt, process.env.OPENAI_API_KEY);
    await fs.writeFile(outputPath, image);
    generated += 1;
    console.log(`Saved ${outputPath}`);
  }

  console.log(`Done. Generated ${generated}; skipped ${skipped}.`);
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
