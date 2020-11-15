# Sails Hook Pdf
Simple pdf generation from template using the `wkhtmltopdf` library.

## Requirements
You should install `wkhtmltopdf` on your system.

## Getting Started
Install it via npm:
```bash
npm install sails-hook-pdf --save
```
Create a directory structure:

    .
    ├── ...
    ├── views/
    │   ├── ...
    │   ├── pdfs/
    │   │   ├── template-1.ejs
    │   │   ├── template-2.ejs
    │   │   └── ... 
    |   └── ... 
    └── ...

## Configuration
Configure `config/pdf.js` in your project:
```javascript
module.exports.pdf = {
  templateDir: 'views/pdfs',
  wkOptions: { // these are the default options
      output: 'pdfs/default.pdf',
      disableJavascript: true,
      minimumFontSize: 14,
  }
};
```
## Available methods
- generate(template, data, options)
    - template: name of template without extension
    - data: object with data to render
    - options: object with wkhtmltopdf options

## Examples 

Generating pdf:
```javascript
sails.hooks.pdf.generate('template-1', { name: 'John Doe' }, { output: 'pdfs/cv-john-doe.pdf' });
```
## License

[MIT](./LICENSE)
