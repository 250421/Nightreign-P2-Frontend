import type { Lobby } from "@/models/lobby"
import type { ColumnDef } from "@tanstack/react-table"

export const columns: ColumnDef<Lobby>[] = [
    {
      accessorKey: "id",
      header: "Lobby Code",
    },
    {
      accessorKey: "user_1",
      header: "User 1",
    },
    {
      accessorKey: "user_2",
      header: "User 2",
    },
  ]