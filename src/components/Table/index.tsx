import {
  useReactTable,
  getFilteredRowModel,
  getCoreRowModel,
  flexRender,
} from '@tanstack/react-table'
import { useEffect, useState, useRef, Fragment } from 'react'
import { PanelGroup, Panel, PanelResizeHandle, ImperativePanelGroupHandle } from 'react-resizable-panels'

import { EmptyContent } from '../EmptyContent'
import { Details } from '../Details'
import { columns } from './columns'
import {
  Th,
  Td,
  Tr,
  Container,
  ResizeHandle,
  TableHeader,
} from './styles'
import type { ExtensionData } from '../../App'

export type DataItem = ExtensionData & {
  grpc: {
    code?: number
    message: string
  }
  http: {
    code?: number
  }
  failed?: boolean
}

export const Table: React.FC<{ search: string, data: DataItem[] }> = ({ data, search }) => {
  const [detail, setDetail] = useState<{ dataItem: DataItem, rowId: string } | undefined>()
  const [columnVisibility, setColumnVisibility] = useState({})
  const ref = useRef<ImperativePanelGroupHandle>(null);

  const resetLayout = (flag: boolean) => {
    const panelGroup = ref.current;
    if (panelGroup) {
      panelGroup.setLayout(flag ? [30, 70] : [100,0]);
    }
  };

  const showDetails = (dataItem: DataItem, rowId: string) => {
    setDetail({ dataItem, rowId})
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    setColumnVisibility(columns.reduce((acc, column) => ({ ...acc, [column.id]: !column.enableHiding }), {}))
    resetLayout(true)
  }

  const table = useReactTable({
    data,
    columns,
    state: {
      columnVisibility,
    },
    meta: { showDetails },
    onColumnVisibilityChange: setColumnVisibility,
    getFilteredRowModel: getFilteredRowModel(),
    getCoreRowModel: getCoreRowModel(),
  })

  const closeDetails = () => {
    setDetail(undefined)
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    setColumnVisibility(columns.reduce((acc, column) => ({ ...acc, [column.id]: true }), {}))
    resetLayout(false)
  }

  useEffect(() => {
    resetLayout(false)
  }, [ref.current])

  useEffect(() => {
    const column = table.getColumn('name')
    column?.setFilterValue(search)
  },[search, table])

  const [lsizes, setlsizes] = useState<number[]>([])

  const updateColumnsLayout = (size: number[]) => {
    setlsizes(size)
  }

  if (data.length === 0) {
    return <EmptyContent />
  }

  return (
    <Container>
      <PanelGroup autoSaveId="layout-persistence" direction="horizontal" ref={ref}>
        <Panel>
          <TableHeader>
            <PanelGroup autoSaveId="table-persistence" onLayout={updateColumnsLayout} direction="horizontal" style={{ height: 'auto' }}>
              {table.getHeaderGroups()[0].headers.map(header => {
                return (
                  <Fragment key={header.id}>
                    <Panel>
                      <Th>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </Th>
                    </Panel>
                    {!detail && (
                      <PanelResizeHandle>
                        {<ResizeHandle />}
                      </PanelResizeHandle>
                    )}
                  </Fragment>
                )
              })}
            </PanelGroup>
          </TableHeader>
          {table.getRowModel().rows.map(row => {
            return (
              <Tr
                key={row.id}
                data-active={row.id === detail?.rowId}
                data-failed={row.original.failed}
                data-stream={row.original.stream}
              >
                {row.getVisibleCells().map((cell, i) => {
                  return (
                    <Td key={cell.id} style={{ flex: `${lsizes[i]} 1 0px` }}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </Td>
                  )
                })}
              </Tr>
            )
          })}
        </Panel>
        {detail && (
          <>
            <PanelResizeHandle>
              <ResizeHandle />
            </PanelResizeHandle>
            <Panel>
              <Details data={detail?.dataItem} close={closeDetails} />
            </Panel>
          </>
        )}
      </PanelGroup>
    </Container>
  )
}
