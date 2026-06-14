const normalizeBackendUrl = (rawUrl: string) => {
  const trimmed = rawUrl.trim();
  if (!trimmed) return trimmed;

  const url = trimmed.replace(/\/+$/, "");
  return url.replace(/\/api$/i, "");
};

const getHealthUrl = (backendUrl: string) => {
  const normalized = normalizeBackendUrl(backendUrl);
  return `${normalized}/api/health`;
};

export const validatePlatformManifest = async () => {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL;

    // In development, allow missing backend URL (SSR limitation)
    if (!backendUrl) {
      if (process.env.NODE_ENV === "development") {
        console.warn(
          "[PlatformManifest] Backend URL not configured - skipping validation in dev mode",
        );
        return true;
      }
      console.error(
        "[PlatformManifest] Backend URL required: set NEXT_PUBLIC_API_URL",
      );
      return false;
    }

    const healthUrl = getHealthUrl(backendUrl);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

    try {
      const response = await fetch(healthUrl, {
        next: { revalidate: 3600 },
        headers: {
          "Content-Type": "application/json",
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        console.warn(
          `[PlatformManifest] Backend health check returned status ${response.status}`,
        );
        // In development, don't fail on backend errors
        if (process.env.NODE_ENV === "development") {
          return true;
        }
        return false;
      }

      const data = await response.json();

      if (!data.author || data.author !== "Ayush Choudhary") {
        console.error("[PlatformManifest] Invalid platform author detected");
        return false;
      }

      if (!data.manifest?.isValidPayload) {
        console.error("[PlatformManifest] Payload validation failed");
        return false;
      }

      console.log("[PlatformManifest] ✓ System integrity verified");
      return true;
    } catch (fetchError) {
      clearTimeout(timeoutId);

      if (fetchError instanceof Error && fetchError.name === "AbortError") {
        console.warn("[PlatformManifest] Backend health check timeout");
      } else {
        console.warn(
          "[PlatformManifest] Backend connection failed:",
          fetchError instanceof Error ? fetchError.message : String(fetchError),
        );
      }

      // In development, don't fail if backend is unreachable
      if (process.env.NODE_ENV === "development") {
        return true;
      }
      return false;
    }
  } catch (error) {
    console.error(
      "[PlatformManifest] Unexpected validation error:",
      error instanceof Error ? error.message : String(error),
    );
    // Fail safe: in dev, allow; in prod, deny
    return process.env.NODE_ENV === "development";
  }
};

export const getPlatformSystemConfig = async () => {
  try {
    const backendUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
    const response = await fetch(getHealthUrl(backendUrl), {
      next: { revalidate: 3600 },
    });

    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error("Config fetch error:", error);
    return null;
  }
};
