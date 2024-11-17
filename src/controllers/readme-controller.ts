import { Request, Response } from 'express';
import { marked } from 'marked';
import path from 'path';
import fs from 'fs/promises';

export const readmeController = async (_req: Request, res: Response) => {
  try {
    const readmePath = path.join(process.cwd(), 'README.md');
    const readmeContent = await fs.readFile(readmePath, 'utf-8');

    const htmlContent = marked(readmeContent);

    // Send HTML response
    res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Furniture API Documentation</title>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/5.2.0/github-markdown.min.css">
        <style>
          :root {
            --color-bg: #ffffff;
            --color-text: #24292e;
            --color-code-bg: #f6f8fa;
          }

          @media (prefers-color-scheme: dark) {
            :root {
              --color-bg: #0d1117;
              --color-text: #c9d1d9;
              --color-code-bg: #161b22;
            }
          }

          body {
            box-sizing: border-box;
            min-width: 200px;
            max-width: 980px;
            margin: 0 auto;
            padding: 45px;
            background-color: var(--color-bg);
          }

          @media (max-width: 767px) {
            body {
              padding: 15px;
            }
          }

          .markdown-body {
            background-color: var(--color-bg);
            color: var(--color-text);
          }

          .markdown-body pre {
            background-color: var(--color-code-bg);
          }

          .markdown-body table {
            display: table;
            width: 100%;
          }

          .markdown-body blockquote {
            color: var(--color-text);
            opacity: 0.8;
          }

          .header {
            position: sticky;
            top: 0;
            background-color: var(--color-bg);
            padding: 10px 0;
            margin-bottom: 20px;
            border-bottom: 1px solid #30363d;
            z-index: 1000;
          }

          .api-version {
            font-size: 0.9em;
            color: #6e7681;
            text-align: right;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="api-version">API Version: v1.0.0</div>
        </div>
        <article class="markdown-body">
          ${htmlContent}
        </article>
      </body>
      </html>
    `);
  } catch (error) {
    console.error('Error serving README:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to load documentation',
    });
  }
};
