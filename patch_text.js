const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        if (file === 'node_modules' || file === '.git' || file === '.expo') return;
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else {
            if (file.endsWith('.tsx') || file.endsWith('.ts')) {
                results.push(file);
            }
        }
    });
    return results;
}

const files = walk('./');
let changed = 0;

files.forEach(file => {
    // skip our custom component
    if (file.includes('AppText.tsx')) return;
    
    let content = fs.readFileSync(file, 'utf8');
    
    // Find import { ..., Text, ... } from 'react-native'
    const importRegex = /import\s+({[^}]*?})\s+from\s+['"]react-native['"]/g;
    let modified = false;

    content = content.replace(importRegex, (match, p1) => {
        if (p1.includes('Text') && !p1.includes('TextInput')) {
            // Need to exact match `Text` as a token, not just something containing Text
            const tokens = p1.split(',').map(s => s.trim()).filter(Boolean);
            if (tokens.includes('Text')) {
                modified = true;
                const newTokens = tokens.filter(t => t !== 'Text');
                if (newTokens.length === 0) {
                    return `// Text import replaced\nimport { AppText as Text } from '@/components/ui/AppText';`;
                }
                const newImport = `import { ${newTokens.join(', ')} } from 'react-native';\nimport { AppText as Text } from '@/components/ui/AppText';`;
                return newImport;
            }
        }
        return match;
    });

    // Also look for multi-line imports just in case regex didn't catch, the regex above catches multiline if well formed
    if (modified) {
        fs.writeFileSync(file, content, 'utf8');
        changed++;
    }
});

console.log(`Replaced Text imports in ${changed} files.`);
