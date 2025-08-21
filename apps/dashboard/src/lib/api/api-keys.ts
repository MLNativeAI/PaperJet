import type { ApiKeysRoutes } from "@paperjet/api/routes";
import { hc } from "hono/client";

const apiClient = hc<ApiKeysRoutes>("/api/v1/api-keys");
