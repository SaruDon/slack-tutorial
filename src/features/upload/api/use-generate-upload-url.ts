import { useMutation } from "convex/react";

import { useState } from "react";
import { api } from "../../../../convex/_generated/api";
import { useCallback } from "react";
import { useMemo } from "react";



type ResponseType = string | null

type Options = {
  onSuccess?: (data: ResponseType) => void;
  onError?: (error: Error) => void;
  onSettled?: () => void
  throwError?: boolean
}

export const useGenerateUploadUrl = () => {

  const [data, setData] = useState<ResponseType>(null);
  const [error, setError] = useState<Error | null>(null);

  const [status, setStatus] = useState<"pending" | "error" | "settled" | "success" | null>(null);


  const isPending = useMemo(() => status === "pending", [status])
  const isSuccess = useMemo(() => status === "success", [status])
  const isError = useMemo(() => status === "error", [status])


  const mutation = useMutation(api.upload.generateUploadUrl)
  const mutate = useCallback(async (values: {}, options?: Options) => {

    setStatus("pending")
    setData(null)
    setError(null)


    try {
      const response = await mutation()
      options?.onSuccess?.(response)
      return response
    } catch (error) {
      setStatus("error")
      options?.onError?.(error as Error)
      if (options?.throwError) {
        throw error
      }
    } finally {
      setStatus("settled")
      options?.onSettled?.()
    }
  }, [mutation])

  return { mutate, data, isError, isSuccess, isPending, error }
}