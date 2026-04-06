const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'src', 'backend', 'actions');

function fixFiles(directory) {
    const files = fs.readdirSync(directory);
    
    files.forEach(file => {
        const fullPath = path.join(directory, file);
        if (fs.statSync(fullPath).isDirectory()) {
            fixFiles(fullPath);
        } else if (file.endsWith('.ts')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let modified = false;

            // Replace standard error returns
            const regex = /return\s*\{\s*error:/g;
            if (regex.test(content)) {
                content = content.replace(regex, 'return { success: false, error:');
                modified = true;
            }

            // Also check for Explicit Return Type in Promises like Promise<{ error: string }>
            const typeRegex = /\{\s*error:\s*string\s*\}/g;
            if (typeRegex.test(content)) {
                content = content.replace(typeRegex, '{ success: false; error: string }');
                modified = true;
            }

            if (modified) {
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log(`Fixed: ${file}`);
            }
        }
    });
}

fixFiles(dir);
console.log('✅ Correção estrutural Completa na tipagem das Actions!');
