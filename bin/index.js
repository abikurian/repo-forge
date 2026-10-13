#!/usr/bin/env node

import { Command } from 'commander';
import inquirer from 'inquirer';
import fs from 'fs-extra';
import path from 'path';

const program = new Command();

program
  .name('repo-forge')
  .description('CLI tool to initialize repository scaffolding')
  .version('1.0.0')
  .action(async () => {
    try {
      const answers = await inquirer.prompt([
        {
          type: 'input',
          name: 'projectName',
          message: 'Project Name:',
          default: path.basename(process.cwd()),
          validate: (input) => (input.trim() ? true : 'Project name cannot be empty.')
        },
        {
          type: 'input',
          name: 'authorName',
          message: 'Author Name:',
          default: ''
        }
      ]);

      const { projectName, authorName } = answers;

      const readmeContent = `# ${projectName}

Created by ${authorName ? authorName : 'Anonymous'}

## Description
A brief description of ${projectName}.

## Getting Started
Instructions on how to get started with the project.
`;

      const gitignoreContent = `# Dependencies
node_modules/
.pnp
.pnp.js

# Testing
coverage/

# Production
build/
dist/

# Misc
.DS_Store
Thumbs.db
*.pem

# Debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Local environment variables
.env
.env*.local

# Editor directories and files
.vscode/
.idea/
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?
`;

      const cwd = process.cwd();
      const readmePath = path.join(cwd, 'README.md');
      const gitignorePath = path.join(cwd, '.gitignore');

      await fs.writeFile(readmePath, readmeContent, 'utf-8');
      await fs.writeFile(gitignorePath, gitignoreContent, 'utf-8');

      console.log(`\n✓ Successfully created README.md and .gitignore for "${projectName}"!`);
    } catch (error) {
      if (error.name === 'ExitPromptError') {
        console.log('\nOperation cancelled.');
        process.exit(0);
      }
      console.error('\nError creating files:', error.message);
      process.exit(1);
    }
  });

program.parse(process.argv);
