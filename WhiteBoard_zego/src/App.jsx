import { ZegoSuperBoardManager } from 'zego-superboard-web';
import { ZegoExpressEngine } from 'zego-express-engine-webrtc'
import { useEffect, useState } from 'react';
import ToolBox from './ToolBox/ToolBox';

function App() {

  const [currentTool, setCurrentTool] = useState(null);

  const appID = parseInt(import.meta.env.VITE_ZEGO_APP_ID),
    serverUrl = import.meta.env.VITE_ZEGO_SERVER_URL,
    userID = "96382",
    roomID = "78787",
    userName = "Mihsan",
    token = "04AAAAAGgaMlUADKe9DkGbzaIsIFjmHwCvwTEWn/2wsevQpAZxjh9oCJJSsdJwiiuVUODa9hOpSqO2oGcDswcgpZp36ujle1ZGsr70fip7qKCLWkJYk7o8GbwZUFu23leRUErCLW/cDmGkPMIO1oTSa4Jb9mUd6uKyIpVMil3ThTzS/leFPFFz3cyW5askGbYjmXhKo8RZOi7r83hvcVf2Ty9JB6A7yYEDea+pOXJoXX5y+pnzYdgYnM2dlz5qlpzCYLR9PeBAIAE="

  const zg = new ZegoExpressEngine(appID, serverUrl);

  const zegoSuperBoard = ZegoSuperBoardManager.getInstance();


  const initWhiteBoard = async () => {
    await zegoSuperBoard.init(zg, {
      parentDomID: 'whiteboard',
      appID,
      userID,
      token

    })
    setCurrentTool(zegoSuperBoard.getToolType());
    await zg.loginRoom(roomID, token, { userID, userName }, { userUpdate: true });

    await zegoSuperBoard.createWhiteboardView({
      name: 'Write here!, anything you want ',
      perPageWidth: 1600,
      perPageHeight: 900,
      pageCount: 1

    });

  };

  useEffect(() => {

    if (zegoSuperBoard) {
      initWhiteBoard();
    }
  }, [zegoSuperBoard])



  return (

    <div className="app">

      <div id="whiteboard"></div>
      {/* <ToolBox currentTool={currentTool} onclick={(tool)=>{
          zegoSuperBoard.setToolType(tool);
          setCurrentTool(tool.type)
          // setCurrentTool(zegoSuperBoard.getToolType())
        }}/> */}
      <ToolBox 
       currentTool={currentTool} 
        onclick={(tool) => {
        zegoSuperBoard.setToolType(tool.type); // Pass tool.type instead of the whole tool object
        setCurrentTool(tool.type);
      }} />
    </div>




  )
}

export default App;