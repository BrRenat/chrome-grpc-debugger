import './styles.css'

export const EmptyContent = () => {
  // navigator.userAgentData.platform
  const modifier = navigator.platform.indexOf('Mac') === 0 ? '⌘' : 'Ctrl'

  return (
    <div className="network-empty">
      <div className="content">
        <div>Recording gRPC network activity...</div>
        <div>Perform a request or hit <strong>{modifier} R</strong> to record the reload</div>
        <div>
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="/"
          >
            Learn more
        </a>
        </div>
      </div>
    </div>
  )
}
