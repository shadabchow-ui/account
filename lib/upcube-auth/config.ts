export interface UpcubeAuthConfig {
  accountUrl: string;
}

let config: UpcubeAuthConfig = {
  accountUrl: "https://account.upcube.ai",
};

export function configureAuth(overrides: Partial<UpcubeAuthConfig>): void {
  config = { ...config, ...overrides };
}

export function getAuthConfig(): UpcubeAuthConfig {
  return { ...config };
}

export function getAccountUrl(): string {
  return config.accountUrl.replace(/\/+$/, "");
}
