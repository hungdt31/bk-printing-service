import * as fs from 'fs';

export interface SystemConfig {
  PERMITTED_FILE_TYPES: string[];
  MAX_FILE_SIZE: number;
  PRICE_PER_A4: number;
  // ... other config fields
}

// singleton pattern
export class SystemProvider {
  private static instance: SystemProvider;
  private systemConfig: SystemConfig;

  private constructor() {
    this.systemConfig = this.loadSystemConfig();
  }

  public static getInstance(): SystemProvider {
    if (!SystemProvider.instance) {
      SystemProvider.instance = new SystemProvider();
    }
    return SystemProvider.instance;
  }

  private loadSystemConfig(): SystemConfig {
    try {
      const configPath = "configuration-system.json";
      const configFile = fs.readFileSync(configPath, "utf8");
      return JSON.parse(configFile);
    } catch (error) {
      console.error("Error loading system config:", error);
      throw new Error("Failed to load system configuration");
    }
  }

  public getConfig(): SystemConfig {
    return this.systemConfig;
  }

  // Helper methods để lấy các config cụ thể
  public getPermittedFileTypes(): string[] {
    return this.systemConfig.PERMITTED_FILE_TYPES;
  }

  public getMaxFileSize(): number {
    return this.systemConfig.MAX_FILE_SIZE;
  }

  public getPricePerA4(): number {
    return this.systemConfig.PRICE_PER_A4;
  }
  // Method để reload config nếu cần
  public reloadConfig(): void {
    this.systemConfig = this.loadSystemConfig();
  }
}

// Export singleton instance
export const systemProvider = SystemProvider.getInstance(); 