const fs = require('fs');
const pdfParse = require('pdf-parse');

async function readPdfs() {
    try {
        let dataBuffer1 = fs.readFileSync('recipe1.pdf');
        let data1 = await pdfParse(dataBuffer1);
        console.log("=== RECIPE 1 ===");
        console.log(data1.text.substring(0, 1000));
        
        let dataBuffer2 = fs.readFileSync('recipe2.pdf');
        let data2 = await pdfParse(dataBuffer2);
        console.log("=== RECIPE 2 ===");
        console.log(data2.text.substring(0, 1000));
    } catch (err) {
        console.error("Error reading PDFs:", err);
    }
}

readPdfs();
