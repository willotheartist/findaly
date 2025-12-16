export type ChecklistItem = { key: string; weight: number; label: string };

export const ProjectManagementChecklist: ChecklistItem[] = [
  { key: "has_api", weight: 2, label: "API / Developer docs" },
  { key: "sso", weight: 2, label: "SSO (SAML/SSO)" },
  { key: "scim", weight: 1, label: "SCIM provisioning" },
  { key: "soc2", weight: 2, label: "SOC 2 claim" },
  { key: "iso27001", weight: 2, label: "ISO 27001 claim" },
  { key: "gdpr", weight: 1, label: "GDPR mention" },
  { key: "has_status_page", weight: 1, label: "Public status page" },
  { key: "has_changelog", weight: 1, label: "Changelog / release notes" },
];
