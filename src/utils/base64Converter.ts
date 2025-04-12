export default function base64Converter(blobUrl: string): Promise<string> {
  return fetch(blobUrl)
    .then((response) => response.blob())
    .then(
      (blob) =>
        new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const base64data = reader.result as string;
            resolve(base64data);
          };
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        })
    );
}
