import React, { useEffect, useRef, } from 'react'
import * as faceapi from '@vladmandic/face-api'

const Camera = ({ setMood }) => {

    const videoRef = useRef(null)

    useEffect(() => {

        const loadModels = async () => {
            try {
                await faceapi.nets.tinyFaceDetector.loadFromUri('/models/weights')
                await faceapi.nets.faceExpressionNet.loadFromUri('/models/weights')
            } catch (error) {
                console.error("Failed to load models:", error)
            }
        }
        loadModels()
    }, [])

    useEffect(() => {
        const startCamera = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: true,
                    audio: false
                })
                videoRef.current.srcObject = stream
            } catch (error) {
                console.error("Camera access denied:", error)
            }
        }
        startCamera()
    }, [])

    const detectExpression = async () => {
        const detections = await faceapi
            .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
            .withFaceExpressions()

        if (detections) {  // agar face mila toh
            const expressions = detections.expressions
            const mood = Object.keys(expressions).reduce((a, b) =>
                expressions[a] > expressions[b] ? a : b
            )
            if (expressions[mood] > 0.5) {
                setMood(mood)
            }
        }
    }

    useEffect(() => {
        const interval = setInterval(() => {
            detectExpression()
        }, 1000) // har 1 second mein

        return () => clearInterval(interval) // cleanup
    }, [])
    return (
        <>
            <div className="w-full">
                <video
                    ref={videoRef}
                    autoPlay
                    muted
                    className="w-full h-56 object-cover"
                />
            </div>
        </>
    )
}

export default Camera