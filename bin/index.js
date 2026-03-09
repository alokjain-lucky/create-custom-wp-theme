#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const { program } = require('commander');
const chalk = require('chalk');
const { execSync } = require('child_process');
const inquirer = require('inquirer');

// Helpers
const toSlug = (str) => str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
const toTitleCase = (str) => str.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

// Replace variables in file
const replaceInFile = (filePath, replacements) => {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');
  for (const [key, value] of Object.entries(replacements)) {
    content = content.replace(new RegExp(`{{${key}}}`, 'g'), value);
  }
  fs.writeFileSync(filePath, content, 'utf8');
};

program.version('1.0.0');

program
  .command('g-block <block-name>')
  .description('Scaffold a new custom Gutenberg block')
  .action((blockName) => {
    const slug = toSlug(blockName);
    const title = toTitleCase(blockName);
    const targetPath = path.resolve(process.cwd(), 'src/blocks', slug);

    if (fs.existsSync(targetPath)) {
      console.error(chalk.red(`\nError: Block directory 'src/blocks/${slug}' already exists.\n`));
      process.exit(1);
    }

    console.log(chalk.blue(`\nGenerating a new Gutenberg block: ${chalk.green(title)}...\n`));

    const blockRepo = 'alokjain-lucky/create-custom-wp-theme/block-template';

    try {
      // 1. Download block templates
      console.log(chalk.yellow(`Downloading block scaffolding from ${blockRepo}...`));
      execSync(`npx degit ${blockRepo} ${targetPath} --force`, { stdio: 'inherit' });

      // 2. Replace variables in all block files
      const blockFiles = [
        'block.json',
        'index.js',
        'edit.js',
        'save.js',
        'style.scss'
      ];

      const replacements = {
        block_slug: slug,
        block_title: title
      };

      for (const file of blockFiles) {
        replaceInFile(path.join(targetPath, file), replacements);
      }

      console.log(chalk.green(`\nSuccess! Block '${title}' generated at 'src/blocks/${slug}'.\n`));
      console.log(chalk.cyan(`Remember to import your block in your main 'src/index.js' or via PHP if necessary!\n`));
      console.log(chalk.cyan(`Example JS Import: import './blocks/${slug}';\n`));

    } catch (err) {
      console.error(chalk.red('\nFailed to generate block:'), err);
    }
  });

// The default command for scaffolding a theme
program
  .argument('[theme-name]', 'Name of the theme directory to create')
  .option('-s, --slug <slug>', 'Theme slug (defaults to folder name)')
  .option('-n, --theme-name <name>', 'Theme "Title" for style.css')
  .action(async (themeNameArg, options) => {

    // Inquirer Prompts if no arguments are provided
    let themeName = themeNameArg;
    let themeSlug = options.slug;
    let themeTitle = options.themeName;

    if (!themeName) {
      console.log(chalk.cyan('\nWelcome to the Custom WP Theme Scaffolder!\n'));
      const answers = await inquirer.prompt([
        {
          type: 'input',
          name: 'themeName',
          message: 'What is the name of your theme directory?',
          default: 'my-custom-theme',
          validate: input => input ? true : 'Directory name is required!'
        },
        {
          type: 'input',
          name: 'themeTitle',
          message: 'What is the Theme Title?',
          default: (answers) => toTitleCase(answers.themeName)
        },
        {
          type: 'input',
          name: 'themeSlug',
          message: 'What is the Theme Slug? (Used for text domain, prefixes)',
          default: (answers) => toSlug(answers.themeName)
        },
        {
          type: 'confirm',
          name: 'includeExampleBlock',
          message: 'Would you like to include an example Custom Gutenberg Block?',
          default: false
        }
      ]);

      themeName = answers.themeName;
      themeTitle = answers.themeTitle;
      themeSlug = answers.themeSlug;
      options.includeExampleBlock = answers.includeExampleBlock;
    } else {
      // Fallback defaults for arguments
      if (!themeSlug) themeSlug = toSlug(themeName);
      if (!themeTitle) themeTitle = toTitleCase(themeName);
    }

    const targetPath = path.resolve(process.cwd(), themeName);
    const functionPrefix = themeSlug.replace(/-/g, '_');

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

      const filesToProcess = [
        'package.json',
        'style.css',
        'functions.php',
        'includes/enqueue.php',
        'patterns/hero.php',
        'README.md',
        'theme.json'
      ];

      const replacements = {
        theme_slug: themeSlug,
        theme_name: themeTitle,
        function_prefix: functionPrefix
      };

      for (const file of filesToProcess) {
        replaceInFile(path.join(targetPath, file), replacements);
      }

      // 3. Optional: Scaffold Example Block
      if (options.includeExampleBlock) {
        console.log(chalk.yellow(`\nDownloading example block scaffolding...`));
        const blockRepo = 'alokjain-lucky/create-custom-wp-theme/block-template';
        const blockTargetPath = path.join(targetPath, 'src/blocks/example-block');

        execSync(`npx degit ${blockRepo} ${blockTargetPath} --force`, { stdio: 'inherit' });

        const blockFiles = ['block.json', 'index.js', 'edit.js', 'save.js', 'style.scss'];
        const blockReplacements = { block_slug: 'example-block', block_title: 'Example Block' };

        for (const file of blockFiles) {
          replaceInFile(path.join(blockTargetPath, file), blockReplacements);
        }

        // Import the new block dynamically in the main src/index.js file
        const indexPath = path.join(targetPath, 'src/index.js');
        if (fs.existsSync(indexPath)) {
          let indexContent = fs.readFileSync(indexPath, 'utf8');
          indexContent += `\n// Import Custom Blocks\nimport './blocks/example-block';\n`;
          fs.writeFileSync(indexPath, indexContent, 'utf8');
        }

        console.log(chalk.green(`Example block added to src/blocks/example-block.`));
      }

      console.log(chalk.green('\nTheme files successfully generated.\n'));
      console.log('Installing dependencies...');

      execSync('npm install', { cwd: targetPath, stdio: 'inherit' });

      console.log(chalk.green('\nSuccess! Created'), chalk.cyan(themeTitle), chalk.green('at'), chalk.cyan(targetPath));
      console.log('\nInside that directory, you can run several commands:\n');
      console.log(chalk.cyan('  npm start'));
      console.log('    Starts the development server.\n');
      console.log(chalk.cyan('  npm run build'));
      console.log('    Bundles the theme files for production.\n');
      console.log(chalk.cyan('  npx github:alokjain-lucky/create-custom-wp-theme g-block my-block'));
      console.log('    Scaffolds a new custom Gutenberg block directly in your theme.\n');
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
