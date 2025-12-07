import { FlipHorizontal, FlipVertical } from "lucide-react";
import Image from "next/image";
import React from "react";
import Cropper, { type Area, type Point } from "react-easy-crop";
import { cn } from "@/lib/utils";
import {
  createImage,
  flipImage,
  getAspectFraction,
  getCroppedCircleImg,
  type ImageFileData,
} from "./canvas-utils";
import type { ImageEditorData } from "./ImageEditor";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Slider } from "./ui/slider";

type AvatarEditorData = {
  crop: Point;
  rotation: number;
  zoom: number;
  croppedArea: Area;
  image: ImageFileData;
};

type AvatarEditorProps = {
  title: string;
  description?: string;
  className?: string;
  children?: React.ReactNode;
  showGrid?: boolean;
  accept?: string;
  onSaveImage?: (files: File[]) => void;
};

const AvatarEditor = ({
  children,
  title,
  description,
  className,
  onSaveImage,
  showGrid,
  ...props
}: AvatarEditorProps) => {
  const id = React.useId();
  const [data, setData] = React.useState<AvatarEditorData | null>(null);
  const [openModal, setOpenModal] = React.useState<boolean>(false);

  const onCropAreaChange = (croppedArea: Area, _croppedAreaPixels: Area) => {
    // setCroppedArea(croppedArea);
  };

  const croppedImage = async () => {
    const files: File[] = [];
    if (onSaveImage && data) {
      try {
        await getCroppedCircleImg(data.image, data.croppedArea, data.rotation);
      } catch (error) {
        console.log(error);
        new Error("Crop image error.");
      }
      onSaveImage(files);
    }
  };

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) throw new Error("No file upload.");
    const file = e.target.files[0];

    // kiem tra kich thuoc file upload

    const url = URL.createObjectURL(file);
    const html = await createImage(url);
    const aspectFraction = getAspectFraction(html.width, html.height);

    const tempUpload: ImageEditorData = {
      crop: { x: 0, y: 0 },
      rotation: 0,
      zoom: 1,
      croppedArea: {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
      },
      image: {
        file,
        url,
        html,
        aspectFraction,
      },
    };

    e.target.value = "";

    setData(tempUpload);
    setOpenModal(true);
  };

  const handleZoomChange = (zoom: number) => {
    if (data) {
      setData({ ...data, zoom });
    }
  };

  const handleRotationChange = (rotation: number) => {
    if (data) {
      setData({ ...data, rotation });
    }
  };

  const handleCropChange = (location: Point) => {
    if (data) {
      setData({ ...data, crop: location });
    }
  };

  const onCropComplete = (_croppedArea: Area, croppedAreaPixels: Area) => {
    if (data) {
      setData({ ...data, croppedArea: croppedAreaPixels });
    }
  };

  const handleFlipX = async () => {
    if (data) {
      const { image } = data;
      const newImage = await flipImage("horizontal", image);
      URL.revokeObjectURL(image.url);
      setData({ ...data, image: newImage });
    }
  };

  const handleFlipY = async () => {
    if (data) {
      const { image } = data;
      const newImage = await flipImage("vertical", image);
      URL.revokeObjectURL(image.url);
      setData({ ...data, image: newImage });
    }
  };

  return (
    <AlertDialog
      open={openModal}
      onOpenChange={(open) => {
        setOpenModal(open);
        if (data && !open) {
          URL.revokeObjectURL(data.image.url);
        }
      }}
    >
      <label htmlFor={id} className={className}>
        {children}
        <input
          {...props}
          id={id}
          type="file"
          className="hidden"
          onChange={onFileChange}
        />
      </label>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          {description && (
            <AlertDialogDescription>{description}</AlertDialogDescription>
          )}
        </AlertDialogHeader>

        <div className="relative size-96 bg-foreground w-full">
          <Cropper
            {...props}
            image={data?.image.url ?? ""}
            cropShape={"round"}
            aspect={1}
            crop={data?.crop ?? { x: 0, y: 0 }}
            zoom={data?.zoom}
            rotation={data?.rotation}
            onCropChange={handleCropChange}
            onZoomChange={handleZoomChange}
            onRotationChange={handleRotationChange}
            onCropComplete={onCropComplete}
            onCropAreaChange={onCropAreaChange}
          />
        </div>
        <div className="flex items-center gap-4">
          <div className="flex flex-col gap-1">
            <Label className="text-muted-foreground text-sm">Lật</Label>
            <div className="flex items-center gap-1">
              <Button variant="secondary" size="icon" onClick={handleFlipX}>
                <FlipHorizontal />
              </Button>
              <Button variant="secondary" size="icon" onClick={handleFlipY}>
                <FlipVertical />
              </Button>
            </div>
          </div>
          {/* <div>{croppedArea && <Output croppedArea={croppedArea} />}</div> */}
        </div>

        <div className="flex flex-col gap-1">
          <Label className="text-muted-foreground text-sm"> Thu / Phóng</Label>
          <Slider
            value={[data ? data.zoom : 1]}
            onValueChange={(v) => handleZoomChange(v[0])}
            min={1}
            max={3}
            step={0.1}
          />
        </div>
        <div className="flex flex-col gap-1">
          <Label className="text-muted-foreground text-sm">Xoay</Label>
          <Slider
            value={[data ? data.rotation : 1]}
            onValueChange={(v) => handleRotationChange(v[0])}
            min={0}
            max={360}
            step={1}
          />
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel>Huỷ</AlertDialogCancel>

          <Button
            type="button"
            onClick={async () => {
              await croppedImage();
              setOpenModal(false);
            }}
          >
            Lưu
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AvatarEditor;
