import { useQuery } from "convex/react"
import { api } from "../../../../convex/_generated/api"
import { Id } from "../../../../convex/_generated/dataModel"

interface UserGetWorkspaceInfoProps {
  id: Id<"workspaces">
}


export const useGetWorkSpaceInfo = ({ id }: UserGetWorkspaceInfoProps) => {
  const data = useQuery(api.workspace.getInfoById, { id })
  const isLoading = data === undefined


  return ({ data, isLoading })
}