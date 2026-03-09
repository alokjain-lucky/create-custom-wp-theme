# Custom WordPress Block Theme Generator

A command-line tool designed to quickly scaffold a custom WordPress block theme structure based on the modern `@wordpress/scripts` workflow. 

## Requirements
- Node.js (v14+)
- npm

## Usage

You can scaffold a new WordPress theme from any directory on your computer by running this command:

```bash
# Navigate to your WordPress themes directory
cd /path/to/wp-content/themes/

# Create a new theme using npx
npx github:alokjain-lucky/create-custom-wp-theme my-new-theme

# Optional Arguments:
# -n, --theme-name "My Custom Title"  (Sets the style.css Name)
# -s, --slug "custom-slug"            (Sets the text-domain and folder prefixes)

# Example with arguments:
npx github:alokjain-lucky/create-custom-wp-theme my-new-theme -n "Awesome Blog" -s "awesome-blog"
```

## What it Does

This CLI tool will:
1. Create a `my-new-theme` folder where you ran the command.
2. Copy all boilerplate files from the internal `template/` folder.
3. Automatically search and replace dynamic names (like `{{theme_slug}}`, `{{theme_name}}`, and `{{function_prefix}}`) inside `style.css`, PHP files, and Package files.
4. Auto-run `npm install` inside your new theme so it is immediately ready for `@wordpress/scripts`!

## Generated Theme Commands

Once your theme is created, simply `cd my-new-theme` and jump straight into development:

- `npm start`: Starts the dev server for compiling assets.
- `npm run build`: Bundles assets for production.
- `npm run zip`: Packages a `.zip` file ready to be uploaded to WordPress.
