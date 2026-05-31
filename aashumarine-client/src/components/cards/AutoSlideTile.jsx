import React from "react";
import "./AutoSlideTile.css";

function AutoSlideTile({ tileData }) {
    const defaultTiles = [
        "Marine Engines",
        "Engine Spare Parts",
        "Cylinder Covers",
        "Fuel Injection Pumps",
        "Turbochargers",
        "Piston & Rings",
        "Cylinder Liners",
        "Cooling Pumps",
        "Marine Valves",
        "Lubrication Systems",
        "Engine Bearings",
    ];

    const tiles = tileData && tileData.length > 0 ? tileData : defaultTiles;

    return (
        <div className="stylesContainer">
            <div className="stylesSlider">
                <div className="stylesSliderTrack">
                    {[...tiles, ...tiles].map((item, index) => (
                        <div key={index} className="stylesTile">
                            {item}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default AutoSlideTile;