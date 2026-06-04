declare module "react-hook-form" {
  export function useForm<T = any>(props?: any): {
    register: (name: string, options?: any) => { onChange: (...args: any[]) => void; onBlur: (...args: any[]) => void; ref: any; name: string }
    handleSubmit: (onValid: (data: T) => any, onInvalid?: (errors: any) => any) => (e?: any) => Promise<any>
    watch: (name?: any) => any
    setValue: (name: any, value: any, options?: any) => void
    getValues: (name?: any) => any
    reset: (values?: any, options?: any) => void
    setError: (name: any, error: any) => void
    clearErrors: (name?: any) => void
    setFocus: (name: any) => void
    trigger: (name?: any) => Promise<boolean>
    formState: { errors: any; isSubmitting: boolean; isDirty: boolean; isValid: boolean }
    control: any
  }

  export const Controller: any
  export const useFormContext: any
  export const FormProvider: any
  export const useWatch: any
}
