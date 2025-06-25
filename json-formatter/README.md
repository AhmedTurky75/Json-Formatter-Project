# JSON Formatter & Validator

A modern, responsive Angular application for formatting, validating, and working with JSON data. Features include syntax highlighting, theme support, and various export options.

## 🌟 Features

- **JSON Formatting**: Beautify and format JSON with customizable indentation
- **Minification**: Compact JSON output by removing unnecessary whitespace
- **Syntax Validation**: Real-time validation with detailed error messages
- **File Support**: Upload and process JSON files (max 2MB)
- **URL Fetching**: Load JSON directly from URLs
- **Theme Support**: Light, dark, and system theme options
- **Responsive Design**: Works on desktop and mobile devices
- **Copy to Clipboard**: One-click copy of formatted JSON
- **File Download**: Save formatted JSON to a file

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or later)
- npm (v8 or later) or Yarn
- Angular CLI (v15 or later)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/json-formatter.git
   cd json-formatter
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

### Development Server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

```bash
ng serve
```

### Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

```bash
ng build
```

For a production build:

```bash
ng build --configuration production
```

## 🛠️ Usage

1. **Input JSON**:
   - Type or paste JSON directly into the input area
   - Upload a JSON file using the file picker
   - Enter a URL to fetch JSON data

2. **Format Options**:
   - Use the "Format" button to beautify the JSON
   - Use the "Minify" button to compress the JSON
   - Toggle between light and dark themes using the theme toggle

3. **Actions**:
   - Click "Copy" to copy the formatted JSON to clipboard
   - Click "Download" to save the JSON to a file
   - Click "Clear" to reset the input and output

## 🧪 Running Tests

### Unit Tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io):

```bash
ng test
```

### End-to-End Tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice:

```bash
ng e2e
```

## 🛠️ Built With

- [Angular](https://angular.io/) - The web framework used
- [Tailwind CSS](https://tailwindcss.com/) - For styling
- [Angular Material](https://material.angular.io/) - UI components
- [ngx-markdown](https://github.com/jfcere/ngx-markdown) - Markdown rendering

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Angular CLI](https://github.com/angular/angular-cli) for project scaffolding
- [JSON Formatter](https://github.com/mohsen1/json-formatter-js) for inspiration
- All contributors who helped improve this project
