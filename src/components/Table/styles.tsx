import { styled } from '@linaria/react'

export const Container = styled.div`
  padding-top: 27px;
`

export const STable = styled.div`
  border-spacing: 0;
  width: 100%;
  border: none;
  color: var(--color);
  position: relative;
`

export const Th = styled.div`
  border-bottom: 1px solid var(--border);
  border-right: 1px solid var(--border);
  font-weight: normal;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 0 5px;
`

export const Td = styled.div`
  border-right: 1px solid var(--border);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 0 1px;
`

export const Tr = styled.div`
  background: var(--row);
  cursor: default;
  display: flex;

  &:nth-child(odd) {
    background: var(--row-odd);
  }

  &:hover {
    background: var(--row-hover);
  }

  &[data-active=true] {
    background: var(--row-selected);
  }

  &[data-failed=true] {
    color: var(--error-color);
  }
`

export const RequestInfo = styled.div``

export const RequestName = styled.div`
  display: inline-block;
`

export const UnaryIcon = styled.div`
  background-color: var(--green);
  mask-image: url(../../assets/right-left-solid.svg);
  mask-size: cover;
  width: 10px;
  height: 10px;
  display: inline-block;
  margin: 0 5px;
`

export const ServerStreamingIcon = styled.div`
  background-color: var(--blue);
  mask-image: url(../../assets/angles-left-solid.svg);
  mask-size: cover;
  width: 10px;
  height: 10px;
  display: inline-block;
  margin: 0 5px;
`

export const UrlCell = styled.div`
  padding: 3px 5px;
`

export const RequestTypeIcon = styled.img`
  width: 10px;
  height: 10px;
`

export const Resizer = styled.div`
  position: absolute;
  right: -2px;
  top: 0;
  height: 100%;
  width: 4px;
  background: transparent;
  cursor: col-resize;
  user-select: none;
  touch-action: none;
`

export const ResizeHandle = styled.div`
  width: 2px;
  height: 100%;
  background: var(--border);
`

export const TableHeader = styled.div``
