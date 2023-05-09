import { styled } from '@linaria/react'

export const DetailsContainer = styled.div`
  background: var(--bg);
  position: fixed;
  height: calc(100vh - 50px);
  overflow: scroll;
`
export const DetailsNav = styled.div`
  display: flex;
  background: var(--row);
  border-bottom: 1px solid var(--border);
  height: 25px;
`

export const DetailsNavTab = styled.div`
  padding: 1px 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: default;

  &.active {
    background: black;
  }

  &:hover {
    background: gray;
  }
`

export const DetailsNavClose = styled.div`
  background-color: var(--color);
  mask-image: url(../../assets/times-solid.svg);
  mask-repeat: no-repeat;
  mask-position: center;
  width: 15px;
  height: 15px;
  margin: 5px;

  &:hover {
    transform: scale(1.1);
  }
`
export const DetailsItem = styled.div`
  overflow: auto;
  height: calc(100% - 20px);
`
export const GeneralDetailsContainer = styled.div`
  background: var(--details-bg);
`
export const GeneralDetailsTitle = styled.div`
  background: var(--details-header);
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
  padding: 2px 5px;
`
export const GeneralDetailsSection = styled.div`
  background: var(--bg);
  padding: 2px 5px;
`
export const GeneralDetailsSectionRow = styled.div`
  display: flex;

  & > div {
    min-width: 200px;
    width: fit-content;
    display: flex;
    align-items: center;
    padding: 5px 0px;
    word-break: break-all;
  }
`

export const JSONContainer = styled.div`
  padding: 10px 20px;
`
