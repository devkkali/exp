
async function main() {
  const [{ default: sharp }, fs, path] = await Promise.all([
    import('sharp'),
    import('node:fs'),
    import('node:path'),
  ]);
  const svg = fs.readFileSync(path.join(__dirname, '../public/icons/icon.svg'));

  await sharp(svg).resize(192, 192).png().toFile(path.join(__dirname, "../public/icons/icon-192.png"));
  console.log("Created icon-192.png");
  await sharp(svg).resize(512, 512).png().toFile(path.join(__dirname, "../public/icons/icon-512.png"));
  console.log("Created icon-512.png");
}

main().catch(console.error);
