const fs = require('fs');
const PDFParser = require("pdf2json");

function parsePdf(filename) {
    return new Promise((resolve, reject) => {
        const pdfParser = new PDFParser(this, 1);
        pdfParser.on("pdfParser_dataError", errData => reject(errData.parserError));
        pdfParser.on("pdfParser_dataReady", pdfData => {
            resolve(pdfParser.getRawTextContent());
        });
        pdfParser.loadPDF(filename);
    });
}

async function main() {
    try {
        const text1 = await parsePdf("recipe1.pdf");
        console.log("=== RECIPE 1 ===");
        console.log(text1.substring(0, 1000));
        
        const text2 = await parsePdf("recipe2.pdf");
        console.log("=== RECIPE 2 ===");
        console.log(text2.substring(0, 1000));
    } catch(e) {
        console.error("Error:", e);
    }
}

main();
