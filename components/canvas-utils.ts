import type { Area } from "react-easy-crop";

export type ImageFileData = {
  file: File;
  url: string;
  html: HTMLImageElement;
  aspectFraction: string;
};

/**
 * Create new HTMLImageElement
 * @param url string
 * @returns HTMLImageElement
 */
export const createImage = (url: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.setAttribute("crossOrigin", "anonymous"); // needed to avoid cross-origin issues on CodeSandbox
    image.src = url;
  });

/**
 * Finding the Greatest Common Factor (GCF) of an image's dimensions
 * @param a number
 * @param b number
 * @returns number
 */
const gcd = (a: number, b: number): number => {
  return b === 0 ? a : gcd(b, a % b);
};

/**
 * Calculator aspect fraction
 * @param width number
 * @param height number
 * @returns string
 */
export const getAspectFraction = (width: number, height: number): string => {
  const divisor = gcd(width, height);
  const w = width / divisor;
  const h = height / divisor;
  return `${w} : ${h}`;
};

function getRadianAngle(degreeValue: number) {
  return (degreeValue * Math.PI) / 180;
}

export function rotateSize(width: number, height: number, rotation: number) {
  const rotRad = getRadianAngle(rotation);
  return {
    width:
      Math.abs(Math.cos(rotRad) * width) + Math.abs(Math.sin(rotRad) * height),
    height:
      Math.abs(Math.sin(rotRad) * width) + Math.abs(Math.cos(rotRad) * height),
  };
}

/**
 * Flip image
 * @param dir "horizontal" | "vertical"
 * @param data ImageFileData
 * @returns ImageFileData
 */
export async function flipImage(
  dir: "horizontal" | "vertical",
  data: ImageFileData
) {
  return new Promise<ImageFileData>((resolve, reject) => {
    const canvas: HTMLCanvasElement = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) return reject(new Error("Create HTMLCanvasElement error."));

    const { html, file } = data;

    canvas.width = html.width;
    canvas.height = html.height;
    // ✅ Lật ngang bằng setTransform
    if (dir === "horizontal") ctx.setTransform(-1, 0, 0, 1, html.width, 0);
    // ✅ Lật dọc bằng setTransform
    else ctx.setTransform(1, 0, 0, -1, 0, html.height);

    ctx.drawImage(html, 0, 0);

    canvas.toBlob(async (blob) => {
      if (!blob) return reject(new Error("Flip image error."));

      const newFile = new File([blob], file.name, {
        type: file.type,
      });
      const newURL = URL.createObjectURL(newFile);
      const newHTML = await createImage(newURL);
      const newAspectFraction = getAspectFraction(
        newHTML.width,
        newHTML.height
      );

      return resolve({
        file: newFile,
        url: newURL,
        html: newHTML,
        aspectFraction: newAspectFraction,
      });
    }, file.type);
  });
}

export async function getCroppedImg(
  data: ImageFileData,
  pixelCrop: Area,
  rotation: number = 0
) {
  return new Promise<File>((resolve, reject) => {
    const { html, file } = data;
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) return reject(new Error("Create HTMLCanvasElement error."));

    const rotRad = getRadianAngle(rotation);

    // calculate bounding box of the rotated image
    const { width: bBoxWidth, height: bBoxHeight } = rotateSize(
      html.width,
      html.height,
      rotation
    );

    // set canvas size to match the bounding box
    canvas.width = bBoxWidth;
    canvas.height = bBoxHeight;

    // translate canvas context to a central location to allow rotating and flipping around the center
    ctx.translate(bBoxWidth / 2, bBoxHeight / 2);
    ctx.rotate(rotRad);
    // ctx.scale(flip.horizontal ? -1 : 1, flip.vertical ? -1 : 1);
    ctx.translate(-html.width / 2, -html.height / 2);

    // draw rotated image
    ctx.drawImage(html, 0, 0);

    const croppedCanvas = document.createElement("canvas");
    const croppedCtx = croppedCanvas.getContext("2d");

    if (!croppedCtx)
      return reject(new Error("Create HTMLCanvasElement error."));

    // Set the size of the cropped canvas
    croppedCanvas.width = pixelCrop.width;
    croppedCanvas.height = pixelCrop.height;

    // Draw the cropped image onto the new canvas
    croppedCtx.drawImage(
      canvas,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height
    );

    // As Base64 string
    // return croppedCanvas.toDataURL('image/jpeg');

    croppedCanvas.toBlob((blob) => {
      if (!blob) return reject(new Error("Crop image error."));

      const newFile = new File([blob], file.name, {
        type: file.type,
      });
      return resolve(newFile);
    }, file.type);
  });
}

export async function getCroppedCircleImg(
  data: ImageFileData,
  pixelCrop: Area,
  rotation: number = 0
) {
  return new Promise<File>((resolve, reject) => {
    const { html, file } = data;
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) return reject(new Error("Create HTMLCanvasElement error."));

    const rotRad = getRadianAngle(rotation);

    // calculate bounding box of the rotated image
    const { width: bBoxWidth, height: bBoxHeight } = rotateSize(
      html.width,
      html.height,
      rotation
    );

    // set canvas size to match the bounding box
    canvas.width = bBoxWidth;
    canvas.height = bBoxHeight;

    // translate canvas context to a central location to allow rotating and flipping around the center
    ctx.translate(bBoxWidth / 2, bBoxHeight / 2);
    ctx.rotate(rotRad);
    // ctx.scale(flip.horizontal ? -1 : 1, flip.vertical ? -1 : 1);
    ctx.translate(-html.width / 2, -html.height / 2);

    // draw rotated image
    ctx.drawImage(html, 0, 0);

    const croppedCanvas = document.createElement("canvas");
    const croppedCtx = croppedCanvas.getContext("2d");

    if (!croppedCtx)
      return reject(new Error("Create HTMLCanvasElement error."));

    const size = pixelCrop.width;

    // Set the size of the cropped canvas
    croppedCanvas.width = size;
    croppedCanvas.height = size;

    croppedCtx.beginPath();
    croppedCtx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
    croppedCtx.closePath();
    croppedCtx.clip();

    // Draw the cropped image onto the new canvas
    croppedCtx.drawImage(
      canvas,
      (html.width - size) / 2, // crop giữa theo chiều ngang
      (html.height - size) / 2, // crop giữa theo chiều dọc
      size,
      size,
      0,
      0,
      size,
      size
    );

    // As Base64 string
    // return croppedCanvas.toDataURL('image/jpeg');

    croppedCanvas.toBlob((blob) => {
      if (!blob) return reject(new Error("Crop image error."));

      const newFile = new File([blob], file.name, {
        type: file.type,
      });
      return resolve(newFile);
    }, file.type);
  });
}

// export async function getRotatedImage1(
//   // image: HTMLImageElement,
//   { html, file }: ImageFileData,
//   rotation: number = 0
// ) {
//   const canvas = document.createElement("canvas");
//   const ctx = canvas.getContext("2d");

//   const orientationChanged =
//     rotation === 90 ||
//     rotation === -90 ||
//     rotation === 270 ||
//     rotation === -270;
//   if (orientationChanged) {
//     canvas.width = image.height;
//     canvas.height = image.width;
//   } else {
//     canvas.width = image.width;
//     canvas.height = image.height;
//   }

//   ctx.translate(canvas.width / 2, canvas.height / 2);
//   ctx.rotate((rotation * Math.PI) / 180);
//   ctx.drawImage(image, -image.width / 2, -image.height / 2);

//   return new Promise<File>((resolve, reject) => {
//     // canvas.toBlob((file) => {
//     //   resolve(URL.createObjectURL(file));
//     // }, "image/png");

//     canvas.toBlob((blob) => {
//       if (!blob) return reject(new Error("Crop image error."));

//       const newFile = new File([blob], file.name, {
//         type: file.type,
//       });
//       return resolve(newFile);
//     }, file.type);
//   });
// }
