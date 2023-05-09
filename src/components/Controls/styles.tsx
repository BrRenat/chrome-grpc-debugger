import { styled } from '@linaria/react'

export const ControlsContainer = styled.div`
  width: 100%;
  height: 25px;
  display: flex;
  align-items: center;
  border-bottom: 2px solid var(--border);
  position: fixed;
  top: 0;
  background: var(--bg);
  z-index: 1;
`

export const ResetNetwork = styled.button`
  background: none;
  background-color: var(--color);
  mask-image: url('../../assets/trash-solid.svg');
  mask-size: cover;
  width: 12px;
  height: 12px;
  border: none;
  margin: 0 5px;

  &:hover {
    transform: scale(1.2);
  }
`

export const SearchContainer = styled.div`
  position: relative;
  input {
    padding-right: 10px;
    background: transparent;
    border: 1px solid var(--border);
    color: var(--color);
    height: 21px;
    box-sizing: border-box;
  }
`

export const ResetSearch = styled(ResetNetwork)`
  mask-image: url('../../assets/times-solid.svg');
  height: 15px;
  transform: translateY(2px);

  &:hover {
    transform: translateY(2px) scale(1.1);
  }
`
