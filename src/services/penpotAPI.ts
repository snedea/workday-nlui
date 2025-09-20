import { UiNode, UiResponse } from '../runtime/types';
import { CANVAS_KIT_PENPOT_TOKENS } from './penpotExporter';

interface PenpotAPIConfig {
  baseURL: string;
  accessToken?: string;
}

interface PenpotProject {
  id: string;
  name: string;
  teamId: string;
}

interface PenpotFile {
  id: string;
  name: string;
  projectId: string;
}

interface PenpotPage {
  id: string;
  name: string;
  fileId: string;
}

interface PenpotShape {
  id: string;
  type: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fills?: Array<{
    fillColor: string;
    fillOpacity: number;
  }>;
  strokes?: Array<{
    strokeColor: string;
    strokeOpacity?: number;
    strokeWidth?: number;
  }>;
  // Text specific
  content?: string;
  fontSize?: number;
  fontWeight?: number;
  fontFamily?: string;
  // Rectangle specific
  rx?: number;
  ry?: number;
}

export class PenpotAPIClient {
  private config: PenpotAPIConfig;

  constructor(config: PenpotAPIConfig) {
    this.config = config;
  }

  private async makeRequest(endpoint: string, method: string = 'POST', body?: any): Promise<any> {
    // Use the proxy endpoint instead of calling Penpot directly
    const url = `/api/penpot/${endpoint}`;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };

    if (this.config.accessToken) {
      headers['Authorization'] = `Token ${this.config.accessToken}`;
    }

    const response = await fetch(url, {
      method,
      headers,
      body: JSON.stringify(body || {}),
      credentials: 'include'
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.error || `HTTP ${response.status}`;
      throw new Error(`Penpot API Error: ${errorMessage}`);
    }

    return await response.json();
  }

  async login(email: string, password: string): Promise<any> {
    return this.makeRequest('login', 'POST', { email, password });
  }

  async getProfile(): Promise<any> {
    return this.makeRequest('get-profile', 'POST', {});
  }

  async getTeams(): Promise<any[]> {
    const profile = await this.getProfile();
    return profile.teams || [];
  }

  async getProjects(teamId: string): Promise<PenpotProject[]> {
    const response = await this.makeRequest('get-team-projects', 'POST', { teamId });
    return response || [];
  }

  async createProject(teamId: string, name: string): Promise<PenpotProject> {
    return this.makeRequest('create-project', 'POST', {
      teamId,
      name,
      isShared: false
    });
  }

  async createFile(projectId: string, name: string): Promise<PenpotFile> {
    return this.makeRequest('create-file', 'POST', {
      projectId,
      name,
      isShared: false
    });
  }

  async getFile(fileId: string): Promise<any> {
    return this.makeRequest('get-file', 'POST', { id: fileId });
  }

  async updateFile(fileId: string, changes: any): Promise<any> {
    return this.makeRequest('update-file', 'POST', {
      id: fileId,
      changes
    });
  }

  // Convert UiNode to Penpot shapes using a simpler format
  private convertUiNodeToShapes(node: UiNode, x: number = 50, y: number = 50): PenpotShape[] {
    const shapes: PenpotShape[] = [];
    let currentY = y;

    switch (node.type) {
      case 'Page':
        if (node.children) {
          for (const child of node.children) {
            const childShapes = this.convertUiNodeToShapes(child, x, currentY);
            shapes.push(...childShapes);
            currentY += 80; // Add spacing between components
          }
        }
        break;

      case 'Header':
        // Create header text
        const headerText: PenpotShape = {
          id: this.generateId(),
          type: 'text',
          name: node.props?.title || 'Header',
          x,
          y: currentY,
          width: 300,
          height: 40,
          content: node.props?.title || 'Header',
          fontSize: 28,
          fontWeight: 600,
          fontFamily: 'Roboto, sans-serif',
          fills: [{
            fillColor: CANVAS_KIT_PENPOT_TOKENS.colors['soap.600'],
            fillOpacity: 1
          }]
        };
        shapes.push(headerText);
        currentY += 60;

        if (node.children) {
          for (const child of node.children) {
            const childShapes = this.convertUiNodeToShapes(child, x, currentY);
            shapes.push(...childShapes);
            currentY += 60;
          }
        }
        break;

      case 'Section':
      case 'Card':
        // Create card background
        const cardBg: PenpotShape = {
          id: this.generateId(),
          type: 'rect',
          name: node.type,
          x,
          y: currentY,
          width: 500,
          height: 200,
          rx: 4,
          ry: 4,
          fills: [{
            fillColor: CANVAS_KIT_PENPOT_TOKENS.colors['soap.100'],
            fillOpacity: 1
          }],
          strokes: [{
            strokeColor: CANVAS_KIT_PENPOT_TOKENS.colors['soap.300'],
            strokeOpacity: 1,
            strokeWidth: 1
          }]
        };
        shapes.push(cardBg);

        // Add title if present
        if (node.props?.title) {
          const title: PenpotShape = {
            id: this.generateId(),
            type: 'text',
            name: 'Card Title',
            x: x + 20,
            y: currentY + 20,
            width: 200,
            height: 24,
            content: node.props.title,
            fontSize: 20,
            fontWeight: 600,
            fontFamily: 'Roboto, sans-serif',
            fills: [{
              fillColor: CANVAS_KIT_PENPOT_TOKENS.colors['soap.600'],
              fillOpacity: 1
            }]
          };
          shapes.push(title);
        }

        // Process children
        if (node.children) {
          let childY = currentY + (node.props?.title ? 60 : 20);
          for (const child of node.children) {
            const childShapes = this.convertUiNodeToShapes(child, x + 20, childY);
            shapes.push(...childShapes);
            childY += 50;
          }
        }
        currentY += 220;
        break;

      case 'Text':
        const textShape: PenpotShape = {
          id: this.generateId(),
          type: 'text',
          name: 'Text',
          x,
          y: currentY,
          width: 300,
          height: 24,
          content: node.props?.content || node.props?.children || 'Text',
          fontSize: 14,
          fontWeight: 400,
          fontFamily: 'Roboto, sans-serif',
          fills: [{
            fillColor: CANVAS_KIT_PENPOT_TOKENS.colors['soap.600'],
            fillOpacity: 1
          }]
        };
        shapes.push(textShape);
        break;

      case 'Button':
        const variant = node.props?.variant || 'primary';
        let fillColor = CANVAS_KIT_PENPOT_TOKENS.colors['blueberry.500'];
        let textColor = CANVAS_KIT_PENPOT_TOKENS.colors['soap.100'];
        let strokeColor;

        if (variant === 'secondary') {
          fillColor = CANVAS_KIT_PENPOT_TOKENS.colors['soap.100'];
          textColor = CANVAS_KIT_PENPOT_TOKENS.colors['blueberry.500'];
          strokeColor = CANVAS_KIT_PENPOT_TOKENS.colors['blueberry.500'];
        }

        // Button background
        const buttonBg: PenpotShape = {
          id: this.generateId(),
          type: 'rect',
          name: 'Button',
          x,
          y: currentY,
          width: 120,
          height: 40,
          rx: 4,
          ry: 4,
          fills: [{
            fillColor,
            fillOpacity: 1
          }]
        };

        if (strokeColor) {
          buttonBg.strokes = [{
            strokeColor,
            strokeOpacity: 1,
            strokeWidth: 2
          }];
        }

        shapes.push(buttonBg);

        // Button text
        const buttonText: PenpotShape = {
          id: this.generateId(),
          type: 'text',
          name: 'Button Text',
          x: x + 20,
          y: currentY + 12,
          width: 80,
          height: 16,
          content: node.props?.text || node.props?.children || 'Button',
          fontSize: 14,
          fontWeight: 500,
          fontFamily: 'Roboto, sans-serif',
          fills: [{
            fillColor: textColor,
            fillOpacity: 1
          }]
        };
        shapes.push(buttonText);
        break;

      case 'Badge':
        const status = node.props?.status;
        let badgeColor = CANVAS_KIT_PENPOT_TOKENS.colors['soap.400'];

        if (status === 'Active' || status === 'success') {
          badgeColor = CANVAS_KIT_PENPOT_TOKENS.colors['success.main'];
        } else if (status === 'error' || status === 'Terminated') {
          badgeColor = CANVAS_KIT_PENPOT_TOKENS.colors['error.main'];
        } else if (status === 'warning' || status === 'On Leave') {
          badgeColor = CANVAS_KIT_PENPOT_TOKENS.colors['warning.main'];
        }

        const badgeText = node.props?.status || node.props?.text || 'Badge';
        const badgeWidth = Math.max(60, badgeText.length * 8 + 16);

        // Badge background
        const badgeBg: PenpotShape = {
          id: this.generateId(),
          type: 'rect',
          name: 'Badge',
          x,
          y: currentY,
          width: badgeWidth,
          height: 24,
          rx: 12,
          ry: 12,
          fills: [{
            fillColor: badgeColor,
            fillOpacity: 1
          }]
        };
        shapes.push(badgeBg);

        // Badge text
        const badgeTextShape: PenpotShape = {
          id: this.generateId(),
          type: 'text',
          name: 'Badge Text',
          x: x + 8,
          y: currentY + 6,
          width: badgeWidth - 16,
          height: 12,
          content: badgeText,
          fontSize: 12,
          fontWeight: 500,
          fontFamily: 'Roboto, sans-serif',
          fills: [{
            fillColor: CANVAS_KIT_PENPOT_TOKENS.colors['soap.100'],
            fillOpacity: 1
          }]
        };
        shapes.push(badgeTextShape);
        break;

      default:
        // Unknown component - create placeholder
        const placeholder: PenpotShape = {
          id: this.generateId(),
          type: 'rect',
          name: `${node.type} (placeholder)`,
          x,
          y: currentY,
          width: 200,
          height: 40,
          rx: 4,
          ry: 4,
          fills: [{
            fillColor: CANVAS_KIT_PENPOT_TOKENS.colors['warning.light'],
            fillOpacity: 1
          }],
          strokes: [{
            strokeColor: CANVAS_KIT_PENPOT_TOKENS.colors['warning.main'],
            strokeOpacity: 1,
            strokeWidth: 1
          }]
        };
        shapes.push(placeholder);
        break;
    }

    return shapes;
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  async uploadDesign(
    teamId: string,
    projectName: string,
    fileName: string,
    uiResponse: UiResponse
  ): Promise<{ project: PenpotProject; file: PenpotFile; url: string }> {
    try {
      // Create or find project
      let project: PenpotProject;
      const existingProjects = await this.getProjects(teamId);
      const existingProject = existingProjects.find(p => p.name === projectName);

      if (existingProject) {
        project = existingProject;
      } else {
        project = await this.createProject(teamId, projectName);
      }

      // Create file
      const file = await this.createFile(project.id, fileName);

      // Convert UI to shapes
      const shapes = this.convertUiNodeToShapes(uiResponse.tree);

      // Prepare changes for the file
      const changes = shapes.map(shape => ({
        type: 'add-shape',
        shape,
        pageId: file.id // Assuming the file ID can be used as page ID initially
      }));

      // Update file with shapes
      if (changes.length > 0) {
        await this.updateFile(file.id, changes);
      }

      // Generate URL to the file
      const url = `${this.config.baseURL}/#/workspace/${project.teamId}/${project.id}/${file.id}`;

      return { project, file, url };
    } catch (error) {
      console.error('Failed to upload design to Penpot:', error);
      throw error;
    }
  }
}

// Factory function to create API client
export function createPenpotAPIClient(accessToken?: string): PenpotAPIClient {
  return new PenpotAPIClient({
    baseURL: 'http://localhost:9001', // Use local Penpot instance
    accessToken
  });
}