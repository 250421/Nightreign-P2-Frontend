import type { Lobby } from "@/models/lobby"
import { DataTable } from "./table"
import { columns } from "./columns"

async function getData(): Promise<Lobby[]> {
    // Fetch data from your API here.
    return [
      {
        id: 0,
        user_1: "User 1",
        user_2: "User 2",
        isFull: false,
      },
    ]
  }
   
  export default async function LobbyTable() {
    const data = await getData()
   
    return (
      <div className="container mx-auto py-10">
        <DataTable columns={columns} data={data} />
      </div>
    )
  }