const fs = require('fs');
const path = 'c:\\Users\\Pedro\\Documents\\DEV\\e-commerce-platform\\Plano_Transformacao_CMS.md';
try {
    fs.unlinkSync(path);
    console.log('File deleted successfully');
} catch (err) {
    console.error('Error deleting file:', err);
}
