#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const { program } = require('commander');
const chalk = require('chalk');
const { execSync } = require('child_process');

program
  .version('1.0.0')
  .argument('<theme-name>', 'Name of the theme directory to create')
  .option('-s, --slug <slug>', 'Theme slug (defaults to folder name)')
  .option('-n, --theme-name <name>', 'Theme "Title" for style.css')
  .action((themeName, options) => {
    const targetPath = path.resolve(process.cwd(), themeName);
    const slug = options.slug || themeName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const title = options.themeName || slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    const functionPrefix = slug.replace(/-/g, '_');

    if (fs.existsSync(targetPath)) {
      console.error(chalk.red(`\nError: Directory ${themeName} already exists.\n`));
      process.exit(1);
    }

    console.log(chalk.blue(`\nCreating a new WordPress theme in ${chalk.green(targetPath)}...\n`));

    const templateRepo = 'alokjain-lucky/create-custom-wp-theme/template';

    try {
      // 1. Download template files via degit
      console.log(chalk.yellow(`Downloading template from ${templateRepo}...`));
      execSync(`npx degit ${templateRepo} ${targetPath} --force`, { stdio: 'inherit' });

      // 2. Process files to replace variables
      // Also rename __gitignore to .gitignore, etc. since NPM sometimes strips them.
      const renameMap = {
        '__gitignore': '.gitignore',
        '__eslintrc': '.eslintrc',
        '__stylelintrc': '.stylelintrc',
        '__prettierrc': '.prettierrc',
        '__distignore': '.distignore'
      };

      for (const [oldName, newName] of Object.entries(renameMap)) {
        if (fs.existsSync(path.join(targetPath, oldName))) {
          fs.renameSync(path.join(targetPath, oldName), path.join(targetPath, newName));
        }
      }

      const replaceInFile = (filePath, replacements) => {
        if (!fs.existsSync(filePath)) return;
        let content = fs.readFileSync(filePath, 'utf8');
        for (const [key, value] of Object.entries(replacements)) {
          content = content.replace(new RegExp(`{{${key}}}`, 'g'), value);
        }
        fs.writeFileSync(filePath, content, 'utf8');
      };

      const filesToProcess = [
        'package.json',
        'style.css',
        'functions.php',
        'includes/enqueue.php',
        'README.md',
        'theme.json'
      ];

      const replacements = {
        theme_slug: slug,
        theme_name: title,
        function_prefix: functionPrefix
      };

      for (const file of filesToProcess) {
        replaceInFile(path.join(targetPath, file), replacements);
      }

      console.log(chalk.green('Theme files successfully generated.\n'));
      console.log('Installing dependencies...');

      execSync('npm install', { cwd: targetPath, stdio: 'inherit' });

      console.log(chalk.green('\nSuccess! Created'), chalk.cyan(title), chalk.green('at'), chalk.cyan(targetPath));
      console.log('\nInside that directory, you can run several commands:\n');
      console.log(chalk.cyan('  npm start'));
      console.log('    Starts the development server.\n');
      console.log(chalk.cyan('  npm run build'));
      console.log('    Bundles the theme files for production.\n');
      console.log(chalk.cyan('  npm run zip'));
      console.log('    Creates a releasable zip file for WP.\n');

      console.log('\nWe suggest that you begin by typing:\n');
      console.log(chalk.cyan(`  cd ${themeName}`));
      console.log(chalk.cyan('  npm start\n'));

    } catch (err) {
      console.error(chalk.red('\nFailed to generate theme:'), err);
    }
  });

program.parse(process.argv);
