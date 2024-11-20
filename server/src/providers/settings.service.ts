import fs from "fs/promises";

interface Settings {
  DEFAULT_BALANCE: number;
  DATE_TO_UPDATE: string;
  PERMITTED_FILE_TYPES: Record<string, string[]>;
  MAX_FILE_SIZE: number;
}

const SETTINGS_PATH = "configuration-system.json";
export class SettingsService {
  public static async readSettings(): Promise<Settings> {
    const data = await fs.readFile(SETTINGS_PATH, "utf8");
    // Chuyển đổi string thành Date objects khi đọc
    const settings = JSON.parse(data);
    return settings;
  }

  public static async writeSettings(settings: Settings) {
    // Chuyển đổi Date objects thành ISO string khi ghi
    //  check if key of settings is empty, if empty replace with default value
    // Đọc settings hiện tại
    const currentSettings = await this.readSettings();

    // Tạo object mới, chỉ cập nhật các giá trị không null/undefined
    const settingsToWrite = {
      ...currentSettings, // Giữ lại tất cả giá trị hiện tại
      ...Object.fromEntries(
        // Chỉ cập nhật các giá trị mới không null/undefined
        Object.entries(settings).filter(([_, value]) => value != null),
      ),
      UPDATED_AT: new Date().toISOString(),
    };

    await fs.writeFile(SETTINGS_PATH, JSON.stringify(settingsToWrite, null, 2));
  }

  static async getSettings(): Promise<Settings> {
    return this.readSettings();
  }
}
