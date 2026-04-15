# Material 3 Design Agent

An interactive MCP App for reviewing UI components against Material 3 design system standards, accessibility guidelines, and best practices.

## Features

- **Material 3 Compliance Review** - Analyzes components for adherence to Material 3 design system
- **Accessibility Audit** - Checks for WCAG compliance and accessibility best practices
- **Design Consistency** - Evaluates consistency with Material 3 principles
- **Interactive Feedback** - Real-time design review with detailed findings and recommendations
- **Visual Scoring** - Gauge-based scoring for easy assessment of design quality

## Getting Started

### Installation

```bash
cd material3-design-agent-server
npm install
```

### Development

```bash
npm run dev
```

This starts:
- Vite dev server watching for UI changes
- TypeScript server with hot reload

### Build & Run

```bash
npm run build
npm run serve
```

Or use the combined command:

```bash
npm start
```

## How It Works

### Tool: `review_design`

The MCP App provides a `review_design` tool that accepts:

- **componentName** - Name of the Material 3 component
- **description** - Design description
- **colorScheme** (optional) - Color system details
- **accessibility** (optional) - Accessibility features
- **typography** (optional) - Typography choices
- **spacing** (optional) - Spacing approach
- **interactivity** (optional) - Interactive states

### Response

The tool returns a detailed review including:

- **Overall Score** - Composite score (0-100)
- **Compliance Breakdown**:
  - Material 3 Adherence
  - Accessibility Score
  - Consistency Score
- **Findings** - Detailed issues with severity levels (error, warning, info)
- **Recommendations** - Actionable suggestions for improvement

## Integration

### With Claude Desktop

Add to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "material3-design-agent": {
      "command": "node",
      "args": ["/path/to/material3-design-agent-server/dist/main.js"]
    }
  }
}
```

### With Custom Hosts

Use the HTTP endpoint at `http://localhost:3001/mcp`

## Project Structure

```
material3-design-agent-server/
├── server.ts              # MCP tool registration
├── main.ts               # Express server & transport setup
├── mcp-app.html          # Entry HTML for the UI
├── src/
│   ├── main.tsx          # React app entry
│   ├── mcp-app.tsx       # Design review component
│   └── mcp-app.css       # Component styles
├── vite.config.ts        # Vite build configuration
├── tsconfig.json         # TypeScript configuration
└── package.json          # Dependencies
```

## Material 3 Resources

- [Material 3 Design System](https://m3.material.io)
- [Color System](https://m3.material.io/styles/color/overview)
- [Typography](https://m3.material.io/styles/typography/overview)
- [Motion](https://m3.material.io/styles/motion/overview)
- [Accessibility](https://m3.material.io/foundations/accessible-design/overview)

## Building for Production

```bash
npm run build
```

Artifacts:
- `dist/mcp-app.html` - Bundled UI resource
- `dist/main.js` - Server entry point
- `dist/server.js` - MCP server implementation

## Extending

### Adding Review Rules

Edit the `analyzeDesign` function in [server.ts](server.ts) to add custom rules:

```typescript
// Example: Add custom rule
if (review.componentName.includes("Button")) {
  // Specific button rules
  findings.push({
    title: "Button Validation",
    severity: "info",
    message: "Ensure button meets Material 3 elevation requirements"
  });
}
```

### Customizing the UI

Modify [src/mcp-app.tsx](src/mcp-app.tsx) to change how reviews are displayed.

## License

MIT
