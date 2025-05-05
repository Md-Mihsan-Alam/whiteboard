import React from 'react'
import "../ToolBox/ToolBox.css"
import { FaPen } from "react-icons/fa";
import { RiText } from "react-icons/ri";
import { TbSlash } from "react-icons/tb";
import { RiRectangleLine } from "react-icons/ri";
import { IoEllipseOutline } from "react-icons/io5";
import { GrSelect } from "react-icons/gr";
import { CiEraser } from "react-icons/ci";
import { GiLaserBurst } from "react-icons/gi";
import { HiCursorClick } from "react-icons/hi";

const ToolBox = ({ currentTool, onclick }) => {

    const tools = [
        {
            name: "Pen",
            icon: FaPen,
            type: 1
        },
        {
            name: "Text",
            icon: RiText,
            type: 2
        },
        {
            name: "Line",
            icon: TbSlash,
            type: 4
        },
        {
            name: "Rectangle",
            icon: RiRectangleLine,
            type: 8
        },
        {
            name: "Ellipse",
            icon: IoEllipseOutline,
            type: 16
        },
        {
            name: "Select",
            icon: GrSelect,
            type: 32
        },
        {
            name: "Eraser",
            icon: CiEraser,
            type: 64
        },
        {
            name: "Laser",
            icon: GiLaserBurst,
            type: 128
        },
        {
            name: "Click",
            icon: HiCursorClick,
            type: 256
        },
    ]
    return (
        <div id='toolbox'>
            <ul className='tools-container'>
                {tools.map((tool, index) => {
                    return (
                        <li
                            title={tool.name}
                            key={index}
                            className={`size-40 tool ${currentTool === tool.type ? "active" : ""}`}
                            onClick={() => onclick(tool)}>
                            <tool.icon />
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}

export default ToolBox
