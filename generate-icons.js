const fs = require('fs');
const path = require('path');

async function generateIcons() {
    try {
        const sharp = require('sharp');
        const inputPath = path.join(__dirname, 'public', 'icon.png');
        const out192 = path.join(__dirname, 'public', 'icon-192x192.png');
        const out512 = path.join(__dirname, 'public', 'icon-512x512.png');

        await sharp(inputPath).resize(192, 192).toFile(out192);
        await sharp(inputPath).resize(512, 512).toFile(out512);
        console.log('Icons generated successfully with sharp');
    } catch (e) {
        console.log('Sharp not available or error occurred, just copying files...');
        const inputPath = path.join(__dirname, 'public', 'icon.png');
        const out192 = path.join(__dirname, 'public', 'icon-192x192.png');
        const out512 = path.join(__dirname, 'public', 'icon-512x512.png');
        fs.copyFileSync(inputPath, out192);
        fs.copyFileSync(inputPath, out512);
        console.log('Icons copied successfully');
    }
}

generateIcons();
