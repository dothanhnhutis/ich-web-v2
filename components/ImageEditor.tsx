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
import { cn } from "@/lib/utils";
import { createImage, getAspectFraction } from "./canvas-utils";
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
  aspectRatio?: NonNullable<ImageEditorProps["aspectRatioList"]>[number];
  image: {
    src: string;
    width: number;
    height: number;
    aspectFraction: string;
  };
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
  // const [zoom, setZoom] = React.useState<number>(1);
  // const [rotation, setRotation] = React.useState<number>(0);
  const [data, setData] = React.useState<ImageEditorData[]>([]);
  // const [crop, setCrop] = React.useState<Point>({ x: 0, y: 0 });
  const [openModal, setOpenModal] = React.useState<boolean>(false);
  // const [croppedArea, setCroppedArea] = React.useState<Area | null>(null);
  // const [aspectRatio, setAspectRatio] = React.useState<
  //   NonNullable<ImageEditorProps["aspectRatioList"]>[number]
  // >(
  //   aspectRatioList && aspectRatioList.length > 0 ? aspectRatioList[0] : "4 : 3"
  // );
  const [currEditIndex, setCurrEditIndex] = React.useState<number>(-1);
  const [maxEditIndex, setMaxEditIndex] = React.useState<number>(-1);

  const onCropComplete = (croppedArea: Area, croppedAreaPixels: Area) => {
    // console.log(croppedArea, croppedAreaPixels);
  };

  const onCropAreaChange = (croppedArea: Area, _croppedAreaPixels: Area) => {
    // setCroppedArea(croppedArea);
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
    const tempUpload: ImageEditorData[] = [];

    if (e.target.files && e.target.files.length > 0) {
      for (const file of e.target.files) {
        const url = URL.createObjectURL(file);
        const image = await createImage(url);
        const aspectFraction = getAspectFraction(image.width, image.height);

        tempUpload.push({
          crop: { x: 0, y: 0 },
          rotation: 0,
          zoom: 1,
          croppedArea: null,
          aspectRatio: aspectRatioList?.[0],
          image: {
            src: url,
            width: image.width,
            height: image.height,
            aspectFraction,
          },
        });
      }
      e.target.value = "";

      if (!aspectRatioList || aspectRatioList.length === 0) {
        // gọi callback trả về hình ảnh đã upload
        return;
      }

      if (tempUpload.length > 0) {
        setData(tempUpload);
        setCurrEditIndex(0);
        setMaxEditIndex(tempUpload.length - 1);
        setOpenModal(true);
      }

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

  console.log(data);

  // console.log(currEditIndex);
  // console.log(maxEditIndex);

  // console.log(data[currEditIndex]?.image.src ?? "");

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

  return (
    <AlertDialog
      open={openModal}
      onOpenChange={(open) => {
        setOpenModal(open);
        if (data.length > 0 && !open) {
          for (const d of data) {
            URL.revokeObjectURL(d.image.src);
          }
        }
      }}
    >
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
            image={data[currEditIndex]?.image.src ?? ""}
            cropShape={cropShape}
            // aspect={aspectRatioList ? aspectRatios[aspectRatio] : undefined}
            aspect={1}
            crop={data[currEditIndex]?.crop}
            zoom={data[currEditIndex]?.zoom}
            rotation={data[currEditIndex]?.rotation}
            onZoomChange={handleZoomChange}
            onRotationChange={handleRotationChange}
            onCropChange={handleCropChange}
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
            onClick={() => {
              if (currEditIndex === maxEditIndex) {
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
