/** @jsx jsx */

import { useState, useRef, useEffect } from "react";
import { useSpring, animated } from "react-spring";
import { css, jsx } from "@emotion/core";

const buttonStyles = css`
    padding: 10px 20px;
    font-size: 16px;
    color: #fff;
    border-radius: 5px;
    background-color: #2080df;

    :hover {
        cursor: pointer;
    }

    > div {
        display: flex;
        justify-content: center;
        align-items: center;

        width: 100%;
        height: 100%;
    }
`;

const loaderStyles = css`
    @keyframes load {
        0% {
            transform: rotate(0deg);
        }

        100% {
            transform: rotate(360deg);
        }
    }

    animation: load 1s infinite linear;
    
    border: 3px solid rgba(255, 255, 255, 0.2);
    border-left: 3px solid;
    border-radius: 50%;
    
    width: 20px;
    height: 20px;
`;

// Based on https://humble.dev/creating-a-nice-loading-button-with-react-hooks
function NiceButton({ children, isLoading, ...props }) {
    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);
    const ref = useRef(null);

    useEffect(() => {
        const current = ref.current;

        if (current) {
            const boundingRect = current.getBoundingClientRect();

            if (boundingRect.width)
                setWidth(boundingRect.width);

            if (boundingRect.height)
                setHeight(boundingRect.height);
        }
    }, [children]);

    const [showLoader, setShowLoader] = useState(false);

    useEffect(() => {
        if (isLoading)
            setShowLoader(true);

        if (!isLoading && showLoader) {
            const timeout = setTimeout(() => setShowLoader(false), 400);

            return () => clearTimeout(timeout);
        }
    });

    const fadeOutProps = useSpring({ opacity: showLoader ? 1: 0 });
    const fadeInProps = useSpring({ opacity: showLoader ? 0 : 1 });

    return (
        <button
            css={buttonStyles}
            ref={ref}
            style={
                showLoader
                    ? {
                        width: `${width}px`,
                        height: `${height}px`
                    }
                    : {}
            }
            {...props}
        >
            {showLoader ? (
                <animated.div style={fadeOutProps}>
                    <div css={loaderStyles}></div>
                </animated.div>
            ) : (
                <animated.div style={fadeInProps}>
                    {children}
                </animated.div>
            )}
        </button>
    );
}

export default NiceButton;
