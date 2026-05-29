import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system/legacy';
import * as Linking from 'expo-linking';

const MAX_BYTES = 1 * 1024 * 1024; // 1MB
const ALLOWED: Record<string, string[]> = {
  'image/jpeg': ['jpg', 'jpeg'],
  'image/png': ['png'],
  'application/pdf': ['pdf'],
};

const getExt = (nameOrUri: string) => {
  const m = nameOrUri.split('?')[0].split('#')[0].split('.'); // strip query/hash
  return (m.length > 1 ? m.pop() : '')?.toLowerCase() || '';
};

const sanitize = (s: string) => s.replace(/[^a-zA-Z0-9._-]/g, '_');

export function useUpload() {
  const [attachedDocument, setAttachedDocument] = useState<{
    uri: string;
    name: string;
    type: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const generateUniqueFileName = (prefix: string, originalName: string, mime?: string) => {
    const rand = Math.random().toString(36).substring(2, 8).toUpperCase();
    const extFromName = getExt(originalName);
    const allowedExts = mime && ALLOWED[mime] ? ALLOWED[mime] : [];
    const ext = allowedExts.includes(extFromName) ? extFromName : allowedExts[0] || 'bin';
    return `${prefix}_${rand}.${ext}`;
  };

  const convertToFileUri = async (contentUri: string) => {
    // Always copy to our cache dir with a safe name
    const target = FileSystem.cacheDirectory + `DOC_${Date.now()}.bin`;
    try {
      await FileSystem.copyAsync({ from: contentUri, to: target });
      return target;
    } catch {
      return null;
    }
  };

  const validateAndSet = async (uri: string, nameHint: string, mime: string) => {
    setError(null);
    // 1) MIME whitelist
    if (!ALLOWED[mime]) {
      setError("Unsupported file type. Please upload a JPG, PNG or PDF.");
      return;
    }
    // 2) Size check
    const info = await FileSystem.getInfoAsync(uri);
    if (!info.exists || (typeof info.size === 'number' && info.size > MAX_BYTES)) {
      setError("File is too large. Maximum size is 1MB.");
      return;
    }
    // 3) Final file name
    const safeName = generateUniqueFileName('ATT', sanitize(nameHint), mime);
    setAttachedDocument({ uri, name: safeName, type: mime });
  };

  const ensurePermission = async (requestFn: () => Promise<ImagePicker.PermissionResponse>) => {
    const { status, canAskAgain } = await requestFn();
    if (status === 'granted') return true;
    if (!canAskAgain) await Linking.openSettings();
    setError("Permission denied. Please enable access in settings.");
    return false;
  };

  const pickFromGallery = async () => {
    const granted = await ensurePermission(ImagePicker.requestMediaLibraryPermissionsAsync);
    if (!granted) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      const asset = result.assets[0];
      const fileUri = await convertToFileUri(asset.uri);
      if (fileUri) {
        const mime = asset.mimeType || 'image/jpeg';
        await validateAndSet(fileUri, asset.fileName || asset.uri, mime);
      }
    }
  };

  const pickFromCamera = async () => {
    const granted = await ensurePermission(ImagePicker.requestCameraPermissionsAsync);
    if (!granted) return;

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      const asset = result.assets[0];
      const fileUri = await convertToFileUri(asset.uri);
      if (fileUri) {
        const mime = asset.mimeType || 'image/jpeg';
        await validateAndSet(fileUri, asset.fileName || asset.uri, mime);
      }
    }
  };

  const pickFromFiles = async () => {
    setError(null);
    const result = await DocumentPicker.getDocumentAsync({
      type: ['image/*', 'application/pdf'], // restrict types
      copyToCacheDirectory: true,
      multiple: false,
    });

    if (result.canceled || !result.assets.length) return;

    const file = result.assets[0];
    const fileUri = await convertToFileUri(file.uri);
    if (fileUri) {
      const mime = file.mimeType || 'application/octet-stream';
      await validateAndSet(fileUri, file.name || file.uri, mime);
    }
  };

  return {
    attachedDocument,
    setAttachedDocument,
    error,
    setError,
    pickFromGallery,
    pickFromCamera,
    pickFromFiles,
  };
}
