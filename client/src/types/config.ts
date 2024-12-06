export type ConfigResponse = {
  data: {
    DEFAULT_BALANCE: number;
    DATE_TO_UPDATE: string;
    PERMITTED_FILE_TYPES: string[];
    MAX_FILE_SIZE: number;
    UPDATED_AT: string;
    PRICE_PER_A4: number;
  };
  message: string;
}

export type UpdateConfigResponse = ConfigResponse & {
  data: ConfigResponse['data'] & {
    UPDATED_AT: string;
  };
};