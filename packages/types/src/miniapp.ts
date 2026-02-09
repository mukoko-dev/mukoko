export interface MiniAppManifest {
  id: string;
  name: string;
  version: string;
  description: string;
  icon: string;
  domain: string;
  entrypoint: string;
  permissions: MiniAppPermission[];
  category: "ecosystem" | "utility";
  color: string;
}

export type MiniAppPermission =
  | "auth"
  | "location"
  | "camera"
  | "storage"
  | "wallet"
  | "notifications"
  | "contacts"
  | "shamwari";
