import { createColumnHelper } from '@tanstack/react-table'

import type { DataItem } from './'
import { UnaryIcon, ServerStreamingIcon, RequestInfo, RequestName } from './styles'

const columnHelper = createColumnHelper<DataItem>()

export const columns = [
  columnHelper.accessor('name', {
    id: 'name',
    header: () => 'Name',
    enableHiding: false,
    cell: (info) => {
      const isStream = info.row.original.stream
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const showDetails = info.table.options.meta?.showDetails
      const url = new URL(info.getValue())

      return (
        <RequestInfo className="url-cell" onClick={() => showDetails?.(info.row.original, info.row.id)}>
          {isStream ? <ServerStreamingIcon /> : <UnaryIcon />}
          <RequestName>
            {url.pathname.slice(1)}
          </RequestName>
        </RequestInfo>
      )
    }
  }),
  columnHelper.accessor('grpc.code', {
    id: 'grpc.code',
    header: () => 'grpc-code',
    enableHiding: true,
  }),
  columnHelper.accessor('http.code', {
    id: 'http.code',
    header: () => 'http-code',
    enableHiding: true,
  }),
  columnHelper.accessor('latency', {
    id: 'latency',
    header: () => 'latency (ms)',
    enableHiding: true,
    cell: (info) => {
      const latency = info.getValue()

      return <span>{latency}</span>
    }
  }),
]
