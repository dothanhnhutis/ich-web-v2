import Image from "next/image";

interface Props
  extends Omit<React.ComponentProps<typeof Image>, "alt" | "src"> {
  type?: "square" | "rectangle";
}

const Logo = ({ type = "square", width, height, ...props }: Props) => {
  if (type === "square") {
    return (
      <Image
        {...props}
        src={"/images/logo-square.png"}
        priority
        alt="logo-square"
        width={width || 48}
        height={height || 48}
        className="aspect-square shrink-0 w-auto h-auto"
      />
    );
  }
  return (
    <Image
      {...props}
      src={"/images/logo-rectangle.png"}
      priority
      alt="logo-rectangle"
      width={width || 150}
      height={height || 56}
    />
  );
};

export default Logo;
