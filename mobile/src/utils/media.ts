import { BASE_URL, DEFAULT_LOCAL_IP } from "../api/config";

/**
 * Resolves media URLs. Replaces localhost/127.0.0.1 with the configured API host,
 * which is necessary for MinIO URLs to load properly on mobile devices.
 */
export const resolveMediaUrl = (url?: string | null): string => {
  if (!url) return "";
  let formattedUrl = url.replace(/\\/g, '/');
  
  // Determine MinIO host based on app API host
  let MINIO_URL = `http://${DEFAULT_LOCAL_IP}:9000`; // fallback
  try {
    const parsed = new URL(BASE_URL);
    MINIO_URL = `${parsed.protocol}//${parsed.hostname}:9000`;
  } catch (e) {
    // Keep fallback
  }

  if (formattedUrl.includes("localhost") || formattedUrl.includes("127.0.0.1") || formattedUrl.includes(":3000")) {
    formattedUrl = formattedUrl.replace(/http:\/\/[^/]+/g, MINIO_URL);
  } else if (!formattedUrl.startsWith("http")) {
    formattedUrl = `${MINIO_URL}${formattedUrl.startsWith('/') ? '' : '/'}${formattedUrl}`;
  }
  return formattedUrl;
};
