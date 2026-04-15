import { registerAppTool, registerAppResource, RESOURCE_MIME_TYPE } from "@modelcontextprotocol/ext-apps/server";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { CallToolResult, ReadResourceResult } from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import fs from "node:fs/promises";
import path from "node:path";

// Determine dist directory (works both from source .ts and compiled .js)
const DIST_DIR = import.meta.filename.endsWith(".ts")
  ? path.join(import.meta.dirname, "dist")
  : import.meta.dirname;

// Define the schema for design review input
const DesignReviewSchema = z.object({
  componentName: z.string().describe("Name of the Material 3 component"),
  description: z.string().describe("Description of the component design"),
  colorScheme: z.string().optional().describe("Color scheme used (e.g., light, dark, custom)"),
  accessibility: z.string().optional().describe("Accessibility features implemented"),
  typography: z.string().optional().describe("Typography choices and hierarchy"),
  spacing: z.string().optional().describe("Spacing and layout approach"),
  interactivity: z.string().optional().describe("Interactive states (hover, focus, active)")
});

type DesignReview = z.infer<typeof DesignReviewSchema>;

interface ReviewResult {
  componentName: string;
  overallScore: number;
  compliance: {
    material3Adherence: number;
    accessibilityScore: number;
    consistencyScore: number;
  };
  findings: {
    title: string;
    severity: "error" | "warning" | "info";
    message: string;
    suggestion?: string;
  }[];
  recommendations: string[];
}

// Simulate design analysis logic
function analyzeDesign(review: DesignReview): ReviewResult {
  const findings = [];
  let complianceScore = 100;
  let accessibilityScore = 100;
  let consistencyScore = 100;

  // Material 3 color system checks
  if (review.colorScheme) {
    if (!review.colorScheme.includes("primary") && !review.colorScheme.includes("secondary")) {
      findings.push({
        title: "Color System",
        severity: "warning",
        message: "Color scheme should follow Material 3 primary and secondary colors",
        suggestion: "Use the Material 3 color system with primary, secondary, and tertiary colors"
      });
      complianceScore -= 15;
    }
  }

  // Typography checks
  if (review.typography) {
    if (!review.typography.includes("headline") && !review.typography.includes("body")) {
      findings.push({
        title: "Typography",
        severity: "warning",
        message: "Should use Material 3 typography scale (headline, title, body, label)",
        suggestion: "Apply Material 3 typography styles: headline, title, body, or label"
      });
      complianceScore -= 10;
    }
  } else {
    findings.push({
      title: "Typography",
      severity: "info",
      message: "No typography details provided",
      suggestion: "Specify typography choices for better review"
    });
  }

  // Accessibility checks
  if (review.accessibility) {
    if (!review.accessibility.toLowerCase().includes("wcag") && 
        !review.accessibility.toLowerCase().includes("aria")) {
      findings.push({
        title: "Accessibility",
        severity: "warning",
        message: "Ensure WCAG 2.1 AA compliance and proper ARIA labels",
        suggestion: "Implement ARIA labels, proper contrast ratios (4.5:1 for text), and keyboard navigation"
      });
      accessibilityScore -= 20;
    }
  } else {
    findings.push({
      title: "Accessibility",
      severity: "warning",
      message: "No accessibility information provided",
      suggestion: "Include accessibility features: ARIA labels, keyboard support, color contrast"
    });
    accessibilityScore -= 15;
  }

  // Spacing and layout checks
  if (review.spacing) {
    if (!review.spacing.includes("8") && !review.spacing.includes("4")) {
      findings.push({
        title: "Spacing System",
        severity: "info",
        message: "Consider using Material 3 8dp or 4dp base spacing grid",
        suggestion: "Align to Material 3 spacing scale (4dp, 8dp, 16dp, 24dp, 32dp...)"
      });
    }
  }

  // Interactivity checks
  if (review.interactivity) {
    if (!review.interactivity.toLowerCase().includes("ripple") && 
        !review.interactivity.toLowerCase().includes("animation")) {
      findings.push({
        title: "Interactions",
        severity: "info",
        message: "Consider Material 3 motion guidelines",
        suggestion: "Add smooth transitions and ripple effects for interactive elements"
      });
      consistencyScore -= 5;
    }
  }

  const overallScore = Math.round((complianceScore + accessibilityScore + consistencyScore) / 3);

  const recommendations = [];
  if (complianceScore < 80) {
    recommendations.push("Review Material 3 design system documentation for better compliance");
  }
  if (accessibilityScore < 80) {
    recommendations.push("Conduct WCAG accessibility audit and implement ARIA labels");
  }
  if (overallScore >= 80) {
    recommendations.push("Great work! The design shows strong Material 3 alignment");
  }
  if (findings.length === 0) {
    findings.push({
      title: "Overall Quality",
      severity: "info",
      message: "Design review looks comprehensive and well-structured"
    });
  }

  return {
    componentName: review.componentName,
    overallScore,
    compliance: {
      material3Adherence: complianceScore,
      accessibilityScore,
      consistencyScore
    },
    findings,
    recommendations
  };
}

// Create and export a factory function for the MCP server
export function createServer(): McpServer {
  const server = new McpServer({
    name: "Material 3 Design Agent",
    version: "1.0.0"
  });

  const resourceUri = "ui://review-design/mcp-app.html";

  // Register the design review tool with UI metadata
  registerAppTool(
    server,
    "review_design",
    {
      displayName: "Review Material 3 Design",
      description: "Review a UI component design for Material 3 compliance, accessibility, and best practices",
      inputSchema: DesignReviewSchema.strict(),
      _meta: {
        ui: { resourceUri } // Links this tool to its UI resource
      }
    },
    async (input): Promise<CallToolResult> => {
      const review = DesignReviewSchema.parse(input);
      const result = analyzeDesign(review);
      return {
        content: [{
          type: "text",
          text: JSON.stringify(result, null, 2)
        }]
      };
    }
  );

  // Register the UI resource
  registerAppResource(
    server,
    resourceUri,
    resourceUri,
    { mimeType: RESOURCE_MIME_TYPE },
    async (): Promise<ReadResourceResult> => {
      const html = await fs.readFile(path.join(DIST_DIR, "mcp-app.html"), "utf-8");
      return {
        contents: [{
          uri: resourceUri,
          mimeType: RESOURCE_MIME_TYPE,
          text: html
        }]
      };
    }
  );

  return server;
}
