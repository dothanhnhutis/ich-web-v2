import { readFile } from "fs";
import {
  AlertTriangle,
  FlipHorizontal,
  FlipVertical,
  ImageUpIcon,
  SearchIcon,
} from "lucide-react";
import Image from "next/image";
import React from "react";
import Cropper, { type Area, type Point } from "react-easy-crop";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { Button } from "./ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "./ui/empty";
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
  children?: React.ReactNode;
  uploadType?: "single" | "mutiple";
  cropShape?: "rect" | "round";
  showGrid?: boolean;
  aspectRatioList?: ("1 : 1" | "4 : 3" | "3 : 4" | "16 : 9" | "9 : 16")[];
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

const DefaultUploadChild = () => {
  return (
    <Empty className="border-2 hover:border-primary">
      <EmptyHeader className="gap-1">
        <EmptyMedia>
          <ImageUpIcon className="size-12" />
        </EmptyMedia>
        <EmptyTitle>Tải hình ảnh</EmptyTitle>
        <EmptyDescription>asdasd</EmptyDescription>
      </EmptyHeader>
      <EmptyContent></EmptyContent>
    </Empty>
  );
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

type ImageEditorData = {
  crop: Point;
  rotation: number;
  zoom: number;
  croppedArea: Area | null;
  url: string;
  //   cropedData: string;
};

const ImageEditor = ({
  children,
  title,
  description,
  uploadType = "single",
  aspectRatioList,
  cropShape = "rect",
  ...props
}: ImageEditorProps) => {
  const id = React.useId();
  const [crop, setCrop] = React.useState<Point>({ x: 0, y: 0 });
  const [rotation, setRotation] = React.useState<number>(0);
  const [croppedArea, setCroppedArea] = React.useState<Area | null>(null);
  const [data, setData] = React.useState<unknown[]>();
  const [zoom, setZoom] = React.useState<number>(1);
  const [aspectRatio, setAspectRatio] = React.useState<
    NonNullable<ImageEditorProps["aspectRatioList"]>[number]
  >(
    aspectRatioList && aspectRatioList.length > 0 ? aspectRatioList[0] : "4 : 3"
  );

  const onCropComplete = (croppedArea: Area, croppedAreaPixels: Area) => {
    // console.log(croppedArea, croppedAreaPixels);
  };

  const onCropAreaChange = (croppedArea: Area, _croppedAreaPixels: Area) => {
    setCroppedArea(croppedArea);
  };

  //   const showCroppedImage = async () => {
  //     try {
  //       const croppedImage = await getCroppedImg(
  //         imageSrc,
  //         croppedAreaPixels,
  //         rotation
  //       );
  //       console.log("donee", { croppedImage });
  //       setCroppedImage(croppedImage);
  //     } catch (e) {
  //       console.error(e);
  //     }
  //   };

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];

      //   const reader = new FileReader();

      //   reader.onload = (event) => {
      //     const text = event.target?.result as string;
      //     console.log("Nội dung file:", text);
      //   };

      //   reader.onerror = (error) => {
      //     console.error("Lỗi đọc file:", error);
      //   };

      //   reader.readAsDataURL(file); // ✅ Quan trọng
    }
  };

  return (
    <AlertDialog defaultOpen={true}>
      <label htmlFor={id}>{children ?? <DefaultUploadChild />}</label>
      <input
        className="hidden"
        id={id}
        name="upload"
        type="file"
        multiple={uploadType === "mutiple"}
        onChange={onFileChange}
      />
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          {description && (
            <AlertDialogDescription>{description}</AlertDialogDescription>
          )}
        </AlertDialogHeader>

        <div className="relative size-50 bg-foreground w-full">
          <Cropper
            {...props}
            image="/images/landscape.webp"
            cropShape={cropShape}
            aspect={aspectRatioList ? aspectRatios[aspectRatio] : undefined}
            crop={crop}
            zoom={zoom}
            onZoomChange={setZoom}
            rotation={rotation}
            onRotationChange={setRotation}
            onCropChange={setCrop}
            onCropComplete={onCropComplete}
            onCropAreaChange={onCropAreaChange}
          />
        </div>
        <div className="flex items-center gap-4">
          {aspectRatioList && (
            <div className="flex flex-col gap-1">
              <Label className="text-muted-foreground text-sm">Tỉ lệ</Label>
              <Select
                value={aspectRatio}
                onValueChange={(v) =>
                  setAspectRatio(
                    v as NonNullable<
                      ImageEditorProps["aspectRatioList"]
                    >[number]
                  )
                }
              >
                <SelectTrigger className="w-[100px]">
                  <SelectValue placeholder="Chọn tỉ lệ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Tỉ lệ</SelectLabel>
                    {aspectRatioList.map((k) => (
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
              <Button variant="secondary" size="icon">
                <FlipHorizontal />
              </Button>
              <Button variant="secondary" size="icon">
                <FlipVertical />
              </Button>
            </div>
          </div>
          <div>{croppedArea && <Output croppedArea={croppedArea} />}</div>
        </div>

        <div className="flex flex-col gap-1">
          <Label className="text-muted-foreground text-sm"> Thu / Phóng</Label>
          <Slider
            value={[zoom]}
            onValueChange={(v) => setZoom(v[0])}
            min={1}
            max={3}
            step={0.1}
          />
        </div>
        <div className="flex flex-col gap-1">
          <Label className="text-muted-foreground text-sm">Xoay</Label>
          <Slider
            value={[rotation]}
            onValueChange={(v) => setRotation(v[0])}
            min={0}
            max={360}
            step={1}
          />
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ImageEditor;
