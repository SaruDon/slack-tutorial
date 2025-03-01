import { useQuery } from "convex/react"
import { api } from "../../../../convex/_generated/api"
import { Id } from "../../../../convex/_generated/dataModel"

interface UserGetWorkspace {
  id: Id<"workspaces">
}


export const useGetWorkSpace = ({ id }: UserGetWorkspace) => {
  const data = useQuery(api.workspace.getById, { id })
  const isLoading = data === undefined


  return ({ data, isLoading })
}