import { useState } from 'react'
import { Code } from '@bufbuild/connect'
import type { DataItem } from '../Table'
import {
  DetailsContainer,
  DetailsNav,
  DetailsNavClose,
  DetailsItem,
  GeneralDetailsContainer,
  GeneralDetailsTitle,
  GeneralDetailsSection,
  GeneralDetailsSectionRow,
  JSONContainer,
  DetailsNavTab,
} from './styles.tsx'
import JSONPretty from 'react-json-pretty'

enum TAB {
  GENERAL = 'general',
  RESPONSE = 'response',
  REQUEST = 'request',
}

const codeToString = (code?: number) => {
  if (!code) {
    return 'unknown'
  }

  if (code in Code) {
    return Code[code]
  }

  if (code === 0) {
    return 'ok'
  }

  return 'unknown'
}

const GeneralDetails: React.FC<DataItem> = ({
  latency,
  name,
  sent_at,
  received_at,
  stream,
  response,
  request,
  grpc,
  http,
}) => {
  return (
    <GeneralDetailsContainer>
      <GeneralDetailsTitle>Overall</GeneralDetailsTitle>
      <GeneralDetailsSection>
        <GeneralDetailsSectionRow><div>Request Url:</div><div> {name}</div></GeneralDetailsSectionRow>
        <GeneralDetailsSectionRow><div>Request Type:</div><div> {stream ? 'server-stream' : 'unary'}</div></GeneralDetailsSectionRow>
        {!stream && <GeneralDetailsSectionRow><div>Latency:</div><div> {latency} ms</div></GeneralDetailsSectionRow>}
        {!stream && <GeneralDetailsSectionRow><div>Grpc Code:</div><div> {grpc.code}</div></GeneralDetailsSectionRow>}
        {!stream && <GeneralDetailsSectionRow><div>Grpc Status:</div><div> {codeToString(grpc.code)}</div></GeneralDetailsSectionRow>}
        {!stream && <GeneralDetailsSectionRow><div>Grpc Message:</div><div> {grpc.message}</div></GeneralDetailsSectionRow>}
        {!stream && <GeneralDetailsSectionRow><div>Http Code:</div><div> {http.code}</div></GeneralDetailsSectionRow>}
        <GeneralDetailsSectionRow><div>Sent</div><div> {sent_at && new Date(sent_at).toUTCString()}</div></GeneralDetailsSectionRow>
        <GeneralDetailsSectionRow><div>Received</div><div> {received_at && new Date(received_at).toUTCString()}</div></GeneralDetailsSectionRow>
      </GeneralDetailsSection>
      <GeneralDetailsTitle>Request Headers</GeneralDetailsTitle>
      <GeneralDetailsSection>
        {Object.entries(request.header || {}).map(([key, value]) => (
          <GeneralDetailsSectionRow key={key}>
            <div>{key}:</div><div>{value}</div>
          </GeneralDetailsSectionRow>
        ))}
      </GeneralDetailsSection>
      <GeneralDetailsTitle>Response Headers</GeneralDetailsTitle>
      <GeneralDetailsSection>
        {Object.entries(response.header || {}).map(([key, value]) => (
          <GeneralDetailsSectionRow key={key}>
            <div>{key}:</div><div>{value}</div>
          </GeneralDetailsSectionRow>
        ))}
      </GeneralDetailsSection>
      <GeneralDetailsTitle>Trailers</GeneralDetailsTitle>
      <GeneralDetailsSection>
        {Object.entries(response.trailer || {}).map(([key, value]) => (
          <GeneralDetailsSectionRow key={key}>
            <div>{key}:</div><div>{value}</div>
          </GeneralDetailsSectionRow>
        ))}
      </GeneralDetailsSection>
    </GeneralDetailsContainer>
  )
}

const ResponseDetails: React.FC<DataItem> = ({ response }) => {
  return (
    <JSONContainer>
      <JSONPretty
        data={response.message}
      />
    </JSONContainer>
  )
}

const RequestDetails: React.FC<DataItem> = ({ request }) => {
  return (
    <JSONContainer>
      <JSONPretty
        data={request.message}
      />
    </JSONContainer>
  )
}

const DetailsMap = {
  [TAB.GENERAL]: GeneralDetails,
  [TAB.REQUEST]: RequestDetails,
  [TAB.RESPONSE]: ResponseDetails,
}

export const Details: React.FC<{ data?: DataItem, close: () => void }> = ({ data, close }) => {
  const [tab, setTab] = useState(TAB.GENERAL)

  if (!data) {
    return null
  }

  const Component = DetailsMap[tab]

  return (
    <DetailsContainer>
      <DetailsNav>
        <DetailsNavClose onClick={close} />
        <DetailsNavTab className={tab === TAB.GENERAL ? 'active' : ''} onClick={() => setTab(TAB.GENERAL)}>General</DetailsNavTab>
        <DetailsNavTab className={tab === TAB.REQUEST ? 'active' : ''} onClick={() => setTab(TAB.REQUEST)}>Request</DetailsNavTab>
        <DetailsNavTab className={tab === TAB.RESPONSE ? 'active' : ''} onClick={() => setTab(TAB.RESPONSE)}>Response</DetailsNavTab>
      </DetailsNav>
      <DetailsItem>
        <Component {...data} />
      </DetailsItem>
    </DetailsContainer>
  )
}
