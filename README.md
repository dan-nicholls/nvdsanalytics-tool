# NVDSAnalytics Tool

The NVDSAnalytics Tool is designed to simplify the creation of analytic
configuration rules for the `nvdsanalytics` component of the Deepstream library.
This tool allows users to easily generate rule coordinates based on a provided
frame image.

## Features:

- **Image Loading**: Load images onto a canvas for analysis.
- **Region of Interest (ROI) Drawing**: Define specific areas of interest within
  the image.
- **Line Crossing (LC) Drawing**: Set up line crossing rules for analytics.
- **Clipboard Copy**: Easily copy configuration strings to the clipboard.

## Prerequisites

- **Node.js**
- **npm** or **pnpm**

## Installation

To install the necessary dependencies, run:

```bash
npm install
```

or

```bash
pnpm install
```

## Usage

1. Ensure no other application is using port 3000.
2. Start the application with:

   ```bash
   pnpm run dev
   ```

3. Open your browser and navigate to `http://localhost:3000` to access the
   application.

## Screenshots

Insert image here

## Todo

- [x] Scale coordinates for image size
- [x] Create output coordinates string
- [x] Load background image from file
- [x] Copy Coordinate String to clipboard
- [ ] Implement dynamic port configuration
- [ ] Build a Docker image for deployment
- [ ] Enable loading of background images from a camera

--
