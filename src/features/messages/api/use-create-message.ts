import { useMutation } from "convex/react";

import { useState } from "react";
import { api } from "../../../../convex/_generated/api";
import { useCallback } from "react";
import { Id } from "../../../../convex/_generated/dataModel";
import { useMemo } from "react";


type RequestType = {
  body: string,
  image?: Id<"_storage">,
  workspaceId: Id<"workspaces">
  channelId?: Id<"channels">
  parentMessageId?: Id<"messages">
  conversationId?: Id<"conversations">
}
type ResponseType = Id<"messages"> | null

type Options = {
  onSuccess?: (data: ResponseType) => void;
  onError?: (error: Error) => void;
  onSettled?: () => void
  throwError?: boolean
}

export const useCreateMessage = () => {

  const [data, setData] = useState<ResponseType>(null);
  const [error, setError] = useState<Error | null>(null);

  const [status, setStatus] = useState<"pending" | "error" | "settled" | "success" | null>(null);


  const isPending = useMemo(() => status === "pending", [status])
  const isSuccess = useMemo(() => status === "success", [status])
  const isError = useMemo(() => status === "error", [status])


  const mutation = useMutation(api.messages.create)
  const mutate = useCallback(async (values: RequestType, options?: Options) => {

    setStatus("pending")
    setData(null)
    setError(null)


    try {
      const response = await mutation(values)
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