import fs from 'fs';
import csv from 'csv-parser';
import ExcelJS from 'exceljs';
import { dataPaths } from '../config/config';
import { createLogger } from './logger';

const logger = createLogger('data-reader');

/**
 * Read CSV file and return its content as an array of objects
 * @param fileName - The name of the CSV file
 * @returns Promise resolving to an array of data objects
 */
export async function readCsvData(fileName: string): Promise<any[]> {
  logger.info(`Reading CSV data from: ${fileName}`);
  const filePath = `${dataPaths.csv}${fileName}`;
  const results: any[] = [];
  
  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => {
        logger.info(`Successfully read ${results.length} records from ${fileName}`);
        resolve(results);
      })
      .on('error', (error) => {
        logger.error(`Error reading CSV file: ${error.message}`);
        reject(error);
      });
  });
}

/**
 * Read JSON file and return its content
 * @param fileName - The name of the JSON file
 * @returns The parsed JSON data
 */
export function readJsonData(fileName: string): any {
  logger.info(`Reading JSON data from: ${fileName}`);
  const filePath = `${dataPaths.json}${fileName}`;
  
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    const jsonData = JSON.parse(data);
    logger.info(`Successfully read JSON data from ${fileName}`);
    return jsonData;
  } catch (error) {
    logger.error(`Error reading JSON file: ${error instanceof Error ? error.message : String(error)}`);
    throw error;
  }
}

/**
 * Read Excel file and return specific sheet data as an array of objects
 * @param fileName - The name of the Excel file
 * @param sheetName - The name of the sheet to read (optional)
 * @returns Promise resolving to an array of data objects
 */
export async function readExcelData(fileName: string, sheetName?: string): Promise<any[]> {
  logger.info(`Reading Excel data from: ${fileName}${sheetName ? `, sheet: ${sheetName}` : ''}`);
  const filePath = `${dataPaths.excel}${fileName}`;
  const workbook = new ExcelJS.Workbook();
  
  try {
    await workbook.xlsx.readFile(filePath);
    
    // Get the specified sheet or the first sheet
    const worksheet = sheetName ? 
      workbook.getWorksheet(sheetName) : 
      workbook.worksheets[0];
    
    if (!worksheet) {
      throw new Error(`Worksheet ${sheetName || 'at index 0'} not found`);
    }
    
    const results: any[] = [];
    
    // Get the header row
    const headerRow = worksheet.getRow(1);
    const headers: string[] = [];
    
    headerRow.eachCell((cell, colNumber) => {
      headers[colNumber - 1] = cell.value as string;
    });
    
    // Process each row
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber > 1) { // Skip header row
        const rowData: Record<string, any> = {};
        
        row.eachCell((cell, colNumber) => {
          const header = headers[colNumber - 1];
          rowData[header] = cell.value;
        });
        
        results.push(rowData);
      }
    });
    
    logger.info(`Successfully read ${results.length} records from Excel`);
    return results;
  } catch (error) {
    logger.error(`Error reading Excel file: ${error instanceof Error ? error.message : String(error)}`);
    throw error;
  }
}