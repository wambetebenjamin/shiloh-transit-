declare module "qrcode" {
  export type QRCodeRenderOptions = {
    width?: number;
    margin?: number;
    scale?: number;
    color?: { dark?: string; light?: string };
    errorCorrectionLevel?: "L" | "M" | "Q" | "H";
  };

  export function toDataURL(
    text: string,
    options?: QRCodeRenderOptions
  ): Promise<string>;

  const QRCode: {
    toDataURL: typeof toDataURL;
  };

  export default QRCode;
}
