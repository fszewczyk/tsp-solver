import React, { useEffect, useRef } from 'react'

function Visual(props) {
    const canvasRef = useRef(null)

    const cityRadius = 7;

    const draw = (ctx, map, path) => {
        ctx.clearRect(0, 0, ctx.canvas.clientWidth, ctx.canvas.clientHeight);
        ctx.fillStyle = '#ffffff'
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)
        if (map != undefined) {
            map.cities.forEach(element => {
                let x = element[0] * (ctx.canvas.clientWidth - cityRadius * 2) + cityRadius;
                let y = element[1] * (ctx.canvas.clientHeight - cityRadius * 2) + cityRadius;

                ctx.beginPath();
                ctx.arc(x, y, cityRadius, 0, 2 * Math.PI, false);
                ctx.fillStyle = 'green';
                ctx.fill();
            });
        }
        if (map != undefined && path != undefined) {
            ctx.moveTo(map.cities[0][0], map.cities[0][1]);
            ctx.beginPath();
            for (let i = 0; i < path.length; i++) {
                let x = map.cities[i][0] * (ctx.canvas.clientWidth - cityRadius * 2) + cityRadius;
                let y = map.cities[i][1] * (ctx.canvas.clientHeight - cityRadius * 2) + cityRadius;

                ctx.lineTo(x, y);
                ctx.stroke();
            }
        }
    }

    useEffect(() => {
        const canvas = canvasRef.current
        const context = canvas.getContext('2d')
        draw(context, props.map, props.path)
    }, [draw])

    return (
        <canvas ref={canvasRef} width={400} height={500}>
        </canvas>
    )
}

export default Visual
