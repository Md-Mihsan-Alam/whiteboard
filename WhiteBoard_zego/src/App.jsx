import { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import ToolBox from './ToolBox/ToolBox';
import { MdClear, MdMenu } from 'react-icons/md';

function App() {
  const canvasRef = useRef(null);
  const [currentTool, setCurrentTool] = useState(1);
  const [isDrawing, setIsDrawing] = useState(false);
  const [socket, setSocket] = useState(null);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [currentColor, setCurrentColor] = useState('#000000');
  const [lineWidth, setLineWidth] = useState(2);
  const [showMobileTools, setShowMobileTools] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const socketUrl = process.env.NODE_ENV === 'production' 
      ? window.location.origin 
      : 'http://localhost:3001';
    const newSocket = io(socketUrl);
    setSocket(newSocket);

    newSocket.on('drawing', (data) => {
      drawOnCanvas(data);
    });

    newSocket.on('clear', () => {
      clearCanvas();
    });

    return () => newSocket.close();
  }, []);

  const drawOnCanvas = (data) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    
    ctx.strokeStyle = data.color || currentColor;
    ctx.fillStyle = data.color || currentColor;
    ctx.lineWidth = data.lineWidth || lineWidth;
    ctx.lineCap = 'round';
    
    switch(data.tool) {
      case 1: // Pen
        if (data.type === 'start') {
          ctx.beginPath();
          ctx.moveTo(data.x, data.y);
        } else if (data.type === 'draw') {
          ctx.lineTo(data.x, data.y);
          ctx.stroke();
        }
        break;
      case 2: // Text
        if (data.type === 'text') {
          ctx.font = '16px Arial';
          ctx.fillText(data.text, data.x, data.y);
        }
        break;
      case 4: // Line
        if (data.type === 'line') {
          ctx.beginPath();
          ctx.moveTo(data.startX, data.startY);
          ctx.lineTo(data.endX, data.endY);
          ctx.stroke();
        }
        break;
      case 8: // Rectangle
        if (data.type === 'rectangle') {
          ctx.strokeRect(data.x, data.y, data.width, data.height);
        }
        break;
      case 16: // Ellipse
        if (data.type === 'ellipse') {
          ctx.beginPath();
          ctx.ellipse(data.x + data.width/2, data.y + data.height/2, Math.abs(data.width/2), Math.abs(data.height/2), 0, 0, 2 * Math.PI);
          ctx.stroke();
        }
        break;
      case 32: // Select
        if (data.type === 'select') {
          ctx.setLineDash([5, 5]);
          ctx.strokeStyle = '#0066ff';
          ctx.strokeRect(data.x, data.y, data.width, data.height);
          ctx.setLineDash([]);
        }
        break;
      case 64: // Eraser
        if (data.type === 'erase') {
          ctx.globalCompositeOperation = 'destination-out';
          ctx.beginPath();
          ctx.arc(data.x, data.y, (data.lineWidth || lineWidth) / 2, 0, 2 * Math.PI);
          ctx.fill();
          ctx.globalCompositeOperation = 'source-over';
        }
        break;
      case 128: // Laser
        if (data.type === 'laser') {
          ctx.save();
          ctx.strokeStyle = 'red';
          ctx.lineWidth = 3;
          ctx.setLineDash([5, 5]);
          ctx.beginPath();
          ctx.arc(data.x, data.y, 20, 0, 2 * Math.PI);
          ctx.stroke();
          ctx.restore();
        }
        break;
      case 512: // Arrow
        if (data.type === 'arrow') {
          const angle = Math.atan2(data.endY - data.startY, data.endX - data.startX);
          const headLength = 20;
          
          ctx.beginPath();
          ctx.moveTo(data.startX, data.startY);
          ctx.lineTo(data.endX, data.endY);
          ctx.stroke();
          
          ctx.beginPath();
          ctx.moveTo(data.endX, data.endY);
          ctx.lineTo(data.endX - headLength * Math.cos(angle - Math.PI / 6), data.endY - headLength * Math.sin(angle - Math.PI / 6));
          ctx.moveTo(data.endX, data.endY);
          ctx.lineTo(data.endX - headLength * Math.cos(angle + Math.PI / 6), data.endY - headLength * Math.sin(angle + Math.PI / 6));
          ctx.stroke();
        }
        break;
      case 1024: // Triangle
        if (data.type === 'triangle') {
          ctx.beginPath();
          ctx.moveTo(data.x + data.width/2, data.y);
          ctx.lineTo(data.x, data.y + data.height);
          ctx.lineTo(data.x + data.width, data.y + data.height);
          ctx.closePath();
          ctx.stroke();
        }
        break;
      case 2048: // Star
        if (data.type === 'star') {
          const centerX = data.x + data.width/2;
          const centerY = data.y + data.height/2;
          const outerRadius = Math.min(Math.abs(data.width), Math.abs(data.height)) / 2;
          const innerRadius = outerRadius * 0.4;
          
          ctx.beginPath();
          for (let i = 0; i < 10; i++) {
            const angle = (i * Math.PI) / 5;
            const radius = i % 2 === 0 ? outerRadius : innerRadius;
            const x = centerX + radius * Math.cos(angle - Math.PI/2);
            const y = centerY + radius * Math.sin(angle - Math.PI/2);
            
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.closePath();
          ctx.stroke();
        }
        break;
    }
  };

  const getMousePos = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  const startDrawing = (e) => {
    setIsDrawing(true);
    const pos = getMousePos(e);
    setStartPos(pos);
    
    if (currentTool === 1) {
      const data = { type: 'start', x: pos.x, y: pos.y, tool: currentTool, color: currentColor, lineWidth };
      drawOnCanvas(data);
      socket?.emit('drawing', data);
    } else if (currentTool === 2) {
      const text = prompt('Enter text:');
      if (text) {
        const data = { type: 'text', x: pos.x, y: pos.y, text, tool: currentTool, color: currentColor };
        drawOnCanvas(data);
        socket?.emit('drawing', data);
      }
    } else if (currentTool === 128) {
      const data = { type: 'laser', x: pos.x, y: pos.y, tool: currentTool };
      drawOnCanvas(data);
      socket?.emit('drawing', data);
    }
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const pos = getMousePos(e);
    
    if (currentTool === 1) {
      const data = { type: 'draw', x: pos.x, y: pos.y, tool: currentTool, color: currentColor, lineWidth };
      drawOnCanvas(data);
      socket?.emit('drawing', data);
    } else if (currentTool === 64) {
      const data = { type: 'erase', x: pos.x, y: pos.y, tool: currentTool, lineWidth };
      drawOnCanvas(data);
      socket?.emit('drawing', data);
    }
  };

  const stopDrawing = (e) => {
    if (!isDrawing) return;
    setIsDrawing(false);
    const pos = getMousePos(e);
    
    let data = null;
    
    if (currentTool === 4) {
      data = { type: 'line', startX: startPos.x, startY: startPos.y, endX: pos.x, endY: pos.y, tool: currentTool, color: currentColor, lineWidth };
    } else if (currentTool === 8) {
      data = { type: 'rectangle', x: startPos.x, y: startPos.y, width: pos.x - startPos.x, height: pos.y - startPos.y, tool: currentTool, color: currentColor, lineWidth };
    } else if (currentTool === 16) {
      data = { type: 'ellipse', x: startPos.x, y: startPos.y, width: pos.x - startPos.x, height: pos.y - startPos.y, tool: currentTool, color: currentColor, lineWidth };
    } else if (currentTool === 32) {
      data = { type: 'select', x: Math.min(startPos.x, pos.x), y: Math.min(startPos.y, pos.y), width: Math.abs(pos.x - startPos.x), height: Math.abs(pos.y - startPos.y), tool: currentTool };
    } else if (currentTool === 512) {
      data = { type: 'arrow', startX: startPos.x, startY: startPos.y, endX: pos.x, endY: pos.y, tool: currentTool, color: currentColor, lineWidth };
    } else if (currentTool === 1024) {
      data = { type: 'triangle', x: startPos.x, y: startPos.y, width: pos.x - startPos.x, height: pos.y - startPos.y, tool: currentTool, color: currentColor, lineWidth };
    } else if (currentTool === 2048) {
      data = { type: 'star', x: startPos.x, y: startPos.y, width: pos.x - startPos.x, height: pos.y - startPos.y, tool: currentTool, color: currentColor, lineWidth };
    }
    
    if (data) {
      drawOnCanvas(data);
      socket?.emit('drawing', data);
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const handleClear = () => {
    clearCanvas();
    socket?.emit('clear');
  };

  const handleToolClick = (tool) => {
    setCurrentTool(tool.type);
    if (isMobile) setShowMobileTools(false);
  };

  return (
    <div className="app">
      <div className="controls">
        <div className="color-controls">
          <input 
            type="color" 
            value={currentColor} 
            onChange={(e) => setCurrentColor(e.target.value)}
            className="color-picker"
          />
          <input 
            type="range" 
            min="1" 
            max="20" 
            value={lineWidth} 
            onChange={(e) => setLineWidth(e.target.value)}
            className="line-width"
          />
          <span className="line-width-display">{lineWidth}px</span>
        </div>
        <button onClick={handleClear} className="clear-btn">
          <MdClear size={20} />
          Clear
        </button>
      </div>
      
      {isMobile && (
        <button 
          className="mobile-menu-btn"
          onClick={() => setShowMobileTools(!showMobileTools)}
        >
          <MdMenu size={24} />
        </button>
      )}
      
      <canvas
        ref={canvasRef}
        width={window.innerWidth}
        height={window.innerHeight}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        style={{ background: 'white', cursor: 'crosshair' }}
      />
      
      <ToolBox 
        currentTool={currentTool} 
        onclick={handleToolClick}
        isMobile={isMobile}
        showMobileTools={showMobileTools}
      />
    </div>
  )
}

export default App;