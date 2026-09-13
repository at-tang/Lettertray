

export function Testing() {
    const fs = require('fs');

    try {
        const data = fs.readFileSync('/Users/aidantang/Downloads/TestingForApp/untitled.txt', 'utf8');
        return data;
    } catch (e) {
        console.error(e);
    }

}