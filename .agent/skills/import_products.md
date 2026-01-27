---
name: Import Products Feature
description: Instructions for implementing the Bulk Product Import via Excel with AI analysis.
---

# Feature: Bulk Product Import (Excel + AI)

## Goal
Allow administrators to upload an Excel file containing product data. The system should parse this file, use an AI (e.g., Gemini) to enrich the data (generate descriptions, categorize), and save the products to the database.

## Architecture

1.  **Admin Page (`/admin/products/import`):**
    -   File Input (Drag & Drop preferred).
    -   "Upload & Analyze" button.
    -   Preview table showing parsed + AI-enriched data.
    -   "Confirm Import" button.

2.  **Server Action (`import-products.ts`):**
    -   Function `parseExcel(formData)`: Reads the file buffer using `xlsx`.
    -   Function `enrichProductWithAI(rawProduct)`: Calls AI to format/fix data.
    -   Function `saveProducts(products)`: Batch `prisma.product.create`.

## Dependencies
- `xlsx` (for parsing).
- `google-generative-ai` (already present).

## Logic Flow
1.  User selects `.xlsx`.
2.  Frontend sends file to Server Action.
3.  Server parses JSON from Excel.
4.  Server loops through rows:
    -   If description missing, ask AI to generate based on Name + details.
    -   If category missing, ask AI to infer.
5.  Server returns "Proposed Data" to Frontend.
6.  User reviews and clicks "Confirm".
7.  Server saves to DB.

## Fields to Map
-   `Name` -> `product.name`
-   `Price` -> `product.price` (Handle currency conversion if needed)
-   `Stock` -> `product.stock`
-   `Image` -> `product.imageUrl` (URL provided in excel)
-   `Description` -> `product.description` (AI generated if empty)
