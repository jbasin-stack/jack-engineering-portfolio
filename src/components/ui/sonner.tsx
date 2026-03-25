import { Toaster as Sonner, type ToasterProps } from "sonner"

/** Thin wrapper around Sonner's Toaster with project defaults */
const Toaster = (props: ToasterProps) => {
  return (
    <Sonner
      position="bottom-right"
      richColors
      {...props}
    />
  )
}

export { Toaster }
