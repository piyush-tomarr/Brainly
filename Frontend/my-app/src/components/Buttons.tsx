export interface ButtonProps {
  varient: "primary" | "secondary";
  size: "sm" | "md" | "lg";
  text: string;
  startIcon?: any;
  endIcon?: any;
  onclick: () => void;
}

export const Buttons = (props: ButtonProps) => {

  let varientStyles:Record<ButtonProps["varient"],string> = {
   primary:  " bg-[#e0e7fe] border border-none px-4 py-2   text-[#5046e4] rounded-sm hover:bg-blue-300 hover:cursor-pointer flex items-center justify-center gap-2",
   secondary:"bg-[#5046e4] border border-none px-4 py-2   text-[#e0e7fe] rounded-sm hover:bg-blue-600 hover:cursor-pointer flex items-center justify-center gap-2"
  }

  let sizeStyles:Record<ButtonProps["size"],string>={
    lg: "text-xl",
    md: "text-md",
    sm: "text-xs "
  }

  
  return (
    <>
      <button className={`${varientStyles[props.varient]} , ${sizeStyles[props.size]}`} onClick={props.onclick}>
        {props.startIcon} {props.text} {props.endIcon}
      </button>
    </>
  );
};
