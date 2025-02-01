export async function blobToDataUrl(blob: Blob): Promise<string> {
  const buffer = Buffer.from(await blob.arrayBuffer());
  return "data:" + blob.type + ';base64,' + buffer.toString('base64');
}

export function uint8ArrayToBlob(uint8Array: Uint8Array, mimeType?: string | null): Blob {
  return new Blob([uint8Array], {type: mimeType ?? 'image/jpg'});
}
