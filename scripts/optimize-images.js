const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const INPUT_DIR = path.resolve(__dirname, '../public/static/images');
const OUTPUT_DIR = path.resolve(__dirname, '../public/static/images/optimized');

const SUPPORTED_EXTENSIONS = ['.png', '.jpg', '.jpeg'];
const WEBP_QUALITY = 80;

async function optimizeImages() {
    // Ensure output directory exists
    if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    const files = fs.readdirSync(INPUT_DIR);
    const imageFiles = files.filter((file) =>
        SUPPORTED_EXTENSIONS.includes(path.extname(file).toLowerCase())
    );

    console.log(`🖼  Found ${imageFiles.length} images to optimize...\n`);

    for (const file of imageFiles) {
        const inputPath = path.join(INPUT_DIR, file);
        const outputName = `${path.parse(file).name}.webp`;
        const outputPath = path.join(OUTPUT_DIR, outputName);

        // Skip if already optimized and source hasn't changed
        try {
            const srcStat = fs.statSync(inputPath);
            const outStat = fs.statSync(outputPath);
            if (outStat.mtimeMs >= srcStat.mtimeMs) {
                console.log(`  ⏭  ${file} — already up to date`);
                continue;
            }
        } catch {
            // Output doesn't exist yet, proceed
        }

        const inputBuffer = fs.readFileSync(inputPath);
        const { size: originalSize } = fs.statSync(inputPath);

        await sharp(inputBuffer)
            .webp({ quality: WEBP_QUALITY, effort: 6 })
            .toFile(outputPath);

        const { size: optimizedSize } = fs.statSync(outputPath);
        const savings = (
            ((originalSize - optimizedSize) / originalSize) *
            100
        ).toFixed(1);

        console.log(
            `  ✅ ${file} → ${outputName}  (${(originalSize / 1024).toFixed(1)}KB → ${(optimizedSize / 1024).toFixed(1)}KB, -${savings}%)`
        );
    }

    console.log('\n🎉 Image optimization complete!');
}

optimizeImages().catch((err) => {
    console.error('❌ Image optimization failed:', err);
    process.exit(1);
});
