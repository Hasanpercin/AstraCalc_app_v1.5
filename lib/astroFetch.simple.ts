// Simplified AstroCalc Fetch utilities
export class AstroFetch {
  private static cache = new Map<string, { data: any; expires: number }>();

  // Enhanced AI webhook call
  static async sendAIWebhook(payload: {
    userId: string;
    question: string;
    full_name: string;
    timestamp: string;
    today: string;
    source: string;
  }) {
    const webhookUrl = process.env.EXPO_PUBLIC_WEBHOOK_URL;
    const webhookToken = process.env.EXPO_PUBLIC_WEBHOOK_TOKEN;

    if (!webhookUrl) {
      throw new Error('Webhook URL not configured');
    }

    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(webhookToken && { 'Authorization': `Bearer ${webhookToken}` }),
          'X-Source': 'astrocalc-mobile',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  // Simple retry wrapper
  static async withRetry<T>(
    fn: () => Promise<T>, 
    retries: number = 3
  ): Promise<T> {
    let lastError: Error;

    for (let i = 0; i <= retries; i++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error as Error;
        if (i < retries) {
          await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, i)));
        }
      }
    }

    throw lastError!;
  }

  // Simple cache
  static getCached(key: string) {
    const cached = this.cache.get(key);
    if (cached && cached.expires > Date.now()) {
      return cached.data;
    }
    return null;
  }

  static setCached(key: string, data: any, ttl: number = 300000) {
    this.cache.set(key, {
      data,
      expires: Date.now() + ttl,
    });
  }

  static clearCache() {
    this.cache.clear();
  }

  // Figma API integration
  static async getFigmaFile(fileKey: string) {
    const token = process.env.EXPO_PUBLIC_FIGMA_TOKEN || 'figd_xAk0tLoqggtI8mAjtadX5mzYhAwPxarjt7Fido2n';
    
    const cacheKey = `figma_file_${fileKey}`;
    const cached = this.getCached(cacheKey);
    if (cached) return cached;

    try {
      const response = await this.withRetry(async () => {
        const res = await fetch(`https://api.figma.com/v1/files/${fileKey}`, {
          headers: {
            'X-Figma-Token': token,
          },
        });
        
        if (!res.ok) {
          throw new Error(`Figma API error: ${res.status}`);
        }
        
        return res.json();
      });

      this.setCached(cacheKey, response, 600000); // 10 min cache
      return response;
    } catch (error) {
      console.error('Figma API error:', error);
      throw error;
    }
  }

  // Get Figma design tokens/styles
  static async getFigmaStyles(fileKey: string) {
    try {
      const file = await this.getFigmaFile(fileKey);
      
      // Extract colors, text styles, etc.
      const styles = {
        colors: this.extractColors(file),
        textStyles: this.extractTextStyles(file),
        components: this.extractComponents(file),
      };
      
      return styles;
    } catch (error) {
      console.error('Failed to extract Figma styles:', error);
      return null;
    }
  }

  // Helper methods for design token extraction
  private static extractColors(file: any) {
    // Extract color palette from Figma file
    const colors: Record<string, string> = {};
    
    // Traverse Figma node tree to find color definitions
    function traverseNodes(node: any) {
      if (node.fills) {
        node.fills.forEach((fill: any) => {
          if (fill.type === 'SOLID' && fill.color) {
            const { r, g, b } = fill.color;
            const hex = `#${Math.round(r * 255).toString(16).padStart(2, '0')}${Math.round(g * 255).toString(16).padStart(2, '0')}${Math.round(b * 255).toString(16).padStart(2, '0')}`;
            colors[`color_${Object.keys(colors).length}`] = hex;
          }
        });
      }
      
      if (node.children) {
        node.children.forEach(traverseNodes);
      }
    }
    
    if (file.document) {
      traverseNodes(file.document);
    }
    
    return colors;
  }

  private static extractTextStyles(file: any) {
    // Extract text styles from Figma
    const textStyles: Record<string, any> = {};
    
    if (file.styles) {
      Object.entries(file.styles).forEach(([key, style]: [string, any]) => {
        if (style.styleType === 'TEXT') {
          textStyles[style.name] = {
            fontSize: style.fontSize,
            fontFamily: style.fontFamily,
            fontWeight: style.fontWeight,
            lineHeight: style.lineHeightPx,
          };
        }
      });
    }
    
    return textStyles;
  }

  private static extractComponents(file: any) {
    // Extract component definitions
    const components: Record<string, any> = {};
    
    function findComponents(node: any) {
      if (node.type === 'COMPONENT') {
        components[node.name] = {
          id: node.id,
          description: node.description,
          width: node.absoluteBoundingBox?.width,
          height: node.absoluteBoundingBox?.height,
        };
      }
      
      if (node.children) {
        node.children.forEach(findComponents);
      }
    }
    
    if (file.document) {
      findComponents(file.document);
    }
    
    return components;
  }
}

// Convenience exports
export const aiWebhook = AstroFetch.sendAIWebhook;
export const withRetry = AstroFetch.withRetry;
export const getCached = AstroFetch.getCached;
export const setCached = AstroFetch.setCached;
