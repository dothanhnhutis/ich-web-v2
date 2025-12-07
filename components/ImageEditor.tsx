import { FlipHorizontal, FlipVertical } from "lucide-react";
import Image from "next/image";
import React from "react";
import Cropper, { type Area, type Point } from "react-easy-crop";
import { cn } from "@/lib/utils";
import {
  createImage,
  flipImage,
  getAspectFraction,
  getCroppedImg,
  type ImageFileData,
} from "./canvas-utils";
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Slider } from "./ui/slider";

type ImageEditorProps = {
  title: string;
  description?: string;
  className?: string;
  children?: React.ReactNode;
  showGrid?: boolean;
  accept?: string;
  multiple?: boolean;
  aspectRatioList?: ("1 : 1" | "4 : 3" | "3 : 4" | "16 : 9" | "9 : 16")[];
  onSaveImage?: (files: File[]) => void;
};
const aspectRatios: Record<
  NonNullable<ImageEditorProps["aspectRatioList"]>[number],
  number
> = {
  "4 : 3": 4 / 3,
  "3 : 4": 3 / 4,
  "16 : 9": 16 / 9,
  "9 : 16": 9 / 16,
  "1 : 1": 1,
};

type OutputProps = {
  croppedArea: Area;
};

const Output = ({ croppedArea }: OutputProps) => {
  const scale = 100 / croppedArea.width;
  const transform = {
    x: `${-croppedArea.x * scale}%`,
    y: `${-croppedArea.y * scale}%`,
    scale,
    width: "calc(100% + 0.5px)",
    height: "auto",
  };

  const imageStyle = {
    transform: `translate3d(${transform.x}, ${transform.y}, 0) scale3d(${transform.scale},${transform.scale},1)`,
    width: transform.width,
    height: transform.height,
  };

  return (
    <div>
      <Image
        src="/images/landscape.webp"
        width={croppedArea.width}
        height={croppedArea.height}
        alt=""
        // style={imageStyle}
      />
    </div>
  );
};

export type ImageEditorData = {
  crop: Point;
  rotation: number;
  zoom: number;
  croppedArea: Area;
  aspectRatio?: NonNullable<ImageEditorProps["aspectRatioList"]>[number];
  image: ImageFileData;
};

const ImageEditor = ({
  children,
  title,
  description,
  aspectRatioList,
  className,
  onSaveImage,
  showGrid,
  ...props
}: ImageEditorProps) => {
  const id = React.useId();
  const [data, setData] = React.useState<ImageEditorData[]>([]);
  const [openModal, setOpenModal] = React.useState<boolean>(false);
  const [currEditIndex, setCurrEditIndex] = React.useState<number>(-1);
  const [maxEditIndex, setMaxEditIndex] = React.useState<number>(-1);

  const onCropAreaChange = (croppedArea: Area, _croppedAreaPixels: Area) => {
    // setCroppedArea(croppedArea);
  };

  const croppedImage = async () => {
    const files: File[] = [];
    if (onSaveImage) {
      for (const { image, croppedArea, rotation } of data) {
        try {
          files.push(await getCroppedImg(image, croppedArea, rotation));
          URL.revokeObjectURL(image.url);
        } catch (e) {
          console.log(e);
          new Error("Crop image error.");
        }
        onSaveImage(files);
      }
    }
  };

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const tempUpload: ImageEditorData[] = [];

    if (e.target.files && e.target.files.length > 0) {
      // if (uploadType === "mutiple" && e.target.files.length > max)
      //   throw new Error("");
      for (const file of e.target.files) {
        const url = URL.createObjectURL(file);
        const html = await createImage(url);
        const aspectFraction = getAspectFraction(html.width, html.height);
        tempUpload.push({
          crop: { x: 0, y: 0 },
          rotation: 0,
          zoom: 1,
          croppedArea: {
            x: 0,
            y: 0,
            width: 0,
            height: 0,
          },
          aspectRatio: aspectRatioList?.[0],
          image: {
            file,
            url,
            html,
            aspectFraction,
          },
        });
      }
      e.target.value = "";

      if (!aspectRatioList || aspectRatioList.length === 0) {
        // gọi callback trả về hình ảnh đã upload

        if (onSaveImage) {
          onSaveImage(tempUpload.map((d) => d.image.file));
        }
        return;
      }

      if (tempUpload.length > 0) {
        setData(tempUpload);
        setCurrEditIndex(0);
        setMaxEditIndex(tempUpload.length - 1);
        setOpenModal(true);
      }
    }
  };

  const handleZoomChange = (zoom: number) => {
    if (data[currEditIndex]) {
      setData((prev) =>
        prev.map((d, idx) => (idx === currEditIndex ? { ...d, zoom } : d))
      );
    }
  };

  const handleRotationChange = (rotation: number) => {
    if (data[currEditIndex]) {
      setData((prev) =>
        prev.map((d, idx) => (idx === currEditIndex ? { ...d, rotation } : d))
      );
    }
  };

  const handleCropChange = (location: Point) => {
    if (data[currEditIndex]) {
      setData((prev) =>
        prev.map((d, idx) =>
          idx === currEditIndex ? { ...d, crop: location } : d
        )
      );
    }
  };

  const onCropComplete = (_croppedArea: Area, croppedAreaPixels: Area) => {
    if (data[currEditIndex]) {
      setData((prev) =>
        prev.map((d, idx) =>
          idx === currEditIndex ? { ...d, croppedArea: croppedAreaPixels } : d
        )
      );
    }
  };

  const handleAspectRatio = (value: string) => {
    if (data[currEditIndex]) {
      setData((prev) =>
        prev.map((d, idx) =>
          idx === currEditIndex
            ? {
                ...d,
                aspectRatio: value as NonNullable<
                  ImageEditorProps["aspectRatioList"]
                >[number],
              }
            : d
        )
      );
    }
  };

  const handleFlipX = async () => {
    if (data[currEditIndex]) {
      console.log("first");
      const { image } = data[currEditIndex];
      const newImage = await flipImage("horizontal", image);
      URL.revokeObjectURL(image.url);
      setData((prev) =>
        prev.map((d, idx) =>
          idx === currEditIndex
            ? {
                ...d,
                image: newImage,
              }
            : d
        )
      );
    }
  };

  const handleFlipY = async () => {
    if (data[currEditIndex]) {
      const { image } = data[currEditIndex];
      const newImage = await flipImage("vertical", image);
      URL.revokeObjectURL(image.url);
      setData((prev) =>
        prev.map((d, idx) =>
          idx === currEditIndex
            ? {
                ...d,
                image: newImage,
              }
            : d
        )
      );
    }
  };

  return (
    <AlertDialog
      open={openModal}
      onOpenChange={(open) => {
        setOpenModal(open);
        if (data.length > 0 && !open) {
          for (const d of data) {
            URL.revokeObjectURL(d.image.url);
          }
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
            image={data[currEditIndex]?.image.url ?? ""}
            cropShape={"rect"}
            aspect={
              data[currEditIndex]?.aspectRatio
                ? aspectRatios[data[currEditIndex].aspectRatio]
                : undefined
            }
            crop={data[currEditIndex]?.crop}
            zoom={data[currEditIndex]?.zoom}
            rotation={data[currEditIndex]?.rotation}
            onCropChange={handleCropChange}
            onZoomChange={handleZoomChange}
            onRotationChange={handleRotationChange}
            onCropComplete={onCropComplete}
            onCropAreaChange={onCropAreaChange}
          />
        </div>
        <div className="flex items-center gap-4">
          {aspectRatioList && (
            <div className="flex flex-col gap-1">
              <Label className="text-muted-foreground text-sm">Tỉ lệ</Label>
              <Select
                value={data[currEditIndex]?.aspectRatio ?? ""}
                onValueChange={handleAspectRatio}
              >
                <SelectTrigger className="w-[100px]">
                  <SelectValue placeholder="Chọn tỉ lệ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Tỉ lệ</SelectLabel>
                    {aspectRatioList
                      .filter((a, idx, arr) => arr.indexOf(a) === idx)
                      .map((k) => (
                        <SelectItem key={k} value={k}>
                          {k}
                        </SelectItem>
                      ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          )}
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
            value={[data[currEditIndex] ? data[currEditIndex].zoom : 1]}
            onValueChange={(v) => handleZoomChange(v[0])}
            min={1}
            max={3}
            step={0.1}
          />
        </div>
        <div className="flex flex-col gap-1">
          <Label className="text-muted-foreground text-sm">Xoay</Label>
          <Slider
            value={[data[currEditIndex] ? data[currEditIndex].rotation : 1]}
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
            variant={"secondary"}
            className={cn(currEditIndex === 0 ? "hidden" : "")}
            onClick={() => {
              if (currEditIndex > 0) {
                setCurrEditIndex((prev) => prev - 1);
              }
            }}
          >
            Trở về
          </Button>

          <Button
            type="button"
            onClick={async () => {
              if (currEditIndex === maxEditIndex) {
                await croppedImage();
                setOpenModal(false);
              } else {
                setCurrEditIndex((prev) => prev + 1);
              }
            }}
          >
            {currEditIndex === maxEditIndex ? "Lưu" : "Lưu & tiếp tục"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ImageEditor;
