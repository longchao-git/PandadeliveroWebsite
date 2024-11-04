
export default ({ app }, inject) => {
  let ws = null
  let  _receiveListener = null
  const connect = (url) => {
    ws = new WebSocket(url)
    ws.onopen = () => console.log('WebSocket connected')
    ws.onerror = (error) => console.log('WebSocket error:', error)
    ws.onmessage = (message) =>{
      console.log('WebSocket message:', message.data)
      _receiveListener && _receiveListener(message.data);
    }
    ws.onclose = () => console.log('WebSocket disconnected')
  }

  const sendMessage = (message) => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(message)
    }
  }
  const setOnReceiveMessageListener = ({listener}) => {
    _receiveListener = listener
  }

  const beforeDestroy = () => {
    // 组件销毁前关闭 WebSocket 连接
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.close()
      }
  }
  // Make the `connect` and `sendMessage` methods available throughout the app
  inject('webSocket', {
    connect,
    sendMessage,
    setOnReceiveMessageListener,
    beforeDestroy,
  })
}
