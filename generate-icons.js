import sharp from "sharp";
import fs from "fs";
import path from "path";

async function generateIcons() {
  const svgPath = path.resolve("public/favicon.svg");
  const output192 = path.resolve("public/icon-192.png");
  const output512 = path.resolve("public/icon-512.png");

  if (!fs.existsSync(svgPath)) {
    console.error("Error: public/favicon.svg not found!");
    process.exit(1);
  }

  console.log("Generating high-resolution PNG icons from public/favicon.svg...");

  try {
    // Generate 192x192 PNG icon
    await sharp(svgPath)
      .resize(192, 192)
      .png()
      .toFile(output192);
    console.log("✓ Successfully created public/icon-192.png");

    // Generate 512x512 PNG icon
    await sharp(svgPath)
      .resize(512, 512)
      .png()
      .toFile(output512);
    console.log("✓ Successfully created public/icon-512.png");

    console.log("PWA icon generation complete!");
  } catch (error) {
    console.error("Error generating icons:", error);
    process.exit(1);
  }
}

generateIcons();
