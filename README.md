# 🎨 Custom WordPress Block Theme Scaffolder

Welcome! This is a simple, beginner-friendly command-line tool that instantly generates a modern, production-ready **WordPress Block Theme** (Full Site Editing). 

Instead of manually creating `theme.json`, enqueueing scripts, and setting up build tools from scratch, this tool does it all for you in seconds. It uses the official `@wordpress/scripts` package under the hood, so you're immediately ready to write modern JavaScript, SCSS, and custom Gutenberg blocks!

---

## 🚀 Getting Started

You do **not** need to install this tool permanently on your computer. As long as you have [Node.js](https://nodejs.org/) installed, you can run it directly from your terminal!

### 1. Create your Theme

Open your terminal, navigate to your local WordPress installation's `themes` folder, and run the magic command:

```bash
cd /working-path/to/your/wp-content/themes/

# Launch the interactive theme creator!
npx github:alokjain-lucky/create-custom-wp-theme
```

### 2. Follow the Prompts
The tool will ask you a few simple questions:
1. **Directory Name:** E.g., `my-awesome-theme`
2. **Theme Title:** E.g., `My Awesome Theme`
3. **Theme Slug:** E.g., `my-awesome-theme` (used internally for code prefixes)
4. **Include Example Block:** If you choose `Yes`, we will automatically scaffold a working Custom Gutenberg Block inside `src/blocks/example-block` so you can see exactly how to build and register your own custom blocks!

### 3. Start Coding!

Once generated, jump into your new folder and start the development server:

```bash
cd my-awesome-theme
npm start
```
*This command watches your `src/` folder. Anytime you save a `.scss` or `.js` file, it automatically compiles it into the `build/` folder for WordPress to load!*

---

## 🧱 Scaffold More Custom Blocks

Building custom blocks in WordPress manually can require a lot of boilerplate code (`block.json`, `edit.js`, `save.js`, etc.). This CLI tool has a built-in shortcut to generate everything for you!

While inside your newly created theme folder, just run:

```bash
# Example: create a block called "hero-banner"
npx github:alokjain-lucky/create-custom-wp-theme g-block hero-banner
```

This will instantly create a `src/blocks/hero-banner/` directory with all the necessary files. Just remember to import it into your `src/index.js` file if you want it loaded by WordPress!

---

## 📦 Building for Production

When you are ready to install your theme on a live server, run:

```bash
npm run zip
```
This will automatically compile all your code, strip out the developer tools, and create a lightweight `my-awesome-theme.zip` file that you can upload directly via the WordPress Admin dashboard!
