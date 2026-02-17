import {
  ControlsContainer,
  ResetNetwork,
  SearchContainer,
  ResetSearch,
  ResetButton,
} from './styles.tsx'

export const Controls: React.FC<any> = ({ resetHistory, search, setSearch, preserveLog, setPreserveLog, reset }) => {
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

      <label>
        <input type="checkbox" checked={preserveLog} onChange={e => setPreserveLog(e.target.checked)} />
        Preserve log
      </label>
      <ResetButton onClick={reset}>reset</ResetButton>
    </ControlsContainer>
  )
}
