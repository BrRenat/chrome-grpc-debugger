import { useCallback, useEffect, useState } from 'react'
import './App.css'
import { Code } from '@bufbuild/connect'
import AutoScroll from '@brianmcallister/react-auto-scroll'

import { Table } from './components/Table'
import { Controls } from './components/Controls'
import type { DataItem } from './components/Table'

export type ExtensionData = {
  name: string
  sent_at?: number
  received_at?: number
  latency?: number
  stream?: boolean
  request: {
    header?: Record<string, string>
    message?: any
  }
  response: {
    header?: Record<string, string>
    trailer?: Record<string, string>
    message?: any
  }
}

type Message = {
  action: 'gRPCDebugger' | string
  data: {
    data: ExtensionData
  }
}

const grpcToHttpStatus: any = {
  0: 200,
  [Code.InvalidArgument]: 400,
  [Code.Unauthenticated]: 401,
  [Code.PermissionDenied]: 403,
  [Code.NotFound]: 404,
  [Code.AlreadyExists]: 409,
  [Code.FailedPrecondition]: 412,
  [Code.ResourceExhausted]: 429,
  [Code.Internal]: 500,
  [Code.DeadlineExceeded]: 504,
}

const prepareData = (data: ExtensionData): DataItem => {
  const grpc = {
    code: data.response.trailer?.['grpc-status'] ? parseInt(data.response.trailer['grpc-status'], 10) : undefined,
    message: data.response.trailer?.['grpc-message'] || '-',
  }

  return {
    ...data,
    grpc,
    http: {
      code: grpc.code !== undefined ? grpcToHttpStatus[grpc.code] : undefined
    },
    failed: grpc.code !== 0 && grpc.code !== undefined,
  }
}

function App() {
  const [search, setSearch] = useState('')
  const [history, setHistory] = useState<DataItem[]>([])

  const onMessage = useCallback((msg: Message) => {
    const { action, data } = msg
    if (action === "gRPCDebugger") {
      setHistory(prev => {
        return [...prev, prepareData(data.data)]
      })
    }
  }, [setHistory])

  useEffect(() => {
    let port: ReturnType<typeof chrome.runtime.connect> | undefined = undefined
    let tabId = undefined

    if (chrome) {
      try {
        tabId = chrome.devtools.inspectedWindow.tabId;
        port = chrome.runtime.connect({ name: "panel" });
        port.postMessage({ tabId, action: "init" });
        port.onMessage.addListener(onMessage);

      } catch (error) {
        console.warn(error, 'UI, open port error')
      }
    }

    return () => {
      port?.onMessage.removeListener(onMessage)
    }
  }, [onMessage])

  return (
    <div style={{ height: '100%' }}>
      <Controls
        search={search}
        setSearch={setSearch}
        resetHistory={() => setHistory([])}
      />
      <AutoScroll height={"calc(100vh - 27px)" as any} showOption={false}>
        <Table data={history} search={search} />
      </AutoScroll>
    </div>
  )
}

export default App
