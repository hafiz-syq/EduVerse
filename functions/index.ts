import { createDatabaseClient, createSiteContext, errorResponse, requireUser } from './_qoder/backend.mjs';
import { createStorageClient } from './_qoder/storage.mjs';
import { typedResponse } from './src/core.mjs';
import { application } from './src/application.mjs';

const env = (name) => {
  try { return Deno.env.get(name) ?? ''; } catch { return ''; }
};

/** Konteks identitas gateway: tanpa login tetap anonim, konteks rusak tetap 403. */
function contextUser(ctx) {
  try {
    return requireUser(ctx);
  } catch (error) {
    if (error?.code === 'login_required') return null;
    throw error;
  }
}

const handle = application({
  db: createDatabaseClient(),
  storage: createStorageClient(),
  env: {
    APP_SESSION_SECRET: env('APP_SESSION_SECRET'),
    APP_ADMIN_IDENTITIES: env('APP_ADMIN_IDENTITIES'),
    APP_GOOGLE_CLIENT_ID: env('APP_GOOGLE_CLIENT_ID'),
    APP_GITHUB_CLIENT_ID: env('APP_GITHUB_CLIENT_ID'),
  },
  contextUser,
});

Deno.serve(async (request) => {
  let context;
  try {
    context = createSiteContext(request);
    return await handle(context);
  } catch (error) {
    return typedResponse(error, context?.requestId) ?? errorResponse(error, context?.requestId);
  }
});
