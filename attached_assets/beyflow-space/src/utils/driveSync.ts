
/**
 * driveSync.ts — stub for Google Drive/Docs integration.
 * Fill in OAuth and use Drive/Docs API to push/pull JSON or markdown.
 */
export type SyncStatus = 'idle' | 'syncing' | 'error' | 'done'

export async function pushToDrive(_: unknown): Promise<SyncStatus> {
  // TODO: implement with Google APIs
  return 'idle'
}

export async function pullFromDrive(): Promise<{ pages: any[] } | null> {
  // TODO: implement with Google APIs
  return null
}
