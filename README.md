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
The tool will guide you through setup:
1. **Directory Name:** The name of the folder created (e.g., `my-theme`).
2. **Theme Title:** The human-readable name in the WordPress dashboard.
3. **Theme Slug:** A unique ID for your theme (used for code prefixes).
4. **Include Example Block?** (Optional)
   - **No (Default):** Keeps your theme lightweight. Use this if you don't need custom blocks or want to add them manually later.
   - **Yes:** Automatically adds an "Example Block" in `src/blocks/example-block`. This is great for learning how the block structure works!

### 3. Start Coding!

Once generated, jump into your new folder and start the development server:

```bash
cd my-awesome-theme
npm start
```

---

## 🛠️ Development Commands

Your new theme comes with a full suite of development tools. Run these from your theme's root directory:

| Command | Description |
| :--- | :--- |
| `npm start` | **The most common command.** Starts the dev server to watch your files and compile them as you save. |
| `npm run build` | Bundles your assets for production (optimized and minified). |
| `npm run format` | Automatically fixes code formatting in your JS and CSS files. |
| `npm run lint:js` | Checks your JavaScript for common errors. |
| `npm run lint:css` | Checks your CSS/SCSS for common errors. |
| `npm run zip` | Creates a ready-to-upload `.zip` file of your theme. |

---

## 🧱 Adding More Custom Blocks

If you decide you need a *new* custom block later on, you don't have to write the boilerplate from scratch. This CLI includes a helper command to add new blocks to an existing theme.

Navigate to your theme folder and run:

```bash
# Example: create a block called "hero-banner"
npx github:alokjain-lucky/create-custom-wp-theme g-block hero-banner
```

This instantly creates a `src/blocks/hero-banner/` directory with all the necessary structure (`block.json`, `edit.js`, etc.). 

> [!TIP]
> After creating a new block with this command, make sure to import it in your `src/index.js` file so WordPress can find it!
>
> **Example:**
> ```javascript
> // In your src/index.js file:
> import './blocks/hero-banner';
> ```

---

## 📦 Packaging Your Theme

When you're ready to deploy your theme or share it, you can package it into a production-ready `.zip` file. This process automatically compiles all your code, optimizes assets, and strips out developer tools.

Run this command from your theme directory:

```bash
npm run zip
```

This will create a lightweight `.zip` file (e.g., `my-awesome-theme.zip`) that you can upload directly via the **WordPress Admin > Appearance > Themes > Add New > Upload Theme** dashboard!
