import {
  ControlsContainer,
  ResetNetwork,
  SearchContainer,
  ResetSearch,
} from './styles.tsx'

export const Controls: React.FC<any> = ({ resetHistory, search, setSearch }) => {
  const updateSearchStr = (e: any) => {
    setSearch(e.target.value)
  }

  return (
    <ControlsContainer>
      <ResetNetwork onClick={resetHistory} />
      <SearchContainer>
        <input value={search} onChange={updateSearchStr} />
        <ResetSearch onClick={() => setSearch('')} />
      </SearchContainer>
    </ControlsContainer>
  )
}
