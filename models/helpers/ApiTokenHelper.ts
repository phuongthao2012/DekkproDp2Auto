import { APIRequestContext, expect } from "@playwright/test";
import { THAO_USER } from "../../test_data/dekkpro/Credentials";

const TOKEN_URL = 'https://demo.is.dekkpro.no/Token';

let cachedToken: string | null = null;

/**
 * Fetches an API access token from the Dekkpro token endpoint.
 * Caches the token so subsequent calls within the same test run reuse it.
 *
 * @param request - Playwright APIRequestContext
 * @param forceRefresh - set true to skip cache and request a new token
 */
export async function getApiToken(
    request: APIRequestContext,
    forceRefresh = false,
): Promise<string> {
    if (cachedToken && !forceRefresh) return cachedToken;

    const response = await request.post(TOKEN_URL, {
        form: {
            grant_type: 'password',
            username: THAO_USER.email,
            password: THAO_USER.password,
        },
    });

    expect(response.ok(), `Token request failed with status ${response.status()}`).toBeTruthy();

    const json = await response.json();
    expect(json).toHaveProperty('access_token');

    cachedToken = json.access_token as string;
    return cachedToken;
}

/** Clears the cached token (e.g. in global teardown). */
export function clearApiToken(): void {
    cachedToken = null;
}
